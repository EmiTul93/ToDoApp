import React, { useState } from 'react';
import './AuthForm.css';
import axios from 'axios';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email: loginEmail,
        password: loginPassword,
      });
      localStorage.setItem('token', res.data.token);
      setMessage('Login effettuato con successo!');
      window.location.href = '/';
    } catch (err) {
      setMessage('Login fallito.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        email: registerEmail,
        password: registerPassword,
      });
      setMessage('Registrazione completata! Ora puoi accedere.');
      setIsLogin(true); // Torna automaticamente al login dopo la registrazione
    } catch (err) {
      setMessage('Registrazione fallita.');
    }
  };

  return (
    <div className="auth-container">
      <div className={`auth-box ${isLogin ? 'login-active' : 'register-active'}`}>
        {/* Pannelli dei form (sempre presenti nel DOM) */}
        <div className="form-panel login-panel">
          <h2>Accedi</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              required
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <button type="submit">Accedi</button>
          </form>
        </div>

        <div className="form-panel register-panel">
          <h2>Registrati</h2>
          <form onSubmit={handleRegister}>
            <input
              type="email"
              placeholder="Email"
              required
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
            <button type="submit">Registrati</button>
          </form>
        </div>

        {/* Overlay animato (slide) */}
        <div className="toggle-overlay">
          <div className="toggle-content">
            <h2>{isLogin ?'Hai già un account?' : 'Nuovo qui?'}</h2>
            <button onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Accedi': 'Registrati'}
            </button>
          </div>
        </div>
      </div>

      {message && <p className="auth-message">{message}</p>}
    </div>
  );
};

export default AuthForm;