// src/components/HomeAlternative/SearchBar.js

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import styles from './homealternative.module.css';

import { Menu, MenuItem, ListItemIcon, ListItemText, Alert, Snackbar } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import locIcon from '../../assets/icons/loc.png';

import { auth } from '../../firebase/config';
import { signOut } from 'firebase/auth';

function SearchBar() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [allCursos, setAllCursos] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
    const navigate = useNavigate();
    const isMenuOpen = Boolean(anchorEl);
    const searchContainerRef = useRef(null);

    useEffect(() => {
        const fetchCursos = async () => {
            try {
                const db = getFirestore();
                const querySnapshot = await getDocs(collection(db, "cursos"));
                const cursosList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setAllCursos(cursosList);
            } catch (error) {
                console.error("ERRO ao buscar cursos:", error);
            }
        };
        fetchCursos();
    }, []);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value.length > 0) {
            const filtered = allCursos.filter(curso =>
                curso.nome && curso.nome.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (cursoId) => {
        setSearchTerm('');
        setSuggestions([]);
        navigate(`/curso/${cursoId}`);
    };
    
    const showAlert = (message, severity = 'info') => setAlert({ open: true, message, severity });
    const handleCloseAlert = () => setAlert({ ...alert, open: false });
    const handleAccountClick = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
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
            <div className={styles.searchContainer} ref={searchContainerRef}>
                <div className={styles.SearchBar}>
                    <img src={locIcon} alt="Ícone de pesquisa" className={styles.icon} />
                    <input
                        type="text"
                        placeholder="Pesquise por um curso"
                        className={styles.input}
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <AccountCircleIcon
                        className={styles.accountIcon}
                        sx={{ fontSize: 24, cursor: 'pointer' }}
                        onClick={handleAccountClick}
                    />
                </div>
                
                {/* --- LÓGICA DE RENDERIZAÇÃO CORRIGIDA E SIMPLIFICADA --- */}
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

            <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
                <MenuItem onClick={handleLogout} disabled={isLoggingOut}>
                    <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
                    <ListItemText primary={isLoggingOut ? "Saindo..." : "Sair"} />
                </MenuItem>
            </Menu>

            <Snackbar open={alert.open} autoHideDuration={4000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </>
    );
}

export default SearchBar;