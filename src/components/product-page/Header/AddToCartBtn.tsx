"use client";

import { addToCart } from "@/lib/features/carts/cartsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { RootState } from "@/lib/store";
import { Product } from "@/types/product.types";
import React from "react";

const AddToCartBtn = ({ data }: { data: Product & { quantity: number } }) => {
  const dispatch = useAppDispatch();
  const { sizeSelection, colorSelection } = useAppSelector(
    (state: RootState) => state.products
  );

  const mainImage = data.images && data.images.length > 0 ? data.images[0] : "/placeholder.svg";
  const price = parseFloat(data.price);

  return (
    <button
      type="button"
      className="bg-black w-full ml-3 sm:ml-5 rounded-full h-11 md:h-[52px] text-sm sm:text-base text-white hover:bg-black/80 transition-all"
      onClick={() =>
        dispatch(
          addToCart({
            id: data.id,
            name: data.name,
            srcUrl: mainImage,
            price: price,
            attributes: [sizeSelection, colorSelection.name],
            discount: { amount: 0, percentage: 0 },
            quantity: data.quantity,
          })
        )
      }
    >
      Add to Cart
    </button>
  );
};

export default AddToCartBtn;
