import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, collection, doc, getDoc, getDocs, query, orderBy, updateDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import Emblema from '../../components/common/Emblema';
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
  const { quizId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // States para o estado do concurso
  const [concursoTerminado, setConcursoTerminado] = useState(false);
  const [vencedor, setVencedor] = useState(null);

  const [curso, setCurso] = useState(null);
  const [perguntas, setPerguntas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [respostas, setRespostas] = useState({});
  const [pontuacao, setPontuacao] = useState(null);
  const [emblemaConquistado, setEmblemaConquistado] = useState(null);
  const [error, setError] = useState('');
  const db = getFirestore();

  const fetchQuizData = useCallback(async () => {
    setLoading(true);
    try {
      // Verificação inicial do estado do concurso
      const estadoConcursoRef = doc(db, "concurso", "estado");
      const estadoConcursoSnap = await getDoc(estadoConcursoRef);
      if (estadoConcursoSnap.exists() && estadoConcursoSnap.data().terminou) {
        setVencedor(estadoConcursoSnap.data());
        setConcursoTerminado(true);
        setLoading(false);
        return; // Para a execução
      }

      // Verificação se o utilizador já respondeu a este quiz
      if (currentUser) {
        const emblemaRef = doc(db, "users", currentUser.uid, "emblemas", quizId);
        const emblemaSnap = await getDoc(emblemaRef);
        if (emblemaSnap.exists()) {
          alert("Você já respondeu a este quiz!");
          navigate('/home', { replace: true });
          return;
        }
      }
      
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
  }, [db, quizId, currentUser, navigate]);

  useEffect(() => {
    if (currentUser) {
      fetchQuizData();
    } else {
      setLoading(false);
    }
  }, [fetchQuizData, currentUser]);

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
    
    const pontosGanhos = acertos * 10;
    setPontuacao(pontosGanhos);
    const pontuacaoMaxima = perguntas.length * 10;
    const emblemaTipo = pontosGanhos === pontuacaoMaxima ? 'gold' : 'silver';
    setEmblemaConquistado(emblemaTipo);

    if (currentUser) {
      try {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const ptsAtuais = userSnap.data().ptsTotais || 0;
          await updateDoc(userRef, { ptsTotais: ptsAtuais + pontosGanhos });
        }
        const emblemaRef = doc(db, "users", currentUser.uid, "emblemas", quizId);
        await setDoc(emblemaRef, {
          tipo: emblemaTipo,
          conquistadoEm: new Date(),
          cursoNome: curso.nome
        });
      } catch (err) {
        console.error("Erro ao salvar pontuação ou emblema:", err);
      }
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  if (error) return <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>;

  // Tela para quando o concurso termina
  if (concursoTerminado) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4">O Concurso Terminou!</Typography>
          <Typography variant="h6" sx={{ my: 3 }}>
            O vencedor já foi determinado.
          </Typography>
          {vencedor && (
            <Alert severity="success">
              Parabéns a <strong>{vencedor.vencedorNome}</strong> por ganhar com {vencedor.vencedorPontos} pontos!
            </Alert>
          )}
          <Button variant="contained" onClick={() => navigate('/home')} sx={{ mt: 3 }}>
            Voltar para a Home
          </Button>
        </Paper>
      </Container>
    );
  }

  // Tela de resultado após responder
  if (pontuacao !== null) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4">Quiz Finalizado!</Typography>
          {emblemaConquistado && (
            <Emblema 
              tipo={emblemaConquistado} 
              nomeCurso={curso?.nome || ''} 
            />
          )}
          <Typography variant="h5" sx={{ my: 2 }}>
            Você ganhou {pontuacao} pontos!
          </Typography>
          <Typography variant="body1">
            Sua pontuação e seu novo emblema foram salvos no seu perfil.
          </Typography>
        </Paper>
      </Container>
    );
  }
  
  if (!curso) {
    return null; // Não renderiza nada se o curso ainda não foi carregado
  }

  // Tela principal do Quiz
  return (
    <Container maxWidth="md" sx={{ mt: 4, pb: 4 }}>
      <Typography variant="h4">{curso.nome}</Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Responda às perguntas abaixo:
      </Typography>

      {perguntas.map((pergunta, index) => (
        <Paper key={pergunta.id} sx={{ p: 3, my: 2 }}>
          <Typography variant="body1" fontWeight="bold">
            {index + 1}. {pergunta.pergunta}
          </Typography>
          <RadioGroup onChange={(e) => handleRespostaChange(pergunta.id, e.target.value)}>
            {pergunta.opcoes.map((opcao, i) => (
              <FormControlLabel
                key={i}
                value={opcao}
                control={<Radio />}
                label={
                  <Typography sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    {opcao}
                  </Typography>
                }
                sx={{ alignItems: 'flex-start', mt: 1 }}
              />
            ))}
          </RadioGroup>
        </Paper>
      ))}

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        mt: 4, 
        mb: 4,
        position: 'sticky',
        bottom: 20,
        zIndex: 1000
      }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          sx={{ 
            py: 1.5, 
            px: 4, 
            fontSize: '1.1rem',
            boxShadow: 3
          }}
          disabled={Object.keys(respostas).length < perguntas.length}
        >
          Finalizar Quiz
        </Button>
      </Box>
    </Container>
  );
}

export default Quiz;