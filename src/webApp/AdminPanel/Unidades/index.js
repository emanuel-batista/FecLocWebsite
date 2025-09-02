// src/webApp/AdminPanel/Unidades/index.js

import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';

function AdminUnidades() {
  const [nome, setNome] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [unidades, setUnidades] = useState([]);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });

  const db = getFirestore();

  // Função para buscar as unidades já cadastradas
  const fetchUnidades = async () => {
    const querySnapshot = await getDocs(collection(db, "unidades"));
    const unidadesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUnidades(unidadesList);
  };

  // Busca as unidades quando o componente é montado
  useEffect(() => {
    fetchUnidades();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome || !fotoUrl) {
      showAlert('Por favor, preencha todos os campos.', 'warning');
      return;
    }
    setLoading(true);

    try {
      await addDoc(collection(db, "unidades"), {
        nome: nome,
        fotoUrl: fotoUrl,
        criadoEm: new Date()
      });
      showAlert('Unidade cadastrada com sucesso!', 'success');
      setNome('');
      setFotoUrl('');
      fetchUnidades(); // Atualiza a lista após o cadastro
    } catch (error) {
      console.error("Erro ao cadastrar unidade: ", error);
      showAlert('Erro ao cadastrar unidade.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Gerenciamento de Unidades
      </Typography>

      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Cadastrar Nova Unidade</Typography>
        <TextField
          label="Nome da Unidade"
          fullWidth
          margin="normal"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <TextField
          label="URL da Foto"
          fullWidth
          margin="normal"
          value={fotoUrl}
          onChange={(e) => setFotoUrl(e.target.value)}
        />
        <Box sx={{ mt: 2, position: 'relative' }}>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar Unidade'}
          </Button>
          {loading && <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', mt: '-12px', ml: '-12px' }} />}
        </Box>
      </Paper>

      <Typography variant="h6" gutterBottom>Unidades Cadastradas</Typography>
      {unidades.map(unidade => (
        <Paper key={unidade.id} sx={{ p: 2, mb: 1, display: 'flex', alignItems: 'center' }}>
          <img src={unidade.fotoUrl} alt={unidade.nome} width="80" height="80" style={{ marginRight: '16px', borderRadius: '4px' }} />
          <Typography variant="body1">{unidade.nome}</Typography>
        </Paper>
      ))}

      <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default AdminUnidades;