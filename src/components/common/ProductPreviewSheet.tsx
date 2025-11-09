"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Product } from "@/types/product.types";
import { Heart, ShoppingBag } from "lucide-react";
import { useMemo } from "react";

type ProductPreviewSheetProps = {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onAddToCart: (quantity?: number) => void;
};

export function ProductPreviewSheet({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
}: ProductPreviewSheetProps) {
  const price = useMemo(() => parseFloat(product.price || "0"), [product.price]);
  const mainImage = useMemo(() => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return "/placeholder.svg";
  }, [product.images]);

  const featureTags = useMemo(() => {
    if (!product.shortFeatures?.length) return [];
    return product.shortFeatures.slice(0, 4);
  }, [product.shortFeatures]);

  const productSlug =
    product.slug ||
    (product.name && typeof product.name === "string"
      ? product.name.toLowerCase().replace(/\s+/g, "-")
      : "producto");
  const productUrl = `/shop/product/${product.id}/${productSlug}`;

  return (
    <SheetContent
      side="right"
      className="flex w-full max-w-lg flex-col gap-6 overflow-y-auto bg-background/95 px-0 pb-10 text-foreground sm:px-6"
    >
      <SheetHeader className="px-6">
        <SheetTitle className="text-xl font-semibold text-foreground">
          Vista previa rápida
        </SheetTitle>
        <SheetDescription className="text-sm text-muted-foreground">
          Explora los detalles del producto y agrégalo al carrito sin salir de la página.
        </SheetDescription>
      </SheetHeader>

      <div className="space-y-6 px-6">
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-muted">
          <Image
            src={mainImage}
            alt={product.name || "Producto"}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 90vw, 480px"
            priority
            unoptimized
          />
          <button
            type="button"
            onClick={onToggleFavorite}
            className="absolute right-4 top-4 rounded-full bg-background/80 p-3 text-muted-foreground shadow-lg backdrop-blur transition hover:text-rose-500"
            aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            <Heart
              className={
                "h-5 w-5 transition-colors" +
                (isFavorite ? " fill-rose-500 text-rose-500" : "")
              }
            />
          </button>
          {product.category?.name && (
            <div className="absolute left-4 top-4 rounded-full bg-background/85 px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground shadow-sm">
              {product.category.name}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-2xl font-semibold leading-tight text-foreground">
              {product.name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {product.company?.displayName || "Colección exclusiva de Shop.co"}
            </p>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-foreground">
              {product.currency || "USD"} {price.toFixed(2)}
            </span>
            {product.stock > 0 ? (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                En stock
              </span>
            ) : (
              <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
                Agotado
              </span>
            )}
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">
            {product.description || "Descripción no disponible para este producto."}
          </p>

          {featureTags.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {featureTags.map((feature, index) => (
                <li
                  key={`${feature}-${index}`}
                  className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {feature}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <SheetFooter className="mt-auto flex flex-col gap-3 px-6">
        <Button
          type="button"
          className="h-12 w-full rounded-full bg-foreground text-background hover:bg-foreground/90"
          onClick={() => onAddToCart(1)}
        >
          <ShoppingBag className="mr-2 h-5 w-5" /> Añadir al carrito
        </Button>
        <SheetClose asChild>
          <Button
            variant="outline"
            className="h-12 w-full rounded-full border-border/80 text-sm font-semibold"
            asChild
          >
            <Link href={productUrl}>Ver detalles completos</Link>
          </Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  );
}

