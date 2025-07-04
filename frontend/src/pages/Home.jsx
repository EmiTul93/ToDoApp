import React from 'react';
import ToDoList from '../components/TodoItem';
import './Home.css';

const Home = () => {
return (
<div className="home-container">
<h1 className="home-title">Benvenuto nella tua ToDo App</h1>
<div className="home-todolist-wrapper">
<ToDoList />
</div>
</div>
);
};

export default Home;