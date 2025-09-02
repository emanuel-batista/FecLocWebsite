// setAdmin.js

const admin = require('firebase-admin');

// =================== CONFIGURE AQUI ===================
// 1. Coloque o caminho para o arquivo da sua chave de serviço
const serviceAccount = require('./un1l0c-firebase-adminsdk-fbsvc-89e5fa6a45.json'); 
// (se você renomeou o arquivo, altere o nome aqui também)

// 2. Coloque o email do usuário que você quer tornar administrador
const userEmail = "admin.uniloc@uniloc.com.br";
// ======================================================

// Inicializa o Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

/**
 * Função principal para buscar um usuário por email e definir
 * a permissão (custom claim) de administrador para ele.
 */
async function setAdminClaim() {
  try {
    console.log(`Buscando usuário com o email: ${userEmail}...`);
    // Busca os dados do usuário no Firebase Authentication pelo email
    const user = await admin.auth().getUserByEmail(userEmail);

    // Adiciona a permissão personalizada { admin: true } ao usuário
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });

    console.log(`✅ Sucesso! A permissão de admin foi concedida para ${userEmail}.`);
    console.log("Lembrete: O usuário precisa fazer logout e login novamente para que a mudança tenha efeito.");
    
  } catch (error) {
    console.error("❌ Erro ao definir a permissão de admin:");
    if (error.code === 'auth/user-not-found') {
      console.error(`   Nenhum usuário encontrado com o email "${userEmail}".`);
    } else {
      console.error(`   ${error.message}`);
    }
  }
}

setAdminClaim();