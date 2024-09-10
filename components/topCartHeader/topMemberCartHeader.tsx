import React from "react";
import cls from "./topCartHeader.module.scss";
import useLocale from "hooks/useLocale";
import CloseFillIcon from "remixicon-react/CloseFillIcon";
import DeleteBinLineIcon from "remixicon-react/DeleteBinLineIcon";
import {
  selectUserCartCount,
  selectUserCart,
  updateUserCart,
} from "redux/slices/userCart";
import { useAppDispatch, useAppSelector } from "hooks/useRedux";
import useModal from "hooks/useModal";
import { useMutation } from "react-query";
import cartService from "services/cart";
import ClearCartModal from "components/clearCartModal/clearCartModal";
import { useShop } from "contexts/shop/shop.context";

type Props = {};

export default function TopMemberCartHeader({}: Props) {
  const { t } = useLocale();
  const [openModal, handleOpen, handleClose] = useModal();
  const cartCount = useAppSelector(selectUserCartCount);
  const cart = useAppSelector(selectUserCart);
  const dispatch = useAppDispatch();
  const { member } = useShop();
  const myCart = cart.user_carts.find((item) => item.uuid === member?.uuid);

  const { mutate: deleteCart, isLoading } = useMutation({
    mutationFn: (data: any) => cartService.deleteGuestProducts(data),
    onSuccess: () => {
      let newCart = JSON.parse(JSON.stringify(cart));
      const cartIdx = cart.user_carts.findIndex(
        (item) => item.id === myCart?.id
      );
      newCart.user_carts[cartIdx].cartDetails = [];
      dispatch(updateUserCart(newCart));
      handleClose();
    },
  });

  function clearCartItems() {
    const ids = myCart?.cartDetails.map((item) => item.id);
    deleteCart({ ids });
  }

  return (
    <div className={cls.wrapper}>
      <div className={cls.naming}>
        <h1 className={cls.title}>{t("group.order")}</h1>
        <p className={cls.text}>
          {t("number.of.products", { count: cartCount.count })}
        </p>
      </div>
      <div className={cls.actions}>
        {!!cartCount.count && (
          <button className={cls.btn} onClick={handleOpen}>
            <DeleteBinLineIcon />
            <span className={cls.text}>{t("delete.all")}</span>
          </button>
        )}
        <button className={cls.iconBtn}>
          <CloseFillIcon />
        </button>
      </div>
      <ClearCartModal
        open={openModal}
        handleClose={handleClose}
        onSubmit={clearCartItems}
        loading={isLoading}
      />
    </div>
  );
}
