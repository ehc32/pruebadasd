"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { fetchProductById, fetchProducts } from "@/lib/features/products/productsApiSlice";
import ProductListSec from "@/components/common/ProductListSec";
import BreadcrumbProduct from "@/components/product-page/BreadcrumbProduct";
import Header from "@/components/product-page/Header";
import Tabs from "@/components/product-page/Tabs";

export default function ProductPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentProduct, isLoading, error, products } = useAppSelector((state) => state.productsApi);
  const productId = params.slug[0];
  const [hasTriedLoad, setHasTriedLoad] = useState(false);

  useEffect(() => {
    if (productId && !hasTriedLoad) {
      setHasTriedLoad(true);
      dispatch(fetchProductById(productId));
      // Cargar algunos productos relacionados
      dispatch(fetchProducts({ page: 1, pageSize: 4 }));
    }
  }, [dispatch, productId, hasTriedLoad]);

  // Si hay error y ya intentamos cargar, mostrar error
  useEffect(() => {
    if (error && hasTriedLoad && !isLoading) {
      // Redirigir a shop después de un tiempo
      setTimeout(() => {
        router.push("/shop");
      }, 2000);
    }
  }, [error, hasTriedLoad, isLoading, router]);

  if (isLoading || !hasTriedLoad) {
    return (
      <main>
        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando producto...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !currentProduct) {
    return (
      <main>
        <div className="max-w-frame mx-auto px-4 xl:px-0 py-8">
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <p className="text-xl font-bold text-black mb-2">Producto no encontrado</p>
            <p className="text-gray-600 mb-4">{error || "El producto que buscas no existe."}</p>
            <button
              onClick={() => router.push("/shop")}
              className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
            >
              Volver a la tienda
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
        <BreadcrumbProduct title={currentProduct.name} />
        <section className="mb-11">
          <Header data={currentProduct} />
        </section>
        <Tabs product={currentProduct} />
      </div>
      {products.length > 0 && (
        <div className="mb-[50px] sm:mb-20">
          <ProductListSec title="You might also like" data={products.filter(p => p.id !== productId).slice(0, 4)} />
        </div>
      )}
    </main>
  );
}



