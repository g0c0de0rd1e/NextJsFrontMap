import React from "react";
import cls from "./cartProduct.module.scss";
import Badge from "components/badge/badge";
import Loading from "components/loader/loading";
import Price from "components/price/price";
import { CartStockWithProducts } from "interfaces";
import AddFillIcon from "remixicon-react/AddFillIcon";
import SubtractFillIcon from "remixicon-react/SubtractFillIcon";
import DeleteBinLineIcon from "remixicon-react/DeleteBinLineIcon";
import getImage from "utils/getImage";
import calculateCartProductTotal from "utils/calculateCartProductTotal";
import FallbackImage from "components/fallbackImage/fallbackImage";
import useLocale from "hooks/useLocale";

type Props = {
  data: CartStockWithProducts;
  loading: boolean;
  addProduct: () => void;
  reduceProduct: () => void;
  quantity: number;
  disabled?: boolean;
  deleteProduct: () => void;
};

export default function CartProductUI({
  data,
  loading,
  addProduct,
  reduceProduct,
  quantity,
  disabled = false,
  deleteProduct,
}: Props) {
  const { t } = useLocale();
  const isReduceDisabled = quantity < 1 || data.bonus || disabled;
  const isAddDisabled =
    !(data.stock?.quantity > quantity) || data.bonus || disabled;

  const { totalPrice, oldPrice } = calculateCartProductTotal(data);

  return (
    <div className={cls.wrapper}>
      <div className={cls.imageWrapper}>
        <FallbackImage
          fill
          src={getImage(data.stock?.product?.img)}
          alt={data.stock?.product?.translation?.title}
          sizes="320px"
          quality={90}
        />
        {data.bonus && (
          <span className={cls.bonus}>
            <Badge type="bonus" variant="circle" />
          </span>
        )}
      </div>
      <div className={cls.flex}>
        <div className={cls.block}>
          <div>
            <h6 className={cls.title}>
              {data.stock?.product?.translation?.title}{" "}
              {data.stock?.extras?.length
                ? data.stock.extras.map((item, idx) => (
                    <span key={"extra" + idx}>({item.value})</span>
                  ))
                : ""}
            </h6>
            <p className={cls.description}>
              {data.stock.product.translation?.description}
              <br />
              {data.addons
                ?.map(
                  (item) =>
                    item.stock?.product?.translation?.title +
                    " x " +
                    item.quantity
                )
                .join(", ")}
            </p>
          </div>
          <button className={cls.btn} onClick={deleteProduct}>
            <DeleteBinLineIcon />
            <span className={cls.text}>{t("delete")}</span>
          </button>
        </div>
        <div className={cls.actions}>
          <div className={cls.price}>
            <Price number={totalPrice} />
            {!!data.discount && (
              <div className={cls.oldPrice}>
                <Price number={oldPrice} old />
              </div>
            )}
          </div>
          <div className={cls.counter}>
            <button
              type="button"
              className={`${cls.counterBtn} ${
                isReduceDisabled ? cls.disabled : ""
              }`}
              disabled={isReduceDisabled}
              onClick={reduceProduct}
            >
              <SubtractFillIcon />
            </button>
            <div className={cls.count}>{quantity}</div>
            <button
              type="button"
              className={`${cls.counterBtn} ${
                isAddDisabled ? cls.disabled : ""
              }`}
              disabled={isAddDisabled}
              onClick={addProduct}
            >
              <AddFillIcon />
            </button>
          </div>
        </div>
      </div>

      {loading && <Loading />}
    </div>
  );
}
