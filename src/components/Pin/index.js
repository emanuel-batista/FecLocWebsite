// src/Components/Pin/index.js

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Imports do Material-UI
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';

// Ícones para as ações
import RoomIcon from '@mui/icons-material/Room'; // <-- ÍCONE DE PIN DE LOCALIZAÇÃO
import HomeIcon from '@mui/icons-material/Home';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

function Pin() {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const actions = [
    { icon: <HomeIcon />, name: 'Home', path: '/home' },
    { icon: <EmojiEventsIcon />, name: 'Meus Emblemas', path: '/meus-emblemas' },
    { 
      icon: <LeaderboardIcon sx={{ color: '#E4A11B' }} />,
      name: 'Ranking Geral', 
      path: '/ranking' 
    },
  ];

  if (userRole === 'admin') {
    actions.push({ 
      icon: <AdminPanelSettingsIcon />, 
      name: 'Painel de Admin', 
      path: '/admin' 
    });
  }

  const hiddenRoutes = ['/', '/login', '/register', '/sobre', '/contato'];
  if (hiddenRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1200 }}>
      <SpeedDial
        ariaLabel="Menu de Navegação Rápida"
        // --- MUDANÇA DO ÍCONE E REMOÇÃO DA SOMBRA ---
        icon={<RoomIcon />} 
        direction="up"
        sx={{
          '& .MuiFab-primary': { 
            backgroundColor: '#014195', // Mantém a cor principal
            boxShadow: 'none', // Remove a sombra principal
            '&:hover': {
              backgroundColor: '#013275',
              boxShadow: 'none' // Remove a sombra no hover
            }
          }
        }}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => navigate(action.path)}
            // --- REMOÇÃO DA SOMBRA DOS BOTÕES DE AÇÃO ---
            sx={{
              '&.MuiSpeedDialAction-fab': {
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none'
                }
              }
            }}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}

export default Pin;