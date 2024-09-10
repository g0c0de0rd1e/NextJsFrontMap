import React, { useMemo } from "react";
import cls from "./firstDeliveryTime.module.scss";
import { useBranch } from "contexts/branch/branch.context";
import { useMediaQuery } from "@mui/material";
import dynamic from "next/dynamic";
import useModal from "hooks/useModal";
import getFirstValidDate from "utils/getFirstValidDate";
import dayjs from "dayjs";
import DeliveryTimes from "components/deliveryTimes/deliveryTimes";
import { useAppDispatch } from "hooks/useRedux";
import { setDeliveryDate } from "redux/slices/order";
import useWindowFocus from "hooks/useWindowFocus";
import { DeliveryIcon } from "components/icons";
import useLocale from "hooks/useLocale";

const ModalContainer = dynamic(() => import("containers/modal/modal"));
const MobileDrawer = dynamic(() => import("containers/drawer/mobileDrawer"));

type Props = {};

export default function FirstDeliveryTime({}: Props) {
  const { t } = useLocale();
  const { branch } = useBranch();
  const isDesktop = useMediaQuery("(min-width:1140px)");
  const [modal, handleOpen, handleClose] = useModal();
  const dispatch = useAppDispatch();
  const windowTriggered = useWindowFocus();

  const { firstValidDate, isToday, day } = useMemo(() => {
    const firstValidDate = branch ? getFirstValidDate(branch) : undefined;
    const isToday = dayjs(firstValidDate?.date).isSame(
      dayjs().format("YYYY-MM-DD")
    );
    const day = dayjs(`${firstValidDate?.date} ${firstValidDate?.time}`).format(
      "ddd"
    );

    return {
      firstValidDate,
      isToday,
      day,
    };
  }, [branch, windowTriggered]);

  const handleChangeDeliverySchedule = ({
    date,
    time,
  }: {
    date: string;
    time: string;
  }) => {
    dispatch(
      setDeliveryDate({
        delivery_time: time,
        delivery_date: date,
        shop_id: branch?.id,
      })
    );
  };

  return (
    <div>
      {!!branch?.id && (
        <button className={cls.wrapper} onClick={handleOpen}>
          <DeliveryIcon />
          <div className={cls.text}>
            {t("delivery.by")}{" "}
            {isToday ? firstValidDate?.time : `${day} ${firstValidDate?.time}`}
          </div>
        </button>
      )}

      {isDesktop ? (
        <ModalContainer open={modal} onClose={handleClose}>
          {modal && (
            <DeliveryTimes
              data={branch}
              handleClose={handleClose}
              handleChangeDeliverySchedule={handleChangeDeliverySchedule}
            />
          )}
        </ModalContainer>
      ) : (
        <MobileDrawer open={modal} onClose={handleClose}>
          {modal && (
            <DeliveryTimes
              data={branch}
              handleClose={handleClose}
              handleChangeDeliverySchedule={handleChangeDeliverySchedule}
            />
          )}
        </MobileDrawer>
      )}
    </div>
  );
}
