import './App.css'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/HomePage/HomePage';
import SobrePage from './pages/Sobre/SobrePage';
import ContatoPage from './pages/Contato/ContatoPage';
import Login from './webApp/Login/';
import Register from './webApp/Register';
import HomeApp from './webApp/HomeAlternative';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sobre" element={<SobrePage />} />
        <Route path="/contato" element={<ContatoPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<HomeApp />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}



export default App;