import { useState } from "react";
import axios from "axios";

import StandardButton from "components/common/StandardButton";
import StandardInput from "components/common/StandardInput";
import H2 from "components/common/text/H2";
import styles from "./Register.module.css";
import SecondaryButton from "components/common/SecondaryButton";
import ErrorAlert from "components/common/alerts/ErrorAlert";

function Register() {
    const [isRegulamentoAceito, setIsRegulamentoAceito] = useState(false);

    // Estados para os campos
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Estados para mensagens
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isRegulamentoAceito) {
            setErrorMessage("Você deve aceitar o regulamento para se cadastrar.");
            return;
        }

        const userData = {
            username,
            fullName,
            phone,
            email,
            password,
        };

        try {
            const apiUrl = process.env.REACT_APP_API_URL || "https://uniloc.vercel.app";
            const response = await axios.post(`${apiUrl}/api/signup`, userData);

            // Se chegou aqui, deu certo
            setErrorMessage("");
            setSuccessMessage(response.data.message || "Registro realizado com sucesso!");

            // Redireciona após 2 segundos
            setTimeout(() => {
                window.location.href = "/login";
            }, 2000);

        } catch (error) {
            console.error("DEBUG: Objeto de erro completo:", error);

            let errorMessage = "Ocorreu um erro de rede. Verifique a sua conexão e tente novamente.";
            if (error.response && error.response.data) {
                if (typeof error.response.data.error === "string") {
                    errorMessage = error.response.data.error;
                } else {
                    errorMessage = JSON.stringify(error.response.data);
                }
            } else if (error.message) {
                errorMessage = error.message;
            }

            console.error("Erro no cadastro:", errorMessage);
            setSuccessMessage("");
            setErrorMessage("Falha no cadastro: " + errorMessage);
        }
    };

    return (
        <div>
            {/* Exibe erro ou sucesso condicionalmente */}
            {errorMessage && <ErrorAlert message={errorMessage} />}
            {successMessage && <ErrorAlert message={successMessage} />} 

            <form className={styles.form} onSubmit={handleSubmit}>
                <H2>Cadastre-se e concorra à uma cesta de chocolate da Cacau Show*!🍫</H2>

                <StandardInput
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <StandardInput
                    type="text"
                    placeholder="Nome completo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                />
                <StandardInput
                    type="text"
                    placeholder="Número de celular para contato"
                    value={phone}
                    onChange={(e) => {
                        const value = e.target.value
                            .replace(/\D/g, "")
                            .replace(/^(\d{2})(\d)/, "($1) $2")
                            .replace(/(\d{5})(\d)/, "$1-$2");
                        setPhone(value);
                    }}
                    maxLength="15"
                    required
                />
                <StandardInput
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <StandardInput
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <div className={styles.regulamentoContainer}>
                    <input
                        type="checkbox"
                        id="regulamento"
                        checked={isRegulamentoAceito}
                        onChange={(e) => setIsRegulamentoAceito(e.target.checked)}
                        required
                    />
                    <label htmlFor="regulamento" className={styles.regulamentoLabel}>
                        Eu li e concordo com o regulamento do concurso.
                    </label>
                    <a
                        href="/regulamento.pdf"
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#014195", textDecoration: "underline" }}
                    >
                        Clique para Regulamento
                    </a>
                </div>

                <StandardButton
                    label="Registre-se"
                    type="submit"
                    disabled={!isRegulamentoAceito}
                />
                <SecondaryButton
                    label="Já tem uma conta? Faça login!"
                    onClick={() => {
                        window.location.href = "/login";
                    }}
                    disabled={false}
                />
            </form>
        </div>
    );
}

export default Register;
