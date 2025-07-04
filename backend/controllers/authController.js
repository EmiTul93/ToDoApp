const register = async (req, res) => {
const { email, password } = req.body;

try {
// Verifica se l'email esiste già
const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
if (existing.length > 0) {
return res.status(400).json({ message: 'Email già registrata.' });
}

csharp
Copia
Modifica
// Cripta la password
const hashedPassword = await bcrypt.hash(password, 10);

// Inserisce l'utente nel database
await db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);

return res.status(201).json({ message: 'Registrazione completata con successo.' });
} catch (err) {
console.error('Errore nella registrazione:', err);
res.status(500).json({ message: 'Errore del server.' });
}
};

// Login utente
export const login = async (req, res) => {
const { email, password } = req.body;

try {
// Cerca l'utente nel database
const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
if (user.length === 0) {
return res.status(401).json({ message: 'Email o password non validi.' });
}
// Verifica la password
const valid = await bcrypt.compare(password, user[0].password);
if (!valid) {
  return res.status(401).json({ message: 'Email o password non validi.' });
}

// Genera un token
const token = jwt.sign({ userId: user[0].id }, process.env.JWT_SECRET, {
  expiresIn: '1h',
});

return res.status(200).json({ message: 'Login effettuato con successo.', token });
} catch (err) {
console.error('Errore nel login:', err);
res.status(500).json({ message: 'Errore del server.' });
}
};