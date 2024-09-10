import React from "react";
import RadioInput from "components/inputs/radioInput";
import cls from "./shopSorting.module.scss";
import { useAppDispatch, useAppSelector } from "hooks/useRedux";
import {
  selectProductFilter,
  setProductSorting,
} from "redux/slices/productFilter";
import useLocale from "hooks/useLocale";

const sortingList = [
  "trust_you",
  "best_sale",
  "high_rating",
  "low_sale",
  "low_rating",
];

type Props = {
  handleClose: () => void;
};

export default function ProductSorting({ handleClose }: Props) {
  const { t } = useLocale();
  const { order_by } = useAppSelector(selectProductFilter);
  const dispatch = useAppDispatch();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setProductSorting(event.target.value));
    handleClose();
  };

  const controlProps = (item: string) => ({
    checked: order_by === item,
    onChange: handleChange,
    value: item,
    id: item,
    name: "sorting",
    inputProps: { "aria-label": item },
  });

  return (
    <div className={cls.wrapper}>
      {sortingList.map((item) => (
        <div className={cls.row} key={item}>
          <RadioInput {...controlProps(item)} />
          <label className={cls.label} htmlFor={item}>
            <span className={cls.text}>{t(item)}</span>
          </label>
        </div>
      ))}
    </div>
  );
}
