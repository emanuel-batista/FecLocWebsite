// src/webApp/HomeAlternative/Unidade.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Container, Typography, Box, CircularProgress, Button, List, ListItem, ListItemText, Paper } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import styles from './Unidade.module.css';

function Unidade() {
  const { unidadeId } = useParams();
  const [unidade, setUnidade] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar dados da unidade
        const unidadeRef = doc(db, 'unidades', unidadeId);
        const unidadeSnap = await getDoc(unidadeRef);
        if (unidadeSnap.exists()) {
          setUnidade(unidadeSnap.data());
        }

        // Buscar cursos relacionados a esta unidade
        const cursosQuery = query(collection(db, 'cursos'), where('unidadeId', '==', unidadeId));
        const cursosSnapshot = await getDocs(cursosQuery);
        setCursos(cursosSnapshot.docs.map(doc => doc.data()));
      } catch (error) {
        console.error("Erro ao buscar dados da unidade:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [unidadeId, db]);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  }

  if (!unidade) {
    return <Typography sx={{ textAlign: 'center', mt: 5 }}>Unidade não encontrada.</Typography>;
  }

  return (
    <div 
      className={styles.unidadeContainer} 
      style={{ backgroundImage: `url(${unidade.fotoUrl})` }}
    >
      <div className={styles.overlay}>
        <Container maxWidth="md" className={styles.content}>
          <Typography variant="h2" component="h1" gutterBottom>{unidade.nome}</Typography>
          
          <Paper sx={{ p: 3, my: 4, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
            <Typography variant="h5" gutterBottom>Cursos com Stand nesta Unidade:</Typography>
            <List>
              {cursos.length > 0 ? (
                cursos.map((curso, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={curso.nome} />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="Nenhum curso com stand cadastrado para esta unidade." />
                </ListItem>
              )}
            </List>
          </Paper>

          <Button
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<MapIcon />}
            href={unidade.localizacaoUrl}
            target="_blank" // Abre em nova aba
            rel="noopener noreferrer"
          >
            Ver no Google Maps
          </Button>
        </Container>
      </div>
    </div>
  );
}

export default Unidade;