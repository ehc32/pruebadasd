"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { fetchFavorites, removeFavorite } from "@/lib/features/favorites/favoritesSlice";
import { Button } from "@/components/ui/button";
import { integralCF } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import React from "react";

export default function FavoritesPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { favorites, isLoading } = useAppSelector((state) => state.favorites);
  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    dispatch(fetchFavorites());
  }, [token, router, dispatch]);

  const handleRemoveFavorite = async (productId: string) => {
    try {
      await dispatch(removeFavorite(productId)).unwrap();
    } catch (error) {
      console.error("Error al eliminar favorito:", error);
    }
  };

  if (!token) {
    return null;
  }

  if (isLoading) {
    return (
      <main className="min-h-screen pb-20">
        <div className="max-w-frame mx-auto px-4 xl:px-0 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando favoritos...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0 py-8">
        <h1
          className={cn([
            integralCF.className,
            "text-3xl md:text-4xl font-bold text-black uppercase mb-8",
          ])}
        >
          Mis Favoritos
        </h1>

        {favorites.length > 0 ? (
          <div className="w-full p-3.5 md:px-6 flex-col space-y-4 md:space-y-6 rounded-[20px] border border-black/10">
            {favorites.map((favorite, idx, arr) => {
              const productName = favorite.product?.name || "Producto";
              const productSlug = favorite.product?.slug || (productName ? productName.toLowerCase().replace(/\s+/g, "-") : "producto");
              const productUrl = `/shop/product/${favorite.productId}/${productSlug}`;
              
              return (
                <React.Fragment key={favorite.id}>
                  <div className="flex items-start space-x-4">
                    <Link
                      href={productUrl}
                      className="bg-[#F0EEED] rounded-lg w-full min-w-[100px] max-w-[100px] sm:max-w-[124px] aspect-square overflow-hidden flex-shrink-0"
                    >
                      {favorite.product?.images && favorite.product.images.length > 0 ? (
                        <Image
                          src={favorite.product.images[0]}
                          width={124}
                          height={124}
                          className="rounded-md w-full h-full object-cover"
                          alt={productName}
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-4xl">📦</span>
                        </div>
                      )}
                    </Link>
                    <div className="flex w-full self-stretch flex-col">
                      <div className="flex items-center justify-between">
                        <Link
                          href={productUrl}
                          className="text-black font-bold text-base xl:text-xl"
                        >
                          {productName}
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 md:h-9 md:w-9"
                          onClick={() => handleRemoveFavorite(favorite.productId)}
                        >
                          <Heart className="text-xl md:text-2xl text-red-500 fill-red-500" />
                        </Button>
                      </div>
                      <div className="mt-2">
                        <span className="text-black text-xs md:text-sm mr-1">Precio:</span>
                        <span className="text-black/60 text-xs md:text-sm">
                          {favorite.product?.currency || "USD"} {favorite.product?.price || "0.00"}
                        </span>
                      </div>
                      <div className="mb-auto mt-1">
                        <span className="text-black text-xs md:text-sm mr-1">Stock:</span>
                        <span className="text-black/60 text-xs md:text-sm">
                          {favorite.product?.stock || 0} disponibles
                        </span>
                      </div>
                      <div className="mt-4">
                        <Button
                          asChild
                          className="bg-black text-white hover:bg-gray-800 rounded-full px-6 py-2 text-sm"
                        >
                          <Link href={productUrl}>
                            Ver Producto
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                  {arr.length - 1 !== idx && <hr className="border-t-black/10" />}
                </React.Fragment>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center mt-24 text-center">
            <Heart
              strokeWidth={1}
              className="text-5xl text-gray-300 mt-6"
            />
            <span className="mt-2 mb-4 text-gray-500">
              No tienes productos favoritos aún.
            </span>
            <Button className="rounded-full" asChild>
              <Link href="/shop">Explorar Productos</Link>
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}

