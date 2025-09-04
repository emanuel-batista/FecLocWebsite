const {onRequest} = require("firebase-functions/v2/https");
const {onDocumentUpdated} = require("firebase-functions/v2/firestore");
const {logger} = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.listUsers = onRequest({cors: true}, async (req, res) => {
  if (!req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")) {
    logger.error("Nenhum token fornecido!");
    res.status(403).send("Unauthorized");
    return;
  }

  const idToken = req.headers.authorization.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    if (decodedToken.admin !== true) {
      res.status(403)
          .send("Unauthorized: Acesso restrito a administradores.");
      return;
    }

    const usersResult = await admin.auth().listUsers(100);

    const users = usersResult.users.map((userRecord) => {
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
    logger.error("Erro ao listar utilizadores:", error);
    res.status(500).send("Internal Server Error");
  }
});

exports.verificarVencedorConcurso = onDocumentUpdated("users/{userId}",
    async (event) => {
      const dadosNovos = event.data.after.data();
      const dadosAntigos = event.data.before.data();

      if (dadosNovos.ptsTotais <= dadosAntigos.ptsTotais) {
        return null;
      }

      const db = admin.firestore();
      const estadoConcursoRef = db.collection("concurso").doc("estado");
      const estadoConcursoSnap = await estadoConcursoRef.get();

      if (estadoConcursoSnap.exists() && estadoConcursoSnap.data().terminou) {
        return null;
      }

      const cursosSnapshot = await db.collection("cursos").get();
      let totalPerguntas = 0;
      for (const cursoDoc of cursosSnapshot.docs) {
        const perguntasSnapshot = await db.collection("cursos")
            .doc(cursoDoc.id).collection("perguntas").get();
        totalPerguntas += perguntasSnapshot.size;
      }
      const pontuacaoMaxima = totalPerguntas * 10;

      logger.info(
          `Utilizador: ${dadosNovos.ptsTotais}, Máximo: ${pontuacaoMaxima}`,
      );

      if (pontuacaoMaxima > 0 && dadosNovos.ptsTotais >= pontuacaoMaxima) {
        logger.info(
            `VENCEDOR: ${dadosNovos.fullName} (${dadosNovos.ptsTotais})`,
        );
        await estadoConcursoRef.set({
          terminou: true,
          vencedorNome: dadosNovos.fullName,
          vencedorPontos: dadosNovos.ptsTotais,
          terminouEm: new Date(),
        });
      }

      return null;
    });

