"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product.types";
import { Heart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { addFavorite, removeFavorite, fetchFavorites } from "@/lib/features/favorites/favoritesSlice";
import { useRouter } from "next/navigation";

type ProductCardProps = {
  data: Product;
};

const ProductCard = ({ data }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { favorites } = useAppSelector((state) => state.favorites);
  const { token } = useAppSelector((state) => state.auth);
  
  // Validar que data existe
  if (!data || !data.id) {
    return null;
  }
  
  const isFavorite = favorites.some((fav) => fav.productId === data.id);
  const mainImage = data.images && data.images.length > 0 ? data.images[0] : "/placeholder.svg";
  const price = parseFloat(data.price || "0");
  
  // Generar slug de forma segura
  const productSlug = data.slug || (data.name && typeof data.name === 'string' ? data.name.toLowerCase().replace(/\s+/g, "-") : "producto");
  const productUrl = `/shop/product/${data.id}/${productSlug}`;

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      if (isFavorite) {
        await dispatch(removeFavorite(data.id)).unwrap();
      } else {
        await dispatch(addFavorite(data.id)).unwrap();
        // Recargar favoritos para obtener el producto completo
        await dispatch(fetchFavorites()).unwrap();
      }
    } catch (error) {
      console.error("Error al manejar favorito:", error);
    }
  };

  return (
    <Link
      href={productUrl}
      className="flex flex-col items-start aspect-auto relative"
    >
      <div className="bg-[#F0EEED] rounded-[13px] lg:rounded-[20px] w-full lg:max-w-[295px] aspect-square mb-2.5 xl:mb-4 overflow-hidden relative group">
        <Image
          src={mainImage}
          width={295}
          height={298}
          className="rounded-md w-full h-full object-contain hover:scale-110 transition-all duration-500"
          alt={data.name || "Producto"}
          priority
          unoptimized
        />
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all z-10"
          aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>
      </div>
      <strong className="text-black xl:text-xl mb-1 block">{data.name || "Producto"}</strong>
      <div className="flex items-center space-x-[5px] xl:space-x-2.5 mt-1">
        <span className="font-bold text-black text-xl xl:text-2xl">
          {data.currency || "USD"} {price.toFixed(2)}
        </span>
      </div>
    </Link>
  );
};

export default ProductCard;
