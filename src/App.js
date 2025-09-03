// App.js - Versão Final
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
import Quiz from './webApp/Quiz';
// --- IMPORTS ATUALIZADOS ---
import AdminPanel from './webApp/AdminPanel';
import AdminUsers from './webApp/AdminPanel/Users';
import AdminUnidades from './webApp/AdminPanel/Unidades';
import AdminQuizzes from './webApp/AdminPanel/Quizzes';
import CriarCurso from './webApp/AdminPanel/Quizzes/CriarCurso'; // <-- NOVO
import CadastrarPergunta from './webApp/AdminPanel/Quizzes/CadastrarPergunta'; // <-- NOVO
import Unidade from './webApp/HomeAlternative/Unidade';
import Curso from './webApp/HomeAlternative/Curso';
import Ranking from './webApp/RankingGeral';
import MeusEmblemas from './webApp/MeusEmblemas';
import Escanear from 'webApp/Escanear';
import Pin from './components/Pin'

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
          element={<ProtectedRoute> <HomeApp /> </ProtectedRoute>}
        />

        <Route path='/escanear' element={<ProtectedRoute> <Escanear /> </ProtectedRoute>} />
        {/* --- NOVA ROTA DO QUIZ --- */}
        <Route path="/quiz/responder/:quizId" element={<ProtectedRoute> <Quiz /> </ProtectedRoute>} />
        <Route path="/unidade/:unidadeId" element={<ProtectedRoute> <Unidade /> </ProtectedRoute>} />

          <Route path="/curso/:cursoId" element={ <ProtectedRoute> <Curso /> </ProtectedRoute> } />
          <Route path="/ranking" element={<ProtectedRoute> <Ranking /> </ProtectedRoute>} />
          <Route path="/meus-emblemas" element={ <ProtectedRoute> <MeusEmblemas /> </ProtectedRoute> } />
        {/* =================================================== */}
        {/* === ROTAS PROTEGIDAS APENAS PARA ADMINISTRADORES === */}
        {/* =================================================== */}

        <Route path="/admin" element={<ProtectedRoute adminOnly={true}> <AdminPanel /> </ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute adminOnly={true}> <AdminUsers /> </ProtectedRoute>} />
        <Route path="/admin/unidades" element={<ProtectedRoute adminOnly={true}> <AdminUnidades /> </ProtectedRoute>} />

        {/* --- NOVAS ROTAS DE QUIZZES --- */}
        <Route path="/admin/quizzes" element={<ProtectedRoute adminOnly={true}> <AdminQuizzes /> </ProtectedRoute>} />
        <Route path="/admin/quizzes/criar-curso" element={<ProtectedRoute adminOnly={true}> <CriarCurso /> </ProtectedRoute>} />
        <Route path="/admin/quizzes/cadastrar-pergunta/:cursoId" element={<ProtectedRoute adminOnly={true}> <CadastrarPergunta /> </ProtectedRoute>} />
      </Routes>
      <Pin />
    </Router>
  );
}

export default App;