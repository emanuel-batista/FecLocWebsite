// src/webApp/Escanear/index.js

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { Container, Typography, Box, Paper, Alert, CircularProgress } from '@mui/material';
import styles from './Escanear.module.css';

function Escanear() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Começa true para mostrar o spinner
  const navigate = useNavigate();
  const qrScannerRef = useRef(null);

  useEffect(() => {
    const scannerElementId = "qr-reader";

    // Garante que a instância do scanner não seja criada várias vezes
    if (!qrScannerRef.current) {
        qrScannerRef.current = new Html5Qrcode(scannerElementId);
    }
    const html5QrCode = qrScannerRef.current;

    const startScanner = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        
        if (devices && devices.length) {
          let cameraId = devices[0].id;
          const rearCamera = devices.find(device => device.label.toLowerCase().includes('back'));
          if (rearCamera) {
            cameraId = rearCamera.id;
          } else {
            cameraId = devices[devices.length - 1].id;
          }

          // Para de mostrar o spinner e inicia a câmara
          setLoading(false);

          html5QrCode.start(
            cameraId,
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (decodedText, decodedResult) => {
              if (html5QrCode.isScanning) {
                html5QrCode.stop();
                try {
                  const url = new URL(decodedText);
                  navigate(url.pathname);
                } catch (err) {
                  setError('QR Code inválido.');
                }
              }
            },
            (errorMessage) => { /* ignora erros de "not found" */ }
          ).catch(err => {
            setError('Não foi possível iniciar a câmara. Verifique as permissões.');
          });
        } else {
          setError("Nenhuma câmara encontrada.");
          setLoading(false);
        }
      } catch (err) {
        setError("Erro ao obter permissão da câmara.");
        setLoading(false);
      }
    };

    startScanner();

    // Função de limpeza para parar a câmara
    return () => {
      if (qrScannerRef.current && qrScannerRef.current.isScanning) {
        qrScannerRef.current.stop().catch(err => {
          console.error("Erro ao parar o scanner:", err);
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

        {/* --- CORREÇÃO APLICADA AQUI --- */}
        {/* Este Box agora SEMPRE existe. O spinner aparece DENTRO dele. */}
        <Box id="qr-reader" className={styles.videoWrapper}>
            {loading && <CircularProgress />}
        </Box>

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