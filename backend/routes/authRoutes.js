import express from 'express';
import { celebrate, Segments } from 'celebrate';
import { registerSchema, loginSchema } from '../validators/schemas.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = express.Router();

// 📝 POST /api/auth/register - Registrazione con validazione
router.post(
  '/register',
  celebrate({
    [Segments.BODY]: registerSchema,
  }),
  async (req, res) => {
    const { email, password } = req.body;

    try {
      // Verifica se l'utente esiste già
      const checkUserQuery = 'SELECT id FROM users WHERE email = ?';
      const existingUser = await new Promise((resolve, reject) => {
        db.query(checkUserQuery, [email], (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      });

      if (existingUser.length > 0) {
        return res.status(400).json({ message: 'Email già registrata.' });
      }

      // Hash della password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Inserimento nel database
      const insertUserQuery =
        'INSERT INTO users (email, password, created_at) VALUES (?, ?, NOW())';
      await new Promise((resolve, reject) => {
        db.query(insertUserQuery, [email, hashedPassword], (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });

      res.status(201).json({ message: 'Utente registrato con successo.' });
    } catch (error) {
      console.error('Errore durante la registrazione:', error);
      res.status(500).json({ message: 'Errore del server.' });
    }
  }
);

// 🔐 POST /api/auth/login - Login con validazione
router.post(
  '/login',
  celebrate({
    [Segments.BODY]: loginSchema,
  }),
  async (req, res) => {
    const { email, password } = req.body;

    try {
      // Verifica utente
      const getUserQuery =
        'SELECT id, email, password FROM users WHERE email = ?';
      const users = await new Promise((resolve, reject) => {
        db.query(getUserQuery, [email], (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      });

      if (users.length === 0) {
        return res.status(401).json({ message: 'Credenziali non valide.' });
      }

      const user = users[0];

      // Verifica password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Credenziali non valide.' });
      }

      // Genera JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login effettuato con successo.',
        token,
        user: { id: user.id, email: user.email },
      });
    } catch (error) {
      console.error('Errore durante il login:', error);
      res.status(500).json({ message: 'Errore del server.' });
    }
  }
);

export default router;
