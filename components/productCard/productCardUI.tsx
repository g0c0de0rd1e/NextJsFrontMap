import React from "react";
import Link from "next/link";
import cls from "./productCard.module.scss";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { Product } from "interfaces";
import FallbackImage from "components/fallbackImage/fallbackImage";
import getImage from "utils/getImage";
import Price from "components/price/price";
import Badge from "components/badge/badge";
import SubtractFillIcon from "remixicon-react/SubtractFillIcon";
import AddFillIcon from "remixicon-react/AddFillIcon";
import PrimaryButton from "components/button/primaryButton";
import Loading from "components/loader/loading";

type Props = {
  data: Product;
  quantity: number;
  isInCart: boolean;
  loading?: boolean;
  addProduct: (event: any) => void;
  incrementProduct: (event: any) => void;
  decrementProduct: (event: any) => void;
  shadow?: boolean;
};

export default function ProductCardUI({
  data,
  quantity,
  isInCart,
  loading = false,
  addProduct,
  incrementProduct,
  decrementProduct,
  shadow,
}: Props) {
  const { t } = useTranslation();
  const { query } = useRouter();

  return (
    <Link
      href={{
        pathname: "",
        query: JSON.parse(
          JSON.stringify({ ...query, id: query.id, product: data.uuid })
        ),
      }}
      shallow={true}
      replace={true}
      className={`${cls.wrapper} ${isInCart ? cls.active : ""} ${
        shadow ? cls.shadow : ""
      }`}
    >
      {loading && <Loading />}
      <div className={cls.header}>
        <FallbackImage
          fill
          src={getImage(data.img)}
          alt={data.translation?.title}
          sizes="320px"
          quality={90}
        />
      </div>
      <div className={cls.body}>
        <h3 className={cls.title}>{data.translation?.title}</h3>
        <p className={cls.text}>{data.translation?.description}</p>
      </div>
      <div className={cls.footer}>
        <div>
          <span className={cls.price}>
            <Price number={data.stock?.total_price} />
          </span>{" "}
          {!!data.stock?.discount && (
            <span className={cls.oldPrice}>
              <Price number={data.stock?.price} old />
            </span>
          )}
          <span className={cls.bonus}>
            {data.stock?.bonus && <Badge type="bonus" variant="circle" />}
          </span>
        </div>
        {isInCart ? (
          <div className={cls.counter}>
            <button
              type="button"
              className={cls.counterBtn}
              onClick={decrementProduct}
            >
              <SubtractFillIcon />
            </button>
            <div className={cls.count}>{quantity}</div>
            <button
              type="button"
              className={`${cls.counterBtn} ${
                Number(data.stock?.quantity) > quantity ? "" : cls.disabled
              }`}
              disabled={!(Number(data.stock?.quantity) > quantity)}
              onClick={incrementProduct}
            >
              <AddFillIcon />
            </button>
          </div>
        ) : (
          <div className={cls.addToCartBtn}>
            <PrimaryButton type="button" size="small" onClick={addProduct}>
              {t("add")}
            </PrimaryButton>
          </div>
        )}
      </div>
    </Link>
  );
}
