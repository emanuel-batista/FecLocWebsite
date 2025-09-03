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
  CircularProgress,
  // --- NOVOS IMPORTS PARA A PRÉ-VISUALIZAÇÃO ---
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; // Ícone para fechar a janela
import VisibilityIcon from '@mui/icons-material/Visibility'; // Ícone para o botão de pré-visualizar

function AdminUnidades() {
  const [nome, setNome] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [localizacaoUrl, setLocalizacaoUrl] = useState('');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [unidades, setUnidades] = useState([]);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });

  // --- NOVO STATE PARA CONTROLAR A JANELA DE PREVIEW ---
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const db = getFirestore();

  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
  };
  
  const fetchUnidades = useCallback(async () => {
    // ... (código da função continua o mesmo)
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
      const novaUnidade = { nome, fotoUrl, localizacaoUrl, criadoEm: new Date() };
      if (descricao) {
        novaUnidade.descricao = descricao;
      }
      await addDoc(collection(db, "unidades"), novaUnidade);
      showAlert('Unidade cadastrada com sucesso!', 'success');
      setNome('');
      setFotoUrl('');
      setLocalizacaoUrl('');
      setDescricao('');
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

  // --- NOVAS FUNÇÕES PARA ABRIR E FECHAR A PRÉ-VISUALIZAÇÃO ---
  const handleOpenPreview = () => {
    if (fotoUrl) {
      setIsPreviewOpen(true);
    } else {
      showAlert('Por favor, insira uma URL da foto primeiro.', 'warning');
    }
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
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
          fullWidth margin="normal" value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        
        {/* --- CAMPO DE URL COM BOTÃO DE PREVIEW --- */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            label="URL da Foto"
            fullWidth margin="normal" value={fotoUrl}
            onChange={(e) => setFotoUrl(e.target.value)}
            required
          />
          <Button
            variant="outlined"
            onClick={handleOpenPreview}
            startIcon={<VisibilityIcon />}
            sx={{ mt: 1 }}
          >
            Preview
          </Button>
        </Box>
        {/* -------------------------------------- */}

        <TextField
          label="URL de Localização do Google Maps"
          fullWidth margin="normal" value={localizacaoUrl}
          onChange={(e) => setLocalizacaoUrl(e.target.value)}
          helperText="No Google Maps, clique em 'Compartilhar' e 'Copiar link'"
          required
        />
        <TextField
          label="Descrição (Opcional)"
          fullWidth margin="normal" multiline rows={2} value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          helperText="Informe detalhes da localização do stand."
        />
        <Box sx={{ mt: 2, position: 'relative' }}>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar Unidade'}
          </Button>
          {loading && <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', mt: '-12px', ml: '-50px' }} />}
        </Box>
      </Paper>

      {/* ... (código da lista de unidades e do snackbar continua o mesmo) ... */}

      {/* --- JANELA MODAL (DIALOG) PARA A PRÉ-VISUALIZAÇÃO --- */}
      <Dialog open={isPreviewOpen} onClose={handleClosePreview} maxWidth="md">
        <DialogTitle>
          Pré-visualização da Imagem
          <IconButton
            aria-label="close"
            onClick={handleClosePreview}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <img 
            src={fotoUrl} 
            alt="Preview da unidade" 
            style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
            // Adiciona um placeholder caso a imagem quebre
            onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/600x400?text=Link+Quebrado"; }}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default AdminUnidades;