import StandardButton from "components/common/StandardButton";
import StandardInput from "components/common/StandardInput";
import H2 from "components/common/text/H2";
import styles from "./Register.module.css";

function Register() {
    return (
        <div>
            <form className={styles.form}>
                <H2>Cadastre-se e concorra à uma cesta de chocolate da Cacau Show!🍫</H2>
                <StandardInput
                    type="text"
                    placeholder="Username"
                    required
                />
                <StandardInput
                    type="text"
                    placeholder="Nome completo"
                    required
                />
                <StandardInput
                    type="text"
                    placeholder="Número de celular para contato"
                    required
                />
                <StandardInput
                    type="email"
                    placeholder="Email"
                    required
                />
                <StandardInput
                    type="password"
                    placeholder="Password"
                    required
                />
                <StandardButton label="Register" type="submit" />
            </form>
        </div>
    );
}

export default Register;
