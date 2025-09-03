// src/components/HomeAlternative/SearchBar.js

import React, { useState, useEffect, useRef } from 'react';
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
    
    // States para a busca
    const [searchTerm, setSearchTerm] = useState('');
    const [allCursos, setAllCursos] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
    
    // State para alertas
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
    
    const navigate = useNavigate();
    const isMenuOpen = Boolean(anchorEl);
    const searchContainerRef = useRef(null); // Ref para o contêiner da busca

    // Efeito que busca todos os cursos do Firestore uma única vez (pré-carregamento)
    useEffect(() => {
        const fetchCursos = async () => {
            console.log("Iniciando busca de cursos no Firestore...");
            try {
                const db = getFirestore();
                const querySnapshot = await getDocs(collection(db, "cursos"));
                const cursosList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setAllCursos(cursosList);
                console.log("Cursos pré-carregados com sucesso:", cursosList);
            } catch (error) {
                console.error("ERRO ao buscar cursos:", error);
            }
        };
        fetchCursos();
    }, []);

    // Efeito para fechar as sugestões se o usuário clicar fora
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setIsSuggestionsVisible(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handler para quando o usuário digita na busca
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.length > 0) {
            const filtered = allCursos.filter(curso =>
                curso.nome && curso.nome.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered);
            setIsSuggestionsVisible(true); // Mostra a lista
        } else {
            setSuggestions([]);
            setIsSuggestionsVisible(false); // Esconde a lista
        }
    };

    // Handler para quando o usuário seleciona uma sugestão
    const handleSuggestionClick = (cursoId) => {
        setSearchTerm('');
        setIsSuggestionsVisible(false);
        navigate(`/curso/${cursoId}`);
    };
    
    // Funções de logout e alertas (sem alteração)
    const showAlert = (message, severity = 'info') => setAlert({ open: true, message, severity });
    const handleCloseAlert = () => setAlert({ ...alert, open: false });
    const handleAccountClick = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const handleLogout = async () => {
        // ... (código do logout)
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
                        onFocus={() => { if (searchTerm) setIsSuggestionsVisible(true); }} // Mostra ao focar de novo
                    />
                    <AccountCircleIcon
                        className={styles.accountIcon}
                        sx={{ fontSize: 24, cursor: 'pointer' }}
                        onClick={handleAccountClick}
                    />
                </div>
                
                {/* LISTA DE SUGESTÕES */}
                {isSuggestionsVisible && (
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

            {/* Menu de Logout e Snackbar (sem alteração) */}
            <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose} /* ... */>
                <MenuItem onClick={handleLogout} /* ... */ >
                    {/* ... */}
                </MenuItem>
            </Menu>
            <Snackbar open={alert.open} autoHideDuration={4000} onClose={handleCloseAlert} /* ... */ >
                <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </>
    );
}

export default SearchBar;