// Login.js - Versão Final Corrigida
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../../firebase/config';
import { 
  signInWithEmailAndPassword, 
  setPersistence, 
  browserLocalPersistence
} from 'firebase/auth';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import styles from "./Login.module.css";
import StandardButton from 'components/common/StandardButton';
import StandardInput from 'components/common/StandardInput';

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();

  // Verifica cooldown periodicamente
  useEffect(() => {
    const checkCooldown = () => {
      const lastLogoutTime = localStorage.getItem('lastLogoutTime');
      if (lastLogoutTime) {
        const timeSinceLogout = Date.now() - parseInt(lastLogoutTime);
        const remainingCooldown = Math.max(0, 3000 - timeSinceLogout); // 3 segundos de cooldown
        
        if (remainingCooldown > 0) {
          setCooldown(Math.ceil(remainingCooldown / 1000));
        } else {
          setCooldown(0);
          localStorage.removeItem('lastLogoutTime');
        }
      }
    };

    checkCooldown();
    const interval = setInterval(checkCooldown, 1000);

    return () => clearInterval(interval);
  }, []);

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
    
    if (isLoggingIn || cooldown > 0) return;
    
    if (emailError || !email || !password) {
      showAlert("Por favor, preencha os campos corretamente.");
      return;
    }

    setIsLoggingIn(true);

    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      
      console.log('Login bem-sucedido, redirecionando...');
      
      // Verificação extra para evitar redirecionamento duplo
      if (window.location.pathname !== '/home') {
        navigate("/home", { replace: true });
      }
      
    } catch (error) {
      console.error("Erro no login:", error);
      let errorMessage = "Falha no login: Verifique seu email e senha.";
      
      if (error.code === 'auth/too-many-requests') {
        errorMessage = "Muitas tentativas de login. Tente novamente mais tarde.";
        setCooldown(30);
        setTimeout(() => setCooldown(0), 30000);
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = "Usuário não encontrado.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Senha incorreta.";
        setCooldown(2);
        setTimeout(() => setCooldown(0), 2000);
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Email inválido.";
      }
      
      showAlert(errorMessage);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Se estiver em cooldown, mostra contagem regressiva
  if (cooldown > 0) {
    return (
      <div id={styles.loginContainer}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            gap: 2
          }}
        >
          <CircularProgress />
          <Typography variant="h6" component="div">
            Aguarde {cooldown} segundos para tentar novamente
          </Typography>
        </Box>
      </div>
    );
  }

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
            disabled={isLoggingIn || cooldown > 0}
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