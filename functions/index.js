// functions/index.js

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});

admin.initializeApp();

// Função para listar utilizadores
exports.listUsers = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    // Linha quebrada para corrigir 'max-len'
    if (!req.headers.authorization ||
        !req.headers.authorization.startsWith("Bearer ")) {
      functions.logger.error("Nenhum token fornecido!");
      res.status(403).send("Unauthorized");
      return;
    }

    const idToken = req.headers.authorization.split("Bearer ")[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      if (decodedToken.admin !== true) {
        // Linha quebrada para corrigir 'max-len'
        res.status(403)
            .send("Unauthorized: Acesso restrito a administradores.");
        return;
      }

      const usersResult = await admin.auth().listUsers(100);

      const users = usersResult.users.map((userRecord) => {
        // Linha quebrada para corrigir 'max-len'
        const {uid, email, displayName, photoURL, disabled, metadata} =
          userRecord.toJSON();

        return {
          uid,
          email,
          fullName: displayName,
          photoURL,
          disabled,
          creationTime: metadata.creationTime,
        };
      });

      res.status(200).json({users});
    } catch (error) {
      functions.logger.error("Erro ao listar utilizadores:", error);
      res.status(500).send("Internal Server Error");
    }
  });
});
