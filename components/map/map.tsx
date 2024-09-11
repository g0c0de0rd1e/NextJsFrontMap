/* eslint-disable @next/next/no-img-element */
import React, { MutableRefObject, useRef, useEffect } from "react";
import { getAddressFromLocation } from "utils/getAddressFromLocation";
import { IShop } from "interfaces";
import ShopLogoBackground from "components/shopLogoBackground/shopLogoBackground";
import cls from "./map.module.scss";
import maplibregl from 'maplibre-gl';
import dynamic from 'next/dynamic';

const MapContainer = dynamic(() => import('containers/map/mapContainer'), { ssr: false });

const Marker = (props: any) => (
  <img src="/images/marker.png" width={32} alt="Location" />
);
const ShopMarker = (props: any) => (
  <div onClick={props.onClick}>
    <ShopLogoBackground data={props.shop} size="small" />
  </div>
);

type Props = {
  location: { lat: number; lng: number };
  setLocation?: (data: any) => void;
  readOnly?: boolean;
  shops?: IShop[];
  inputRef?: MutableRefObject<HTMLInputElement | null>;
  handleMarkerClick?: (data: IShop) => void;
  useInternalApi?: boolean;
};

export default function Map({
  location,
  setLocation = () => {},
  readOnly = false,
  shops = [],
  inputRef,
  handleMarkerClick,
  useInternalApi = true,
}: Props) {
  const mapContainer = useRef(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (mapContainer.current && !mapRef.current) {
      mapRef.current = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json', 
        center: [location.lng, location.lat],
        zoom: 15,
      });

      mapRef.current.on('moveend', () => {
        if (!readOnly) {
          const center = mapRef.current?.getCenter();
          if (center) {
            const newLocation = { lat: center.lat, lng: center.lng };
            setLocation(newLocation);
            getAddressFromLocation(`${newLocation.lat},${newLocation.lng}`).then((address) => {
              if (inputRef?.current) inputRef.current.value = address;
            });
          }
        }
      });

      if (shops.length && useInternalApi) {
        const bounds = new maplibregl.LngLatBounds();
        shops.forEach((shop) => {
          const shopLocation = [shop.location?.longitude || 0, shop.location?.latitude || 0];
          bounds.extend(shopLocation);
        });
        bounds.extend([location.lng, location.lat]);
        mapRef.current.fitBounds(bounds);
      }
    }
  }, [location, shops, useInternalApi, readOnly, setLocation, inputRef]);

  return (
    <div className={cls.root}>
      {!readOnly && (
        <div className={cls.marker}>
          <img src="/images/marker.png" width={32} alt="Location" />
        </div>
      )}
      <div ref={mapContainer} style={{ width: '100%', height: '500px' }} />
      {readOnly && <Marker lat={location.lat} lng={location.lng} />}
      {shops.map((item, idx) => (
        <ShopMarker
          key={`marker-${idx}`}
          lat={item.location?.latitude || 0}
          lng={item.location?.longitude || 0}
          shop={item}
          onClick={() => {
            if (handleMarkerClick) handleMarkerClick(item);
          }}
        />
      ))}
    </div>
  );
}