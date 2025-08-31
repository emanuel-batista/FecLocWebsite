// login-backend/index.js

const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// --- Configuração do Firebase Admin SDK ---
// Faça o download deste arquivo no console do Firebase
const serviceAccount = require('../un1l0c-firebase-adminsdk-fbsvc-ab6dc5637c.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();

// --- Middlewares ---
app.use(cors()); // Permite requisições de outras origens (seu frontend)
app.use(express.json()); // Permite que o servidor entenda JSON

// --- Rotas da API ---
app.get('/', (req, res) => {
  res.send('Backend do Login está funcionando!');
});

// Rota de Cadastro
app.post('/api/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });

    // Opcional: Crie um documento no Firestore para o novo usuário
    await admin.firestore().collection('users').doc(userRecord.uid).set({
        email: userRecord.email,
        role: 'user', // Nível de usuário padrão
    });

    res.status(201).send({ message: 'Usuário criado com sucesso!', uid: userRecord.uid });
  } catch (error) {
    console.error("Erro no cadastro:", error);
    res.status(400).send({ error: error.message });
  }
});


// --- Iniciar o Servidor ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});