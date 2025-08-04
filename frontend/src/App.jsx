import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import AuthForm from './pages/AuthForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      <ToastContainer position="top-center" autoClose={3200} newestOnTop />
    </Router>
  );
}

export default App;