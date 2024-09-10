import React, { useRef, useState } from "react";
import ModalContainer from "containers/modal/modal";
import { DialogProps } from "@mui/material";
import { useTranslation } from "react-i18next";
import cls from "./addressModal.module.scss";
import Search2LineIcon from "remixicon-react/Search2LineIcon";
import DarkButton from "components/button/darkButton";
import BranchMap from "components/branchMap/branchMap";
import ArrowLeftLineIcon from "remixicon-react/ArrowLeftLineIcon";
import CompassDiscoverLineIcon from "remixicon-react/CompassDiscoverLineIcon";
import { getAddressFromLocation } from "utils/getAddressFromLocation";
import { Location, OrderFormValues, IShop } from "interfaces";
import { FormikProps } from "formik";
import { useQuery } from "react-query";
import shopService from "services/shop";

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
  const [location, setLocation] = useState<Location>({
    latitude: latlng.latitude.toString(),
    longitude: latlng.longitude.toString(),
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const { isSuccess } = useQuery(["shopZone", location], () =>
    shopService.checkZone({
      address: { latitude: parseFloat(location.latitude), longitude: parseFloat(location.longitude) },
    })
  );

  function submitAddress() {
    formik?.setFieldValue("address.address", inputRef.current?.value);
    formik?.setFieldValue("location", {
      latitude: location.latitude,
      longitude: location.longitude,
    });
    if (rest.onClose) rest.onClose({}, "backdropClick");
  }

  function defineAddress() {
    window.navigator.geolocation.getCurrentPosition(
      defineLocation,
      console.log
    );
  }

  async function defineLocation(position: GeolocationPosition) {
    const { coords } = position;
    const addr = await getAddressFromLocation(coords.latitude, coords.longitude);
    if (inputRef.current?.value) inputRef.current.value = addr;
    const locationObj = {
      latitude: coords.latitude.toString(),
      longitude: coords.longitude.toString(),
    };
    setLocation(locationObj);
  }

  const shopData: IShop = {
  id: 1,
  translation: {
    title: "Shop Title",
    locale: "en", 
    description: "Description of the shop"
  },
  price: 0,
  open: true,
  location: location,
};


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
                placeholder={t("search")}
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
          <BranchMap
            data={[shopData]}
            isLoading={!isSuccess}
            handleSubmit={(id) => console.log(id)}
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
