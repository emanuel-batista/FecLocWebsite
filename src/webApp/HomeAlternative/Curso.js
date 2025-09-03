// src/webApp/HomeAlternative/Curso.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Container, Typography, Box, CircularProgress, Button, Paper } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import styles from './Curso.module.css';

function Curso() {
  const { cursoId } = useParams();
  const [curso, setCurso] = useState(null);
  const [unidade, setUnidade] = useState(null);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Buscar dados do curso
        const cursoRef = doc(db, 'cursos', cursoId);
        const cursoSnap = await getDoc(cursoRef);

        if (cursoSnap.exists()) {
          const cursoData = cursoSnap.data();
          setCurso(cursoData);

          // 2. Usar o unidadeId do curso para buscar os dados da unidade
          if (cursoData.unidadeId) {
            const unidadeRef = doc(db, 'unidades', cursoData.unidadeId);
            const unidadeSnap = await getDoc(unidadeRef);
            if (unidadeSnap.exists()) {
              setUnidade(unidadeSnap.data());
            }
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [cursoId, db]);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  }

  if (!curso || !unidade) {
    return <Typography sx={{ textAlign: 'center', mt: 5, fontFamily: 'Roboto' }}>Curso ou unidade não encontrados.</Typography>;
  }

  return (
    <div className={styles.cursoContainer}>
      <Container maxWidth="md" className={styles.content}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontFamily: 'Roboto', fontWeight: 'bold' }}>
          {curso.nome}
        </Typography>
        
        {/* --- EXIBE A DESCRIÇÃO DO CURSO SE ELA EXISTIR --- */}
        {curso.descricao && (
          <Typography variant="h6" component="p" sx={{ fontFamily: 'Roboto', fontWeight: 300, mt: -2, mb: 4, fontStyle: 'italic' }}>
            {curso.descricao}
          </Typography>
        )}
        
        <Paper sx={{ p: 3, my: 4, borderRadius: '16px' }}>
          <Typography variant="h5" sx={{ fontFamily: 'Roboto', fontWeight: 500 }}>
            Localização
          </Typography>
          <Typography variant="body1" sx={{ fontFamily: 'Roboto', color: '#555', mt: 1, mb: 3 }}>
            Este curso está localizado na unidade: <strong>{unidade.nome}</strong>.
          </Typography>

          <Button
            variant="contained"
            size="large"
            startIcon={<MapIcon />}
            href={unidade.localizacaoUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              fontFamily: 'Roboto',
              fontWeight: 'bold',
              backgroundColor: '#014195',
              color: 'white',
              px: 4,
              py: 1.5,
              borderRadius: '28px',
              textTransform: 'none',
              fontSize: '1rem',
              '&:hover': {
                backgroundColor: '#013275',
                boxShadow: '0 4px 20px rgba(0,0,0,0.25)'
              }
            }}
          >
            Encontrar no Google Maps
          </Button>
        </Paper>
      </Container>
    </div>
  );
}

export default Curso;