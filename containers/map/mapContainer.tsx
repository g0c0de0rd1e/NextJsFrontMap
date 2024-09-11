import React, { useEffect, useRef, ReactNode } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import useUserLocation from 'hooks/useUserLocation';

interface MapContainerProps {
  children: ReactNode;
  [key: string]: any;
}

export default function MapContainer({ children, ...rest }: MapContainerProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const location = useUserLocation();

  useEffect(() => {
    console.log("User location:", location); 

    if (location && mapContainer.current) {
      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json', 
        center: [
          Number(location.longitude) || 0,
          Number(location.latitude) || 0,
        ],
        zoom: 15,
      });

      return () => map.remove();
    }
  }, [location]);

  return (
    <div ref={mapContainer} style={{ width: '100%', height: '500px' }}>
      {children}
    </div>
  );
}
