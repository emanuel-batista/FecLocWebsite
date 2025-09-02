import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { auth, db } from "../../firebase/config";
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
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isRegulamentoAceito) {
            setErrorMessage("Você deve aceitar o regulamento para se cadastrar.");
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
                role: "user",
                createdAt: new Date(),
                createdAtTimestamp: new Date().toISOString(),
            };

            await setDoc(doc(db, "users", userCredential.user.uid), userData);

            setSuccessMessage("Registro realizado com sucesso!");

            // Redireciona para login imediatamente
            navigate("/login");

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

                {/* Botão ajustado para mudar de cor */}
                <button
                    type="submit"
                    disabled={!isRegulamentoAceito || isSubmitting}
                    style={{
                        backgroundColor: !isRegulamentoAceito || isSubmitting ? "#888" : "#014195",
                        color: "white",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "6px",
                        cursor: !isRegulamentoAceito || isSubmitting ? "not-allowed" : "pointer",
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
