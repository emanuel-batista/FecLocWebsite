// src/webApp/Escanear/index.js

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { Container, Typography, Box, Paper, Alert, CircularProgress, Button } from '@mui/material';
import styles from './Escanear.module.css';
import SwitchCameraIcon from '@mui/icons-material/SwitchCamera'; // Ícone para o botão

function Escanear() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const scannerRef = useRef(null);

  // --- NOVOS STATES PARA GERIR AS CÂMARAS ---
  const [cameras, setCameras] = useState([]);
  const [activeCameraId, setActiveCameraId] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const onScanSuccess = useCallback((decodedText) => {
    // Para a câmara assim que um código é lido
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
          // Tenta encontrar a câmara traseira por defeito
          const rearCamera = devices.find(d => d.label.toLowerCase().includes('back'));
          setActiveCameraId(rearCamera ? rearCamera.id : devices[0].id);
        } else {
          setError("Nenhuma câmara encontrada.");
        }
      })
      .catch(err => {
        setError("Não foi possível aceder às câmaras. Verifique as permissões.");
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
      
      scannerRef.current.start(
        activeCameraId,
        { fps: 10, qrbox: { width: 250, height: 250 } },
        onScanSuccess,
        (errorMessage) => { /* ignora erros de "not found" */ }
      ).then(() => {
        setIsScanning(true);
      }).catch(err => {
        setError("Erro ao iniciar a câmara. Tente outra ou verifique as permissões.");
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

        {/* Div onde a câmara será renderizada */}
        <Box id="qr-reader" className={styles.videoWrapper}>
            {!isScanning && !error && <CircularProgress />}
        </Box>

        {/* Botão para trocar de câmara (só aparece se houver mais de uma) */}
        {cameras.length > 1 && (
          <Button
            variant="contained"
            startIcon={<SwitchCameraIcon />}
            onClick={handleCameraSwitch}
            sx={{ mt: 2 }}
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