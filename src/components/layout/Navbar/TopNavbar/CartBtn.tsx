"use client";

import { useAppSelector } from "@/lib/hooks/redux";
import { RootState } from "@/lib/store";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CartBtn = () => {
  const { cart } = useAppSelector((state: RootState) => state.carts);

  return (
    <Link
      href="/cart"
      className="relative mr-3 flex h-9 w-9 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
      aria-label="Ver carrito"
    >
      <Image
        priority
        src="/icons/cart.svg"
        height={24}
        width={24}
        alt="Cart"
        className="h-5 w-5"
      />
      {cart && cart.totalQuantities > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
          {cart.totalQuantities > 9 ? "9+" : cart.totalQuantities}
        </span>
      )}
    </Link>
  );
};

export default CartBtn;
