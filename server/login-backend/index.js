// login-backend/index.js

const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const serviceAccount = require('../un1l0c-firebase-adminsdk-fbsvc-ab6dc5637c.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://un1l0c-default-rtdb.firebaseio.com"
});

const app = express();
app.use(cors());
app.use(express.json());

// Pega a referência dos bancos de dados
const firestore = admin.firestore();
const rtdb = admin.database();


app.post('/api/signup', async (req, res) => {
  // --- NOVO: Lógica de Log ---
  const logsCollection = firestore.collection('registration_logs');
  const logRef = logsCollection.doc(); // Cria uma referência para um novo documento de log

  try {
    const { email, password, username, fullName, phone } = req.body;

    // 1. Grava o log inicial da TENTATIVA
    await logRef.set({
      email: email,
      username: username,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      status: 'initiated', // Status inicial
      ip: req.ip // Opcional: grava o IP do requerente
    });

    if (!email || !password || !username || !fullName) {
        throw new Error("Campos obrigatórios em falta.");
    }

    // 2. Tenta criar o usuário no Authentication
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: username,
    });

    const userData = {
        username: username,
        fullName: fullName,
        phone: phone,
        email: email,
        role: 'user',
    };

    // 3. Salva os dados no Realtime Database e Firestore
    const rtdbPromise = rtdb.ref('users/' + userRecord.uid).set(userData);
    const firestorePromise = firestore.collection('users').doc(userRecord.uid).set(userData);
    await Promise.all([rtdbPromise, firestorePromise]);

    // 4. Atualiza o log para SUCESSO
    await logRef.update({
        status: 'success',
        uid: userRecord.uid
    });

    res.status(201).send({ message: 'Usuário criado com sucesso!', uid: userRecord.uid });

  } catch (error) {
    console.error("Erro no cadastro:", error);
    
    // 5. Atualiza o log para FALHA
    await logRef.update({
        status: 'failed',
        error: error.message
    });

    if (error.code === 'auth/email-already-exists') {
        return res.status(400).send({ error: 'Este email já está a ser utilizado.' });
    }
    res.status(400).send({ error: error.message || 'Ocorreu um erro ao criar o usuário.' });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});