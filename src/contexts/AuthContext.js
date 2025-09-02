// src/contexts/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config'; // Verifique o caminho para seu config

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          // Pega o token do usuário e os "claims" (permissões)
          const idTokenResult = await user.getIdTokenResult();
          
          // Verifica se o claim 'admin' é verdadeiro
          if (idTokenResult.claims.admin === true) {
            setUserRole('admin');
          } else {
            setUserRole('user');
          }
        } catch (error) {
          console.error("Erro ao buscar permissões do usuário:", error);
          setUserRole('user'); // Define como user em caso de erro
        }
      } else {
        setUserRole(null); // Nenhum usuário logado
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}