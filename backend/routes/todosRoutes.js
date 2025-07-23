// routes/todosRoutes.js
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import db from '../db.js';

const router = express.Router();

// 🔐 POST /api/todos - Crea una nuova ToDo
router.post('/', authMiddleware, (req, res) => {
const { title, description, due_date, priority, status } = req.body;
const userId = req.userId;

const query = "INSERT INTO todos (user_id, title, description, due_date, priority, status, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())";

db.query(query, [userId, title, description, due_date, priority, status], (err, result) => {
if (err) {
console.error("Errore nel salvataggio della ToDo:", err);
return res.status(500).json({ message: 'Errore del server.' });
}
return res.status(201).json({ message: 'ToDo creata con successo.', todoId: result.insertId });
});
});

// 🔐 GET /api/todos - Ottiene tutte le ToDo dell’utente
router.get('/', authMiddleware, (req, res) => {
const userId = req.userId;

const query = "SELECT id, title, description, due_date, priority, status, created_at FROM todos WHERE user_id = ? ORDER BY created_at DESC";

db.query(query, [userId], (err, results) => {
if (err) {
console.error("Errore durante il recupero delle ToDo:", err);
return res.status(500).json({ message: 'Errore del server.' });
}
return res.status(200).json(results);
});
});

// 🔐 GET /api/todos/:id - Ottiene una ToDo specifica
router.get('/:id', authMiddleware, (req, res) => {
const userId = req.userId;
const todoId = req.params.id;

const query = "SELECT id, title, description, due_date, priority, status, created_at FROM todos WHERE id = ? AND user_id = ?";

db.query(query, [todoId, userId], (err, results) => {
if (err) {
console.error("Errore durante il recupero della ToDo:", err);
return res.status(500).json({ message: 'Errore del server.' });
}
if (results.length === 0) {
  return res.status(404).json({ message: 'ToDo non trovata.' });
}

return res.status(200).json(results[0]);
});
});

// 🔐 PUT /api/todos/:id - Aggiorna una ToDo
router.put('/:id', authMiddleware, (req, res) => {
const userId = req.userId;
const todoId = req.params.id;
const { title, description, due_date, priority, status } = req.body;

const query = "UPDATE todos SET title = ?, description = ?, due_date = ?, priority = ?, status = ? WHERE id = ? AND user_id = ?";

db.query(query, [title, description, due_date, priority, status, todoId, userId], (err, result) => {
if (err) {
console.error("Errore durante l'aggiornamento della ToDo:", err);
const query = "UPDATE todos SET title = ?, description = ?, due_date = ?, priority = ?, status = ? WHERE id = ? AND user_id = ?";
}
if (result.affectedRows === 0) {
  return res.status(404).json({ message: 'ToDo non trovata o non autorizzato.' });
}

return res.status(200).json({ message: 'ToDo aggiornata con successo.' });
});
});

// 🔐 DELETE /api/todos/:id - Elimina una ToDo
router.delete('/:id', authMiddleware, (req, res) => {
const userId = req.userId;
const todoId = req.params.id;

const query = "DELETE FROM todos WHERE id = ? AND user_id = ?";

db.query(query, [todoId, userId], (err, result) => {
if (err) {
console.error("Errore durante l'eliminazione della ToDo:", err);
const query = "DELETE FROM todos WHERE id = ? AND user_id = ?";
}
if (result.affectedRows === 0) {
  return res.status(404).json({ message: 'ToDo non trovata o non autorizzato.' });
}

return res.status(200).json({ message: 'ToDo eliminata con successo.' });
});
});

export default router;