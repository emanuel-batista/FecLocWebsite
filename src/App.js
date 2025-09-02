// App.js - Versão Atualizada
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import './App.css'; 
import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/HomePage/HomePage';
import SobrePage from './pages/Sobre/SobrePage';
import ContatoPage from './pages/Contato/ContatoPage';
import Login from './webApp/Login/';
import Register from './webApp/Register';
import HomeApp from './webApp/HomeAlternative';

// --- IMPORTS ATUALIZADOS ---
import AdminPanel from './webApp/AdminPanel'; // O novo painel principal
import AdminUsers from './webApp/AdminPanel/Users';
import AdminUnidades from './webApp/AdminPanel/Unidades';
import AdminQuizzes from './webApp/AdminPanel/Quizzes';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* === Rotas Públicas === */}
        <Route path="/" element={<HomePage />} />
        <Route path="/sobre" element={<SobrePage />} />
        <Route path="/contato" element={<ContatoPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* === Rota Protegida para Utilizadores Comuns === */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <HomeApp />
            </ProtectedRoute>
          } 
        />

        {/* =================================================== */}
        {/* === ROTAS PROTEGIDAS APENAS PARA ADMINISTRADORES === */}
        {/* =================================================== */}
        
        {/* Rota principal do painel de admin */}
        <Route 
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        
        {/* Rota para gerenciar usuários */}
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminUsers />
            </ProtectedRoute>
          } 
        />

        {/* Rota para gerenciar unidades */}
        <Route 
          path="/admin/unidades" 
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminUnidades />
            </ProtectedRoute>
          } 
        />

        {/* Rota para gerenciar quizzes */}
        <Route 
          path="/admin/quizzes" 
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminQuizzes />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;