// api/set-admin.js
import admin from 'firebase-admin';

// Helper para inicializar o app do Firebase Admin apenas uma vez
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON))
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

export default async function handler(request, response) {
  // 1. Proteger o Endpoint com uma chave secreta
  const providedSecret = request.headers.authorization?.split(' ')[1];
  if (request.method !== 'POST' || providedSecret !== process.env.ADMIN_SECRET_KEY) {
    return response.status(401).json({ error: 'Unauthorized' });
  }

  // 2. Pegar o email do corpo da requisição
  const { email } = request.body;
  if (!email) {
    return response.status(400).json({ error: 'Email is required' });
  }

  try {
    // 3. Encontrar o usuário e definir a permissão de admin
    console.log(`Buscando usuário: ${email}...`);
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });

    console.log(`Permissão de admin concedida para ${email}`);
    return response.status(200).json({ message: `Success! Admin claim set for ${email}` });

  } catch (error) {
    console.error('Error setting admin claim:', error);
    return response.status(500).json({ error: error.message });
  }
}