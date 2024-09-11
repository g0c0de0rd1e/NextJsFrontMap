import React, { useRef, useState } from "react";
import ModalContainer from "containers/modal/modal";
import { DialogProps } from "@mui/material";
import { useTranslation } from "react-i18next";
import Search2LineIcon from "remixicon-react/Search2LineIcon";
import DarkButton from "components/button/darkButton";
import Map from "components/map/map";
import ArrowLeftLineIcon from "remixicon-react/ArrowLeftLineIcon";
import CompassDiscoverLineIcon from "remixicon-react/CompassDiscoverLineIcon";
import { getAddressFromLocation } from "utils/getAddressFromLocation";
import { Location, OrderFormValues } from "interfaces";
import { FormikProps } from "formik";
import { useQuery } from "react-query";
import shopService from "services/shop";
import cls from "./addressModal.module.scss";

interface Props extends DialogProps {
  address: string;
  latlng: Location;
  formik?: FormikProps<OrderFormValues>;
}

export default function DeliveryAddressModal({
  address,
  latlng,
  formik,
  ...rest
}: Props) {
  const { t } = useTranslation();
  const [location, setLocation] = useState({
    lat: Number(latlng.latitude),
    lng: Number(latlng.longitude),
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const { isSuccess } = useQuery(["shopZone", location], () =>
    shopService.checkZone({
      address: { latitude: location.lat, longitude: location.lng },
    })
  );

  function submitAddress() {
    formik?.setFieldValue("address.address", inputRef.current?.value);
    formik?.setFieldValue("location", {
      latitude: location.lat,
      longitude: location.lng,
    });
    if (rest.onClose) rest.onClose({}, "backdropClick");
  }

  function defineAddress() {
    window.navigator.geolocation.getCurrentPosition(
      defineLocation,
      console.log
    );
  }

  async function defineLocation(position: any) {
    const { coords } = position;
    const addr = await getAddressFromLocation(coords.latitude, coords.longitude);
    if (inputRef.current) inputRef.current.value = addr;
    const locationObj = {
      lat: coords.latitude,
      lng: coords.longitude,
    };
    setLocation(locationObj);
  }

  return (
    <ModalContainer {...rest}>
      <div className={cls.wrapper}>
        <div className={cls.header}>
          <h1 className={cls.title}>{t("enter.delivery.address")}</h1>
          <div className={cls.flex}>
            <div className={cls.search}>
              <label htmlFor="search">
                <Search2LineIcon />
              </label>
              <input
                type="text"
                id="search"
                name="search"
                ref={inputRef}
                placeholder={t("search")!} // Добавлен оператор non-null assertion
                autoComplete="off"
                defaultValue={address}
              />
            </div>
            <div className={cls.btnWrapper}>
              <DarkButton onClick={defineAddress}>
                <CompassDiscoverLineIcon />
              </DarkButton>
            </div>
          </div>
        </div>
        <div className={cls.body}>
          <Map
            location={location}
            setLocation={setLocation}
            inputRef={inputRef}
          />
        </div>
        <div className={cls.form}>
          <DarkButton
            type="button"
            onClick={submitAddress}
            disabled={!isSuccess}
          >
            {isSuccess ? t("submit") : t("delivery.zone.not.available")}
          </DarkButton>
        </div>
        <div className={cls.footer}>
          <button
            className={cls.circleBtn}
            onClick={(event) => {
              if (rest.onClose) rest.onClose(event, "backdropClick");
            }}
          >
            <ArrowLeftLineIcon />
          </button>
        </div>
      </div>
    </ModalContainer>
  );
}
