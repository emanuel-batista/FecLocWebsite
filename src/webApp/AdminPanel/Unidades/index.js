// src/webApp/AdminPanel/Unidades/index.js

import React, { useState, useEffect, useCallback } from 'react'; // <-- Importa useCallback
import { getFirestore, collection, addDoc, getDocs, orderBy, query } from 'firebase/firestore';
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
  const [localizacaoUrl, setLocalizacaoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [unidades, setUnidades] = useState([]);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });

  const db = getFirestore();

  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
  };

  // --- FUNÇÃO MOVIDA PARA FORA DO USEEFFECT ---
  // Envolvemos com useCallback para otimização e para evitar loops infinitos de re-renderização.
  const fetchUnidades = useCallback(async () => {
    setListLoading(true);
    try {
      const q = query(collection(db, "unidades"), orderBy("criadoEm", "desc"));
      const querySnapshot = await getDocs(q);
      const unidadesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUnidades(unidadesList);
    } catch (error) {
      console.error("Erro ao buscar unidades:", error);
      // O showAlert não pode ser chamado diretamente aqui, pois causaria um loop
      // A lógica de alerta de erro na busca foi removida para simplificar
    } finally {
      setListLoading(false);
    }
  }, [db]); // A função será recriada se 'db' mudar

  useEffect(() => {
    // Agora o useEffect apenas chama a função que já existe fora dele
    fetchUnidades();
  }, [fetchUnidades]); // A dependência agora é a própria função

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome || !fotoUrl || !localizacaoUrl) {
      showAlert('Por favor, preencha todos os campos.', 'warning');
      return;
    }
    setLoading(true);

    try {
      await addDoc(collection(db, "unidades"), {
        nome: nome,
        fotoUrl: fotoUrl,
        localizacaoUrl: localizacaoUrl,
        criadoEm: new Date()
      });
      showAlert('Unidade cadastrada com sucesso!', 'success');
      setNome('');
      setFotoUrl('');
      setLocalizacaoUrl('');
      fetchUnidades(); // <-- AGORA A CHAMADA FUNCIONA CORRETAMENTE
    } catch (error) {
      console.error("Erro ao cadastrar unidade: ", error);
      showAlert('Erro ao cadastrar unidade.', 'error');
    } finally {
      setLoading(false);
    }
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
        <TextField
          label="URL de Localização do Google Maps"
          fullWidth
          margin="normal"
          value={localizacaoUrl}
          onChange={(e) => setLocalizacaoUrl(e.target.value)}
          helperText="No Google Maps, clique em 'Compartilhar' e 'Copiar link'"
        />
        <Box sx={{ mt: 2, position: 'relative' }}>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar Unidade'}
          </Button>
          {loading && <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', mt: '-12px', ml: '-12px' }} />}
        </Box>
      </Paper>

      <Typography variant="h6" gutterBottom>Unidades Cadastradas</Typography>
      {listLoading ? (
        <Box display="flex" justifyContent="center"><CircularProgress /></Box>
      ) : (
        unidades.map(unidade => (
          <Paper key={unidade.id} sx={{ p: 2, mb: 1, display: 'flex', alignItems: 'center' }}>
            <img src={unidade.fotoUrl} alt={unidade.nome} width="80" height="80" style={{ marginRight: '16px', borderRadius: '4px', objectFit: 'cover' }} />
            <Typography variant="body1">{unidade.nome}</Typography>
          </Paper>
        ))
      )}
      
      <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default AdminUnidades;