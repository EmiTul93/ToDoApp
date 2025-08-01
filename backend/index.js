import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errors } from 'celebrate'; // AGGIUNTO per gestire errori Joi
import authRoutes from './routes/authRoutes.js';
import todosRoutes from './routes/todosRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // Porte comuni per React/Vite
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todosRoutes);

// AGGIUNTO: Middleware per gestire errori di validazione Joi
app.use(errors());

// Middleware di gestione errori globale
app.use((err, req, res, next) => {
  console.error('Errore:', err);
  
  if (err.statusCode) {
    return res.status(err.statusCode).json({ 
      message: err.message || 'Errore di validazione' 
    });
  }
  
  res.status(500).json({ message: 'Errore interno del server' });
});

// Route di fallback
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Endpoint non trovato' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
