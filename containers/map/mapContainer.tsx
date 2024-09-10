import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import useUserLocation from "hooks/useUserLocation";
import L from "leaflet";

// Fix for default marker icon issue
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

type Props = {
  children?: React.ReactNode;
  center: { lat: number; lng: number };
  zoom?: number;
};

export default function CustomMapContainer({ children, center, zoom = 15 }: Props) {
  const location = useUserLocation();
  return (
    <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
      <Marker position={[Number(location?.latitude) || 0, Number(location?.longitude) || 0]} />
    </MapContainer>
  );
}
