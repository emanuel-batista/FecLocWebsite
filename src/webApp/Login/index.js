// webApp/Login/index.js (Versão Atualizada)

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged
} from 'firebase/auth';

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
    const navigate = useNavigate();

    // --> Verifica se o usuário já está autenticado
    useEffect(() => {
        const auth = getAuth();
        
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsCheckingAuth(false);
            if (user) {
                // Usuário já está logado, redireciona para Home
                navigate("/home");
            }
        });

        // Cleanup function
        return () => unsubscribe();
    }, [navigate]);

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
        if (emailError || !email || !password) {
            alert("Por favor, preencha os campos corretamente.");
            return;
        }

        const auth = getAuth();

        try {
            await setPersistence(auth, browserLocalPersistence);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            alert(`Login bem-sucedido para ${userCredential.user.email}`);
            navigate("/home");
        } catch (error) {
            console.error("Erro no login:", error);
            alert("Falha no login: Verifique seu email e senha.");
        }
    };

    // Mostra um loading enquanto verifica a autenticação
    if (isCheckingAuth) {
        return (
            <div id={styles.loginContainer}>
                <div className={styles.loading}>
                    <p>Verificando autenticação...</p>
                </div>
            </div>
        );
    }

    return (
        <div id={styles.loginContainer}>
            <form className={styles.form} onSubmit={handleLogin}>
                <StandardInput
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={handleEmailChange}
                />
                {emailError && <span style={{color: "red", marginTop: "5px"}}>{emailError}</span>}
                <StandardInput
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <StandardButton label="Login" type="submit" />
                <p>Não tem uma conta?
                    <Link to="/register" className={styles.link}>
                        Cadastre-se
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default Login;