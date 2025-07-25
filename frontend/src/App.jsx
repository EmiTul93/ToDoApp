import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AuthForm from './pages/authForm';

function App() {
return (
<Router>
<Routes>
{/* Mostra AuthForm come prima pagina */}
<Route path="/" element={<AuthForm />} />
{/* Home accessibile dopo il login */}
<Route path="/home" element={<Home />} />
</Routes>
</Router>
);
}

export default App;