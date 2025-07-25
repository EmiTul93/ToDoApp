import React, { useState } from 'react';
import axios from 'axios';
import './AuthForm.css'; // per l'animazione

const AuthForm = () => {
const [isLogin, setIsLogin] = useState(true); // true = login, false = register
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [message, setMessage] = useState('');

const handleSubmit = async (e) => {
e.preventDefault();
if (!isLogin && password !== confirmPassword) {
  setMessage("Le password non coincidono.");
  return;
}

try {
  const url = isLogin
    ? 'http://localhost:5000/api/auth/login'
    : 'http://localhost:5000/api/auth/register';

  const res = await axios.post(url, { email, password });

  if (isLogin) {
    localStorage.setItem('token', res.data.token);
    setMessage('Login effettuato con successo!');
    window.location.href = '/';
  } else {
    setMessage('Registrazione completata. Ora puoi accedere.');
    setIsLogin(true);
  }
} catch (err) {
  console.error(err);
  setMessage(
    err?.response?.data?.message || 'Errore durante la richiesta.'
  );
}
};

return (
<div className="auth-container">
<div className={`auth-box ${isLogin ? 'login-mode' : 'register-mode'}`}>
<h2>{isLogin ? 'Login' : 'Registrati'}</h2>
<form onSubmit={handleSubmit}>
<input
type="email"
placeholder="Email"
required
value={email}
onChange={(e) => setEmail(e.target.value)}
/>
<input
type="password"
placeholder="Password"
required
value={password}
onChange={(e) => setPassword(e.target.value)}
/>
{!isLogin && (
<input
type="password"
placeholder="Conferma Password"
required
value={confirmPassword}
onChange={(e) => setConfirmPassword(e.target.value)}
/>
)}
<button type="submit">{isLogin ? 'Accedi' : 'Registrati'}</button>
</form>
<p className="auth-message">{message}</p>
<p className="auth-switch">
{isLogin ? 'Non hai un account?' : 'Hai già un account?'}{' '}
<button type="button" onClick={() => setIsLogin(!isLogin)}>
{isLogin ? 'Registrati' : 'Accedi'}
</button>
</p>
</div>
</div>
);
};

export default AuthForm;