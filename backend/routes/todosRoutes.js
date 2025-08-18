// backend/routes/todosRoutes.js - VERSIONE DEBUG
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import db from '../db.js';
import { validate } from '../middleware/validation.js';
import {
  createTodoSchema,
  updateTodoSchema,
  idSchema,
} from '../validators/schemas.js';

const router = express.Router();

// LISTA ToDo SOLO utente corrente
router.get('/', authMiddleware, async (req, res) => {
  console.log('🔍 GET /todos - userId:', req.userId);

  const userId = req.userId;
  db.query(
    'SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC',
    [userId],
    (err, rows) => {
      if (err) {
        console.error('❌ Errore GET todos:', err);
        return res.status(500).json({ message: 'Errore DB: ' + err.message });
      }
      console.log('✅ Todos trovate:', rows.length);
      res.json(rows);
    }
  );
});

// AGGIUNGI ToDo - CON DEBUG COMPLETO
router.post('/', authMiddleware, async (req, res) => {
  console.log('🚀 POST /todos iniziato');
  console.log('👤 userId dal token:', req.userId);
  console.log('📝 Body ricevuto:', req.body);

  try {
    const userId = req.userId;

    // Verifica che userId esista
    if (!userId) {
      console.error('❌ userId mancante dal token');
      return res
        .status(401)
        .json({ message: 'Token non valido - userId mancante' });
    }

    // Estrai dati con valori di default
    const {
      title,
      description = '',
      due_date = null,
      priority = 'medium',
      status = 'pending',
    } = req.body;

    console.log('📋 Dati processati:', {
      userId,
      title,
      description,
      due_date,
      priority,
      status,
    });

    // Validazione manuale base
    if (!title || title.trim().length === 0) {
      console.error('❌ Titolo mancante o vuoto');
      return res.status(400).json({ message: 'Titolo obbligatorio' });
    }

    if (title.length > 100) {
      console.error('❌ Titolo troppo lungo:', title.length);
      return res
        .status(400)
        .json({ message: 'Titolo troppo lungo (max 100 caratteri)' });
    }

    // Validazione priority
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(priority)) {
      console.error('❌ Priorità non valida:', priority);
      return res.status(400).json({ message: 'Priorità non valida' });
    }

    // Validazione status
    const validStatuses = ['pending', 'completed', 'in_progress'];
    if (!validStatuses.includes(status)) {
      console.error('❌ Status non valido:', status);
      return res.status(400).json({ message: 'Status non valido' });
    }

    console.log('✅ Validazioni passate, inserimento nel DB...');

    // Query di inserimento
    const query = `INSERT INTO todos (user_id, title, description, due_date, priority, status, created_at)
                   VALUES (?, ?, ?, ?, ?, ?, NOW())`;

    const values = [
      userId,
      title.trim(),
      description,
      due_date,
      priority,
      status,
    ];

    console.log('🗃️ Query:', query);
    console.log('🗃️ Values:', values);

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('❌ Errore inserimento DB:', err);
        console.error('❌ Errore codice:', err.code);
        console.error('❌ Errore SQL:', err.sqlMessage);

        // Errori specifici del database
        if (err.code === 'ER_NO_SUCH_TABLE') {
          return res.status(500).json({
            message: 'Tabella todos non esiste nel database',
            error: err.message,
          });
        }

        if (err.code === 'ER_BAD_FIELD_ERROR') {
          return res.status(500).json({
            message: 'Colonna non esistente nella tabella todos',
            error: err.message,
          });
        }

        if (err.code === 'ER_DATA_TOO_LONG') {
          return res.status(400).json({
            message: 'Dati troppo lunghi per il campo',
            error: err.message,
          });
        }

        return res.status(500).json({
          message: 'Errore nel salvataggio ToDo',
          error: err.message,
          code: err.code,
        });
      }

      console.log('✅ Todo inserita con successo, ID:', result.insertId);

      const newTodo = {
        id: result.insertId,
        user_id: userId,
        title: title.trim(),
        description,
        due_date,
        priority,
        status,
        created_at: new Date().toISOString(),
      };

      console.log('📤 Risposta inviata:', newTodo);

      res.status(201).json({
        message: 'ToDo creata con successo',
        todo: newTodo,
      });
    });
  } catch (error) {
    console.error('❌ Errore generale POST /todos:', error);
    res.status(500).json({
      message: 'Errore interno del server',
      error: error.message,
    });
  }
});

// MODIFICA ToDo
router.put(
  '/:id',
  authMiddleware,
  validate({ params: idSchema, body: updateTodoSchema }),
  async (req, res) => {
    console.log(
      '🔄 PUT /todos/:id - userId:',
      req.userId,
      'todoId:',
      req.params.id
    );

    const userId = req.userId;
    const todoId = req.params.id;
    const fields = Object.keys(req.body);

    if (!fields.length) {
      return res.status(400).json({ message: 'Nessun campo da aggiornare.' });
    }

    const setClause = fields.map((k) => `${k} = ?`).join(', ');
    const values = [...fields.map((f) => req.body[f]), todoId, userId];

    console.log(
      '🗃️ Query UPDATE:',
      `UPDATE todos SET ${setClause} WHERE id = ? AND user_id = ?`
    );
    console.log('🗃️ Values:', values);

    db.query(
      `UPDATE todos SET ${setClause} WHERE id = ? AND user_id = ?`,
      values,
      (err, result) => {
        if (err) {
          console.error('❌ Errore UPDATE:', err);
          return res
            .status(500)
            .json({ message: 'Errore update ToDo: ' + err.message });
        }

        if (result.affectedRows === 0) {
          console.log(
            '⚠️ Nessuna riga aggiornata - Todo non trovata o non autorizzato'
          );
          return res.status(404).json({ message: 'ToDo non trovata.' });
        }

        console.log('✅ Todo aggiornata con successo');
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
    console.log(
      '🗑️ DELETE /todos/:id - userId:',
      req.userId,
      'todoId:',
      req.params.id
    );

    const userId = req.userId;
    const todoId = req.params.id;

    db.query(
      'DELETE FROM todos WHERE id = ? AND user_id = ?',
      [todoId, userId],
      (err, result) => {
        if (err) {
          console.error('❌ Errore DELETE:', err);
          return res
            .status(500)
            .json({ message: "Errore nell'eliminazione ToDo: " + err.message });
        }

        if (result.affectedRows === 0) {
          console.log(
            '⚠️ Nessuna riga eliminata - Todo non trovata o non autorizzato'
          );
          return res
            .status(404)
            .json({ message: 'ToDo non trovata o non autorizzato.' });
        }

        console.log('✅ Todo eliminata con successo');
        res.json({ message: 'ToDo eliminata' });
      }
    );
  }
);

export default router;
