import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// Rotta per registrazione
router.post('/register', register);

// Rotta per login
router.post('/login', login);

export default router;