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
setIsLogin(true);
} catch (err) {
setMessage('Registrazione fallita.');
}
};

return (
<div className="auth-container">
<div className="auth-box">
<div className="forms-container">
<div
  className={`form-panel-login ${isLogin ? 'active' : ''}`}
>
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
      <div
        className={`form-panel-register ${!isLogin ? 'active' : ''}`}
      >
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
    </div>

    <div className="toggle-panel">
      <h2>{isLogin ? 'Nuovo qui?' : 'Hai già un account?'}</h2>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Registrati' : 'Accedi'}
      </button>
    </div>
  </div>

  {message && <p className="auth-message">{message}</p>}
</div>
);
};

export default AuthForm;