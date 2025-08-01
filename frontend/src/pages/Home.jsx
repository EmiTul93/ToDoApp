// pages/Home.jsx - VERSIONE DEBUG IMMEDIATA
import React, { useEffect, useState } from "react";
import axios from 'axios';

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  // Debug: verifica token
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('🔍 Token trovato:', token ? 'SÌ' : 'NO');
    console.log('🔍 Token value:', token);
    setDebugInfo(`Token: ${token ? 'PRESENTE' : 'MANCANTE'}`);
  }, []);

  // Carica todos con debug completo
  useEffect(() => {
    const loadTodos = async () => {
      try {
        console.log('🚀 Inizio caricamento todos...');
        setLoading(true);
        setError('');
        
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token mancante - rieffettua il login');
        }

        console.log('📡 Chiamata API a: http://localhost:5000/api/todos');
        
        const response = await axios.get('http://localhost:5000/api/todos', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        });

        console.log('✅ Risposta ricevuta:', response.data);
        console.log('📊 Numero todos:', response.data.length);
        
        setTodos(response.data);
        setDebugInfo(`Todos caricate: ${response.data.length}`);
        
      } catch (err) {
        console.error('❌ Errore caricamento:', err);
        console.error('❌ Errore response:', err.response?.data);
        console.error('❌ Errore status:', err.response?.status);
        
        let errorMsg = 'Errore sconosciuto';
        
        if (err.code === 'ECONNABORTED') {
          errorMsg = 'Timeout - Backend non risponde';
        } else if (err.code === 'ERR_NETWORK') {
          errorMsg = 'Errore di rete - Backend offline?';
        } else if (err.response?.status === 401) {
          errorMsg = 'Token scaduto - rieffettua il login';
          localStorage.removeItem('token');
        } else if (err.response?.status === 500) {
          errorMsg = 'Errore server - controlla il backend';
        } else {
          errorMsg = err.message || 'Errore nel caricamento';
        }
        
        setError(errorMsg);
        setDebugInfo(`ERRORE: ${errorMsg}`);
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, []);

  // Funzione per aggiungere todo (semplificata per debug)
  const [newTodo, setNewTodo] = useState('');
  
  const addTodo = async () => {
    if (!newTodo.trim()) return;
    
    try {
      console.log('➕ Aggiunta todo:', newTodo);
      setLoading(true);
      
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/todos', {
        title: newTodo.trim(),
        description: '',
        priority: 'medium',
        status: 'pending'
      }, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Todo aggiunta:', response.data);
      setTodos(prev => [response.data.todo, ...prev]);
      setNewTodo('');
      
    } catch (err) {
      console.error('❌ Errore aggiunta:', err);
      setError('Errore nell\'aggiunta: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#333', textAlign: 'center' }}>
        🐛 DEBUG MODE - Le mie ToDo
      </h1>
      
      {/* Info di debug */}
      <div style={{ 
        background: '#f0f0f0', 
        padding: '10px', 
        borderRadius: '5px',
        marginBottom: '20px',
        fontSize: '14px'
      }}>
        <strong>Debug Info:</strong> {debugInfo}
      </div>

      {/* Errori */}
      {error && (
        <div style={{ 
          background: '#ffebee', 
          color: '#c62828', 
          padding: '15px', 
          borderRadius: '5px',
          marginBottom: '20px',
          border: '1px solid #ef5350'
        }}>
          <strong>❌ ERRORE:</strong> {error}
        </div>
      )}

      {/* Form aggiunta */}
      <div style={{ marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="Aggiungi una nuova todo..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          style={{
            width: '70%',
            padding: '10px',
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '5px'
          }}
        />
        <button 
          onClick={addTodo}
          disabled={loading || !newTodo.trim()}
          style={{
            width: '25%',
            padding: '10px',
            marginLeft: '5%',
            fontSize: '16px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Caricando...' : 'Aggiungi'}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          🔄 Caricamento in corso...
        </div>
      )}

      {/* Lista todos */}
      <div>
        <h3>Todos ({todos.length}):</h3>
        {todos.length === 0 && !loading ? (
          <p style={{ textAlign: 'center', color: '#666' }}>
            Nessuna todo trovata. Aggiungine una!
          </p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {todos.map((todo) => (
              <li key={todo.id} style={{
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: '5px',
                padding: '15px',
                marginBottom: '10px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <strong>{todo.title}</strong>
                {todo.description && <p style={{ margin: '5px 0', color: '#666' }}>{todo.description}</p>}
                <small style={{ color: '#999' }}>
                  Priorità: {todo.priority} | Status: {todo.status}
                  {todo.created_at && ` | Creata: ${new Date(todo.created_at).toLocaleDateString()}`}
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Debug console */}
      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        background: '#f8f9fa', 
        borderRadius: '5px',
        fontSize: '12px'
      }}>
        <strong>🔧 Istruzioni Debug:</strong>
        <ol>
          <li>Apri DevTools (F12)</li>
          <li>Vai su Console</li>
          <li>Cerca messaggi che iniziano con 🔍 🚀 ✅ ❌</li>
          <li>Vai su Network e cerca chiamate a /api/todos</li>
          <li>Verifica che il backend sia su localhost:5000</li>
        </ol>
      </div>
    </div>
  );
};

export default Home;