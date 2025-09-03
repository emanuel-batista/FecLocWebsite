import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 2, // Padding vertical (em cima e em baixo)
        px: 2, // Padding horizontal
        mt: 'auto', // Empurra o footer para o fundo da página
        backgroundColor: '#f5f5f5', // Cor de fundo suave
        borderTop: '1px solid #e0e0e0' // Linha subtil no topo
      }}
    >
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Versão Beta 1.0
        </Typography>
        <Link
          href="https://www.github.com/emanuel-batista/FecLocWebsite"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            color: 'text.secondary',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
              color: '#014195'
            }
          }}
        >
          <GitHubIcon sx={{ fontSize: 16 }} />
          Visite o GitHub
        </Link>
      </Container>
    </Box>
  );
}

export default Footer;
