import React from "react";
import cls from "./cart.module.scss";
import CartProduct from "components/cartProduct/cartProduct";
import CartServices from "components/cartServices/cartServices";
import CartTotal from "components/cartTotal/cartTotal";
import { useAppSelector } from "hooks/useRedux";
import { selectCart, selectTotalPrice } from "redux/slices/cart";
import EmptyCart from "components/emptyCart/emptyCart";
import TopCartHeader from "components/topCartHeader/topCartHeader";

export default function Cart() {
  const cartItems = useAppSelector(selectCart);
  const totalPrice = useAppSelector(selectTotalPrice);

  return (
    <div className={cls.container}>
      <TopCartHeader />
      <div className={cls.wrapper}>
        <div className={cls.body}>
          <div
            className={cls.itemsWrapper}
            style={{
              display: cartItems.length ? "block" : "none",
            }}
          >
            {cartItems.map((item) => (
              <CartProduct key={item.stock.id} data={item} />
            ))}
          </div>
        </div>
        <div className={cls.details}>
          {cartItems.length < 1 ? (
            <div className={cls.empty}>
              <EmptyCart />
            </div>
          ) : (
            <div className={cls.float}>
              {cartItems.length > 0 && <CartServices />}
              {cartItems.length > 0 && <CartTotal totalPrice={totalPrice} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
