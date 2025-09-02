// src/components/HomeAlternative/SearchBar.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import styles from './homealternative.module.css';

// --- Imports do Material-UI ---
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Snackbar,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import locIcon from '../../assets/icons/loc.png';

import { auth } from '../../firebase/config';
import { signOut } from 'firebase/auth';

function SearchBar() {
    // --- States para o logout ---
    const [anchorEl, setAnchorEl] = useState(null);
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    
    // --- States para a busca ---
    const [searchTerm, setSearchTerm] = useState('');
    const [allCursos, setAllCursos] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    
    const navigate = useNavigate();
    const open = Boolean(anchorEl);

    // Efeito para buscar todos os cursos do Firestore uma única vez
    useEffect(() => {
        const fetchCursos = async () => {
            try {
                const db = getFirestore();
                const querySnapshot = await getDocs(collection(db, "cursos"));
                const cursosList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAllCursos(cursosList);
            } catch (error) {
                console.error("Erro ao buscar cursos para a busca:", error);
            }
        };
        fetchCursos();
    }, []);

    // Handler para quando o usuário digita na busca
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.length > 0) {
            const filteredSuggestions = allCursos.filter(curso =>
                curso.nome.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]); // Limpa as sugestões se a busca estiver vazia
        }
    };

    // Handler para quando o usuário clica em uma sugestão
    const handleSuggestionClick = (cursoId) => {
        setSearchTerm(''); // Limpa a busca
        setSuggestions([]); // Esconde a lista
        navigate(`/curso/${cursoId}`); // Navega para a página do curso
    };
    
    // --- Funções de logout ---
    const showAlert = (message, severity = 'info') => {
        setAlert({ open: true, message, severity });
    };

    const handleCloseAlert = () => {
        setAlert({ ...alert, open: false });
    };

    const handleAccountClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        if (isLoggingOut) return;
        
        setIsLoggingOut(true);
        handleClose();
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
                        placeholder="Pesquise por um curso para encontrar o stand!"
                        className={styles.input}
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onBlur={() => setTimeout(() => setSuggestions([]), 150)}
                    />
                    <AccountCircleIcon
                        className={styles.accountIcon}
                        sx={{ fontSize: 16 }}
                        onClick={handleAccountClick}
                        style={{ cursor: 'pointer', opacity: isLoggingOut ? 0.5 : 1 }}
                    />
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        PaperProps={{
                            sx: {
                                minWidth: 120,
                                borderRadius: 2,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            },
                        }}
                    >
                        <MenuItem
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            sx={{
                                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                                '&.Mui-disabled': { opacity: 0.5 }
                            }}
                        >
                            <ListItemIcon>
                                <LogoutIcon fontSize="small" color="error" />
                            </ListItemIcon>
                            <ListItemText
                                primary={isLoggingOut ? "Saindo..." : "Sair"}
                                primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
                            />
                        </MenuItem>
                    </Menu>
                </div>
                
                {/* --- LISTA DE SUGESTÕES --- */}
                {suggestions.length > 0 && searchTerm.length > 0 && (
                    <ul className={styles.suggestionsList}>
                        {suggestions.map(curso => (
                            <li
                                key={curso.id}
                                className={styles.suggestionItem}
                                onMouseDown={() => handleSuggestionClick(curso.id)} // Usar onMouseDown para evitar conflito com onBlur
                            >
                                {curso.nome}
                            </li>
                        ))}
                    </ul>
                )}
                {suggestions.length === 0 && searchTerm.length > 0 && (
                     <ul className={styles.suggestionsList}>
                        <li className={styles.noSuggestionItem}>Curso não encontrado</li>
                     </ul>
                )}
            </div>

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