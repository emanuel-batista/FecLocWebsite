// api/toggle-user-status.js
import admin from 'firebase-admin';

// Helper para inicializar o Firebase Admin
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
  // --- INÍCIO DA CORREÇÃO DE CORS ---
  // Define os headers de permissão para todas as respostas
  response.setHeader('Access-Control-Allow-Origin', '*'); // Em produção, restrinja a 'https://uniloc.vercel.app'
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  // Responde imediatamente à requisição de preparação (preflight)
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }
  // --- FIM DA CORREÇÃO DE CORS ---

  // Apenas admins podem executar esta função
  const idToken = request.headers.authorization?.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    if (decodedToken.admin !== true) {
      return response.status(403).json({ error: 'Unauthorized' });
    }
  } catch (error) {
    return response.status(401).json({ error: 'Invalid token' });
  }

  // Lógica principal
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const { uid, disabled } = request.body;
  if (!uid || typeof disabled !== 'boolean') {
    return response.status(400).json({ error: 'UID and disabled status are required' });
  }

  try {
    await admin.auth().updateUser(uid, { disabled: disabled });
    return response.status(200).json({ message: `User status updated successfully.` });
  } catch (error) {
    console.error('Error updating user status:', error);
    return response.status(500).json({ error: error.message });
  }
}