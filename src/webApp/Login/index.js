// Login.js - Versão Simplificada
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../firebase/config';
import { 
  signInWithEmailAndPassword, 
  setPersistence, 
  browserLocalPersistence
} from 'firebase/auth';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import styles from "./Login.module.css";
import StandardButton from 'components/common/StandardButton';
import StandardInput from 'components/common/StandardInput';
import { useNavigate } from 'react-router-dom';
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
  const showAlert = (message, severity = 'error') => {
    setAlert({ open: true, message, severity });
  };

  useEffect(() => {
    if (currentUser) {
        navigate('/home', { replace: true });
    }
  }, [currentUser, navigate]);
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
    
    if (isLoggingIn) return;
    
    if (emailError || !email || !password) {
      showAlert("Por favor, preencha os campos corretamente.");
      return;
    }

    setIsLoggingIn(true);

    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      // O AuthContext vai redirecionar automaticamente!
      
    } catch (error) {
      console.error("Erro no login:", error);
      let errorMessage = "Falha no login: Verifique seu email e senha.";
      
      if (error.code === 'auth/too-many-requests') {
        errorMessage = "Muitas tentativas de login. Tente novamente mais tarde.";
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = "Usuário não encontrado.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Senha incorreta.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Email inválido.";
      }
      
      showAlert(errorMessage);
    } finally {
      setIsLoggingIn(false);
    }
  };

  

  return (
    <>
      <div id={styles.loginContainer}>
        <form className={styles.form} onSubmit={handleLogin}>
          <StandardInput
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={handleEmailChange}
            disabled={isLoggingIn}
          />
          {emailError && <span style={{color: "red", marginTop: "5px"}}>{emailError}</span>}
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
      </div>

      <Snackbar 
        open={alert.open} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={alert.severity}
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Login;