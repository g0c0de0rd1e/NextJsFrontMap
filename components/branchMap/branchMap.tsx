"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import cls from "./branchMap.module.scss";
import { IShop } from "interfaces";
import { Skeleton, Tooltip } from "@mui/material";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(() => import("react-leaflet/MapContainer"), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet/TileLayer"), { ssr: false });
const Marker = dynamic(() => import("react-leaflet/Marker"), { ssr: false });
const Popup = dynamic(() => import("react-leaflet/Popup"), { ssr: false });

type MarkerProps = {
  data: IShop;
  lat: number;
  lng: number;
  index: number;
  handleSubmit: (id: string) => void;
};

const CustomMarker = ({ data, index, handleSubmit }: MarkerProps) => {
  return (
    <Marker position={[Number(data.location?.latitude) || 0, Number(data.location?.longitude) || 0]}>
      <Popup>
        <Tooltip title={data.translation?.title} arrow>
          <button
            className={cls.mark}
            onClick={() => handleSubmit(data.id.toString())}
          >
            {index}
          </button>
        </Tooltip>
      </Popup>
    </Marker>
  );
};

type Props = {
  data?: IShop[];
  isLoading?: boolean;
  handleSubmit: (id: string) => void;
};

const SetViewOnClick = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

export default function BranchMap({
  data = [],
  isLoading,
  handleSubmit,
}: Props) {
  const markers = useMemo(
    () =>
      data.map((item) => ({
        lat: Number(item.location?.latitude) || 0,
        lng: Number(item.location?.longitude) || 0,
        data: item,
      })),
    [data]
  );

  const center: [number, number] = markers.length > 0 ? [markers[0].lat, markers[0].lng] : [0, 0];
  const zoom = 13;

  // Ensure we only render the map component on the client side
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <div className={cls.wrapper}>
      {!isLoading ? (
        <MapContainer
          className={cls.mapContainer}
          style={{ height: "100%", width: "100%" }}
        >
          <SetViewOnClick center={center} zoom={zoom} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markers.map((item, idx) => (
            <CustomMarker
              key={idx}
              lat={item.lat}
              lng={item.lng}
              data={item.data}
              index={idx + 1}
              handleSubmit={handleSubmit}
            />
          ))}
        </MapContainer>
      ) : (
        <Skeleton variant="rectangular" className={cls.shimmer} />
      )}
    </div>
  );
}
