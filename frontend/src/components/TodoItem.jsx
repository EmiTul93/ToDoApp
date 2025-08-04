// components/TodoItem.jsx
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
              className={`status-badge status-badge-${todo.status}`}
              disabled={loading}
              title={todo.status === 'completed' ? 'Segna come attiva' : 'Segna come completata'}
              aria-label={todo.status === 'completed' ? 'Segna come attiva' : 'Segna come completata'}
            >
              {todo.status === 'completed' ? '↶' : '✓'}
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="todo-delete-btn"
              disabled={loading}
              title="Elimina todo"
              aria-label="Elimina todo"
            >
              {loading ? '...' : '🗑️'}
            </button>
          </div>
        </div>

        {todo.description && (
          <p className="todo-description">{todo.description}</p>
        )}

        <div className="todo-meta">
          <span className={`priority-badge priority-badge-${todo.priority}`}>
            Priorità: {getPriorityLabel(todo.priority)}
          </span>
          <span className={`status-badge status-badge-${todo.status}`}>
            Status: {getStatusLabel(todo.status)}
          </span>
          {todo.due_date && (
            <span className="todo-date">
              Scadenza: {formatDate(todo.due_date)}
            </span>
          )}
          {todo.created_at && (
            <span className="todo-date">
              Creata: {formatDate(todo.created_at)}
            </span>
          )}
        </div>
      </div>
    </li>
  );
};

export default TodoItem;
