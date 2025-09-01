// webApp/Login/index.js (Versão Corrigida)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // --> 1. Importe o useNavigate

// --> 2. Importe as funções necessárias do Firebase
import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';

import styles from "./Login.module.css";
import StandardButton from 'components/common/StandardButton';
import StandardInput from 'components/common/StandardInput';

// --> 3. REMOVA a configuração e inicialização do Firebase daqui
// A inicialização já é feita no App.js

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const navigate = useNavigate(); // --> 4. Inicialize o hook de navegação

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

        const auth = getAuth(); // Obtém a instância do auth que já foi inicializada no App.js

        try {
            // --> 5. ANTES do login, defina a persistência
            await setPersistence(auth, browserLocalPersistence);

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            alert(`Login bem-sucedido para ${userCredential.user.email}`);

            // --> 6. Use o navigate para redirecionar sem recarregar a página
            navigate("/home");

        } catch (error) {
            console.error("Erro no login:", error);
            alert("Falha no login: Verifique seu email e senha.");
        }
    };

    const handleRegister = (e) => {
        e.preventDefault(); // Previne o comportamento padrão do link
        navigate("/register"); // Navega para a página de registo
    };

    return (
        <div className={styles.container}>
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
                    <a href="/register" onClick={handleRegister} className={styles.link}>
                        Cadastre-se
                    </a>
                </p>
            </form>
        </div>
    );
}

export default Login;