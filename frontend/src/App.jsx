import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';
import Home from './pages/Home';
import AuthForm from './pages/AuthForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactGA from "react-ga4";
import { useEffect } from "react";
import { hotjar } from 'react-hotjar';

ReactGA.initialize("G-501543623");

function App() {
  // Componente per tracciare pageview GA
  function GAListener() {
    const location = useLocation();
    useEffect(() => {
      ReactGA.send({ hitType: "pageview", page: location.pathname });
    }, [location]);
    return null;
  }

  // Inizializza Hotjar una volta al montaggio
  useEffect(() => {
    hotjar.initialize(6496051, 6); // 6 è la versione snippet standard Hotjar
  }, []);

  return (
    <Router>
      <GAListener />
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route
          path="/home"
          element={
            localStorage.getItem('token') ? (
              <Home />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
      <ToastContainer position="top-center" autoClose={3200} newestOnTop />
    </Router>
  );
}

export default App;
