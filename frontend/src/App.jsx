import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import AuthForm from './pages/AuthForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route 
          path="/home" 
          element={
            localStorage.getItem('token') 
              ? <Home /> 
              : <Navigate to="/" replace />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;