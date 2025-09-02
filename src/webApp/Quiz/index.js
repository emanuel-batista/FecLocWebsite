// src/webApp/Quiz/index.js

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, collection, doc, getDoc, getDocs, query, orderBy, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext'; // Verifique o caminho
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert
} from '@mui/material';

function Quiz() {
  const { quizId } = useParams(); // Pega o ID do quiz da URL
  const { currentUser } = useAuth(); // Pega o usuário logado
  const [curso, setCurso] = useState(null);
  const [perguntas, setPerguntas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [respostas, setRespostas] = useState({});
  const [pontuacao, setPontuacao] = useState(null);
  const [error, setError] = useState('');
  const db = getFirestore();

  const fetchQuizData = useCallback(async () => {
    try {
      const cursoRef = doc(db, 'cursos', quizId);
      const cursoSnap = await getDoc(cursoRef);
      if (!cursoSnap.exists()) {
        setError("Quiz não encontrado.");
        return;
      }
      setCurso(cursoSnap.data());

      const perguntasQuery = query(collection(db, 'cursos', quizId, 'perguntas'), orderBy('criadoEm', 'asc'));
      const querySnapshot = await getDocs(perguntasQuery);
      setPerguntas(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      setError("Erro ao carregar o quiz.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [db, quizId]);

  useEffect(() => {
    fetchQuizData();
  }, [fetchQuizData]);

  const handleRespostaChange = (perguntaId, resposta) => {
    setRespostas(prev => ({ ...prev, [perguntaId]: resposta }));
  };

  const handleSubmit = async () => {
    let acertos = 0;
    perguntas.forEach(pergunta => {
      if (respostas[pergunta.id] === pergunta.respostaCorreta) {
        acertos++;
      }
    });
    
    const pontosGanhos = acertos * 10; // Ex: 10 pontos por acerto
    setPontuacao(pontosGanhos);

    // Atualiza a pontuação total do usuário no Firestore
    if (currentUser) {
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const ptsAtuais = userSnap.data().ptsTotais || 0;
        await updateDoc(userRef, {
          ptsTotais: ptsAtuais + pontosGanhos
        });
      }
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  if (error) return <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>;

  // Se o quiz já foi respondido, mostra a pontuação
  if (pontuacao !== null) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4">Quiz Finalizado!</Typography>
          <Typography variant="h5" sx={{ my: 3 }}>
            Você ganhou {pontuacao} pontos!
          </Typography>
          <Typography variant="body1">
            Sua pontuação total foi atualizada.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4">{curso.nome}</Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>Responda às perguntas abaixo:</Typography>

      {perguntas.map((pergunta, index) => (
        <Paper key={pergunta.id} sx={{ p: 3, my: 2 }}>
          <Typography variant="body1" fontWeight="bold">{index + 1}. {pergunta.pergunta}</Typography>
          <RadioGroup onChange={(e) => handleRespostaChange(pergunta.id, e.target.value)}>
            {pergunta.opcoes.map((opcao, i) => (
              <FormControlLabel key={i} value={opcao} control={<Radio />} label={opcao} />
            ))}
          </RadioGroup>
        </Paper>
      ))}

      <Button variant="contained" size="large" onClick={handleSubmit} sx={{ mt: 3 }}>
        Finalizar Quiz
      </Button>
    </Container>
  );
}

export default Quiz;