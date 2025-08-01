// pages/Home.jsx - VERSIONE CORRETTA CON STILI TODOLIST.CSS
import React, { useState } from 'react';
import { useTodos } from '../hooks/useTodos';
import TodoItem from '../components/TodoItem';
import '../components/ToDoList.css'; // Importa gli stili corretti

const Home = () => {
  const { todos, loading, error, addTodo, updateTodo, deleteTodo, clearError } = useTodos();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_date: ''
  });

  // Statistiche todos
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.status === 'completed').length;
  const pendingTodos = todos.filter(todo => todo.status === 'pending').length;
  const inProgressTodos = todos.filter(todo => todo.status === 'in_progress').length;

  const handleAddTodo = async (e) => {
    e.preventDefault();
    
    if (!newTodo.title.trim()) {
      alert('Il titolo è obbligatorio');
      return;
    }

    const success = await addTodo({
      ...newTodo,
      due_date: newTodo.due_date || null
    });

    if (success) {
      setNewTodo({
        title: '',
        description: '',
        priority: 'medium',
        due_date: ''
      });
      setShowAddForm(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTodo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="home-container">
      {/* Header con statistiche */}
      <div className="home-header">
        <h1>Le Mie Todo</h1>
        <div className="todo-stats">
          <span className="stat-item total">Totale: {totalTodos}</span>
          <span className="stat-item pending">Attive: {pendingTodos}</span>
          <span className="stat-item in-progress">In Corso: {inProgressTodos}</span>
          <span className="stat-item completed">Completate: {completedTodos}</span>
        </div>
      </div>

      {/* Barra azioni */}
      <div className="todo-actions-bar">
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="add-todo-btn"
          disabled={loading}
        >
          {showAddForm ? 'Annulla' : '+ Nuova Todo'}
        </button>
        <button 
          onClick={handleLogout}
          className="logout-btn"
        >
          Logout
        </button>
      </div>

      {/* Messaggio di errore */}
      {error && (
        <div className="error-message">
          <span>{error}</span>
          <button onClick={clearError} className="close-error">×</button>
        </div>
      )}

      {/* Form aggiunta todo */}
      {showAddForm && (
        <div className="add-todo-form">
          <h3>Aggiungi Nuova Todo</h3>
          <form onSubmit={handleAddTodo}>
            <div className="form-group">
              <label htmlFor="title">Titolo *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newTodo.title}
                onChange={handleInputChange}
                placeholder="Inserisci il titolo della todo"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Descrizione</label>
              <textarea
                id="description"
                name="description"
                value={newTodo.description}
                onChange={handleInputChange}
                placeholder="Descrizione opzionale"
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="priority">Priorità</label>
                <select
                  id="priority"
                  name="priority"
                  value={newTodo.priority}
                  onChange={handleInputChange}
                >
                  <option value="low">Bassa</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="due_date">Scadenza</label>
                <input
                  type="date"
                  id="due_date"
                  name="due_date"
                  value={newTodo.due_date}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Aggiungendo...' : 'Aggiungi Todo'}
              </button>
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="cancel-btn"
              >
                Annulla
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista todos */}
      <div className="todos-section">
        {loading && todos.length === 0 ? (
          <div className="loading-message">
            <div className="spinner"></div>
            <p>Caricamento todos...</p>
          </div>
        ) : todos.length === 0 ? (
          <div className="empty-state">
            <h3>Nessuna todo trovata</h3>
            <p>Inizia aggiungendo la tua prima todo!</p>
            <button 
              onClick={() => setShowAddForm(true)}
              className="add-first-todo-btn"
            >
              + Aggiungi la prima todo
            </button>
          </div>
        ) : (
          <ul className="todo-list">
            {todos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onDelete={deleteTodo}
                onUpdate={updateTodo}
                loading={loading}
              />
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="home-footer">
        <p>Gestisci le tue attività in modo efficiente</p>
      </div>
    </div>
  );
};

export default Home;