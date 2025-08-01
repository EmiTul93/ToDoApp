// backend/middleware/authMiddleware.js

import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  // Prendi il token dall’header Authorization (tipo: "Bearer <token>")
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token mancante o non valido.' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    // Decodifica il token usando la tua secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Associa l'id utente a req.userId (e volendo anche l’user completo)
    req.userId = decoded.userId;
    req.user = { id: decoded.userId, email: decoded.email };

    // Passa al controller successivo
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token non valido o scaduto.' });
  }
};

export default authMiddleware;
