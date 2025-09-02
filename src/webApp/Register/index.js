import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// Importe as instâncias do auth e db do arquivo de configuração
import { auth, db } from "../../firebase/config";
import StandardButton from "components/common/StandardButton";
import StandardInput from "components/common/StandardInput";
import H2 from "components/common/text/H2";
import styles from "./Register.module.css";
import SecondaryButton from "components/common/SecondaryButton";
import ErrorAlert from "components/common/alerts/ErrorAlert";

function Register() {
    const [isRegulamentoAceito, setIsRegulamentoAceito] = useState(false);
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    // Estado para controle de envio
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isRegulamentoAceito) {
            setErrorMessage("Você deve aceitar o regulamento para se cadastrar.");
            return;
        }

        setIsSubmitting(true); // 🔹 Desativa botão imediatamente

        try {
            // Cria usuário com Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Salva os dados adicionais no Firestore
            const userData = { 
                username, 
                fullName, 
                phone, 
                email, 
                role: "user",
                createdAt: new Date(),
                createdAtTimestamp: new Date().toISOString()
            };

            await setDoc(doc(db, "users", userCredential.user.uid), userData);

            setErrorMessage("");
            setSuccessMessage("Registro realizado com sucesso!");

            // Redireciona após 2 segundos
            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (error) {
            console.error("Erro no cadastro:", error);

            let errorMessage = "Erro ao criar conta. Tente novamente.";
            if (error.code === "auth/email-already-in-use") {
                errorMessage = "Este email já está em uso.";
            } else if (error.code === "auth/weak-password") {
                errorMessage = "A senha deve ter pelo menos 6 caracteres.";
            } else if (error.code === "auth/invalid-email") {
                errorMessage = "Email inválido.";
            }

            setSuccessMessage("");
            setErrorMessage(errorMessage);

            setIsSubmitting(false); // 🔹 Reativa botão em caso de erro
        }
    };

    return (
        <div>
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

                <StandardButton
                    label={isSubmitting ? "Registrando..." : "Registre-se"}
                    type="submit"
                    disabled={!isRegulamentoAceito || isSubmitting}
                />
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
