// webApp/Login/index.js (Versão Corrigida)

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // --> Importe Link também

// --> Importe as funções necessárias do Firebase
import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence
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
    const navigate = useNavigate();

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

            // --> CORREÇÃO: Use navigate corretamente
            navigate("/home"); // Note: "/home" em vez de "/Home" (verifique a rota exata)

        } catch (error) {
            console.error("Erro no login:", error);
            alert("Falha no login: Verifique seu email e senha.");
        }
    };

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
                    {/* CORREÇÃO: Use Link em vez de <a> com onClick */}
                    <Link to="/register" className={styles.link}>
                        Cadastre-se
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default Login;