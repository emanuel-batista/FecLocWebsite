// src/webApp/AdminPanel/Users/index.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importado para o botão de voltar
import { useAuth } from '../../../contexts/AuthContext';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
  Button, // Importado para o botão de ação
  IconButton // Para o ícone de voltar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Ícone de voltar

function Users() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUser) {
        setError("Você precisa estar logado para ver os usuários.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError('');
        const token = await currentUser.getIdToken();
        const functionUrl = 'https://us-central1-un1l0c.cloudfunctions.net/listUsers';
        
        const response = await fetch(functionUrl, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Falha ao buscar usuários: ${errorText}`);
        }

        const data = await response.json();
        const sortedUsers = (data.users || []).sort((a, b) => 
          new Date(b.creationTime) - new Date(a.creationTime)
        );
        setUsers(sortedUsers);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Ocorreu um erro desconhecido.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [currentUser]);

  // --- NOVA FUNÇÃO PARA ATIVAR/DESATIVAR USUÁRIO ---
  const handleToggleUserStatus = async (uid, currentStatus) => {
    if (!currentUser) return;

    // Atualiza o estado local imediatamente para uma UI mais rápida
    setUsers(users.map(user => 
      user.uid === uid ? { ...user, disabled: !currentStatus } : user
    ));

    try {
      const token = await currentUser.getIdToken();
      const response = await fetch('/api/toggle-user-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ uid: uid, disabled: !currentStatus }),
      });

      if (!response.ok) {
        // Se a API falhar, reverte a mudança no estado local
        setUsers(users.map(user => 
          user.uid === uid ? { ...user, disabled: currentStatus } : user
        ));
        alert('Falha ao atualizar o status do usuário.');
      }
    } catch (error) {
      console.error("Erro ao alterar status do usuário:", error);
      // Reverte a mudança se ocorrer um erro
      setUsers(users.map(user => 
        user.uid === uid ? { ...user, disabled: currentStatus } : user
      ));
      alert('Falha ao atualizar o status do usuário.');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  const renderDesktopView = () => (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="tabela de usuários">
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
          <TableRow>
            <TableCell>Usuário</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Data de Criação</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Ações</TableCell> 
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.uid} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar src={user.photoURL} sx={{ mr: 2 }}>{user.fullName ? user.fullName.charAt(0) : user.email.charAt(0)}</Avatar>
                  {user.fullName || 'Sem nome'}
                </Box>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{new Date(user.creationTime).toLocaleDateString('pt-BR')}</TableCell>
              <TableCell>
                <Chip label={user.disabled ? 'Desativado' : 'Ativo'} color={user.disabled ? 'error' : 'success'} size="small" />
              </TableCell>
              {/* --- BOTÃO DE AÇÃO --- */}
              <TableCell align="right">
                <Button variant="outlined" size="small" color={user.disabled ? 'success' : 'error'} onClick={() => handleToggleUserStatus(user.uid, user.disabled)}>
                  {user.disabled ? 'Reativar' : 'Desativar'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderMobileView = () => (
    <Box>
      {users.map((user) => (
        <Paper key={user.uid} sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar src={user.photoURL} sx={{ width: 48, height: 48 }}>{user.fullName ? user.fullName.charAt(0) : user.email.charAt(0)}</Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body1" fontWeight="bold" noWrap>{user.fullName || 'Sem nome'}</Typography>
              <Typography variant="body2" color="text.secondary" noWrap>{user.email}</Typography>
              <Typography variant="caption" color="text.secondary">Criado em: {new Date(user.creationTime).toLocaleDateString('pt-BR')}</Typography>
            </Box>
            <Chip label={user.disabled ? 'Desativado' : 'Ativo'} color={user.disabled ? 'error' : 'success'} size="small" />
          </Box>
          {/* --- BOTÃO DE AÇÃO NO MOBILE --- */}
          <Button fullWidth variant="outlined" size="small" color={user.disabled ? 'success' : 'error'} onClick={() => handleToggleUserStatus(user.uid, user.disabled)}>
            {user.disabled ? 'Reativar' : 'Desativar'}
          </Button>
        </Paper>
      ))}
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {/* --- BOTÃO DE VOLTAR --- */}
        <IconButton component={Link} to="/admin" sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Painel de Usuários
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {isMobile ? renderMobileView() : renderDesktopView()}
    </Container>
  );
}

export default Users;