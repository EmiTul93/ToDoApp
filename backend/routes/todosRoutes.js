// backend/routes/todosRoutes.js
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import db from '../db.js';
import { validate } from '../middleware/validation.js';
import { createTodoSchema, updateTodoSchema, idSchema } from '../validators/schemas.js';

const router = express.Router();

// LISTA ToDo SOLO utente corrente
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.userId; // preso dal token
  db.query(
    "SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC",
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ message: 'Errore DB' });
      res.json(rows);
    }
  );
});

// AGGIUNGI ToDo
router.post(
  '/',
  authMiddleware,
  validate({ body: createTodoSchema }),
  async (req, res) => {
    const userId = req.userId;
    const { title, description = '', due_date = null, priority = 'medium', status = 'pending' } = req.body;

    db.query(
      `INSERT INTO todos (user_id, title, description, due_date, priority, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [userId, title, description, due_date, priority, status],
      (err, result) => {
        if (err) return res.status(500).json({ message: 'Errore nel salvataggio ToDo' });
        res.status(201).json({ 
          message: 'ToDo creata con successo',
          todo: { id: result.insertId, title, description, due_date, priority, status }
        });
      }
    );
  }
);

// MODIFICA ToDo
router.put(
  '/:id',
  authMiddleware,
  validate({ params: idSchema, body: updateTodoSchema }),
  async (req, res) => {
    const userId = req.userId;
    const todoId = req.params.id;
    const fields = Object.keys(req.body);
    if (!fields.length) return res.status(400).json({ message: 'Nessun campo da aggiornare.' });

    const setClause = fields.map(k => `${k} = ?`).join(', ');
    const values = [...fields.map(f => req.body[f]), todoId, userId];

    db.query(
      `UPDATE todos SET ${setClause} WHERE id = ? AND user_id = ?`,
      values,
      (err, result) => {
        if (err) return res.status(500).json({ message: 'Errore update ToDo' });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'ToDo non trovata.' });

        res.json({ message: 'ToDo aggiornata con successo' });
      }
    );
  }
);

// ELIMINA ToDo
router.delete(
  '/:id',
  authMiddleware,
  validate({ params: idSchema }),
  async (req, res) => {
    const userId = req.userId;
    const todoId = req.params.id;
    db.query(
      'DELETE FROM todos WHERE id = ? AND user_id = ?',
      [todoId, userId],
      (err, result) => {
        if (err) return res.status(500).json({ message: 'Errore nell\'eliminazione ToDo' });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'ToDo non trovata o non autorizzato.' });
        res.json({ message: 'ToDo eliminata' });
      }
    );
  }
);

export default router;
