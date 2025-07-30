import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema, registerSchema } from '../utils/validationSchemas';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './AuthForm.css';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Form per login
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors },
    reset: resetLogin
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onBlur'
  });

  // Form per registrazione
  const {
    register: registerRegister,
    handleSubmit: handleSubmitRegister,
    formState: { errors: registerErrors },
    reset: resetRegister
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: 'onBlur'
  });

  const handleLogin = async (data) => {
  setIsLoading(true);
  setMessage('');
  
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', data);
    localStorage.setItem('token', res.data.token);
    
    // Redirect immediato senza messaggio
    window.location.href = '/home';
    
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Login fallito.';
    setMessage(errorMessage);
    setIsLoading(false);
  }
};


  const handleRegister = async (data) => {
    setIsLoading(true);
    setMessage('');
    
    try {
      await axios.post('http://localhost:5000/api/auth/register', data);
      setMessage('Registrazione completata! Ora puoi accedere.');
      resetRegister();
      
      // Switch automatico al login dopo registrazione
      setTimeout(() => {
        setIsLogin(true);
        setMessage('');
      }, 2000);
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registrazione fallita.';
      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setMessage('');
    resetLogin();
    resetRegister();
  };

  return (
    <div className="auth-container">
      <div className={`auth-box ${!isLogin ? 'register-active' : ''}`}>
        <div className="forms-wrapper">
          {/* Form di Login */}
          <div className="form-panel">
            <h2>Accedi</h2>
            <form onSubmit={handleSubmitLogin(handleLogin)}>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  {...registerLogin('email')}
                  className={loginErrors.email ? 'error' : ''}
                />
                {loginErrors.email && (
                  <span className="error-message">{loginErrors.email.message}</span>
                )}
              </div>

              <div className="password-container">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  placeholder="Password"
                  {...registerLogin('password')}
                  className={loginErrors.password ? 'error' : ''}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                >
                  {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {loginErrors.password && (
                  <span className="error-message">{loginErrors.password.message}</span>
                )}
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className={isLoading ? 'loading' : ''}
              >
                {isLoading ? 'Accesso...' : 'Accedi'}
              </button>
            </form>
          </div>

          {/* Form di Registrazione */}
          <div className="form-panel">
            <h2>Registrati</h2>
            <form onSubmit={handleSubmitRegister(handleRegister)}>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  {...registerRegister('email')}
                  className={registerErrors.email ? 'error' : ''}
                />
                {registerErrors.email && (
                  <span className="error-message">{registerErrors.email.message}</span>
                )}
              </div>

              <div className="password-container">
                <input
                  type={showRegisterPassword ? 'text' : 'password'}
                  placeholder="Password"
                  {...registerRegister('password')}
                  className={registerErrors.password ? 'error' : ''}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                >
                  {showRegisterPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {registerErrors.password && (
                  <span className="error-message password-error">{registerErrors.password.message}</span>
                )}
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className={isLoading ? 'loading' : ''}
              >
                {isLoading ? 'Registrazione...' : 'Registrati'}
              </button>
            </form>
          </div>
        </div>

        {/* Overlay Toggle */}
        <div className="toggle-overlay">
          <div className="toggle-content">
            <h2>{isLogin ? 'Hai già un account?' : 'Nuovo qui?'}</h2>
            <p>
              {isLogin 
                ?'Accedi per continuare con le tue attività'
                : 'Registrati per iniziare a gestire le tue attività'
              }
            </p>
            <button onClick={toggleMode} disabled={isLoading}>
              {isLogin ? 'Accedi' : 'Registrati' }
            </button>
          </div>
        </div>

        {/* Messaggio */}
        {message && (
          <div className={`auth-message ${message.includes('successo') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
