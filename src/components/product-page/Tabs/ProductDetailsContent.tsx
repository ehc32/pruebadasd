import React from "react";
import ProductDetails from "./ProductDetails";
import { Product } from "@/types/product.types";

const ProductDetailsContent = ({ product }: { product?: Product }) => {
  return (
    <section>
      <h3 className="text-xl sm:text-2xl font-bold text-black mb-5 sm:mb-6">
        Product specifications
      </h3>
      <ProductDetails product={product} />
      {product?.description && (
        <div className="mt-6">
          <h4 className="text-lg font-bold text-black mb-3">Descripción</h4>
          <p className="text-sm text-black/60 leading-7">{product.description}</p>
        </div>
      )}
    </section>
  );
};

export default ProductDetailsContent;
