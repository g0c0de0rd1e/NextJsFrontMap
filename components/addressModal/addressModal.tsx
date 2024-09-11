import React, { useRef, useState } from "react";
import { DialogProps } from "@mui/material";
import ModalContainer from "containers/modal/modal";
import DarkButton from "components/button/darkButton";
import Map from "components/map/map";
import ArrowLeftLineIcon from "remixicon-react/ArrowLeftLineIcon";
import EqualizerLineIcon from "remixicon-react/EqualizerLineIcon";
import FileListFillIcon from "remixicon-react/FileListFillIcon";
import CompassDiscoverLineIcon from "remixicon-react/CompassDiscoverLineIcon";
import Map2FillIcon from "remixicon-react/Map2FillIcon";
import { useSettings } from "contexts/settings/settings.context";
import { getAddressFromLocation } from "utils/getAddressFromLocation";
import shopService from "services/shop";
import { useQuery } from "react-query";
import PrimaryButton from "components/button/primaryButton";
import BranchCard from "components/branchCard/branchCard";
import { IShop } from "interfaces";
import { useBranch } from "contexts/branch/branch.context";
import useModal from "hooks/useModal";
import useClearCart from "hooks/useClearCart";
import ConfirmationModal from "components/confirmationModal/confirmationModal";
import useLocale from "hooks/useLocale";
import BranchListForm from "components/branchListForm/branchListForm";
import Loading from "components/loader/loading";
import cls from "./addressModal.module.scss";

const shopStatuses = ["near_you", "open_now", "24/7", "new"];

interface Props extends DialogProps {
  address?: string;
  latlng: string;
}

export default function AddressModal({ address, latlng, ...rest }: Props) {
  const { t, locale } = useLocale();
  const [tab, setTab] = useState(shopStatuses[0]);
  const [tempBranch, setTempBranch] = useState<IShop | undefined>(undefined);
  const [isMapView, setMapView] = useState(true);
  const { updateAddress, updateLocation } = useSettings();
  const { updateBranch } = useBranch();
  const [location, setLocation] = useState({
    lat: Number(latlng.split(",")[0]),
    lng: Number(latlng.split(",")[1]),
  });
  const inputRef = useRef<any>();
  const [openPrompt, handleOpenPrompt, handleClosePrompt] = useModal();
  const { isCartEmpty, clearCart } = useClearCart();

  const { data, isFetching } = useQuery(
    ["shops", location, tab, locale],
    () =>
      shopService.getAll({
        address: { latitude: location.lat, longitude: location.lng },
        always_open: tab === "24/7" ? 1 : undefined,
        open: tab === "open_now" ? 1 : undefined,
        order_by: tab === "new" ? "new" : undefined,
      }),
    {
      keepPreviousData: true,
    }
  );
  const shops = data?.data || [];

  const { data: branches, isLoading: isBranchListLoading } = useQuery(
    ["branches", locale],
    () => shopService.getAll({ page: 1, perPage: 100, open: 1 })
  );

  function submitAddress() {
    updateAddress(inputRef.current?.value);
    updateLocation(`${location.lat},${location.lng}`);
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
    let latlng: string = `${coords.latitude},${coords.longitude}`;
    const addr = await getAddressFromLocation(latlng);
    if (inputRef.current) inputRef.current.value = addr;
    const locationObj = {
      lat: coords.latitude,
      lng: coords.longitude,
    };
    setLocation(locationObj);
  }

  function selectBranch(data: IShop) {
    if (!isCartEmpty) {
      setTempBranch(data);
      handleOpenPrompt();
      return;
    }
    updateBranch(data);
    submitAddress();
  }

  const changeBranch = () => {
    clearCart();
    updateBranch(tempBranch);
    submitAddress();
    if (rest.onClose) rest.onClose({}, "backdropClick");
  };

  const handleSubmit = (selectedValue: string) => {
    if (!selectedValue) {
      return;
    }
    const selectedBranch = branches?.data.find(
      (item) => String(item.id) == selectedValue
    );
    setTempBranch(selectedBranch);
    if (!isCartEmpty) {
      handleOpenPrompt();
      return;
    }
    updateBranch(selectedBranch);
    if (rest.onClose) rest.onClose({}, "backdropClick");
  };

  return (
    <ModalContainer {...rest}>
      <div className={cls.wrapper}>
        <div className={cls.header}>
          <h1 className={cls.title}>{t("enter.delivery.address")}</h1>
          <div className={cls.flex}>
            <div className={cls.search}>
              <label htmlFor="search" onClick={defineAddress}>
                <CompassDiscoverLineIcon />
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
              <DarkButton onClick={submitAddress}>{t("submit")}</DarkButton>
            </div>
          </div>
          <div className={cls.actions}>
            <div className={cls.filters}>
              <div className={cls.filterIcon}>
                <EqualizerLineIcon />
              </div>
              <div className={cls.filterTabs}>
                {shopStatuses.map((item) => (
                  <button
                    key={item}
                    className={`${cls.tab} ${tab === item ? cls.active : ""}`}
                    onClick={() => setTab(item)}
                  >
                    {t(item)}
                  </button>
                ))}
              </div>
            </div>
            <div className={cls.action}>
              {isMapView ? (
                <PrimaryButton
                  icon={<FileListFillIcon />}
                  onClick={() => setMapView(false)}
                >
                  {t("view.in.list")}
                </PrimaryButton>
              ) : (
                <DarkButton
                  icon={<Map2FillIcon />}
                  onClick={() => setMapView(true)}
                >
                  {t("view.in.map")}
                </DarkButton>
              )}
            </div>
          </div>
        </div>
        {isMapView ? (
          <div className={cls.body}>
            <Map
              location={location}
              setLocation={setLocation}
              inputRef={inputRef}
              shops={shops}
              handleMarkerClick={selectBranch}
              useInternalApi={false}
            />
            {!!data && (
              <div className={cls.shopList}>
                {shops.map((item) => (
                  <BranchCard
                    key={item.id}
                    data={item}
                    handleClick={selectBranch}
                  />
                ))}
                {isFetching && <Loading />}
              </div>
            )}
          </div>
        ) : (
          <div className={cls.block}>
            <BranchListForm
              data={branches?.data}
              isLoading={isBranchListLoading}
              handleSubmit={handleSubmit}
            />
          </div>
        )}
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
        <ConfirmationModal
          open={openPrompt}
          handleClose={handleClosePrompt}
          onSubmit={changeBranch}
          title={t("branch.change.permission")}
        />
      </div>
    </ModalContainer>
  );
}
