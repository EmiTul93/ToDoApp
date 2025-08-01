import React, { useState, useEffect } from 'react';
import './ToDoList.css';

const ToDoList = () => {
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // URL del backend - MODIFICA QUESTO SE IL TUO BACKEND È SU PORTA DIVERSA
  const API_BASE_URL = 'http://localhost:5000/api';

  // Funzione per ottenere il token di autenticazione
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Funzione per fare richieste API con autenticazione
  const apiRequest = async (url, options = {}) => {
    const token = getAuthToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${url}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Errore HTTP: ${response.status}`);
    }
    
    return response.json();
  };

  // Carica le todo all'avvio del componente
  useEffect(() => {
    loadTodos();
  }, []);

  // Funzione per caricare tutte le todo dal backend
  const loadTodos = async () => {
    try {
      setLoading(true);
      setError('');
      const todosData = await apiRequest('/todos');
      setTodos(todosData);
    } catch (err) {
      console.error('Errore nel caricamento delle todo:', err);
      setError('Errore nel caricamento delle todo: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Funzione per aggiungere una nuova todo
  const handleAdd = async () => {
    if (task.trim() === '') {
      setError('Il titolo della todo non può essere vuoto');
      return;
    }

    if (task.length > 100) {
      setError('Il titolo non può superare i 100 caratteri');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Invia la richiesta al backend
      const newTodo = await apiRequest('/todos', {
        method: 'POST',
        body: JSON.stringify({
          title: task.trim(),
          description: '',
          priority: 'medium',
          status: 'pending'
        }),
      });

      // Aggiorna la lista locale
      setTodos(prevTodos => [newTodo.todo, ...prevTodos]);
      setTask('');
      
    } catch (err) {
      console.error('Errore nell\'aggiunta della todo:', err);
      setError('Errore nell\'aggiunta: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Funzione per eliminare una todo
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      setError('');
      
      await apiRequest(`/todos/${id}`, {
        method: 'DELETE',
      });

      // Rimuovi dalla lista locale
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      
    } catch (err) {
      console.error('Errore nell\'eliminazione della todo:', err);
      setError('Errore nell\'eliminazione: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Funzione per gestire l'invio con Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleAdd();
    }
  };

  return (
    <div className="todo-container">
      <h2 className="todo-title">La mia ToDo List</h2>
      
      {/* Mostra errori */}
      {error && (
        <div className="error-message" style={{ 
          color: 'red', 
          marginBottom: '10px', 
          padding: '10px', 
          backgroundColor: '#ffe6e6', 
          border: '1px solid #ff9999',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}

      <div className="todo-input-group">
        <input
          type="text"
          placeholder="Scrivi un task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={handleKeyDown}
          className="todo-input"
          disabled={loading}
          maxLength={100}
        />
        <button 
          onClick={handleAdd} 
          className="todo-button"
          disabled={loading || task.trim() === ''}
        >
          {loading ? 'Aggiungendo...' : 'Aggiungi'}
        </button>
      </div>

      {/* Indicatore di caricamento */}
      {loading && (
        <div style={{ textAlign: 'center', margin: '10px 0' }}>
          Caricamento...
        </div>
      )}

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className="todo-item">
            <div className="todo-content">
              <strong>{todo.title}</strong>
              {todo.description && <p>{todo.description}</p>}
              <small>
                Priorità: {todo.priority} | Status: {todo.status}
                {todo.created_at && ` | Creata: ${new Date(todo.created_at).toLocaleDateString()}`}
              </small>
            </div>
            <button
              onClick={() => handleDelete(todo.id)}
              className="todo-delete-btn"
              disabled={loading}
            >
              {loading ? '...' : 'Elimina'}
            </button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && !loading && (
        <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
          Nessuna todo presente. Aggiungine una!
        </p>
      )}
    </div>
  );
};

export default ToDoList;