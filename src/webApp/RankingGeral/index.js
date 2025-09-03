// src/webApp/Ranking/index.js

import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Container, Typography, Box, Paper, Avatar, CircularProgress, List, ListItem, ListItemAvatar, ListItemText, Divider } from '@mui/material';
import styles from './Ranking.module.css';
import CrownIcon from './crown.svg'; // Ícone da coroa para o 1º lugar

function Ranking() {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();

  useEffect(() => {
    // Cria a query para buscar os 5 melhores usuários, ordenados por ptsTotais
    const rankingQuery = query(
      collection(db, "users"), 
      orderBy("ptsTotais", "desc"), 
      limit(5)
    );

    // onSnapshot é o "ouvinte" em tempo real do Firestore.
    // Ele será executado sempre que os dados que correspondem à query mudarem.
    const unsubscribe = onSnapshot(rankingQuery, (querySnapshot) => {
      const usersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRanking(usersList);
      setLoading(false);
    }, (error) => {
      console.error("Erro ao buscar ranking em tempo real:", error);
      setLoading(false);
    });

    // A função de limpeza do useEffect.
    // Ela remove o "ouvinte" quando o componente é desmontado para evitar leaks de memória.
    return () => unsubscribe();
  }, [db]);

  const topThree = ranking.slice(0, 3);
  const others = ranking.slice(3, 5);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth="md" className={styles.rankingContainer}>
      <Typography variant="h2" component="h1" className={styles.title}>
        Pódio dos Melhores
      </Typography>
      
      <Box className={styles.podium}>
        {/* 2º Lugar */}
        {topThree[1] && (
          <Box className={`${styles.podiumPlace} ${styles.second}`}>
            <Avatar className={styles.avatar} sx={{ width: 100, height: 100 }}>{topThree[1].fullName.charAt(0)}</Avatar>
            <Typography variant="h6" className={styles.name}>{topThree[1].fullName}</Typography>
            <Typography variant="h5" className={styles.points}>{topThree[1].ptsTotais} pts</Typography>
            <div className={styles.podiumStep}>2</div>
          </Box>
        )}
        
        {/* 1º Lugar */}
        {topThree[0] && (
          <Box className={`${styles.podiumPlace} ${styles.first}`}>
            <img src={CrownIcon} alt="Coroa" className={styles.crown} />
            <Avatar className={styles.avatar} sx={{ width: 120, height: 120 }}>{topThree[0].fullName.charAt(0)}</Avatar>
            <Typography variant="h5" className={styles.name}>{topThree[0].fullName}</Typography>
            <Typography variant="h4" className={styles.points}>{topThree[0].ptsTotais} pts</Typography>
            <div className={styles.podiumStep}>1</div>
          </Box>
        )}

        {/* 3º Lugar */}
        {topThree[2] && (
          <Box className={`${styles.podiumPlace} ${styles.third}`}>
            <Avatar className={styles.avatar} sx={{ width: 100, height: 100 }}>{topThree[2].fullName.charAt(0)}</Avatar>
            <Typography variant="h6" className={styles.name}>{topThree[2].fullName}</Typography>
            <Typography variant="h5" className={styles.points}>{topThree[2].ptsTotais} pts</Typography>
            <div className={styles.podiumStep}>3</div>
          </Box>
        )}
      </Box>

      {/* Lista para o 4º e 5º lugar */}
      {others.length > 0 && (
        <Paper sx={{ mt: 4, borderRadius: '16px' }}>
          <List>
            {others.map((user, index) => (
              <React.Fragment key={user.id}>
                <ListItem>
                  <Typography sx={{ mr: 2, fontWeight: 'bold' }}>{index + 4}º</Typography>
                  <ListItemAvatar>
                    <Avatar>{user.fullName.charAt(0)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={user.fullName} />
                  <Typography sx={{ fontWeight: 'bold' }}>{user.ptsTotais} pts</Typography>
                </ListItem>
                {index < others.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Container>
  );
}

export default Ranking;