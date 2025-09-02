// functions/index.js

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});

admin.initializeApp();

// Função para listar usuários
exports.listUsers = functions.https.onRequest(async (req, res) => {
  // Usamos o CORS para permitir que nosso app React chame esta função
  cors(req, res, async () => {
    // Validação de segurança: Verifica a requisição do usuário autenticado
    if (!req.headers.authorization ||
        !req.headers.authorization.startsWith("Bearer ")) {
      functions.logger.error("Nenhum token fornecido!");
      res.status(403).send("Unauthorized");
      return;
    }

    const idToken = req.headers.authorization.split("Bearer ")[1];

    try {
      // Verifica o token do usuário que fez a chamada
      const decodedToken = await admin.auth().verifyIdToken(idToken);

      // **CORREÇÃO IMPORTANTE**: Ativa a verificação de admin
      // Isso corrige o erro 'no-unused-vars' e torna a função segura
      if (decodedToken.admin !== true) {
        res.status(403)
            .send("Unauthorized: Acesso restrito a administradores.");
        return;
      }

      // Lista até 100 usuários
      const usersResult = await admin.auth().listUsers(100);

      const users = usersResult.users.map((userRecord) => {
        // Linha quebrada para corrigir 'max-len'
        const {uid, email, displayName, photoURL, disabled, metadata} =
          userRecord.toJSON();
        // Objeto retornado quebrado para corrigir 'max-len'
        return {
          uid, email, displayName, photoURL, disabled,
          creationTime: metadata.creationTime,
        };
      });

      res.status(200).json({users});
    } catch (error) {
      functions.logger.error("Erro ao listar usuários:", error);
      res.status(500).send("Internal Server Error");
    }
  });
});
