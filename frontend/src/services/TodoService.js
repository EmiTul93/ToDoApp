import axios from 'axios';

const API_URL = 'http://localhost:5000/api/todos';

const getToken = () => localStorage.getItem('token');

export const fetchTodos = async () => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.data;
};

export const addTodo = async (todo) => {
  const payload = {
    title: todo.title,
    description: todo.description || '',
    due_date: todo.due_date || null,
    priority: todo.priority || 'medium',
    status: todo.status || 'pending'
  };

  const res = await axios.post(API_URL, payload, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return res.data.todo;
};


export const updateTodo = async (id, updates) => {
  await axios.put(`${API_URL}/${id}`, updates, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
};

export const deleteTodo = async (id) => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
};
