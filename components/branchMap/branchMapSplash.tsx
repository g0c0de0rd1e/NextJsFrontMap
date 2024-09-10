"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import cls from "./branchMap.module.scss";
import { IShop } from "interfaces";
import { Skeleton } from "@mui/material";
import StoreCard from "components/storeCard/storeCard";
import PopoverContainer from "containers/popover/popover";
import { useRouter } from "next/router";
import useUserLocation from "hooks/useUserLocation";
import { useBranch } from "contexts/branch/branch.context";

const MapContainer = dynamic(() => import("react-leaflet/MapContainer"), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet/TileLayer"), { ssr: false });
const Marker = dynamic(() => import("react-leaflet/Marker"), { ssr: false });
const Popup = dynamic(() => import("react-leaflet/Popup"), { ssr: false });

type MarkerProps = {
  data: IShop;
  lat: number;
  lng: number;
  index: number;
  handleHover: (event: any, branch: IShop) => void; 
  handleHoverLeave: () => void;
};

const CustomMarker = ({
  data,
  index,
  handleHover,
  handleHoverLeave,
}: MarkerProps) => {
  const { push } = useRouter();
  const { updateBranch } = useBranch();

  const handleClick = () => {
    updateBranch(data);
    push("/");
  };

  return (
    <Marker
      position={[Number(data.location?.latitude) || 0, Number(data.location?.longitude) || 0]}
      eventHandlers={{
        mouseover: (event: any) => handleHover(event, data), 
        mouseout: handleHoverLeave,
        click: handleClick,
      }}
    >
      <Popup>
        <button id={`marker-${index}`} className={cls.mark}>
          {index}
        </button>
      </Popup>
    </Marker>
  );
};

type Props = {
  data?: IShop[];
  isLoading?: boolean;
};

const SetViewOnClick = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
};

export default function BranchMapSplash({ data = [], isLoading }: Props) {
  const [hoveredBranch, setHoveredBranch] = useState<IShop | undefined>(
    undefined
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const location = useUserLocation();

  const handleOpen = (event: any) => setAnchorEl(event?.currentTarget);
  const handleClose = () => setAnchorEl(null);

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
    <div className={`${cls.wrapper} ${cls.splash}`}>
      {!isLoading ? (
        <MapContainer
          className={cls.mapContainer}
          style={{ height: "100%", width: "100%" }}
          center={center}
          zoom={zoom}
        >
          <SetViewOnClick center={center} />
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
              handleHover={(event: any, branch: IShop) => { 
                setHoveredBranch(branch);
                handleOpen(event);
              }}
              handleHoverLeave={handleClose}
            />
          ))}
        </MapContainer>
      ) : (
        <Skeleton variant="rectangular" className={cls.shimmer} />
      )}

      <PopoverContainer
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        disableRestoreFocus={true}
        sx={{
          pointerEvents: "none",
        }}
      >
        <div className={cls.float}>
          {!!hoveredBranch && <StoreCard data={hoveredBranch} />}
        </div>
      </PopoverContainer>
    </div>
  );
}
