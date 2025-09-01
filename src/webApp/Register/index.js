import { useState } from "react";
import axios from "axios"; // Importe o axios para fazer requisições HTTP

import StandardButton from "components/common/StandardButton";
import StandardInput from "components/common/StandardInput";
import H2 from "components/common/text/H2";
import styles from "./Register.module.css";
import SecondaryButton from "components/common/SecondaryButton";
import ErrorAlert from "components/common/alerts/ErrorAlert";

function Register() {
    //se o regulamento não for aceito, desabilita o botão de submit
    const [isRegulamentoAceito, setIsRegulamentoAceito] = useState(false);

    // Crie um estado para cada campo do formulário
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Função para lidar com o envio do formulário
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isRegulamentoAceito) {
            <ErrorAlert message="Você deve aceitar o regulamento para se cadastrar." />;
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
            // A URL da API agora deve vir de uma variável de ambiente
            const apiUrl = process.env.REACT_APP_API_URL || 'https://uniloc.vercel.app'; // Use a sua URL da Vercel
            const response = await axios.post(`${apiUrl}/api/signup`, userData);
            <ErrorAlert message={response.data.message} />;
        } catch (error) {
            // --- CORREÇÃO PRINCIPAL AQUI ---

            // 1. Mostra o objeto de erro completo no console para diagnóstico
            console.error("DEBUG: Objeto de erro completo:", error);

            // 2. Tenta extrair uma mensagem de erro mais clara para o utilizador
            let errorMessage = "Ocorreu um erro de rede. Verifique a sua conexão e tente novamente.";
            if (error.response && error.response.data) {
                // Se a resposta do backend tiver uma mensagem de erro específica
                if (typeof error.response.data.error === 'string') {
                    errorMessage = error.response.data.error;
                } else {
                    // Se a resposta for um objeto, converte para texto para podermos vê-lo
                    errorMessage = JSON.stringify(error.response.data);
                }
            } else if (error.message) {
                errorMessage = error.message;
            }

            console.error("Erro no cadastro:", errorMessage);
            <ErrorAlert message={"Falha no cadastro: " + errorMessage} />;
        }
    };
    return (
            
        <div>
            <ErrorAlert message={"Falha no cadastro: "} />
            {/* Adiciona o manipulador onSubmit ao formulário */}
            <form className={styles.form} onSubmit={handleSubmit}>
                <H2>Cadastre-se e concorra à uma cesta de chocolate da Cacau Show*!🍫</H2>
                <StandardInput
                    type="text"
                    placeholder="Username"
                    value={username} // Conecta o valor ao estado
                    onChange={(e) => setUsername(e.target.value)} // Atualiza o estado
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
                        setPhone(value); // Atualiza o estado com o valor mascarado
                    }}
                    maxLength="15" // Limita o tamanho do campo
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

                {/* Checkbox e link para o regulamento */}
                <div className={styles.regulamentoContainer}>
                    <input
                        type="checkbox"
                        id="regulamento"
                        // --- LÓGICA ADICIONADA ---
                        // Controla o estado de "marcado" e atualiza o estado quando clicado
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

                {/* --- LÓGICA ADICIONADA --- */}
                {/* O botão é desabilitado se isRegulamentoAceito for falso */}
                <StandardButton
                    label="Registre-se"
                    type="submit"
                    disabled={!isRegulamentoAceito}
                />
                <SecondaryButton
                    label="Já tem uma conta? Faça login!"
                    onClick={() => {
                        // Lógica para redirecionar para a página de login
                        window.location.href = "/login";
                    }}
                    disabled={false}
                />
            </form>
        </div>

    );
}

export default Register;