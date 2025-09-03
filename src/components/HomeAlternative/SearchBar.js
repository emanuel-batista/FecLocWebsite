// src/components/HomeAlternative/SearchBar.js

import React, { useState } from 'react';
import styles from './homealternative.module.css';
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import locIcon from '../../assets/icons/loc.png';
import { auth } from '../../firebase/config';
import { signOut } from 'firebase/auth';

// O componente agora recebe props da página pai
function SearchBar({ searchTerm, onSearchChange, onSearchSubmit }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleKeyDown = (e) => {
        // Se a tecla pressionada for 'Enter', chama a função de busca
        if (e.key === 'Enter') {
            onSearchSubmit();
        }
    };

    const handleAccountClick = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const handleLogout = async () => {
        handleMenuClose();
        try {
            await signOut(auth);
            // O redirecionamento é feito pelo AuthContext
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    return (
        <div className={styles.searchContainer}>
            <div className={styles.SearchBar}>
                <img src={locIcon} alt="Ícone de pesquisa" className={styles.icon} />
                <input
                    type="text"
                    placeholder="Pesquise por um curso e pressione Enter"
                    className={styles.input}
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <AccountCircleIcon
                    className={styles.accountIcon}
                    sx={{ fontSize: 24, cursor: 'pointer' }}
                    onClick={handleAccountClick}
                />
            </div>

            <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
                    <ListItemText>Sair</ListItemText>
                </MenuItem>
            </Menu>
        </div>
    );
}

export default SearchBar;