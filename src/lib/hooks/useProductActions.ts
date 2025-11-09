"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product.types";
import { addToCart } from "@/lib/features/carts/cartsSlice";
import {
  addFavorite,
  removeFavorite,
  fetchFavorites,
} from "@/lib/features/favorites/favoritesSlice";
import { useAppDispatch, useAppSelector } from "./redux";

export function useProductActions(product: Product) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { favorites } = useAppSelector((state) => state.favorites);
  const { token } = useAppSelector((state) => state.auth);

  const isFavorite = useMemo(() => {
    if (!product?.id) return false;
    return favorites.some((fav) => fav.productId === product.id);
  }, [favorites, product?.id]);

  const ensureAuthenticated = useCallback(() => {
    if (!token) {
      router.push("/login");
      return false;
    }
    return true;
  }, [router, token]);

  const toggleFavorite = useCallback(async () => {
    if (!ensureAuthenticated() || !product?.id) {
      return;
    }

    try {
      if (isFavorite) {
        await dispatch(removeFavorite(product.id)).unwrap();
      } else {
        await dispatch(addFavorite(product.id)).unwrap();
        await dispatch(fetchFavorites()).unwrap();
      }
    } catch (error) {
      console.error("Error al manejar favorito:", error);
    }
  }, [dispatch, ensureAuthenticated, isFavorite, product?.id]);

  const addProductToCart = useCallback(
    (quantity: number = 1) => {
      if (!product) return;

      const mainImage =
        product.images && product.images.length > 0
          ? product.images[0]
          : "/placeholder.svg";
      const price = parseFloat(product.price || "0");

      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          srcUrl: mainImage,
          price,
          attributes: [
            product.unit?.name || "Único",
            product.category?.name || "General",
          ],
          discount: { amount: 0, percentage: 0 },
          quantity,
        })
      );
    },
    [dispatch, product]
  );

  return {
    isFavorite,
    toggleFavorite,
    addProductToCart,
    token,
  };
}

