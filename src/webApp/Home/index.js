import React from 'react';
// --- CORREÇÃO AQUI ---
// Revertemos para o uso do 'Marker' para resolver o erro de compilação.
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '400px',
  height: '400px'
};

const center = {
  lat: -23.55052,
  lng: -46.633308
};

function MapComponent() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  });

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        // O mapId foi removido temporariamente, pois não é necessário para o <Marker> básico
      >
        {/* --- CORREÇÃO AQUI --- */}
        {/* Usamos o componente <Marker> original, que é compatível com a sua biblioteca */}
        <Marker
          position={center}
          title="Estamos aqui!"
        />
      </GoogleMap>
  ) : <p>A carregar o mapa...</p>
}

export default React.memo(MapComponent);

