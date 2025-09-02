// src/webApp/Login/index.js

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase/config';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { doc, getDoc, updateDoc } from "firebase/firestore";

// --- IMPORTS CORRIGIDOS ---
import { Alert, Snackbar } from '@mui/material';
import StandardButton from 'components/common/StandardButton'; // Importado do local correto
import StandardInput from 'components/common/StandardInput';   // Importado do local correto
// --------------------------

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
      
      const user = userCredential.user;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists() && !userDocSnap.data().hasOwnProperty('ptsTotais')) {
          console.log(`Usuário antigo detectado (${user.email}). Adicionando campo ptsTotais.`);
          await updateDoc(userDocRef, {
            ptsTotais: 0
          });
        }
      }
      
    } catch (error) {
      console.error("Erro no login:", error);
      let errorMessage = "Falha no login: Verifique seu email e senha.";
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = "Email ou senha incorretos.";
      }
      
      showAlert(errorMessage);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <>
      <div id={styles.loginContainer}>
        {/* --- FORMULÁRIO RESTAURADO --- */}
        <form className={styles.form} onSubmit={handleLogin}>
          <StandardInput
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={handleEmailChange}
            disabled={isLoggingIn}
          />
          {emailError && <span style={{color: "red", width: '100%', textAlign: 'left', marginTop: "-10px", marginBottom: "10px", fontSize: "12px"}}>{emailError}</span>}
          <StandardInput
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoggingIn}
          />
          <StandardButton 
            label={isLoggingIn ? "Entrando..." : "Login"} 
            type="submit" 
            disabled={isLoggingIn}
          />
          <p>Não tem uma conta?
            <Link to="/register" className={styles.link}>
              Cadastre-se
            </Link>
          </p>
        </form>
        {/* ---------------------------- */}
      </div>

      <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Login;