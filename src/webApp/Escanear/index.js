// src/webApp/Escanear/index.js

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { Container, Typography, Box, Paper, Alert, CircularProgress, Button } from '@mui/material';
import styles from './Escanear.module.css';
import SwitchCameraIcon from '@mui/icons-material/SwitchCamera';

function Escanear() {
  const [error, setError] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [activeCameraId, setActiveCameraId] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Estado de carregamento
  const navigate = useNavigate();
  const scannerRef = useRef(null);

  // Função de sucesso ao escanear
  const onScanSuccess = useCallback((decodedText) => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.stop();
    }
    try {
      const url = new URL(decodedText);
      navigate(url.pathname);
    } catch (err) {
      setError('QR Code inválido. Por favor, escaneie o código correto.');
    }
  }, [navigate]);

  // Efeito principal para configurar o scanner
  useEffect(() => {
    scannerRef.current = new Html5Qrcode("qr-reader", false);
    
    Html5Qrcode.getCameras()
      .then(devices => {
        if (devices && devices.length) {
          setCameras(devices);
          const rearCamera = devices.find(d => d.label.toLowerCase().includes('back'));
          setActiveCameraId(rearCamera ? rearCamera.id : devices[0].id);
        } else {
          setError("Nenhuma câmara encontrada.");
          setIsLoading(false); // CORREÇÃO: Garante que o loading para
        }
      })
      .catch(err => {
        setError("Não foi possível aceder às câmaras. Verifique as permissões.");
        setIsLoading(false); // CORREÇÃO: Garante que o loading para
      });

    // Função de limpeza
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop();
      }
    };
  }, []);

  // Efeito para iniciar/parar o scanner quando a câmara ativa muda
  useEffect(() => {
    if (activeCameraId && scannerRef.current) {
      // Para o scanner atual antes de iniciar um novo
      if (scannerRef.current.isScanning) {
        scannerRef.current.stop();
      }
      
      setIsLoading(true); // Mostra o loading ao trocar de câmara
      scannerRef.current.start(
        activeCameraId,
        { fps: 10, qrbox: { width: 250, height: 250 } },
        onScanSuccess,
        (errorMessage) => { /* ignora erros */ }
      ).then(() => {
        setIsLoading(false); // Para o loading quando a câmara inicia
      }).catch(err => {
        setError("Erro ao iniciar a câmara. Tente outra ou verifique as permissões.");
        setIsLoading(false); // CORREÇÃO: Garante que o loading para
      });
    }
  }, [activeCameraId, onScanSuccess]);

  // Função para trocar de câmara
  const handleCameraSwitch = () => {
    if (cameras.length > 1) {
      const currentIndex = cameras.findIndex(c => c.id === activeCameraId);
      const nextIndex = (currentIndex + 1) % cameras.length;
      setActiveCameraId(cameras[nextIndex].id);
    }
  };

  return (
    <Container maxWidth="sm" className={styles.escanearContainer}>
      <Paper className={styles.scannerBox}>
        <Typography variant="h4" component="h1" gutterBottom>
          Escanear QR Code
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Aponte a sua câmara para o QR Code do stand para iniciar o quiz.
        </Typography>

        {/* O spinner agora é controlado pelo novo estado isLoading */}
        <Box id="qr-reader" className={styles.videoWrapper}>
            {isLoading && <CircularProgress />}
        </Box>

        {cameras.length > 1 && (
          <Button
            variant="contained"
            startIcon={<SwitchCameraIcon />}
            onClick={handleCameraSwitch}
            sx={{ mt: 2 }}
            disabled={isLoading}
          >
            Trocar Câmara
          </Button>
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