// src/components/HomeAlternative/SearchBar.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import styles from './homealternative.module.css';

// --- Imports do Material-UI ---
import { Menu, MenuItem, ListItemIcon, ListItemText, Alert, Snackbar } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import locIcon from '../../assets/icons/loc.png';

import { auth } from '../../firebase/config';
import { signOut } from 'firebase/auth';

function SearchBar() {
    // States para o menu de logout
    const [anchorEl, setAnchorEl] = useState(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    
    // States para a busca com sugestões
    const [searchTerm, setSearchTerm] = useState('');
    const [allCursos, setAllCursos] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    
    // State para alertas e notificações
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
    
    const navigate = useNavigate();
    const isMenuOpen = Boolean(anchorEl);

    // Efeito para buscar todos os cursos do Firestore uma única vez quando o componente monta
    useEffect(() => {
        const fetchCursos = async () => {
            try {
                const db = getFirestore();
                const querySnapshot = await getDocs(collection(db, "cursos"));
                const cursosList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setAllCursos(cursosList);
            } catch (error) {
                console.error("Erro ao buscar cursos para a busca:", error);
            }
        };
        fetchCursos();
    }, []);

    // Handler para quando o usuário digita no campo de busca
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.length > 0) {
            const filteredSuggestions = allCursos.filter(curso =>
                curso.nome && curso.nome.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]); // Limpa as sugestões se a busca estiver vazia
        }
    };

    // Handler para quando o usuário seleciona uma sugestão
    const handleSuggestionClick = (cursoId) => {
        setSearchTerm('');
        setSuggestions([]);
        navigate(`/curso/${cursoId}`);
    };
    
    // Funções de controle do menu de logout e alertas
    const showAlert = (message, severity = 'info') => setAlert({ open: true, message, severity });
    const handleCloseAlert = () => setAlert({ ...alert, open: false });
    const handleAccountClick = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    // Função de logout
    const handleLogout = async () => {
        if (isLoggingOut) return;
        setIsLoggingOut(true);
        handleMenuClose();
        showAlert("Saindo...", "info");
        try {
            await signOut(auth);
            showAlert("Logout realizado com sucesso!", "success");
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            showAlert('Erro ao fazer logout. Tente novamente.', 'error');
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <>
            <div className={styles.searchContainer}>
                <div className={styles.SearchBar}>
                    <img src={locIcon} alt="Ícone de pesquisa" className={styles.icon} />
                    <input
                        type="text"
                        placeholder="Pesquise por um curso"
                        className={styles.input}
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onBlur={() => setTimeout(() => setSuggestions([]), 200)}
                    />
                    <AccountCircleIcon
                        className={styles.accountIcon}
                        sx={{ fontSize: 24, cursor: 'pointer' }} // Aumentado para melhor toque
                        onClick={handleAccountClick}
                    />
                </div>
                
                {/* LISTA DE SUGESTÕES */}
                {searchTerm.length > 0 && (
                    <ul className={styles.suggestionsList}>
                        {suggestions.length > 0 ? (
                            suggestions.map(curso => (
                                <li
                                    key={curso.id}
                                    className={styles.suggestionItem}
                                    onMouseDown={() => handleSuggestionClick(curso.id)}
                                >
                                    {curso.nome}
                                </li>
                            ))
                        ) : (
                            <li className={styles.noSuggestionItem}>Curso não encontrado</li>
                        )}
                    </ul>
                )}
            </div>

            {/* MENU DE LOGOUT */}
            <Menu
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={handleMenuClose}
                PaperProps={{
                    sx: { minWidth: 150, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
                }}
            >
                <MenuItem
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                >
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText primary={isLoggingOut ? "Saindo..." : "Sair"} />
                </MenuItem>
            </Menu>

            {/* SNACKBAR PARA ALERTAS */}
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
        </>
    );
}

export default SearchBar;