import React from "react";
import { IShop, UserCart } from "interfaces";
import cls from "./checkoutProducts.module.scss";
import AddCircleLineIcon from "remixicon-react/AddCircleLineIcon";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "hooks/useRedux";
import { selectUserCart } from "redux/slices/userCart";
import Loading from "components/loader/loading";
import CheckoutProductItem from "components/checkoutProductItem/checkoutProductItem";
import { useRouter } from "next/router";

type Props = {
  data: IShop;
  loading?: boolean;
};

export default function CheckoutProducts({ data, loading = false }: Props) {
  const { t } = useTranslation();
  const { push } = useRouter();
  const cart = useAppSelector(selectUserCart);

  const goToCart = () => {
    push("/");
  };

  return (
    <div className={cls.wrapper}>
      <div className={cls.main}>
        <div className={cls.header}>
          <h3 className={cls.title}>{t("your.orders")}</h3>
          <button type="button" className={cls.cartBtn} onClick={goToCart}>
            <AddCircleLineIcon />
            <span className={cls.text}>{t("add.to.bag")}</span>
          </button>
        </div>
        <div className={cls.body}>
          {cart.user_carts.map((item: UserCart) => (
            <React.Fragment key={"user" + item.id}>
              <div className={cls.userCard}>
                {cart.user_carts.length > 1 && (
                  <h3 className={cls.title}>
                    {item.user_id === cart.owner_id
                      ? t("your.orders")
                      : item.name}
                  </h3>
                )}
                {item.cartDetails.map((el) => (
                  <CheckoutProductItem
                    key={"c" + el.id + "q" + el.quantity}
                    data={el}
                    disabled={item.user_id !== cart.owner_id}
                  />
                ))}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
      {loading && <Loading />}
    </div>
  );
}
