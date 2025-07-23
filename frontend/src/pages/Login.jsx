// src/pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [message, setMessage] = useState('');

const handleLogin = async (e) => {
e.preventDefault();
try {
const res = await axios.post("http://localhost:5000/api/auth/login", {
email,
password,
});
  localStorage.setItem("token", res.data.token);
  setMessage("Login effettuato con successo!");
  // Reindirizza alla home (opzionale)
  window.location.href = "/";
} catch (err) {
  console.error("Login error:", err);
  setMessage("Credenziali errate o errore nel login.");
}
};

return (
<div style={{ padding: "2rem" }}>
<h2>Login</h2>
<form onSubmit={handleLogin}>
<div>
<label htmlFor="email">Email: </label>
<input
id="email"
type="email"
required
value={email}
onChange={(e) => setEmail(e.target.value)}
/>
</div>
<div style={{ marginTop: '1rem' }}>
<label htmlFor="password">Password: </label>
<input
id="password"
type="password"
required
value={password}
onChange={(e) => setPassword(e.target.value)}
/>
</div>
<button style={{ marginTop: '1rem' }} type="submit">
Accedi
</button>
</form>
<p>{message}</p>
</div>
);
};

export default Login;