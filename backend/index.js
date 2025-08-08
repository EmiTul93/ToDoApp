import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errors } from 'celebrate';
import authRoutes from './routes/authRoutes.js';
import todosRoutes from './routes/todosRoutes.js';
import https from 'https';
import fs from 'fs';
import path from 'path';

dotenv.config();
const app = express();
const PORT = 443; // Porta HTTPS
// Carica chiave e certificato SSL dalla cartella 'certificate'
const key = fs.readFileSync(path.join(process.cwd(), 'certificate/localhost-key.pem'));
const cert = fs.readFileSync(path.join(process.cwd(), 'certificate/localhost.pem'));
const credentials = { key, cert };
// Middleware CORS configurato per React (porta 3000 o Vite 5173)
app.use(cors({
  origin: ['http://localhost:3000/', 'http://localhost:5173/', 'https://localhost:3000', 'https://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// Middleware per parse JSON (limite a 10mb)
app.use(express.json({ limit: '10mb' }));
// Rotte API
app.use('/api/auth', authRoutes);
app.use('/api/todos', todosRoutes);
// Middleware per gestire errori validation Joi (celebrate)
app.use(errors());
// Middleware di gestione errori globale personalizzata
app.use((err, req, res, next) => {
  console.error('Errore:', err);
  if (err.statusCode) {
    return res.status(err.statusCode).json({ message: err.message || 'Errore di validazione' });
  }
  res.status(500).json({ message: 'Errore interno del server' });
});
// Route fallback per endpoint non trovati
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Endpoint non trovato' });
});
// Avvia server HTTPS
https.createServer(credentials, app).listen(PORT, () => {
  console.log(`Server HTTPS in ascolto su https://localhost:${PORT}`);
});