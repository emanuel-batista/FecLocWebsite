import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '400px'
};

const center = {
  lat: -23.55052,
  lng: -46.633308
};

function MapComponent() {
  const [map, setMap] = useState(null);
  const [loadError, setLoadError] = useState(false);

  const { isLoaded, loadError: apiLoadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'] // Adicione bibliotecas necessárias
  });

  useEffect(() => {
    if (apiLoadError) {
      console.error('Erro ao carregar Google Maps API:', apiLoadError);
      setLoadError(true);
    }
  }, [apiLoadError]);

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  if (loadError) {
    return (
      <div style={{ 
        width: '400px', 
        height: '400px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        border: '1px solid #ccc'
      }}>
        <p>Erro ao carregar o mapa. Verifique a configuração da API Key.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div style={{ 
        width: '400px', 
        height: '400px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f0f0f0'
      }}>
        <p>Carregando mapa...</p>
      </div>
    );
  }

  return (
    <div style={{ width: '400px', height: '400px' }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
          zoomControl: true,
          styles: [
            {
              "featureType": "all",
              "stylers": [{ "saturation": 0 }, { "hue": "#e7ecf0" }]
            }
          ]
        }}
      >
        <Marker
          position={center}
          title="Estamos aqui!"
          icon={{
            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
            scaledSize: new window.google.maps.Size(40, 40)
          }}
        />
      </GoogleMap>
    </div>
  );
}

export default React.memo(MapComponent);