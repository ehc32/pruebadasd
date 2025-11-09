"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product.types";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Heart, MoveRight } from "lucide-react";
import { ProductPreviewSheet } from "./ProductPreviewSheet";
import { useProductActions } from "@/lib/hooks/useProductActions";

type ProductCardProps = {
  data: Product;
};

const ProductCard = ({ data }: ProductCardProps) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { isFavorite, toggleFavorite, addProductToCart } = useProductActions(data);

  const mainImage = useMemo(() => {
    if (data.images && data.images.length > 0) {
      return data.images[0];
    }
    return "/placeholder.svg";
  }, [data.images]);

  const price = useMemo(() => parseFloat(data.price || "0"), [data.price]);

  const featureTags = useMemo(() => {
    if (!data.shortFeatures?.length) return [];
    return data.shortFeatures.slice(0, 3);
  }, [data.shortFeatures]);

  const productSlug =
    data.slug ||
    (data.name && typeof data.name === "string"
      ? data.name.toLowerCase().replace(/\s+/g, "-")
      : "producto");
  const productUrl = `/shop/product/${data.id}/${productSlug}`;

  if (!data || !data.id) {
    return null;
  }

  return (
    <Sheet open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
      <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/80 bg-background/95 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-background/80">
        <div className="relative aspect-[4/5] overflow-hidden bg-muted/60">
          <Link href={productUrl} className="absolute inset-0">
            <Image
              src={mainImage}
              alt={data.name || "Producto"}
              fill
              sizes="(max-width: 768px) 50vw, 320px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority
              unoptimized
            />
          </Link>
          <button
            type="button"
            onClick={toggleFavorite}
            className="absolute right-4 top-4 rounded-full bg-background/80 p-2 text-muted-foreground shadow-md backdrop-blur transition-colors hover:text-rose-500"
            aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                isFavorite ? "fill-rose-500 text-rose-500" : ""
              }`}
            />
          </button>
          {(data.category?.name || data.company?.displayName) && (
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-full bg-background/90 px-4 py-2 text-xs font-medium text-muted-foreground shadow-lg backdrop-blur">
              <span className="truncate">
                {data.category?.name || "Colección"}
              </span>
              {data.company?.displayName && (
                <span className="ml-3 truncate text-foreground">
                  {data.company.displayName}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-4 px-5 py-5">
          <div className="space-y-2">
            <Link
              href={productUrl}
              className="text-lg font-semibold leading-tight text-foreground transition-colors hover:text-foreground/80 line-clamp-2"
            >
              {data.name || "Producto"}
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
              {data.description || "Descripción no disponible."}
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

          <div className="mt-auto space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-foreground">
                {data.currency || "USD"} {price.toFixed(2)}
              </span>
              {data.stock > 0 ? (
                <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                  Disponible
                </span>
              ) : (
                <span className="text-xs font-semibold uppercase tracking-wide text-rose-500">
                  Agotado
                </span>
              )}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="h-11 flex-1 rounded-full bg-foreground text-background hover:bg-foreground/90"
              >
                <Link href={productUrl}>
                  Ver detalles
                  <MoveRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="h-11 flex-1 rounded-full border-border/80 text-foreground hover:bg-muted"
                >
                  Vista rápida
                </Button>
              </SheetTrigger>
            </div>
          </div>
        </div>
      </article>

      {isPreviewOpen && (
        <ProductPreviewSheet
          product={data}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          onAddToCart={(quantity = 1) => {
            addProductToCart(quantity);
            setIsPreviewOpen(false);
          }}
        />
      )}
    </Sheet>
  );
};

export default ProductCard;
