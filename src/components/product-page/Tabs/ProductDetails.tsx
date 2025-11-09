import React from "react";
import { Product } from "@/types/product.types";

const ProductDetails = ({ product }: { product?: Product }) => {
  if (!product || !product.specs || Object.keys(product.specs).length === 0) {
    return (
      <div className="text-sm text-black/60 py-4">
        No hay especificaciones disponibles para este producto.
      </div>
    );
  }

  const specsEntries = Object.entries(product.specs);

  return (
    <>
      {specsEntries.map(([key, value], i) => (
        <div className="grid grid-cols-3" key={i}>
          <div>
            <p className="text-sm py-3 w-full leading-7 lg:py-4 pr-2 text-neutral-500 capitalize">
              {key}
            </p>
          </div>
          <div className="col-span-2 py-3 lg:py-4 border-b">
            <p className="text-sm w-full leading-7 text-neutral-800 font-medium">
              {value}
            </p>
          </div>
        </div>
      ))}
      {product.category && (
        <div className="grid grid-cols-3">
          <div>
            <p className="text-sm py-3 w-full leading-7 lg:py-4 pr-2 text-neutral-500">
              Categoría
            </p>
          </div>
          <div className="col-span-2 py-3 lg:py-4 border-b">
            <p className="text-sm w-full leading-7 text-neutral-800 font-medium">
              {product.category.name}
            </p>
          </div>
        </div>
      )}
      {product.unit && (
        <div className="grid grid-cols-3">
          <div>
            <p className="text-sm py-3 w-full leading-7 lg:py-4 pr-2 text-neutral-500">
              Unidad
            </p>
          </div>
          <div className="col-span-2 py-3 lg:py-4 border-b">
            <p className="text-sm w-full leading-7 text-neutral-800 font-medium">
              {product.unit.name} ({product.unit.code})
            </p>
          </div>
        </div>
      )}
      <div className="grid grid-cols-3">
        <div>
          <p className="text-sm py-3 w-full leading-7 lg:py-4 pr-2 text-neutral-500">
            Stock disponible
          </p>
        </div>
        <div className="col-span-2 py-3 lg:py-4 border-b">
          <p className="text-sm w-full leading-7 text-neutral-800 font-medium">
            {product.stock} unidades
          </p>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
