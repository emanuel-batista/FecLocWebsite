// src/components/HomeAlternative/PremioBanner.js

import React from 'react';
import { Link } from 'react-router-dom';
import { Paper, Typography, Button, Box } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'; // Ícone de troféu

function PremioBanner() {
  return (
    <Paper 
      elevation={3}
      sx={{
        p: 2,
        mt: 3, // Margem no topo
        mb: 3, // Margem em baixo
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        background: 'linear-gradient(135deg, #FFF8E1, #FFECB3)' // Fundo com gradiente suave de amarelo
      }}
    >
      <EmojiEventsIcon sx={{ fontSize: 50, color: '#FFA000' }} />
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#AF6C00' }}>
          Concorra a um Prémio Delicioso! 🍫
        </Typography>
        <Typography variant="body2" sx={{ color: '#614D2A' }}>
          O usuário com mais pontos no ranking geral ganhará uma cesta de chocolate da Cacau Show!
        </Typography>
      </Box>
      <Button
        variant="contained"
        component={Link}
        to="/ranking"
        sx={{ 
          backgroundColor: '#014195', 
          '&:hover': { backgroundColor: '#013275' },
          flexShrink: 0 // Impede que o botão encolha
        }}
      >
        Ver Ranking
      </Button>
    </Paper>
  );
}

export default PremioBanner;