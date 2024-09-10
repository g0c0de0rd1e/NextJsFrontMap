import React, { useMemo } from "react";
import { Product } from "interfaces";
import { useAppDispatch, useAppSelector } from "hooks/useRedux";
import {
  addToCart,
  reduceCartItem,
  removeFromCart,
  selectCart,
} from "redux/slices/cart";
import ProductCardUI from "./productCardUI";

type Props = {
  data: Product;
  shadow?: boolean;
};

export default function ProductCard({ data, shadow }: Props) {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(selectCart);

  const { isInCart, cartData } = useMemo(() => {
    const foundedItems = cart.filter((item) => data.id === item.id);
    let foundedItem;
    if (foundedItems.length) {
      foundedItem = foundedItems[foundedItems.length - 1];
    }
    return {
      isInCart: !!foundedItems.length,
      cartData: foundedItem,
    };
  }, [cart, data]);

  function addProduct(event?: any) {
    if (!checkIsAbleToAddProduct()) {
      return;
    }
    if (data.stocks_count <= 1) {
      event?.stopPropagation();
      event?.preventDefault();
      const product = {
        id: data?.id,
        img: data?.img,
        translation: data?.translation,
        quantity: 1,
        stock: data.stock,
        shop_id: data?.shop_id,
        extras: data.stock?.extras?.map((el) => el.value) || [],
        addons: data.stock?.addons || [],
      };
      dispatch(addToCart(product));
    }
  }

  function incrementProduct(event?: any) {
    if (!checkIsAbleToAddProduct()) {
      return;
    }
    event?.stopPropagation();
    event?.preventDefault();
    const product = {
      id: cartData?.id,
      img: cartData?.img,
      translation: cartData?.translation,
      quantity: 1,
      stock: cartData?.stock,
      shop_id: cartData?.shop_id,
      extras: cartData?.extras,
      addons: cartData?.addons,
    };
    dispatch(addToCart(product));
  }

  function reduceProduct(event?: any) {
    event.stopPropagation();
    event.preventDefault();
    if (cartData?.quantity === 1) {
      dispatch(removeFromCart(cartData));
    } else {
      dispatch(reduceCartItem(cartData));
    }
  }

  function checkIsAbleToAddProduct() {
    let isActiveCart: boolean;
    if (!!cart.length) {
      isActiveCart = cart.some((item) => item.shop_id === data?.shop_id);
    } else {
      isActiveCart = true;
    }
    return isActiveCart;
  }

  return (
    <ProductCardUI
      data={data}
      quantity={cartData?.quantity || 0}
      isInCart={isInCart}
      addProduct={addProduct}
      incrementProduct={incrementProduct}
      decrementProduct={reduceProduct}
      shadow={shadow}
    />
  );
}
