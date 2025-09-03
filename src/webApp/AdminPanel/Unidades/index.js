// src/webApp/AdminPanel/Unidades/index.js

import React, { useState, useEffect, useCallback } from 'react';
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
  const [descricao, setDescricao] = useState(''); // <-- NOVO STATE
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [unidades, setUnidades] = useState([]);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });

  const db = getFirestore();

  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
  };

  const fetchUnidades = useCallback(async () => {
    setListLoading(true);
    try {
      const q = query(collection(db, "unidades"), orderBy("criadoEm", "desc"));
      const querySnapshot = await getDocs(q);
      const unidadesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUnidades(unidadesList);
    } catch (error) {
      console.error("Erro ao buscar unidades:", error);
    } finally {
      setListLoading(false);
    }
  }, [db]);

  useEffect(() => {
    fetchUnidades();
  }, [fetchUnidades]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome || !fotoUrl || !localizacaoUrl) {
      showAlert('Por favor, preencha os campos obrigatórios.', 'warning');
      return;
    }
    setLoading(true);

    try {
      const novaUnidade = {
        nome: nome,
        fotoUrl: fotoUrl,
        localizacaoUrl: localizacaoUrl,
        criadoEm: new Date()
      };
      
      if (descricao) {
        novaUnidade.descricao = descricao;
      }

      await addDoc(collection(db, "unidades"), novaUnidade);
      
      showAlert('Unidade cadastrada com sucesso!', 'success');
      setNome('');
      setFotoUrl('');
      setLocalizacaoUrl('');
      setDescricao(''); // <-- LIMPA O CAMPO
      fetchUnidades();
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

      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3, mb: 4, borderRadius: '16px' }}>
        <Typography variant="h6" gutterBottom>Cadastrar Nova Unidade</Typography>
        <TextField
          label="Nome da Unidade"
          fullWidth
          margin="normal"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <TextField
          label="URL da Foto"
          fullWidth
          margin="normal"
          value={fotoUrl}
          onChange={(e) => setFotoUrl(e.target.value)}
          required
        />
        <TextField
          label="URL de Localização do Google Maps"
          fullWidth
          margin="normal"
          value={localizacaoUrl}
          onChange={(e) => setLocalizacaoUrl(e.target.value)}
          helperText="No Google Maps, clique em 'Compartilhar' e 'Copiar link'"
          required
        />
        {/* --- NOVO CAMPO DE DESCRIÇÃO (OPCIONAL) --- */}
        <TextField
          label="Descrição (Ex: Sala, Bloco, etc.)"
          fullWidth
          margin="normal"
          multiline
          rows={2}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          helperText="Opcional: Informe detalhes da localização do stand."
        />
        <Box sx={{ mt: 2, position: 'relative' }}>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar Unidade'}
          </Button>
          {loading && <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', mt: '-12px', ml: '-50px' }} />}
        </Box>
      </Paper>

      <Typography variant="h6" gutterBottom>Unidades Cadastradas</Typography>
      {listLoading ? (
        <Box display="flex" justifyContent="center"><CircularProgress /></Box>
      ) : (
        unidades.map(unidade => (
          <Paper key={unidade.id} sx={{ p: 2, mb: 1, display: 'flex', alignItems: 'center', gap: 2, borderRadius: '8px' }}>
            <img src={unidade.fotoUrl} alt={unidade.nome} width="80" height="80" style={{ objectFit: 'cover', borderRadius: '4px' }} />
            <Box>
              <Typography variant="body1" fontWeight="bold">{unidade.nome}</Typography>
              {unidade.descricao && <Typography variant="body2" color="text.secondary">{unidade.descricao}</Typography>}
            </Box>
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