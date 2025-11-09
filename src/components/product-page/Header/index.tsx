import React from "react";
import PhotoSection from "./PhotoSection";
import { Product } from "@/types/product.types";
import { integralCF } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import Rating from "@/components/ui/Rating";
import ColorSelection from "./ColorSelection";
import SizeSelection from "./SizeSelection";
import AddToCardSection from "./AddToCardSection";

const Header = ({ data }: { data: Product }) => {
  const price = parseFloat(data.price);
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <PhotoSection data={data} />
        </div>
        <div>
          <h1
            className={cn([
              integralCF.className,
              "text-2xl md:text-[40px] md:leading-[40px] mb-3 md:mb-3.5 capitalize",
            ])}
          >
            {data.name}
          </h1>
          <div className="flex items-center space-x-2.5 sm:space-x-3 mb-5">
            <span className="font-bold text-black text-2xl sm:text-[32px]">
              {data.currency} {price.toFixed(2)}
            </span>
          </div>
          <p className="text-sm sm:text-base text-black/60 mb-5">
            {data.description || "Descripción del producto no disponible."}
          </p>
          {data.shortFeatures && data.shortFeatures.length > 0 && (
            <div className="mb-5">
              <p className="text-sm font-medium text-black mb-2">Características:</p>
              <ul className="list-disc list-inside text-sm text-black/60 space-y-1">
                {data.shortFeatures.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
          <hr className="h-[1px] border-t-black/10 mb-5" />
          <ColorSelection />
          <hr className="h-[1px] border-t-black/10 my-5" />
          <SizeSelection />
          <hr className="hidden md:block h-[1px] border-t-black/10 my-5" />
          <AddToCardSection data={data} />
        </div>
      </div>
    </>
  );
};

export default Header;
