// src/webApp/Register/index.js

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { auth, db } from "../../firebase/config";
import StandardInput from "components/common/StandardInput";
import styles from "./Register.module.css";
import ErrorAlert from "components/common/alerts/ErrorAlert";

// --- FUNÇÕES DO CPF (COLE AQUI) ---
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
function mascaraCPF(value) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .substring(0, 14);
}
// ------------------------------------

function Register() {
    const [isRegulamentoAceito, setIsRegulamentoAceito] = useState(false);
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    // --- NOVOS STATES PARA O CPF ---
    const [cpf, setCpf] = useState("");
    const [cpfError, setCpfError] = useState("");
    // --------------------------------

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    // --- NOVO HANDLER PARA O CAMPO CPF ---
    const handleCpfChange = (e) => {
        const maskedValue = mascaraCPF(e.target.value);
        setCpf(maskedValue);
        
        if (maskedValue.length === 14 && !validaCPF(maskedValue)) {
            setCpfError("CPF inválido.");
        } else {
            setCpfError("");
        }
    };
    // ------------------------------------

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isRegulamentoAceito) {
            setErrorMessage("Você deve aceitar o regulamento para se cadastrar.");
            return;
        }
        // --- NOVA VALIDAÇÃO ANTES DE ENVIAR ---
        if (cpfError || !validaCPF(cpf)) {
            setErrorMessage("Por favor, insira um CPF válido.");
            return;
        }
        // ---------------------------------------

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
                cpf: cpf.replace(/[^\d]+/g, ''), // Salva apenas os números do CPF
                role: "user",
                createdAt: new Date(),
            };
            await setDoc(doc(db, "users", userCredential.user.uid), userData);
            setSuccessMessage("Registro realizado com sucesso!");
            navigate("/login");
        } catch (error) {
            // ... (seu catch de erros continua igual)
        }
    };

    return (
        <div>
            {/* ... (seus alerts continuam iguais) ... */}
            <form className={styles.form} onSubmit={handleSubmit}>
                {/* ... (seus inputs de nome, celular, email, etc. continuam iguais) ... */}
                
                {/* --- NOVO INPUT PARA O CPF --- */}
                <StandardInput
                    type="text"
                    placeholder="CPF"
                    value={cpf}
                    onChange={handleCpfChange}
                    maxLength="14"
                    required
                />
                {cpfError && <span style={{color: "red", marginTop: "-10px", marginBottom: "10px", fontSize: "12px"}}>{cpfError}</span>}
                {/* ----------------------------- */}

                {/* ... (seus inputs de email e senha continuam iguais) ... */}
                {/* ... (seu checkbox de regulamento e botões continuam iguais) ... */}
            </form>
        </div>
    );
}

export default Register;