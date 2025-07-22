// routes/todosRoutes.js
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import db from '../db.js';

const router = express.Router();

// 🔐 Rotta protetta: crea una nuova ToDo
router.post('/', authMiddleware, (req, res) => {
  const { title, description, due_date, priority, status } = req.body;
  const userId = req.user.id;

  const query = `
    INSERT INTO todos (user_id, title, description, due_date, priority, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, NOW())
  `;

  db.query(
    query,
    [userId, title, description, due_date, priority, status],
    (err, result) => {
      if (err) {
        console.error('Errore nel salvataggio della ToDo:', err);
        return res.status(500).json({ message: 'Errore del server.' });
      }

      return res.status(201).json({ message: 'ToDo creata con successo.', todoId: result.insertId });
    }
  );
});

export default router;
