// components/MapContainer.js
import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import useUserLocation from 'hooks/useUserLocation';

export default function MapContainer({ children, ...rest }) {
  const mapContainer = useRef(null);
  const location = useUserLocation();

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/style.json', 
      center: [
        Number(location?.longitude) || 0,
        Number(location?.latitude) || 0,
      ],
      zoom: 15,
    });

    return () => map.remove();
  }, [location]);

  return (
    <div ref={mapContainer} style={{ width: '100%', height: '500px' }}>
      {children}
    </div>
  );
}
