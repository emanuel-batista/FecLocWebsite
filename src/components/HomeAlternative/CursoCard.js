// src/components/HomeAlternative/CursoCard.js

import React from 'react';
import { Link } from 'react-router-dom';
import { Paper, Typography, Button, Box } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function CursoCard({ curso }) {
  return (
    <Paper 
      elevation={3}
      sx={{
        p: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2,
        borderRadius: '8px'
      }}
    >
      <Typography variant="h6" component="p" sx={{ fontWeight: 500 }}>
        {curso.nome}
      </Typography>
      <Button
        variant="contained"
        component={Link}
        to={`/curso/${curso.id}`}
        endIcon={<ArrowForwardIcon />}
        sx={{ backgroundColor: '#014195', '&:hover': { backgroundColor: '#013275' } }}
      >
        Clique aqui
      </Button>
    </Paper>
  );
}

export default CursoCard;