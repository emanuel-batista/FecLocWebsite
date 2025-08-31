import React, { useState } from 'react';
// --> 1. Importações necessárias para a comunicação
import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import styles from "./Login.module.css"; // Seu arquivo de estilos é mantido

// --> 2. Configuração do Firebase (CLIENTE)
//    - Cole aqui as suas credenciais do Firebase que pode encontrar no seu projeto.
const firebaseConfig = {
  apiKey: "AIzaSyDviUSj5sqnmuclPnt6rKYE5RIe63ecbLk",
  authDomain: "un1l0c.firebaseapp.com",
  databaseURL: "https://un1l0c-default-rtdb.firebaseio.com",
  projectId: "un1l0c",
  storageBucket: "un1l0c.firebasestorage.app",
  messagingSenderId: "670542305627",
  appId: "1:670542305627:web:169a865261b7cd7a26e27e",
  measurementId: "G-N33Y1XYZXJ"
};

// Inicializa o Firebase no cliente
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


function validateEmail(email) {
    // Simple email regex validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function Login() {
    const [email, setEmail] = useState("");
    // --> 3. Adicionado estado para a senha
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");

    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        if (!validateEmail(newEmail)) {
            setEmailError("Email inválido");
        } else {
            setEmailError("");
        }
    };

    // --> 4. Função para lidar com o login
    //    - Esta função será chamada quando o botão "Login" for clicado.
    //    - Ela previne o comportamento padrão do formulário e usa o Firebase para autenticar.
    const handleLogin = async (e) => {
        e.preventDefault(); // Impede o recarregamento da página
        if (emailError || !email || !password) {
            alert("Por favor, preencha os campos corretamente.");
            return;
        }
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            alert(`Login bem-sucedido para ${userCredential.user.email}`);
            // Aqui, você pode redirecionar o usuário ou atualizar o estado do seu app
            //ir para Home
            window.location.href = "../Home";
        } catch (error) {
            console.error("Erro no login:", error);
            alert("Falha no login: Verifique seu email e senha.");
        }
    };

    // --> 5. Função para lidar com o cadastro (registro)
    //    - Esta função chama o seu backend Node.js.
    const handleRegister = async (e) => {
        e.preventDefault();
        if (emailError || !email || !password) {
            alert("Por favor, preencha os campos para se cadastrar.");
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/api/signup', {
                email: email,
                password: password
            });
            alert(response.data.message);
        } catch (error) {
            console.error("Erro no cadastro:", error.response?.data);
            alert("Falha no cadastro: " + (error.response?.data?.error || error.message));
        }
    };


    return(
        <div className={styles.container}>
            {/* --> 6. O 'onSubmit' do formulário agora chama a função de login.
                  Removemos o 'method="POST"' pois a lógica é controlada pelo JavaScript.
            */}
            <form className={styles.form} onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={handleEmailChange}
                    className={styles.inputEmail}
                    name="email"
                />
                {emailError && <span style={{color: "red", marginTop: "5px"}}>{emailError}</span>}
                <input
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    // --> 7. Adicionado o onChange para o campo de senha
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.inputPassword}
                    name="password"
                />
                {/** não tem uma conta? Cadastre-se */}
                <button type="submit" className={styles.button}>Login</button>
                <p>Não tem uma conta? 
                    {/* --> 8. O link de cadastro agora chama a função 'handleRegister' */}
                    <a href="/register" onClick={handleRegister} className={styles.link}>
                        Cadastre-se
                    </a>
                </p>
            </form>
        </div>
    );
}

export default Login;

