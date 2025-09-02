// Login.js - Versão Atualizada

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase/config'; // Importa o db
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'firebase/auth';
// --- NOVOS IMPORTS DO FIRESTORE ---
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  Alert,
  Snackbar,
  StandardButton,
  StandardInput,
} from '@mui/material'; // Simplificando imports
import styles from "./Login.module.css";
import { useAuth } from '../../contexts/AuthContext';

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/home', { replace: true });
    }
  }, [currentUser, navigate]);

  const showAlert = (message, severity = 'error') => {
    setAlert({ open: true, message, severity });
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailError(validateEmail(newEmail) ? "" : "Email inválido");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (isLoggingIn || emailError || !email || !password) {
      showAlert("Por favor, preencha os campos corretamente.");
      return;
    }

    setIsLoggingIn(true);

    try {
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // =============================================================
      // --- LÓGICA DE MIGRAÇÃO PARA ADICIONAR ptsTotais ---
      // =============================================================
      const user = userCredential.user;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        // Verifica se o documento do usuário existe e se o campo ptsTotais NÃO existe
        if (userDocSnap.exists() && !userDocSnap.data().hasOwnProperty('ptsTotais')) {
          console.log(`Usuário antigo detectado (${user.email}). Adicionando campo ptsTotais.`);
          await updateDoc(userDocRef, {
            ptsTotais: 0
          });
        }
      }
      // =============================================================
      // FIM DA LÓGICA DE MIGRAÇÃO
      // =============================================================

      // O AuthContext vai redirecionar automaticamente!
      
    } catch (error) {
      console.error("Erro no login:", error);
      let errorMessage = "Falha no login: Verifique seu email e senha.";
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = "Email ou senha incorretos.";
      }
      // ... outros tratamentos de erro
      
      showAlert(errorMessage);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <>
      <div id={styles.loginContainer}>
        {/* ... seu formulário JSX continua o mesmo ... */}
      </div>
      <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Login;