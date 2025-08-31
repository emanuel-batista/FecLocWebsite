import { useState } from "react";

import styles from "./Login.module.css";

function validateEmail(email) {
    // Simple email regex validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function Login() {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (!validateEmail(e.target.value)) {
            setEmailError("Email inválido");
        } else {
            setEmailError("");
        }
    };

    return(
        <div className={styles.container}>
            <form className={styles.form} method="POST">
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
                    className={styles.inputPassword} // <-- Use styles.inputPassword
                    name="password"
                />
                {/** não tem uma conta? Cadastre-se */}
                <button type="submit" className={styles.button}>Login</button>
                <p>Não tem uma conta? <a href="/register" className={styles.link}>Cadastre-se</a></p>
            </form>
        </div>
    );
}

export default Login;