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
  // --- PASSO 1: LIDAR COM O CORS PRIMEIRO ---
  // Define os headers de permissão para o navegador
  response.setHeader('Access-Control-Allow-Origin', '*'); // Para produção, troque '*' por 'https://uniloc.vercel.app'
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  // Se a requisição for a verificação 'OPTIONS' do navegador, responda OK e pare aqui.
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  // --- PASSO 2: A LÓGICA DA SUA API COMEÇA AQUI ---
  // Agora que o CORS foi resolvido, prossiga com a sua lógica normal.

  // Verificação de segurança: apenas POST é permitido
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  // Verificação de segurança: apenas admins podem executar
  try {
    const idToken = request.headers.authorization?.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    if (decodedToken.admin !== true) {
      return response.status(403).json({ error: 'Acesso não autorizado' });
    }
  } catch (error) {
    return response.status(401).json({ error: 'Token inválido ou expirado' });
  }

  // Lógica principal para desativar o usuário
  const { uid, disabled } = request.body;
  if (!uid || typeof disabled !== 'boolean') {
    return response.status(400).json({ error: 'UID e status "disabled" são obrigatórios' });
  }

  try {
    await admin.auth().updateUser(uid, { disabled: disabled });
    return response.status(200).json({ message: 'Status do usuário atualizado com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar status do usuário:', error);
    return response.status(500).json({ error: error.message });
  }
}