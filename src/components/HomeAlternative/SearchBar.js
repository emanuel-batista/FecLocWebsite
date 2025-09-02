// SearchBar.js - Versão Simplificada
import React, { useState } from 'react';
import styles from './homealternative.module.css';
import locIcon from '../../assets/icons/loc.png';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LogoutIcon from '@mui/icons-material/Logout';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { auth } from '../../firebase/config';
import { signOut } from 'firebase/auth';

function SearchBar() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const open = Boolean(anchorEl);

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
            // O AuthContext vai redirecionar automaticamente!
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
            <div className={styles.SearchBar}>
                <img src={locIcon} alt="Ícone de pesquisa" className={styles.icon} />
                <input type="text" placeholder="Pesquise por um curso para encontrar o stand!" className={styles.input} />

                <AccountCircleIcon
                    className={styles.accountIcon}
                    sx={{ fontSize: 16 }}
                    onClick={handleAccountClick}
                    style={{ cursor: 'pointer', opacity: isLoggingOut ? 0.5 : 1 }}
                    disabled={isLoggingOut}
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
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            },
                            '&.Mui-disabled': {
                                opacity: 0.5,
                            }
                        }}
                    >
                        <ListItemIcon>
                            <LogoutIcon fontSize="small" color="error" />
                        </ListItemIcon>
                        <ListItemText
                            primary={isLoggingOut ? "Saindo..." : "Sair"}
                            primaryTypographyProps={{
                                fontSize: 14,
                                fontWeight: 500,
                            }}
                        />
                    </MenuItem>
                </Menu>
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