// AdminPanel/Users/index.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext'; // Verifique se este caminho está correto
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
  Chip
} from '@mui/material';

function Users() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      // Garante que existe um usuário logado para fazer a requisição
      if (!currentUser) {
        setError("Você precisa estar logado para ver os usuários.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        // 1. Pega o token de autenticação do usuário admin logado
        const token = await currentUser.getIdToken();

        // 2. Chama a sua Cloud Function (LEIA A SEÇÃO ABAIXO!)
        const functionUrl = 'https://us-central1-un1l0c.cloudfunctions.net/listUsers'; 
        
        const response = await fetch(functionUrl, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Falha ao buscar usuários: ${errorText}`);
        }

        const data = await response.json();
        setUsers(data.users || []);

      } catch (err) {
        console.error(err);
        setError(err.message || 'Ocorreu um erro desconhecido.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser]); // A requisição roda sempre que o usuário mudar

  // Renderiza um spinner de carregamento enquanto busca os dados
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom component="h1">
        Painel de Usuários
      </Typography>

      {/* Exibe uma mensagem de erro, se houver */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Tabela para exibir os usuários */}
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
    </Container>
  );
}

export default Users;