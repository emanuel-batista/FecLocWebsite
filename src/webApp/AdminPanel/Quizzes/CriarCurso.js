// src/webApp/AdminPanel/Quizzes/CriarCurso.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';

function CriarCurso() {
  const [nome, setNome] = useState('');
  const [unidadeId, setUnidadeId] = useState('');
  const [descricao, setDescricao] = useState(''); // <-- NOVO STATE
  const [unidades, setUnidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  const navigate = useNavigate();
  const db = getFirestore();

  useEffect(() => {
    const fetchUnidades = async () => {
      const querySnapshot = await getDocs(collection(db, "unidades"));
      setUnidades(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchUnidades();
  }, [db]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome || !unidadeId) {
      showAlert('Nome do curso e unidade são obrigatórios.', 'warning');
      return;
    }
    setLoading(true);
    try {
      const novoCurso = {
        nome,
        unidadeId,
        criadoEm: new Date()
      };

      // Adiciona a descrição apenas se ela foi preenchida
      if (descricao) {
        novoCurso.descricao = descricao;
      }

      await addDoc(collection(db, "cursos"), novoCurso);
      
      showAlert('Curso criado com sucesso!', 'success');
      setTimeout(() => navigate('/admin/quizzes'), 1500);
    } catch (error) {
      showAlert('Erro ao criar curso.', 'error');
      setLoading(false);
    }
  };

  const showAlert = (message, severity) => setAlert({ open: true, message, severity });
  const handleCloseAlert = () => setAlert({ ...alert, open: false });

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Cadastrar Novo Curso</Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel id="unidade-select-label">Unidade</InputLabel>
          <Select
            labelId="unidade-select-label"
            value={unidadeId}
            label="Unidade"
            onChange={(e) => setUnidadeId(e.target.value)}
            required
          >
            {unidades.map(unidade => (
              <MenuItem key={unidade.id} value={unidade.id}>{unidade.nome}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Nome do Curso"
          fullWidth
          margin="normal"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        {/* --- NOVO CAMPO DE DESCRIÇÃO --- */}
        <TextField
          label="Descrição do Curso"
          fullWidth
          margin="normal"
          multiline
          rows={3}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          helperText="Opcional: Dê mais detalhes sobre o curso."
        />
        <Box sx={{ mt: 2, position: 'relative' }}>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Criando...' : 'Criar Curso'}
          </Button>
          {loading && <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', mt: '-12px', ml: '-50px' }} />}
        </Box>
      </Paper>
      <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alert.severity}>{alert.message}</Alert>
      </Snackbar>
    </Container>
  );
}

export default CriarCurso;