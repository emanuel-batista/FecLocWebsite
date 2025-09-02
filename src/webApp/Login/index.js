import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Importe do arquivo de configuração dentro de src
import { auth } from '../../firebase/config';
import { 
  signInWithEmailAndPassword, 
  setPersistence, 
  browserLocalPersistence,
  onAuthStateChanged 
} from 'firebase/auth';

// Importações do Material-UI
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

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
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
    const navigate = useNavigate();
    const isMounted = useRef(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!isMounted.current) return;
            
            setIsCheckingAuth(false);
            if (user) {
                console.log('Usuário já autenticado, redirecionando...');
                navigate("/home", { replace: true });
            }
        });

        return () => {
            isMounted.current = false;
            unsubscribe();
        };
    }, [navigate]);

    const showAlert = (message, severity = 'error') => {
        setAlert({ open: true, message, severity });
    };

    const handleCloseAlert = () => {
        setAlert({ ...alert, open: false });
    };

    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        if (!validateEmail(newEmail)) {
            setEmailError("Email inválido");
        } else {
            setEmailError("");
        }
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
            
            if (!isMounted.current) return;
            
            console.log('Login bem-sucedido, redirecionando...');
            // REMOVIDO: alert de sucesso que bloqueava o redirecionamento
            navigate("/home", { replace: true });
            
        } catch (error) {
            if (!isMounted.current) return;
            
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
            if (isMounted.current) {
                setIsLoggingIn(false);
            }
        }
    };

    if (isCheckingAuth) {
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
                    <CircularProgress 
                        size={60} 
                        thickness={4}
                        sx={{
                            color: 'primary.main'
                        }}
                    />
                    <Typography 
                        variant="h6" 
                        component="div" 
                        sx={{
                            color: 'text.primary',
                            fontWeight: 300
                        }}
                    >
                        Verificando autenticação...
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