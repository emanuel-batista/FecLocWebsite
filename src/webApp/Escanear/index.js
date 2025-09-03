// src/webApp/Escanear/index.js

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode'; // Importa o "motor" principal
import { Container, Typography, Box, Paper, Alert, CircularProgress } from '@mui/material';
import styles from './Escanear.module.css';

function Escanear() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Usamos uma ref para guardar a instância do scanner e evitar recriações
  const qrScannerRef = useRef(null);
  
  // Este useEffect executa apenas uma vez para configurar e iniciar a câmara
  useEffect(() => {
    const scannerElementId = "qr-reader";
    
    // Cria uma única instância do scanner
    const html5QrCode = new Html5Qrcode(scannerElementId);
    qrScannerRef.current = html5QrCode;

    const startScanner = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        setLoading(false);

        if (devices && devices.length) {
          let cameraId = devices[0].id; // Usa a primeira câmara como fallback
          
          // Lógica para encontrar a câmara traseira ("environment")
          const rearCamera = devices.find(device => device.label.toLowerCase().includes('back') || device.label.toLowerCase().includes('rear') || device.facing === 'environment');
          if (rearCamera) {
            cameraId = rearCamera.id;
            console.log("Câmara traseira encontrada:", rearCamera.label);
          } else {
             // Se não encontrar uma com "back", a última da lista costuma ser a principal em Android
             cameraId = devices[devices.length - 1].id;
             console.log("Câmara traseira não encontrada explicitamente, usando a câmara padrão:", devices[devices.length-1].label);
          }

          html5QrCode.start(
            cameraId, // ID da câmara a ser usada
            {
              fps: 10,
              qrbox: { width: 250, height: 250 }
            },
            (decodedText, decodedResult) => {
              // Sucesso na leitura
              html5QrCode.stop(); // Para a câmara imediatamente
              
              try {
                const url = new URL(decodedText);
                navigate(url.pathname);
              } catch (err) {
                setError('QR Code inválido. Por favor, escaneie o código correto.');
              }
            },
            (errorMessage) => {
              // Erro durante a leitura (ignorado)
            }
          ).catch(err => {
            setError('Não foi possível iniciar a câmara. Verifique as permissões.');
            console.error("Erro ao iniciar o scanner:", err);
          });
        } else {
          setError("Nenhuma câmara encontrada neste dispositivo.");
        }
      } catch (err) {
        setLoading(false);
        setError("Erro ao obter permissão da câmara. Por favor, autorize o acesso.");
        console.error("Erro ao listar câmaras:", err);
      }
    };

    startScanner();

    // Função de limpeza para parar a câmara quando sair da página
    return () => {
      if (qrScannerRef.current) {
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

        {/* Este div continua a ser o local onde a câmara será renderizada */}
        {loading ? (
            <Box sx={{ my: 4 }}><CircularProgress /></Box>
        ) : (
            <Box id="qr-reader" className={styles.videoWrapper}></Box>
        )}

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