// src/webApp/AdminPanel/index.js

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Box
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import BusinessIcon from '@mui/icons-material/Business';
import QuizIcon from '@mui/icons-material/Quiz';

// Um componente auxiliar para os cards de navegação
const AdminCard = ({ to, title, description, icon }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea component={Link} to={to} sx={{ flexGrow: 1 }}>
        <CardContent sx={{ textAlign: 'center', p: 3 }}>
          <Box sx={{ fontSize: 48, mb: 2 }}>
            {icon}
          </Box>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  </Grid>
);

function AdminPanel() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom component="h1" sx={{ mb: 4 }}>
        Painel de Administração
      </Typography>
      
      <Grid container spacing={4}>
        <AdminCard
          to="/admin/users"
          title="Gerenciar Usuários"
          description="Visualizar, editar e gerenciar todos os usuários da plataforma."
          icon={<GroupIcon color="primary" fontSize="inherit" />}
        />
        <AdminCard
          to="/admin/unidades"
          title="Gerenciar Unidades"
          description="Adicionar, editar ou remover as unidades e stands disponíveis."
          icon={<BusinessIcon color="primary" fontSize="inherit" />}
        />
        <AdminCard
          to="/admin/quizzes"
          title="Gerenciar Quizzes"
          description="Criar e editar os cursos e os quizzes associados a cada um."
          icon={<QuizIcon color="primary" fontSize="inherit" />}
        />
      </Grid>
    </Container>
  );
}

export default AdminPanel;