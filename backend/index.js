import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db.js';
import authRoutes from './routes/authRoutes.js';

// Configurazione environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Test di connessione al database
db.query('SELECT 1', (err) => {
  if (err) {
    console.error('❌ Errore nella connessione al database:', err);
  } else {
    console.log('✅ Connessione al database MySQL riuscita');
  }
});

// Middleware per log delle richieste (utile per debug)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Rotte
app.use('/api/auth', authRoutes);

// Rotta base di test
app.get('/', (req, res) => {
  res.send('✅ API online');
});

// Gestione errori centralizzata
app.use((err, req, res, next) => {
  console.error('🔥 Errore:', err.stack);
  res.status(500).json({ message: 'Errore interno del server' });
});

// Avvio del server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server attivo sulla porta ${PORT}`);
});