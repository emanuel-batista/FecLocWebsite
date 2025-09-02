// src/webApp/Register/index.js

import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Adicionado Link para navegação
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { auth, db } from "../../firebase/config";
import StandardInput from "components/common/StandardInput";
import H2 from "components/common/text/H2";
import styles from "./Register.module.css";
import SecondaryButton from "components/common/SecondaryButton";
import ErrorAlert from "components/common/alerts/ErrorAlert";

// --- FUNÇÕES DO CPF ---
// Função para validar o CPF (algoritmo padrão)
function validaCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let soma = 0, resto;
  for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;
  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;
  return true;
}

// Função para aplicar a máscara XXX.XXX.XXX-XX
function mascaraCPF(value) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .substring(0, 14);
}
// -----------------------

function Register() {
    const [isRegulamentoAceito, setIsRegulamentoAceito] = useState(false);
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cpf, setCpf] = useState("");
    const [cpfError, setCpfError] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleCpfChange = (e) => {
        const maskedValue = mascaraCPF(e.target.value);
        setCpf(maskedValue);
        
        // Valida apenas quando o CPF está completo
        if (maskedValue.length === 14 && !validaCPF(maskedValue)) {
            setCpfError("CPF inválido.");
        } else {
            setCpfError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isRegulamentoAceito) {
            setErrorMessage("Você deve aceitar o regulamento para se cadastrar.");
            return;
        }
        if (cpfError || (cpf && !validaCPF(cpf))) {
            setErrorMessage("Por favor, insira um CPF válido.");
            return;
        }

        setIsSubmitting(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const userData = {
                username,
                fullName,
                phone,
                email,
                cpf: cpf.replace(/[^\d]+/g, ''), // Salva apenas os números
                role: "user",
                createdAt: new Date(),
                ptsTotais: 0,
            };
            await setDoc(doc(db, "users", userCredential.user.uid), userData);
            setSuccessMessage("Registro realizado com sucesso!");
            setTimeout(() => navigate("/login"), 2000); // Pequeno delay para ver a mensagem
        } catch (error) {
            console.error("Erro no cadastro:", error);
            let msg = "Erro ao criar conta. Tente novamente.";
            if (error.code === "auth/email-already-in-use") {
                msg = "Este email já está em uso.";
            } else if (error.code === "auth/weak-password") {
                msg = "A senha deve ter pelo menos 6 caracteres.";
            } else if (error.code === "auth/invalid-email") {
                msg = "Email inválido.";
            }
            setErrorMessage(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            {errorMessage && <ErrorAlert message={errorMessage} />}
            {successMessage && <ErrorAlert message={successMessage} type="success" />}

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
                    placeholder="CPF"
                    value={cpf}
                    onChange={handleCpfChange}
                    maxLength="14"
                    required
                />
                {cpfError && <span style={{color: "red", width: '100%', textAlign: 'left', marginTop: "-10px", marginBottom: "10px", fontSize: "12px"}}>{cpfError}</span>}

                <StandardInput
                    type="tel" // Alterado para 'tel' para melhor semântica
                    placeholder="Número de celular para contato"
                    value={phone}
                    onChange={(e) => {
                        const value = e.target.value
                            .replace(/\D/g, "")
                            .replace(/^(\d{2})(\d)/, "($1) $2")
                            .replace(/(\d{5})(\d)/, "$1-$2");
                        setPhone(value.substring(0, 15));
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
                    minLength={6}
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

                <button
                    type="submit"
                    disabled={!isRegulamentoAceito || isSubmitting || !!cpfError}
                    style={{
                        backgroundColor: !isRegulamentoAceito || isSubmitting || !!cpfError ? "#888" : "#014195",
                        color: "white",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "6px",
                        cursor: !isRegulamentoAceito || isSubmitting || !!cpfError ? "not-allowed" : "pointer",
                        fontWeight: "bold",
                        marginTop: "10px",
                        width: "100%",
                    }}
                >
                    {isSubmitting ? "Registrando..." : "Registre-se"}
                </button>

                <SecondaryButton
                    label="Já tem uma conta? Faça login!"
                    onClick={() => navigate("/login")}
                    disabled={false}
                />
            </form>
        </div>
    );
}

export default Register;