import React, { useState } from "react";
import PlaceCard from "components/HomeAlternative/PlaceCard";
import styles from "./hAlternative.module.css";
import cardniteImg from "./cardnite.jpg";
import SearchBar from "components/HomeAlternative/SearchBar";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
// Importe a instância do auth do arquivo de configuração
import { auth } from "../../firebase/config";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function HomeAlternative() {
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
    const navigate = useNavigate();

    const showAlert = (message, severity = 'info') => {
        setAlert({ open: true, message, severity });
    };

    const handleCloseAlert = () => {
        setAlert({ ...alert, open: false });
    };

    // HomeAlternative.js - Adicione esta função
    const handleLogout = async () => {
        try {
            await signOut(auth);
            showAlert("Logout realizado com sucesso!", "success");

            // Limpa qualquer estado persistente do localStorage
            localStorage.removeItem('hasLoggedIn');

            // Redireciona após um breve delay para mostrar o alerta
            setTimeout(() => {
                navigate("/", { replace: true });
                // Força um reload completo para limpar o estado da aplicação
                window.location.reload();
            }, 1500);
        } catch (error) {
            console.error("Erro no logout:", error);
            showAlert("Erro ao fazer logout. Tente novamente.", "error");
        }
    };

    return (
        <div id={styles.hAlternativeContainer}>
            <SearchBar />
            <h2 className={styles.h2}>Unidades</h2>
            <div className={styles.hAlternative}>
                <PlaceCard backgroundImage={cardniteImg} standName={'Nite'} />
                <PlaceCard backgroundImage={cardniteImg} standName={'Nite'} />
                <PlaceCard backgroundImage={cardniteImg} standName={'Nite'} />
                <PlaceCard backgroundImage={cardniteImg} standName={'Nite'} />
                <PlaceCard backgroundImage={cardniteImg} standName={'Nite'} />
            </div>

            {/* logout button */}
            <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
            </button>

            <Snackbar
                open={alert.open}
                autoHideDuration={4000}
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseAlert}
                    severity={alert.severity}
                    sx={{ width: '100%' }}
                >
                    {alert.message}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default HomeAlternative;