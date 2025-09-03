// src/webApp/Escanear/index.js

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { Container, Typography, Box, Paper, Alert, CircularProgress } from '@mui/material';
import styles from './Escanear.module.css';

function Escanear() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // Usamos uma ref para guardar a instância do scanner e evitar recriações
  const scannerRef = useRef(null);

  // Este useEffect agora tem um array de dependências vazio [].
  // Isso garante que ele só será executado UMA VEZ quando o componente montar
  // e a sua limpeza só ocorrerá quando o componente for desmontado.
  useEffect(() => {
    const scannerElementId = "qr-reader";

    // Só cria uma nova instância se ela ainda não existir
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode(scannerElementId, /* verbose= */ false);
    }
    const html5QrCode = scannerRef.current;

    const startScanner = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length) {
          let cameraId = devices[0].id;
          const rearCamera = devices.find(d => d.label.toLowerCase().includes('back'));
          if (rearCamera) {
            cameraId = rearCamera.id;
          } else {
            cameraId = devices[devices.length - 1].id;
          }

          html5QrCode.start(
            cameraId,
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (decodedText, decodedResult) => {
              // Sucesso na leitura
              if (html5QrCode && html5QrCode.isScanning) {
                html5QrCode.stop();
              }
              try {
                const url = new URL(decodedText);
                navigate(url.pathname);
              } catch (err) {
                setError('QR Code inválido. Por favor, escaneie o código correto.');
              }
            },
            (errorMessage) => { /* Ignora erros de "not found" */ }
          ).catch(err => {
            setError('Não foi possível iniciar a câmara. Verifique as permissões.');
          });
        } else {
          setError("Nenhuma câmara encontrada neste dispositivo.");
        }
      } catch (err) {
        setError("Erro ao obter permissão da câmara. Por favor, autorize o acesso.");
      }
    };

    startScanner();

    // Função de limpeza robusta
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(err => {
          console.error("Erro ao parar o scanner:", err);
        });
      }
    };
  }, [navigate]); // Manter navigate aqui é seguro e correto segundo a documentação do React

  return (
    <Container maxWidth="sm" className={styles.escanearContainer}>
      <Paper className={styles.scannerBox}>
        <Typography variant="h4" component="h1" gutterBottom>
          Escanear QR Code
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Aponte a sua câmara para o QR Code do stand para iniciar o quiz.
        </Typography>

        {/* Este div continua a ser o local onde a câmara será renderizada */}
        <Box id="qr-reader" className={styles.videoWrapper} />

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