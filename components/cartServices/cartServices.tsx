import React from "react";
import cls from "./cartServices.module.scss";
import Price from "components/price/price";
import { selectCurrency } from "redux/slices/currency";
import { useAppSelector } from "hooks/useRedux";
import { useBranch } from "contexts/branch/branch.context";
import { selectUserCart } from "redux/slices/userCart";
import useLocale from "hooks/useLocale";

export default function CartServices() {
  const { t } = useLocale();
  const currency = useAppSelector(selectCurrency);
  const { branch } = useBranch();
  const cart = useAppSelector(selectUserCart);

  return (
    <div className={cls.wrapper}>
      <div className={cls.flex}>
        <div className={cls.item}>
          <div className={cls.row}>
            <h5 className={cls.title}>{t("discount")}</h5>
            {!!cart.receipt_discount && (
              <p className={cls.text}>{t("recipe.discount.definition")}</p>
            )}
          </div>
        </div>
        <div className={cls.price}>
          <Price number={cart.receipt_discount} minus />
        </div>
      </div>
      {/* <div className={cls.flex}>
        <div className={cls.item}>
          <div className={cls.row}>
            <h5 className={cls.title}>{t("delivery")}</h5>
          </div>
        </div>
        <div className={cls.price}>
          <Price number={Number(branch?.price) * Number(currency?.rate)} />
        </div>
      </div> */}
    </div>
  );
}
