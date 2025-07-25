import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './AuthForm.css';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email: loginEmail,
        password: loginPassword,
      });
      localStorage.setItem('token', res.data.token);
      setMessage('Login effettuato con successo!');
      navigate('/home');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login fallito.');
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
      setIsLogin(true);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registrazione fallita.');
    }
  };

  return (
    <div className="auth-container">
      <div className={`auth-box ${isLogin ? 'login-active' : 'register-active'}`}>
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
            <div className="password-container">
              <input
                type={showLoginPassword ? 'text' : 'password'}
                placeholder="Password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
              >
                {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
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
            <div className="password-container">
              <input
                type={showRegisterPassword ? 'text' : 'password'}
                placeholder="Password"
                required
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowRegisterPassword(!showRegisterPassword)}
              >
                {showRegisterPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <button type="submit">Registrati</button>
          </form>
        </div>

        <div className="toggle-overlay">
          <div className="toggle-content">
            <h2>{isLogin ? 'Hai già un account?' : 'Nuovo qui?'}</h2>
            <button onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Accedi' : 'Registrati'}
            </button>
          </div>
        </div>
      </div>

      {message && <p className="auth-message">{message}</p>}
    </div>
  );
};

export default AuthForm;