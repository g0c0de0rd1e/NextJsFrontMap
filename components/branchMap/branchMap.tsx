/* eslint-disable @next/next/no-img-element */
import React, { useMemo } from "react";
import cls from "./branchMap.module.scss";
import { IShop } from "interfaces";
import { Skeleton, Tooltip } from "@mui/material";
import dynamic from 'next/dynamic';

const MapContainer = dynamic(() => import('containers/map/mapContainer'), { ssr: false });

type MarkerProps = {
  data: IShop;
  lat: number;
  lng: number;
  index: number;
  handleSubmit: (id: string) => void;
};

const Marker = ({ data, index, handleSubmit }: MarkerProps) => {
  return (
    <div className={cls.marker}>
      <Tooltip title={data.translation?.title} arrow>
        <button
          className={cls.mark}
          onClick={() => handleSubmit(String(data.id))}
        >
          {index}
        </button>
      </Tooltip>
    </div>
  );
};

type Props = {
  data?: IShop[];
  isLoading?: boolean;
  handleSubmit: (id: string) => void;
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

  return (
    <div className={cls.wrapper}>
      {!isLoading ? (
        <MapContainer>
          {markers.map((item, idx) => (
            <Marker
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