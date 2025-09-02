// HomeAlternative.js - Versão Corrigida
import React, { useState } from "react";
import PlaceCard from "components/HomeAlternative/PlaceCard";
import styles from "./hAlternative.module.css";
import cardniteImg from "./cardnite.jpg";
import SearchBar from "components/HomeAlternative/SearchBar";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { auth } from "../../firebase/config";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

function HomeAlternative() {
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
    const navigate = useNavigate();

    const showAlert = (message, severity = 'info') => {
        setAlert({ open: true, message, severity });
    };

    const handleCloseAlert = () => {
        setAlert({ ...alert, open: false });
    };

    // HomeAlternative.js - Adicione no início do componente


    // Dentro do componente:
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                // Se não está autenticado, redireciona para login
                navigate("/login", { replace: true });
            }
        });

        return unsubscribe;
    }, [navigate]);

    const handleLogout = async () => {
        try {
            // Primeiro, mostra mensagem de que está processando
            showAlert("Saindo...", "info");

            // Aguarda o signOut completar
            await signOut(auth);

            // Aguarda um tempo adicional para garantir que o Firebase processe o logout
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Limpa qualquer estado local
            localStorage.removeItem('lastLogoutTime');
            localStorage.removeItem('hasLoggedIn');

            showAlert("Logout realizado com sucesso!", "success");

            // Redireciona após um breve delay
            setTimeout(() => {
                navigate("/", { replace: true });
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