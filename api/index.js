// api/index.js

const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://un1l0c-default-rtdb.firebaseio.com"
  });
}

const app = express();

// --- CORREÇÃO DE CORS AQUI ---
// Configura o CORS para permitir pedidos apenas do seu domínio de frontend.
const corsOptions = {
  origin: 'https://uniloc.vercel.app'
};
app.use(cors(corsOptions));
// A linha acima substitui o app.use(cors()) simples.

app.use(express.json());


app.post('/api/signup', async (req, res) => {
  // A sua lógica de cadastro, que está correta, continua aqui...
  try {
    const { email, password, username, fullName, phone } = req.body;

    if (!email || !password || !username || !fullName) {
      return res.status(400).send({ error: "Campos obrigatórios em falta." });
    }

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

    const rtdb = admin.database();
    const firestore = admin.firestore();

    const rtdbPromise = rtdb.ref('users/' + userRecord.uid).set(userData);
    const firestorePromise = firestore.collection('users').doc(userRecord.uid).set(userData);

    await Promise.all([rtdbPromise, firestorePromise]);

    res.status(201).send({ message: 'Usuário criado com sucesso!', uid: userRecord.uid });
  } catch (error) {
    console.error("Erro no cadastro:", error);
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).send({ error: 'Este email já está a ser utilizado.' });
    }
    res.status(400).send({ error: 'Ocorreu um erro ao criar o usuário.' });
  }
});

// Rota de diagnóstico
app.get('/api', (req, res) => {
  res.status(200).send('A API está a funcionar!');
});

module.exports = app;