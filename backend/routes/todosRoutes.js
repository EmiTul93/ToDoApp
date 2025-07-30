import express from 'express';
import { celebrate, Segments } from 'celebrate';
import { createTodoSchema, updateTodoSchema, idSchema } from '../validators/schemas.js';
import authMiddleware from '../middleware/authMiddleware.js';
import db from '../db.js';

const router = express.Router();

// 🔐 POST /api/todos - Crea una nuova ToDo con validazione
router.post('/', 
  authMiddleware,
  celebrate({
    [Segments.BODY]: createTodoSchema
  }),
  async (req, res) => {
    const { title, description = '', due_date = null, priority = 'medium', status = 'pending' } = req.body;
    const userId = req.userId;

    try {
      const query = "INSERT INTO todos (user_id, title, description, due_date, priority, status, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())";
      
      const result = await new Promise((resolve, reject) => {
        db.query(query, [userId, title, description, due_date, priority, status], (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });

      res.status(201).json({ 
        message: 'ToDo creata con successo.',
        todoId: result.insertId,
        todo: { id: result.insertId, title, description, due_date, priority, status }
      });

    } catch (error) {
      console.error("Errore nel salvataggio della ToDo:", error);
      res.status(500).json({ message: 'Errore del server.' });
    }
  }
);

// 🔐 GET /api/todos - Ottiene tutte le ToDo dell'utente
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.userId;

  try {
    const query = "SELECT id, title, description, due_date, priority, status, created_at FROM todos WHERE user_id = ? ORDER BY created_at DESC";
    
    const results = await new Promise((resolve, reject) => {
      db.query(query, [userId], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    res.status(200).json(results);

  } catch (error) {
    console.error("Errore durante il recupero delle ToDo:", error);
    res.status(500).json({ message: 'Errore del server.' });
  }
});

// 🔐 GET /api/todos/:id - Ottiene una ToDo specifica con validazione ID
router.get('/:id', 
  authMiddleware,
  celebrate({
    [Segments.PARAMS]: idSchema
  }),
  async (req, res) => {
    const userId = req.userId;
    const todoId = req.params.id;

    try {
      const query = "SELECT id, title, description, due_date, priority, status, created_at FROM todos WHERE id = ? AND user_id = ?";
      
      const results = await new Promise((resolve, reject) => {
        db.query(query, [todoId, userId], (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      });

      if (results.length === 0) {
        return res.status(404).json({ message: 'ToDo non trovata.' });
      }

      res.status(200).json(results[0]);

    } catch (error) {
      console.error("Errore durante il recupero della ToDo:", error);
      res.status(500).json({ message: 'Errore del server.' });
    }
  }
);

// 🔐 PUT /api/todos/:id - Aggiorna una ToDo con validazione
router.put('/:id', 
  authMiddleware,
  celebrate({
    [Segments.PARAMS]: idSchema,
    [Segments.BODY]: updateTodoSchema
  }),
  async (req, res) => {
    const userId = req.userId;
    const todoId = req.params.id;
    const updates = req.body;

    try {
      // Costruisci query dinamica basata sui campi forniti
      const fields = Object.keys(updates);
      const setClause = fields.map(field => `${field} = ?`).join(', ');
      const values = [...Object.values(updates), todoId, userId];

      const query = `UPDATE todos SET ${setClause} WHERE id = ? AND user_id = ?`;
      
      const result = await new Promise((resolve, reject) => {
        db.query(query, values, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'ToDo non trovata o non autorizzato.' });
      }

      res.status(200).json({ message: 'ToDo aggiornata con successo.' });

    } catch (error) {
      console.error("Errore durante l'aggiornamento della ToDo:", error);
      res.status(500).json({ message: 'Errore del server.' });
    }
  }
);

// 🔐 DELETE /api/todos/:id - Elimina una ToDo con validazione ID
router.delete('/:id', 
  authMiddleware,
  celebrate({
    [Segments.PARAMS]: idSchema
  }),
  async (req, res) => {
    const userId = req.userId;
    const todoId = req.params.id;

    try {
      const query = "DELETE FROM todos WHERE id = ? AND user_id = ?";
      
      const result = await new Promise((resolve, reject) => {
        db.query(query, [todoId, userId], (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'ToDo non trovata o non autorizzato.' });
      }

      res.status(200).json({ message: 'ToDo eliminata con successo.' });

    } catch (error) {
      console.error("Errore durante l'eliminazione della ToDo:", error);
      res.status(500).json({ message: 'Errore del server.' });
    }
  }
);

export default router;
