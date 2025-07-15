import db from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Registrazione utente (versione con callback)
export const register = (req, res) => {
  const { email, password } = req.body;

  // 1. Verifica se l'email esiste già
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error('Errore nel database:', err);
      return res.status(500).json({ message: 'Errore del server.' });
    }
    
    if (results.length > 0) {
      return res.status(400).json({ message: 'Email già registrata.' });
    }

    try {
      // 2. Cripta la password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // 3. Inserisce l'utente nel database
      db.query('INSERT INTO users (email, password) VALUES (?, ?)', 
        [email, hashedPassword], 
        (err) => {
          if (err) {
            console.error('Errore nell inserimento:', err);
            return res.status(500).json({ message: 'Errore del server.' });
          }
          return res.status(201).json({ message: 'Registrazione completata con successo.' });
        });
    } catch (err) {
      console.error('Errore nella crittografia:', err);
      res.status(500).json({ message: 'Errore del server.' });
    }
  });
};

// Login utente (versione con callback)
export const login = (req, res) => {
  const { email, password } = req.body;

  // 1. Cerca l'utente nel database
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error('Errore nel database:', err);
      return res.status(500).json({ message: 'Errore del server.' });
    }
    
    if (results.length === 0) {
      return res.status(401).json({ message: 'Email o password non validi.' });
    }

    try {
      // 2. Verifica la password
      const user = results[0];
      const valid = await bcrypt.compare(password, user.password);
      
      if (!valid) {
        return res.status(401).json({ message: 'Email o password non validi.' });
      }

      // 3. Genera il token JWT
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      return res.status(200).json({ message: 'Login effettuato con successo.', token });
    } catch (err) {
      console.error('Errore nel login:', err);
      res.status(500).json({ message: 'Errore del server.' });
    }
  });
};