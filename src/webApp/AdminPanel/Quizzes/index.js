// src/webApp/AdminPanel/Quizzes/index.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFirestore, collection, getDocs, orderBy, query } from 'firebase/firestore';
import { QRCodeCanvas } from 'qrcode.react'; // CORREÇÃO APLICADA AQUI
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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function AdminQuizzes() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCurso, setSelectedCurso] = useState(null);
  const db = getFirestore();

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const q = query(collection(db, "cursos"), orderBy("nome", "asc"));
        const querySnapshot = await getDocs(q);
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

  const handleOpenModal = (curso) => {
    setSelectedCurso(curso);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCurso(null);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">Gerenciamento de Quizzes</Typography>
        <Button variant="contained" component={Link} to="/admin/quizzes/criar-curso">
          Cadastrar Novo Curso
        </Button>
      </Box>

      <Paper>
        <Typography variant="h6" sx={{ p: 2 }}>Cursos Cadastrados</Typography>
        <Divider />
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
        ) : (
          <List>
            {cursos.map((curso) => (
              <ListItem key={curso.id}
                secondaryAction={
                  <Button variant="outlined" size="small" onClick={() => handleOpenModal(curso)}>
                    Gerar QR Code
                  </Button>
                }
              >
                <ListItemText 
                  primary={curso.nome} 
                  secondary={
                    <Link to={`/admin/quizzes/cadastrar-pergunta/${curso.id}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
                      Adicionar/Ver Perguntas
                    </Link>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      {/* Janela Modal para exibir o QR Code */}
      <Dialog open={modalOpen} onClose={handleCloseModal}>
        <DialogTitle>
          QR Code para: {selectedCurso?.nome}
          <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', p: 4 }}>
          {selectedCurso && (
            <QRCodeCanvas // CORREÇÃO APLICADA AQUI
              value={`${window.location.origin}/quiz/responder/${selectedCurso.id}`}
              size={256}
              includeMargin={true}
            />
          )}
          <Typography variant="caption" display="block" sx={{ mt: 2 }}>
            Imprima este código para que os usuários possam escanear.
          </Typography>
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default AdminQuizzes;