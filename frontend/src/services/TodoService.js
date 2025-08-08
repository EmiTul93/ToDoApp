// services/TodoService.js - VERSIONE MIGLIORATA E UNIFICATA
import axios from 'axios';

// Configurazione base
const API_BASE_URL = 'https://localhost:443/api';
const API_URL = `${API_BASE_URL}/todos`;

// Timeout per le richieste (10 secondi)
const REQUEST_TIMEOUT = 10000;

// Configurazione axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  // Configurazione per certificati self-signed (solo per sviluppo)
  httpsAgent: process.env.NODE_ENV === 'development' ? {
    rejectUnauthorized: false
  } : undefined,
});

// Interceptor per aggiungere automaticamente il token di autenticazione
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor per gestire risposte e errori
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Gestione errori di autenticazione
    if (error.response?.status === 401) {
      // Token scaduto o non valido
      localStorage.removeItem('token');
      window.location.href = '/'; // Redirect al login
    }
    
    // Aggiungi informazioni aggiuntive all'errore
    if (error.code === 'ECONNABORTED') {
      error.message = 'Timeout della richiesta. Il server potrebbe essere lento.';
    } else if (error.code === 'ERR_NETWORK') {
      error.message = 'Errore di rete. Controlla la connessione internet.';
    }
    
    return Promise.reject(error);
  }
);

// Funzioni API

/**
 * Recupera tutte le todos dell'utente autenticato
 * @returns {Promise<Array>} Array di todos
 */
export const fetchTodos = async () => {
  try {
    const response = await apiClient.get('/todos');
    return response.data;
  } catch (error) {
    console.error('Errore nel recupero delle todos:', error);
    throw error;
  }
};

/**
 * Aggiunge una nuova todo
 * @param {Object} todo - Dati della todo da aggiungere
 * @param {string} todo.title - Titolo della todo (obbligatorio)
 * @param {string} [todo.description] - Descrizione della todo
 * @param {string} [todo.due_date] - Data di scadenza (formato YYYY-MM-DD)
 * @param {string} [todo.priority] - Priorità (low, medium, high)
 * @param {string} [todo.status] - Status (pending, completed, in_progress)
 * @returns {Promise<Object>} La todo creata
 */
export const addTodo = async (todo) => {
  try {
    // Validazione lato client
    if (!todo.title || !todo.title.trim()) {
      throw new Error('Il titolo della todo è obbligatorio');
    }

    if (todo.title.length > 100) {
      throw new Error('Il titolo non può superare i 100 caratteri');
    }

    if (todo.description && todo.description.length > 500) {
      throw new Error('La descrizione non può superare i 500 caratteri');
    }

    // Validazione data di scadenza
    if (todo.due_date) {
      const dueDate = new Date(todo.due_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        throw new Error('La data di scadenza non può essere nel passato');
      }
    }

    const payload = {
      title: todo.title.trim(),
      description: todo.description?.trim() || '',
      due_date: todo.due_date || null,
      priority: todo.priority || 'medium',
      status: todo.status || 'pending'
    };

    const response = await apiClient.post('/todos', payload);
    return response.data.todo;
  } catch (error) {
    console.error('Errore nell\'aggiunta della todo:', error);
    throw error;
  }
};

/**
 * Aggiorna una todo esistente
 * @param {number} id - ID della todo da aggiornare
 * @param {Object} updates - Campi da aggiornare
 * @returns {Promise<void>}
 */
export const updateTodo = async (id, updates) => {
  try {
    if (!id) {
      throw new Error('ID della todo non specificato');
    }

    // Rimuovi campi vuoti o non modificati
    const cleanUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});

    if (Object.keys(cleanUpdates).length === 0) {
      throw new Error('Nessun campo da aggiornare');
    }

    // Validazioni specifiche
    if (cleanUpdates.title && cleanUpdates.title.length > 100) {
      throw new Error('Il titolo non può superare i 100 caratteri');
    }

    if (cleanUpdates.description && cleanUpdates.description.length > 500) {
      throw new Error('La descrizione non può superare i 500 caratteri');
    }

    await apiClient.put(`/todos/${id}`, cleanUpdates);
  } catch (error) {
    console.error('Errore nell\'aggiornamento della todo:', error);
    throw error;
  }
};

/**
 * Elimina una todo
 * @param {number} id - ID della todo da eliminare
 * @returns {Promise<void>}
 */
export const deleteTodo = async (id) => {
  try {
    if (!id) {
      throw new Error('ID della todo non specificato');
    }

    await apiClient.delete(`/todos/${id}`);
  } catch (error) {
    console.error('Errore nell\'eliminazione della todo:', error);
    throw error;
  }
};

/**
 * Segna una todo come completata o attiva
 * @param {number} id - ID della todo
 * @param {boolean} completed - true per completata, false per attiva
 * @returns {Promise<void>}
 */
export const toggleTodoStatus = async (id, completed = true) => {
  try {
    const status = completed ? 'completed' : 'pending';
    await updateTodo(id, { status });
  } catch (error) {
    console.error('Errore nel cambio di status della todo:', error);
    throw error;
  }
};

/**
 * Recupera una singola todo per ID
 * @param {number} id - ID della todo
 * @returns {Promise<Object>} La todo richiesta
 */
export const getTodoById = async (id) => {
  try {
    if (!id) {
      throw new Error('ID della todo non specificato');
    }

    const response = await apiClient.get(`/todos/${id}`);
    return response.data;
  } catch (error) {
    console.error('Errore nel recupero della todo:', error);
    throw error;
  }
};

/**
 * Verifica se il servizio backend è raggiungibile
 * @returns {Promise<boolean>} true se il servizio è attivo
 */
export const checkServiceHealth = async () => {
  try {
    const response = await apiClient.get('/health', { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    console.error('Servizio backend non raggiungibile:', error);
    return false;
  }
};

// Esporta anche la configurazione per uso avanzato
export { apiClient, API_BASE_URL, API_URL };