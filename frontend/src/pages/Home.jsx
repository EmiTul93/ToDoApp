import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ToDoList from '../components/TodoItem';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  // Controlla l'autenticazione al mount del componente
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="home-container">
      {/* Header con pulsante logout */}
      <header className="home-header">
        <h1 className="home-title">Benvenuto nella tua ToDo App</h1>
        <button 
          onClick={handleLogout}
          className="logout-button"
          aria-label="Esci dall'account"
        >
          Logout
        </button>
      </header>

      {/* Contenuto principale */}
      <div className="home-content">
        <div className="home-todolist-wrapper">
          <ToDoList />
        </div>
      </div>
    </div>
  );
};

export default Home;