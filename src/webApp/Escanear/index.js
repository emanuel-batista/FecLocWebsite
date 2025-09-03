// src/webApp/Escanear/index.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Container, Typography, Box, Paper, Alert } from '@mui/material';
import styles from './Escanear.module.css';

function Escanear() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // A biblioteca vai renderizar o scanner dentro deste div
    const scannerElementId = "qr-reader";

    const html5QrcodeScanner = new Html5QrcodeScanner(
      scannerElementId,
      { 
        fps: 10, // Frames por segundo para escanear
        qrbox: { width: 250, height: 250 }, // Tamanho da caixa de scan
        supportedScanTypes: [0] // 0 para câmara, 1 para ficheiro
      },
      false // verbose
    );

    const onScanSuccess = (decodedText, decodedResult) => {
      // Para o scanner assim que um código é lido com sucesso
      html5QrcodeScanner.clear();
      
      console.log(`QR Code escaneado: ${decodedText}`);
      try {
        const url = new URL(decodedText);
        // Navega para o caminho detetado (ex: /quiz/responder/XYZ)
        navigate(url.pathname);
      } catch (err) {
        setError('QR Code inválido. Por favor, escaneie o código correto.');
      }
    };

    const onScanFailure = (errorMessage) => {
      // Ignora erros de "QR code not found" que acontecem a cada frame
    };

    html5QrcodeScanner.render(onScanSuccess, onScanFailure);

    // Função de limpeza para parar a câmara quando o componente for desmontado
    return () => {
      // Garante que o scanner e a câmara são desligados
      if (html5QrcodeScanner && html5QrcodeScanner.getState() === 2) { // 2 = SCANNING
        html5QrcodeScanner.clear().catch(err => {
          console.error("Falha ao limpar o scanner:", err);
        });
      }
    };
  }, [navigate]);

  return (
    <Container maxWidth="sm" className={styles.escanearContainer}>
      <Paper className={styles.scannerBox}>
        <Typography variant="h4" component="h1" gutterBottom>
          Escanear QR Code
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Aponte a sua câmara para o QR Code do stand para iniciar o quiz.
        </Typography>

        {/* Este div é onde a câmara será renderizada */}
        <Box id="qr-reader" className={styles.videoWrapper}></Box>

        {error && (
          <Alert severity="error" sx={{ mt: 3, width: '100%' }}>
            {error}
          </Alert>
        )}
      </Paper>
    </Container>
  );
}

export default Escanear;