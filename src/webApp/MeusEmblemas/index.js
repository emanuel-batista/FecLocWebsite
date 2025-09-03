// src/webApp/MeusEmblemas/index.js

import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, orderBy, getDocs } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import Emblema from '../../components/common/Emblema';
import { Container, Typography, Box, CircularProgress, Grid, Paper, Alert } from '@mui/material';
import styles from './MeusEmblemas.module.css';

function MeusEmblemas() {
  const [emblemas, setEmblemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const db = getFirestore();

  useEffect(() => {
    if (currentUser) {
      const fetchEmblemas = async () => {
        try {
          const emblemasQuery = query(
            collection(db, "users", currentUser.uid, "emblemas"),
            orderBy("conquistadoEm", "desc")
          );
          const querySnapshot = await getDocs(emblemasQuery);
          const emblemasList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setEmblemas(emblemasList);
        } catch (err) {
          console.error("Erro ao buscar emblemas:", err);
          setError("Não foi possível carregar seus emblemas.");
        } finally {
          setLoading(false);
        }
      };
      fetchEmblemas();
    } else {
      setLoading(false);
    }
  }, [currentUser, db]);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>;
  }

  return (
    <Container maxWidth="lg" className={styles.pageContainer}>
      <Typography variant="h2" component="h1" className={styles.title}>
        Minha Galeria de Emblemas
      </Typography>

      {emblemas.length > 0 ? (
        <Grid container spacing={4}>
          {emblemas.map(emblema => (
            <Grid item key={emblema.id} xs={12} sm={6} md={4}>
              <Paper className={styles.emblemaCard}>
                <Emblema tipo={emblema.tipo} nomeCurso={emblema.cursoNome} />
                <Typography variant="caption" color="text.secondary">
                  Conquistado em: {new Date(emblema.conquistadoEm.toDate()).toLocaleDateString('pt-BR')}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper className={styles.emptyState}>
          <Typography variant="h6">Você ainda não conquistou nenhum emblema.</Typography>
          <Typography color="text.secondary">Escanear os QR Codes nos stands e responda aos quizzes para começar!</Typography>
        </Paper>
      )}
    </Container>
  );
}

export default MeusEmblemas;