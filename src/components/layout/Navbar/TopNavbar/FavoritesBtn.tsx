"use client";

import { useAppSelector } from "@/lib/hooks/redux";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Heart } from "lucide-react";

const FavoritesBtn = () => {
  const { favorites } = useAppSelector((state) => state.favorites);
  const { token } = useAppSelector((state) => state.auth);

  // Si no hay token, no mostrar el botón
  if (!token) {
    return null;
  }

  return (
    <Link href="/favorites" className="relative mr-[14px] p-1">
      <Heart
        className={`w-[22px] h-[22px] ${
          favorites.length > 0 ? "fill-red-500 text-red-500" : "text-gray-600"
        }`}
      />
      {favorites.length > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
          {favorites.length > 9 ? "9+" : favorites.length}
        </span>
      )}
    </Link>
  );
};

export default FavoritesBtn;

