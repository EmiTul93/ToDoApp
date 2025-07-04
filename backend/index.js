import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
res.send('API online ✅');
});

// Ottieni tutti i task
app.get('/api/tasks', (req, res) => {
db.query('SELECT * FROM tasks', (err, results) => {
if (err) return res.status(500).json({ error: 'Errore nel recupero delle tasks' });
res.json(results);
});
});

// Aggiungi un nuovo task
app.post('/api/tasks', (req, res) => {
const { text } = req.body;
if (!text) return res.status(400).json({ error: 'Il testo è richiesto' });

db.query('INSERT INTO tasks (text) VALUES (?)', [text], (err, result) => {
if (err) return res.status(500).json({ error: "Errore durante l'inserimento del task" });
res.status(201).json({ id: result.insertId, text });
});
});

// Elimina un task
app.delete('/api/tasks/:id', (req, res) => {
const { id } = req.params;

db.query('DELETE FROM tasks WHERE id = ?', [id], (err) => {
if (err) return res.status(500).json({ error: "Errore durante l'eliminazione del task" });
res.json({ message: 'Task eliminato correttamente' });
});
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
console.log(`✅ Server attivo sulla porta ${PORT}`);
});

// dopo gli altri import
import authRoutes from './routes/authRoutes.js';

// sotto app.use(cors()), ecc.
app.use('/api/auth', authRoutes);