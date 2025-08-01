// hooks/useTodos.js - CUSTOM HOOK PER GESTIONE TODOS
import { useState, useEffect, useCallback } from 'react';
import { 
  fetchTodos, 
  addTodo as addTodoAPI, 
  updateTodo as updateTodoAPI, 
  deleteTodo as deleteTodoAPI 
} from '../services/TodoService';

export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Carica le todos all'avvio
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const todosData = await fetchTodos();
      setTodos(todosData);
    } catch (err) {
      console.error('Errore nel caricamento delle todos:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const addTodo = useCallback(async (todoData) => {
    try {
      setLoading(true);
      setError('');
      
      const newTodo = await addTodoAPI(todoData);
      setTodos(prevTodos => [newTodo, ...prevTodos]);
      return true; // Successo
    } catch (err) {
      console.error('Errore nell\'aggiunta della todo:', err);
      setError(getErrorMessage(err));
      return false; // Fallimento
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTodo = useCallback(async (id, updates) => {
    try {
      setLoading(true);
      setError('');
      
      await updateTodoAPI(id, updates);
      
      // Aggiorna lo stato locale
      setTodos(prevTodos => 
        prevTodos.map(todo => 
          todo.id === id ? { ...todo, ...updates } : todo
        )
      );
      return true;
    } catch (err) {
      console.error('Errore nell\'aggiornamento della todo:', err);
      setError(getErrorMessage(err));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTodo = useCallback(async (id) => {
    try {
      setLoading(true);
      setError('');
      
      await deleteTodoAPI(id);
      
      // Rimuovi dallo stato locale
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      return true;
    } catch (err) {
      console.error('Errore nell\'eliminazione della todo:', err);
      setError(getErrorMessage(err));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError('');
  }, []);

  const refreshTodos = useCallback(() => {
    loadTodos();
  }, [loadTodos]);

  // Funzione helper per gestire i messaggi di errore
  const getErrorMessage = (err) => {
    if (err.response?.status === 401) {
      return 'Sessione scaduta. Effettua nuovamente il login.';
    }
    if (err.response?.status === 403) {
      return 'Non hai i permessi per eseguire questa operazione.';
    }
    if (err.response?.status === 404) {
      return 'Todo non trovata.';
    }
    if (err.response?.status >= 500) {
      return 'Errore del server. Riprova più tardi.';
    }
    if (err.code === 'NETWORK_ERROR' || !navigator.onLine) {
      return 'Errore di connessione. Controlla la tua connessione internet.';
    }
    
    return err.response?.data?.message || err.message || 'Si è verificato un errore imprevisto.';
  };

  return {
    todos,
    loading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    clearError,
    refreshTodos
  };
};