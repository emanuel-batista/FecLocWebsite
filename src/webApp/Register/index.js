import { useState } from "react";
import axios from "axios"; // Importe o axios para fazer requisições HTTP

import StandardButton from "components/common/StandardButton";
import StandardInput from "components/common/StandardInput";
import H2 from "components/common/text/H2";
import styles from "./Register.module.css";
import MobileOnly from "webApp/MobileOnly";


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
        e.preventDefault(); // Previne o recarregamento da página

        // --- VERIFICAÇÃO ADICIONADA ---
        // Se o regulamento não foi aceite, exibe um alerta e interrompe a função.
        if (!isRegulamentoAceito) {
            alert("Você precisa ler e aceitar o regulamento para continuar.");
            return; // Impede o envio dos dados
        }

        // Monta o objeto com os dados do usuário
        const userData = {
            username,
            fullName,
            phone,
            email,
            password,
        };

        try {
            // Envia os dados para a rota /api/signup do seu backend
            const response = await axios.post('http://localhost:5000/api/signup', userData);
            alert(response.data.message); // Exibe a mensagem de sucesso
            // Aqui você pode redirecionar o usuário para a página de login
        } catch (error) {
            // Exibe a mensagem de erro retornada pelo backend
            console.error("Erro no cadastro:", error.response?.data);
            alert("Falha no cadastro: " + (error.response?.data?.error || error.message));
        }
    };
    return (
        
            <div>
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
                </form>
            </div>
        
    );
}

export default Register;