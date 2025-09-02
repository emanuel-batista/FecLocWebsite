// src/webApp/AdminPanel/Quizzes/CadastrarPergunta.js

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, collection, doc, getDoc, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';

function CadastrarPergunta() {
  const { cursoId } = useParams(); // Pega o ID do curso da URL
  const [curso, setCurso] = useState(null);
  const [pergunta, setPergunta] = useState('');
  const [opcoes, setOpcoes] = useState(['', '', '', '']);
  const [respostaCorreta, setRespostaCorreta] = useState('');
  const [perguntas, setPerguntas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  const db = getFirestore();

  const fetchCursoEPerguntas = useCallback(async () => {
    // Busca os dados do curso
    const cursoRef = doc(db, 'cursos', cursoId);
    const cursoSnap = await getDoc(cursoRef);
    if (cursoSnap.exists()) setCurso(cursoSnap.data());

    // Busca as perguntas existentes
    const perguntasQuery = query(collection(db, 'cursos', cursoId, 'perguntas'), orderBy('criadoEm', 'asc'));
    const querySnapshot = await getDocs(perguntasQuery);
    setPerguntas(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, [db, cursoId]);

  useEffect(() => {
    fetchCursoEPerguntas();
  }, [fetchCursoEPerguntas]);
  
  const handleOpcaoChange = (index, value) => {
    const novasOpcoes = [...opcoes];
    novasOpcoes[index] = value;
    setOpcoes(novasOpcoes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pergunta || opcoes.some(opt => !opt) || !respostaCorreta) {
      showAlert('Preencha todos os campos da pergunta.', 'warning');
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'cursos', cursoId, 'perguntas'), {
        pergunta,
        opcoes,
        respostaCorreta,
        criadoEm: new Date()
      });
      showAlert('Pergunta cadastrada com sucesso!', 'success');
      // Limpa o formulário
      setPergunta('');
      setOpcoes(['', '', '', '']);
      setRespostaCorreta('');
      fetchCursoEPerguntas(); // Atualiza a lista
    } catch (error) {
      showAlert('Erro ao cadastrar pergunta.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, severity) => setAlert({ open: true, message, severity });
  const handleCloseAlert = () => setAlert({ ...alert, open: false });

  if (!curso) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4">Adicionar Perguntas ao Quiz</Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>Curso: {curso.nome}</Typography>
      
      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3, my: 4 }}>
        <TextField
          label="Texto da Pergunta"
          fullWidth multiline rows={3}
          margin="normal" value={pergunta}
          onChange={(e) => setPergunta(e.target.value)}
        />
        {opcoes.map((opcao, index) => (
          <TextField
            key={index}
            label={`Opção ${index + 1}`}
            fullWidth margin="dense" value={opcao}
            onChange={(e) => handleOpcaoChange(index, e.target.value)}
          />
        ))}
        <FormControl component="fieldset" margin="normal">
          <Typography variant="subtitle1">Qual a resposta correta?</Typography>
          <RadioGroup row value={respostaCorreta} onChange={(e) => setRespostaCorreta(e.target.value)}>
            {opcoes.map((opcao, index) => (
              <FormControlLabel key={index} value={opcao} control={<Radio />} label={`Opção ${index + 1}`} />
            ))}
          </RadioGroup>
        </FormControl>
        <Box sx={{ mt: 2 }}><Button type="submit" variant="contained" disabled={loading}>{loading ? 'Salvando...' : 'Salvar Pergunta'}</Button>
        
        </Box>
      </Paper>

      <Typography variant="h5" gutterBottom>Perguntas já cadastradas</Typography>
      {perguntas.map((p, index) => (
          <Paper key={p.id} sx={{p: 2, mb: 1}}>
              <Typography variant="body1"><strong>{index+1}.</strong> {p.pergunta}</Typography>
          </Paper>
      ))}

      <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alert.severity}>{alert.message}</Alert>
      </Snackbar>
    </Container>
  );
}

export default CadastrarPergunta;