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

app.post('/api/signup', async (req, res) => {
  try {
    const { email, password, username, fullName, phone } = req.body;

    if (!email || !password || !username || !fullName) {
        return res.status(400).send({ error: "Campos obrigatórios em falta." });
    }

    // 1. Cria o usuário no Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: username,
    });

    // --- Prepara o objeto de dados do usuário ---
    const userData = {
        username: username,
        fullName: fullName,
        phone: phone,
        email: email,
        role: 'user',
    };

    // 2. Salva os dados no Realtime Database
    const rtdb = admin.database();
    const rtdbPromise = rtdb.ref('users/' + userRecord.uid).set(userData);

    // 3. Salva os mesmos dados no Firestore
    const firestore = admin.firestore();
    const firestorePromise = firestore.collection('users').doc(userRecord.uid).set(userData);

    // 4. Espera que ambas as operações de escrita terminem
    await Promise.all([rtdbPromise, firestorePromise]);

    res.status(201).send({ message: 'Usuário criado com sucesso em ambos os bancos de dados!', uid: userRecord.uid });
  } catch (error) {
    console.error("Erro no cadastro:", error);
    if (error.code === 'auth/email-already-exists') {
        return res.status(400).send({ error: 'Este email já está a ser utilizado.' });
    }
    res.status(400).send({ error: 'Ocorreu um erro ao criar o usuário.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});