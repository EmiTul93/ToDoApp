import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Verifica che il token esista ed inizi con "Bearer"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token mancante o non valido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verifica il token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Aggiunge l'ID utente alla richiesta, così possiamo usarlo nei controller
    req.userId = decoded.userId;

    next(); // passa al controller successivo
  } catch (err) {
    console.error('JWT verification error:', err);
    return res.status(401).json({ message: 'Token non valido o scaduto.' });
  }
};

export default authMiddleware;
