// AdminPanel/Users/index.js

import React, { useState, useEffect } from 'react';
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
  useMediaQuery
} from '@mui/material';

function Users() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Hooks para responsividade do Material-UI
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

        // **NOVO: Ordena os usuários pela data de criação (do mais novo para o mais antigo)**
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
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.uid} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar src={user.photoURL} sx={{ mr: 2 }}>
                    {user.displayName ? user.displayName.charAt(0) : user.email.charAt(0)}
                  </Avatar>
                  {user.displayName || 'Sem nome'}
                </Box>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{new Date(user.creationTime).toLocaleDateString('pt-BR')}</TableCell>
              <TableCell>
                <Chip 
                  label={user.disabled ? 'Desativado' : 'Ativo'} 
                  color={user.disabled ? 'error' : 'success'} 
                  size="small" 
                />
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
        <Paper key={user.uid} sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={user.photoURL} sx={{ width: 48, height: 48 }}>
            {user.displayName ? user.displayName.charAt(0) : user.email.charAt(0)}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body1" fontWeight="bold" noWrap>
              {user.displayName || 'Sem nome'}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {user.email}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Criado em: {new Date(user.creationTime).toLocaleDateString('pt-BR')}
            </Typography>
          </Box>
          <Chip 
            label={user.disabled ? 'Desativado' : 'Ativo'} 
            color={user.disabled ? 'error' : 'success'} 
            size="small" 
            sx={{ alignSelf: 'flex-start' }}
          />
        </Paper>
      ))}
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom component="h1">
        Painel de Usuários
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* **NOVO: Renderização condicional baseada no tamanho da tela** */}
      {isMobile ? renderMobileView() : renderDesktopView()}
    </Container>
  );
}

export default Users;