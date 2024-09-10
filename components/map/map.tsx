"use client";

import React, { MutableRefObject, useRef } from "react";
import dynamic from "next/dynamic";
import cls from "./map.module.scss";
import { getAddressFromLocation } from "utils/getAddressFromLocation";
import { IShop } from "interfaces";
import ShopLogoBackground from "components/shopLogoBackground/shopLogoBackground";
import { useRouter } from "next/router";

const MapContainer = dynamic(() => import("react-leaflet/MapContainer"), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet/TileLayer"), { ssr: false });
const Marker = dynamic(() => import("react-leaflet/Marker"), { ssr: false });
const Popup = dynamic(() => import("react-leaflet/Popup"), { ssr: false });

type Props = {
  location: {
    lat: number;
    lng: number;
  };
  setLocation?: (data: { lat: number; lng: number }) => void;
  readOnly?: boolean;
  shops?: IShop[];
  inputRef?: MutableRefObject<HTMLInputElement | null>;
  handleMarkerClick?: (data: IShop) => void;
};

const MapComponent = ({
  location,
  setLocation = () => {},
  readOnly = false,
  shops = [],
  inputRef,
  handleMarkerClick,
}: Props) => {
  const { push } = useRouter();

  function MapEvents() {
    const map = useMap();
    
    return (
      <div>
        {!readOnly && (
          <div className={cls.marker}>
            <img src="/images/marker.png" width={32} alt="Location" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cls.root}>
      <MapContainer center={location} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {!readOnly && <MapEvents />}
        {readOnly && <Marker position={[location.lat, location.lng]} />}
        {shops.map((item, idx) => (
          <Marker
            key={`marker-${idx}`}
            position={[Number(item.location?.latitude) || 0, Number(item.location?.longitude) || 0]}
            eventHandlers={{
              click: () => {
                if (handleMarkerClick) handleMarkerClick(item);
              },
            }}
          >
            <Popup>{item.translation?.title}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
