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
  // ====================== CÓDIGO DE DEBUG ======================
  // Vamos registrar o método e os headers da requisição que chega
  console.log('--- NOVA REQUISIÇÃO RECEBIDA ---');
  console.log('Método HTTP:', request.method);
  console.log('Headers:', JSON.stringify(request.headers, null, 2));
  // =============================================================

  // Proteger o Endpoint com uma chave secreta
  const providedSecret = request.headers.authorization?.split(' ')[1];
  if (request.method !== 'POST' || providedSecret !== process.env.ADMIN_SECRET_KEY) {
    return response.status(401).json({ error: 'Unauthorized' });
  }

  // Pegar o email do corpo da requisição
  const { email } = request.body;
  if (!email) {
    return response.status(400).json({ error: 'Email is required' });
  }

  try {
    // Encontrar o usuário e definir a permissão de admin
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });

    return response.status(200).json({ message: `Success! Admin claim set for ${email}` });
    
  } catch (error) {
    console.error('Error setting admin claim:', error);
    return response.status(500).json({ error: error.message });
  }
}