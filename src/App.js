import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// --- IMPORTAÇÕES DO FIREBASE ---
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

import './App.css'; 
import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/HomePage/HomePage';
import SobrePage from './pages/Sobre/SobrePage';
import ContatoPage from './pages/Contato/ContatoPage';
import Login from './webApp/Login/';
import Register from './webApp/Register';
import HomeApp from './webApp/HomeAlternative';
import AdminUsers from './webApp/AdminPanel/Users';

// --- CONFIGURAÇÃO SEGURA DO FIREBASE ---
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Inicializa o Firebase e o Firestore
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


function App() {
  // --- ESTADO DE AUTENTICAÇÃO E NÍVEL DE ACESSO ---
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Se o utilizador está logado, busca o seu nível de acesso no Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role); // Ex: 'admin' ou 'user'
        }
        setCurrentUser(user);
      } else {
        // Se não há utilizador, limpa os estados
        setCurrentUser(null);
        setUserRole(null);
      }
      setLoading(false); 
    });

    return unsubscribe;
  }, []);

  // --- COMPONENTES DE ROTAS PROTEGIDAS ---
  // "Porteiro" para utilizadores normais
  const PrivateRoute = ({ children }) => {
    if (loading) {
      return <div>A carregar...</div>;
    }
    return currentUser ? children : <Navigate to="/login" />;
  };

  // "Porteiro" APENAS para administradores
  const AdminRoute = ({ children }) => {
    if (loading) {
        return <div>A carregar...</div>;
    }
    // Redireciona se não houver utilizador ou se o nível não for 'admin'
    return currentUser && userRole === 'admin' ? children : <Navigate to="/home" />;
  };

  return (
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
            <PrivateRoute>
              <HomeApp />
            </PrivateRoute>
          } 
        />

        {/* Rota Protegida para Admins */}
        <Route 
          path="/admin/users" 
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;

