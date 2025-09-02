// App.js - Versão Simplificada
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import './App.css'; 
import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/HomePage/HomePage';
import SobrePage from './pages/Sobre/SobrePage';
import ContatoPage from './pages/Contato/ContatoPage';
import Login from './webApp/Login/';
import Register from './webApp/Register';
import HomeApp from './webApp/HomeAlternative';
import AdminUsers from './webApp/AdminPanel/Users';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/sobre" element={<SobrePage />} />
          <Route path="/contato" element={<ContatoPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rota Protegida para Utilizadores Logados */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <HomeApp />
              </ProtectedRoute>
            } 
          />

          {/* Rota Protegida para Admins */}
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminUsers />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;