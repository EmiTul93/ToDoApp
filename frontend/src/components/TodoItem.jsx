import React, { useState } from 'react';
import './ToDoList.css';

const ToDoList = () => {
const [task, setTask] = useState('');
const [todos, setTodos] = useState([]);

const handleAdd = () => {
if (task.trim() === '') return;
setTodos([...todos, { id: Date.now(), text: task }]);
setTask('');
};

const handleDelete = (id) => {
setTodos(todos.filter((todo) => todo.id !== id));
};

const handleKeyDown = (e) => {
if (e.key === 'Enter') {
handleAdd();
}
};

return (
<div className="todo-container">
<h2 className="todo-title">La mia ToDo List</h2>
<div className="todo-input-group">
<input
type="text"
placeholder="Scrivi un task..."
value={task}
onChange={(e) => setTask(e.target.value)}
onKeyDown={handleKeyDown}
className="todo-input"
/>
<button onClick={handleAdd} className="todo-button">Aggiungi</button>
</div>
<ul className="todo-list">
{todos.map((todo) => (
<li key={todo.id} className="todo-item">
{todo.text}
<button
onClick={() => handleDelete(todo.id)}
className="todo-delete-btn"
>
Elimina
</button>
</li>
))}
</ul>
</div>
);
};

export default ToDoList;