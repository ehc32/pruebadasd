"use client";

import { useEffect, useState } from "react";
import BreadcrumbShop from "@/components/shop-page/BreadcrumbShop";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MobileFilters from "@/components/shop-page/filters/MobileFilters";
import Filters from "@/components/shop-page/filters";
import { FiSliders } from "react-icons/fi";
import ProductCard from "@/components/common/ProductCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { fetchProducts } from "@/lib/features/products/productsApiSlice";

export default function ShopPage() {
  const dispatch = useAppDispatch();
  const { products, isLoading, meta } = useAppSelector((state) => state.productsApi);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchProducts({ page: currentPage, pageSize: 12 }));
  }, [dispatch, currentPage]);

  const totalPages = meta ? Math.ceil(meta.total / meta.pageSize) : 1;
  const startItem = meta ? (meta.page - 1) * meta.pageSize + 1 : 0;
  const endItem = meta ? Math.min(meta.page * meta.pageSize, meta.total) : 0;

  return (
    <main className="pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
        <BreadcrumbShop />
        <div className="flex md:space-x-5 items-start">
          <div className="hidden md:block min-w-[295px] max-w-[295px] border border-black/10 rounded-[20px] px-5 md:px-6 py-5 space-y-5 md:space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-bold text-black text-xl">Filters</span>
              <FiSliders className="text-2xl text-black/40" />
            </div>
            <Filters />
          </div>
          <div className="flex flex-col w-full space-y-5">
            <div className="flex flex-col lg:flex-row lg:justify-between">
              <div className="flex items-center justify-between">
                <h1 className="font-bold text-2xl md:text-[32px]">Productos</h1>
                <MobileFilters />
              </div>
              <div className="flex flex-col sm:items-center sm:flex-row">
                <span className="text-sm md:text-base text-black/60 mr-3">
                  {meta ? `Showing ${startItem}-${endItem} of ${meta.total} Products` : "Loading..."}
                </span>
                <div className="flex items-center">
                  Sort by:{" "}
                  <Select defaultValue="most-popular">
                    <SelectTrigger className="font-medium text-sm px-1.5 sm:text-base w-fit text-black bg-transparent shadow-none border-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="most-popular">Most Popular</SelectItem>
                      <SelectItem value="low-price">Low Price</SelectItem>
                      <SelectItem value="high-price">High Price</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                  <p className="text-gray-600">Cargando productos...</p>
                </div>
              </div>
            ) : (
              <div className="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                {products.map((product) => (
                  <ProductCard key={product.id} data={product} />
                ))}
              </div>
            )}
            {products.length > 0 && (
              <>
                <hr className="border-t-black/10" />
                <Pagination className="justify-between">
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className={`border border-black/10 ${currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                  />
                  <PaginationContent>
                    {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            className="text-black/50 font-medium text-sm cursor-pointer"
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    {totalPages > 10 && (
                      <>
                        <PaginationItem>
                          <PaginationEllipsis className="text-black/50 font-medium text-sm" />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink
                            onClick={() => setCurrentPage(totalPages)}
                            className="text-black/50 font-medium text-sm cursor-pointer"
                          >
                            {totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      </>
                    )}
                  </PaginationContent>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className={`border border-black/10 ${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                  />
                </Pagination>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
