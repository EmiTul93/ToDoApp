import express from 'express';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errors } from 'celebrate';
import authRoutes from './routes/authRoutes.js';
import todosRoutes from './routes/todosRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const HTTPS_PORT = process.env.HTTPS_PORT || 5443;
const NODE_ENV = process.env.NODE_ENV || 'development';

/* ----------------- BASIC MIDDLEWARE ----------------- */
// Logging
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

// Compression
app.use(compression());

/* ----------------- CORS (DEVE ESSERE PRIMA DEL REDIRECT) ----------------- */
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://localhost:3000',
      'https://localhost:5173',
    ];

const corsOptions = {
  origin: (origin, callback) => {
    // Permetti richieste senza origin (Postman, mobile apps, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Non permesso da CORS policy'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400, // 24 ore preflight cache
};

app.use(cors(corsOptions));
// Rispondi esplicitamente alle preflight OPTIONS con lo stesso CORS
app.options('*', cors(corsOptions));

/* ----------------- SECURITY ----------------- */
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);

/* ----------------- RATE LIMIT / SLOWDOWN ----------------- */
app.use(
  rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Troppe richieste da questo IP, riprova più tardi.' },
  })
);

app.use(
  slowDown({
    windowMs: 15 * 60 * 1000,
    delayAfter: 50,
    delayMs: 500,
    maxDelayMs: 20000,
  })
);

/* ----------------- PARSING ----------------- */
app.use(
  express.json({
    limit: '1mb',
    verify: (req, res, buf) => {
      try {
        JSON.parse(buf);
      } catch {
        res.status(400).json({ error: 'JSON malformato' });
        throw new Error('JSON malformato');
      }
    },
  })
);
app.use(
  express.urlencoded({ extended: true, limit: '1mb', parameterLimit: 20 })
);

// Rimuovi header sensibili
app.use((req, res, next) => {
  res.removeHeader('X-Powered-By');
  res.removeHeader('Server');
  next();
});

/* ----------------- ROUTES ----------------- */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
  });
});

app.use(
  '/api/auth',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_AUTH_MAX) || 5,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
  }),
  authRoutes
);

app.use('/api/todos', todosRoutes);

/* ----------------- ERROR HANDLING ----------------- */
app.use(errors());
app.use((err, req, res, next) => {
  console.error('Errore:', err);

  if (err.statusCode) {
    return res.status(err.statusCode).json({
      message: err.message || 'Errore di validazione',
    });
  }

  res.status(500).json({ message: 'Errore interno del server' });
});

app.use('*', (req, res) => {
  res.status(404).json({ status: 'error', message: 'Endpoint non trovato' });
});

// Error handler centrale
app.use((err, req, res, next) => {
  console.error('[Backend Error]', err); // Log dettagliato lato server

  // Gestione Joi/validazione
  if (err.isJoi || err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      type: 'validation',
      message: err.details?.map((d) => d.message).join(', ') || err.message,
      errors: err.details || null,
    });
  }

  // Errore custom "Unauthorized"
  if (err.status === 401 || err.name === 'UnauthorizedError') {
    return res.status(401).json({
      status: 'error',
      type: 'authorization',
      message: err.message || 'Non autorizzato',
    });
  }

  // Generico (catch-all)
  res.status(err.status || 500).json({
    status: 'error',
    type: err.type || 'server',
    message: err.message || 'Errore interno del server',
  });
});

/* ----------------- SSL SETUP ----------------- */
function loadSSLCert() {
  try {
    const sslDir = './ssl';
    const keyPath = path.join(sslDir, 'private-key.pem');
    const certPath = path.join(sslDir, 'certificate.pem');

    if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
      console.warn(`⚠️  Certificati SSL mancanti. Generali con:
openssl req -x509 -newkey rsa:4096 -keyout ssl/private-key.pem -out ssl/certificate.pem -days 365 -nodes`);
      return null;
    }
    return { key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) };
  } catch (err) {
    console.error('Errore caricamento certificati SSL:', err);
    return null;
  }
}

/* ----------------- SERVER START (gestisce OPTIONS senza redirect) ----------------- */
function startServer() {
  const sslOptions = loadSSLCert();

  // HTTP server: se richieste OPTIONS -> lascia che express gestisca (preflight),
  // altrimenti in produzione con certificati presenti fai redirect a HTTPS.
  http
    .createServer((req, res) => {
      // Se è una preflight request lascia passare all'app (così risponde CORS)
      if (req.method === 'OPTIONS') {
        return app(req, res);
      }

      // Solo in produzione e se certificati presenti: redirect a HTTPS
      if (NODE_ENV === 'production' && sslOptions) {
        // Se host contiene porta, sostituisci con HTTPS_PORT; altrimenti aggiungila
        const hostHeader = req.headers.host || `localhost:${PORT}`;
        const host = hostHeader.includes(':')
          ? hostHeader.replace(/:\d+$/, `:${HTTPS_PORT}`)
          : `${hostHeader}:${HTTPS_PORT}`;
        res.writeHead(301, { Location: `https://${host}${req.url}` });
        return res.end();
      }

      // Altrimenti passa la richiesta all'app (HTTP normale)
      return app(req, res);
    })
    .listen(PORT, () => {
      console.log(`🌐 HTTP server in ascolto su http://localhost:${PORT}`);
    });

  // HTTPS server (se ci sono certificati)
  if (sslOptions) {
    https.createServer(sslOptions, app).listen(HTTPS_PORT, () => {
      console.log(
        `🔒 HTTPS server in ascolto su https://localhost:${HTTPS_PORT}`
      );
    });
  } else {
    console.log('⚠️ HTTPS non avviato: certificati assenti.');
  }
}

/* ----------------- SIGNALS ----------------- */
process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0));
process.on('uncaughtException', (err) => {
  console.error(err);
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  console.error(reason);
  process.exit(1);
});

startServer();
