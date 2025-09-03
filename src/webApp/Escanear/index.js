// src/webApp/Escanear/index.js

import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { Container, Typography, Box, Paper, Alert, Button, CircularProgress } from '@mui/material';
import styles from './Escanear.module.css';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SwitchCameraIcon from '@mui/icons-material/SwitchCamera';

function Escanear() {
  const [error, setError] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const navigate = useNavigate();
  
  // States para gerir o scanner
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [activeCameraIndex, setActiveCameraIndex] = useState(0);

  const scannerRef = useRef(null);

  // Função que inicia o processo de escaneamento
  const handleStartScanner = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const scannerElementId = "qr-reader";
    
    // Cria a instância do scanner se ainda não existir
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode(scannerElementId, false);
    }
    const html5QrCode = scannerRef.current;

    // Para qualquer scanner que já esteja a funcionar
    if (html5QrCode && html5QrCode.isScanning) {
      await html5QrCode.stop();
    }

    try {
      // Pede a lista de câmaras (isto também pede a permissão)
      if (cameras.length === 0) {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length) {
          setCameras(devices);
          // Tenta pré-selecionar a câmara traseira
          const rearCameraIndex = devices.findIndex(d => d.label.toLowerCase().includes('back'));
          setActiveCameraIndex(rearCameraIndex !== -1 ? rearCameraIndex : 0);
        } else {
          setError("Nenhuma câmara encontrada.");
          setIsLoading(false);
          return;
        }
      }

      // Inicia a câmara selecionada
      const cameraId = cameras[activeCameraIndex]?.id;
      if (cameraId) {
        html5QrCode.start(
          cameraId,
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            // Sucesso na leitura
            if (!scanResult) { // Evita múltiplos redirecionamentos
              setScanResult(decodedText);
              html5QrCode.stop();
              try {
                const url = new URL(decodedText);
                navigate(url.pathname);
              } catch (err) {
                setError('QR Code inválido.');
              }
            }
          },
          (errorMessage) => { /* ignora erros */ }
        ).then(() => {
          setIsScannerActive(true);
        });
      }
    } catch (err) {
      setError("Permissão da câmara negada. Por favor, autorize o acesso nas configurações do seu navegador.");
    } finally {
      setIsLoading(false);
    }
  }, [cameras, activeCameraIndex, scanResult, navigate]);

  const handleCameraSwitch = () => {
    if (cameras.length > 1) {
      const nextIndex = (activeCameraIndex + 1) % cameras.length;
      setActiveCameraIndex(nextIndex);
    }
  };

  return (
    <Container maxWidth="sm" className={styles.escanearContainer}>
      <Paper className={styles.scannerBox}>
        <Typography variant="h4" component="h1" gutterBottom>
          Escanear QR Code
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Clique no botão abaixo para abrir a sua câmara e aponte para o QR Code.
        </Typography>

        {/* O div para o vídeo agora fica dentro de um contêiner que pode ser escondido */}
        <Box className={styles.videoContainer} sx={{ display: isScannerActive ? 'block' : 'none' }}>
          <Box id="qr-reader" className={styles.videoWrapper} />
        </Box>

        {/* Mensagem inicial para guiar o utilizador */}
        {!isScannerActive && !isLoading && (
          <Box className={styles.placeholder}>
            <CameraAltIcon sx={{ fontSize: 60, color: '#ccc' }} />
            <Typography color="text.secondary">A sua câmara aparecerá aqui</Typography>
          </Box>
        )}
        
        {/* Mostra o spinner apenas quando está a carregar */}
        {isLoading && <CircularProgress sx={{ my: 4 }} />}

        {/* Botão de controlo principal */}
        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={handleStartScanner}
            disabled={isLoading}
            startIcon={<CameraAltIcon />}
          >
            {isScannerActive ? "Reiniciar Câmara" : "Abrir Câmara"}
          </Button>

          {isScannerActive && cameras.length > 1 && (
            <Button
              variant="outlined"
              onClick={handleCameraSwitch}
              startIcon={<SwitchCameraIcon />}
            >
              Trocar
            </Button>
          )}
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