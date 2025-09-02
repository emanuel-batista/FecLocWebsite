// src/webApp/HomeAlternative/Unidade.js

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // <-- Importa o Link
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { 
  Container, 
  Typography, 
  Box, 
  CircularProgress, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  Paper,
  Divider
} from '@mui/material';
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
        const unidadeRef = doc(db, 'unidades', unidadeId);
        const unidadeSnap = await getDoc(unidadeRef);
        if (unidadeSnap.exists()) {
          setUnidade(unidadeSnap.data());
        }

        const cursosQuery = query(collection(db, 'cursos'), where('unidadeId', '==', unidadeId));
        const cursosSnapshot = await getDocs(cursosQuery);
        // ATUALIZAÇÃO: Captura o ID do curso para usar no link
        setCursos(cursosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Erro ao buscar dados da unidade:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [unidadeId, db]);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  }

  if (!unidade) {
    return <Typography sx={{ textAlign: 'center', mt: 5, fontFamily: 'Roboto' }}>Unidade não encontrada.</Typography>;
  }

  return (
    <div 
      className={styles.unidadeContainer} 
      style={{ backgroundImage: `url(${unidade.fotoUrl})` }}
    >
      <div className={styles.overlay}>
        <Container maxWidth="md" className={styles.content}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontFamily: 'Roboto', fontWeight: 'bold' }}>
            {unidade.nome}
          </Typography>
          
          <Paper sx={{ p: 3, my: 4, backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '16px' }}>
            <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Roboto', fontWeight: 500, color: '#333' }}>
              Cursos com Stand nesta Unidade:
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              {cursos.length > 0 ? (
                cursos.map((curso) => (
                  // --- ATUALIZAÇÃO: ListItem agora é um Link clicável ---
                  <ListItem 
                    button 
                    component={Link} 
                    to={`/curso/${curso.id}`} 
                    key={curso.id}
                  >
                    <ListItemText
                      primary={curso.nome}
                      primaryTypographyProps={{ fontFamily: 'Roboto', fontWeight: 'bold', color: '#111' }} 
                    />
                  </ListItem>
                  // --------------------------------------------------
                ))
              ) : (
                <ListItem>
                  <ListItemText
                    primary="Nenhum curso com stand cadastrado para esta unidade."
                    primaryTypographyProps={{ fontFamily: 'Roboto', color: '#555' }}
                  />
                </ListItem>
              )}
            </List>
          </Paper>

          <Button
            variant="contained"
            size="large"
            startIcon={<MapIcon />}
            href={unidade.localizacaoUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              fontFamily: 'Roboto', fontWeight: 'bold', backgroundColor: '#014195',
              color: 'white', px: 4, py: 1.5, borderRadius: '28px', textTransform: 'none',
              fontSize: '1rem', '&:hover': { backgroundColor: '#013275', boxShadow: '0 4px 20px rgba(0,0,0,0.25)'}
            }}
          >
            Ver no Google Maps
          </Button>
        </Container>
      </div>
    </div>
  );
}

export default Unidade;