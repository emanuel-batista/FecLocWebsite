// App.js - Versão Modificada
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import './App.css'; 
import Navbar from './components/Navbar/Navbar';
import LandingPage from './pages/LandingPage'; // 1. Importe a nova página
import Login from './webApp/Login/';
import Register from './webApp/Register';
import HomeApp from './webApp/HomeAlternative';
import AdminUsers from './webApp/AdminPanel/Users';

function App() {
  return (
      <Router>
        <Navbar />
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<LandingPage />} /> {/* 2. Use a LandingPage para a rota principal */}
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
  );
}

export default App;