// components/TodoItem.jsx - COMPONENTE CORRETTO PER SINGOLO ITEM
import React from 'react';
import './ToDoList.css';

const TodoItem = ({ todo, onDelete, onUpdate, loading }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return "";
    return date.toLocaleDateString("it-IT");
  };

  const getPriorityLabel = (priority) => {
    const labels = {
      low: "Bassa",
      medium: "Media", 
      high: "Alta"
    };
    return labels[priority] || priority;
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: "Attiva",
      completed: "Completata",
      in_progress: "In Corso"
    };
    return labels[status] || status;
  };

  const handleStatusToggle = () => {
    const newStatus = todo.status === 'completed' ? 'pending' : 'completed';
    onUpdate(todo.id, { status: newStatus });
  };

  return (
    <li className="todo-item">
      <div className="todo-content">
        <div className="todo-header">
          <strong className={todo.status === 'completed' ? 'completed' : ''}>
            {todo.title}
          </strong>
          <div className="todo-actions">
            <button
              onClick={handleStatusToggle}
              className={`status-btn ${todo.status}`}
              disabled={loading}
              title={todo.status === 'completed' ? 'Segna come attiva' : 'Segna come completata'}
            >
              {todo.status === 'completed' ? '↶' : '✓'}
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="todo-delete-btn"
              disabled={loading}
              title="Elimina todo"
            >
              {loading ? '...' : '🗑️'}
            </button>
          </div>
        </div>
        
        {todo.description && (
          <p className="todo-description">{todo.description}</p>
        )}
        
        <div className="todo-meta">
          <span className={`priority priority-${todo.priority}`}>
            Priorità: {getPriorityLabel(todo.priority)}
          </span>
          <span className={`status status-${todo.status}`}>
            Status: {getStatusLabel(todo.status)}
          </span>
          {todo.due_date && (
            <span className="due-date">
              Scadenza: {formatDate(todo.due_date)}
            </span>
          )}
          {todo.created_at && (
            <span className="created-date">
              Creata: {formatDate(todo.created_at)}
            </span>
          )}
        </div>
      </div>
    </li>
  );
};

export default TodoItem;