// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importe do arquivo de configuração dentro de src
import { auth, db } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

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
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        setUserRole(null);
      }
      setLoading(false); 
    });

    return unsubscribe;
  }, []);

  const PrivateRoute = ({ children }) => {
    if (loading) {
      return <div>A carregar...</div>;
    }
    return currentUser ? children : <Navigate to="/login" />;
  };

  const AdminRoute = ({ children }) => {
    if (loading) {
        return <div>A carregar...</div>;
    }
    return currentUser && userRole === 'admin' ? children : <Navigate to="/home" />;
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sobre" element={<SobrePage />} />
        <Route path="/contato" element={<ContatoPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route 
          path="/home" 
          element={
            <PrivateRoute>
              <HomeApp />
            </PrivateRoute>
          } 
        />

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