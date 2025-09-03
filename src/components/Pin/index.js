// src/Components/Pin/index.js

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Imports do Material-UI para o SpeedDial
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';

// Ícones para as ações
import HomeIcon from '@mui/icons-material/Home';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

function Pin() {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Define as ações do menu
  const actions = [
    { icon: <HomeIcon />, name: 'Home', path: '/home' },
    { icon: <EmojiEventsIcon />, name: 'Meus Emblemas', path: '/meus-emblemas' },
    { 
      icon: <LeaderboardIcon sx={{ color: '#E4A11B' }} />, // Cor dourada para o ícone
      name: 'Ranking Geral', 
      path: '/ranking' 
    },
  ];

  // Adiciona a ação de admin apenas se o utilizador for um admin
  if (userRole === 'admin') {
    actions.push({ 
      icon: <AdminPanelSettingsIcon />, 
      name: 'Painel de Admin', 
      path: '/admin' 
    });
  }

  // Lista de páginas onde o botão NÃO deve aparecer
  const hiddenRoutes = ['/', '/login', '/register', '/sobre', '/contato'];
  if (hiddenRoutes.includes(location.pathname)) {
    return null; // Não renderiza nada nestas páginas
  }

  return (
    <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1, position: 'fixed', bottom: 16, right: 16, zIndex: 1200 }}>
      <SpeedDial
        ariaLabel="Menu de Navegação Rápida"
        icon={<SpeedDialIcon />}
        direction="up" // As opções abrem para cima
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => navigate(action.path)}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}

export default Pin;