// src/webApp/AdminPanel/Quizzes/index.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress
} from '@mui/material';

function AdminQuizzes() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "cursos"));
        const cursosList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCursos(cursosList);
      } catch (error) {
        console.error("Erro ao buscar cursos: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCursos();
  }, [db]);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Gerenciamento de Quizzes
        </Typography>
        <Button variant="contained" component={Link} to="/admin/quizzes/criar-curso">
          Cadastrar Novo Curso
        </Button>
      </Box>

      <Paper>
        <Typography variant="h6" sx={{ p: 2 }}>Selecione um curso para adicionar perguntas</Typography>
        <Divider />
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
        ) : (
          <List>
            {cursos.map((curso) => (
              <ListItem button component={Link} to={`/admin/quizzes/cadastrar-pergunta/${curso.id}`} key={curso.id}>
                <ListItemText primary={curso.nome} />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
}

export default AdminQuizzes;