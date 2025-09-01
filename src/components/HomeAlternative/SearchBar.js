import React, { useState } from 'react';
import styles from './homealternative.module.css';
import locIcon from '../../assets/icons/loc.png';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LogoutIcon from '@mui/icons-material/Logout';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function SearchBar() {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const open = Boolean(anchorEl);

    const handleAccountClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            const auth = getAuth();
            await signOut(auth);
            navigate('/');
            handleClose();
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            alert('Erro ao fazer logout. Tente novamente.');
        }
    };

    return (
        <div className={styles.SearchBar}>
            <img src={locIcon} alt="Ícone de pesquisa" className={styles.icon} />
            <input type="text" placeholder="Pesquise por um curso para encontrar o stand!" className={styles.input} />

            <AccountCircleIcon
                className={styles.accountIcon}
                sx={{ fontSize: 16 }}
                onClick={handleAccountClick}
                style={{ cursor: 'pointer' }}
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
                    sx={{
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        },
                    }}
                >
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText
                        primary="Sair"
                        primaryTypographyProps={{
                            fontSize: 14,
                            fontWeight: 500,
                        }}
                    />
                </MenuItem>
            </Menu>
        </div>
    );
}

export default SearchBar;