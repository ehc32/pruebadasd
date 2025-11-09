import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import Link from "next/link";
import React from "react";
import { NavMenu } from "../navbar.types";
import { MenuList } from "./MenuList";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { MenuItem } from "./MenuItem";
import Image from "next/image";
import InputGroup from "@/components/ui/input-group";
import ResTopNavbar from "./ResTopNavbar";
import CartBtn from "./CartBtn";
import ProfileDropdown from "./ProfileDropdown";
import FavoritesBtn from "./FavoritesBtn";
import ThemeToggle from "./ThemeToggle";

const data: NavMenu = [
  {
    id: 1,
    label: "Shop",
    type: "MenuList",
    children: [
      {
        id: 11,
        label: "Men's clothes",
        url: "/shop#men-clothes",
        description: "In attractive and spectacular colors and designs",
      },
      {
        id: 12,
        label: "Women's clothes",
        url: "/shop#women-clothes",
        description: "Ladies, your style and tastes are important to us",
      },
      {
        id: 13,
        label: "Kids clothes",
        url: "/shop#kids-clothes",
        description: "For all ages, with happy and beautiful colors",
      },
      {
        id: 14,
        label: "Bags and Shoes",
        url: "/shop#bag-shoes",
        description: "Suitable for men, women and all tastes and styles",
      },
    ],
  },
  {
    id: 2,
    type: "MenuItem",
    label: "On Sale",
    url: "/shop#on-sale",
    children: [],
  },
  {
    id: 3,
    type: "MenuItem",
    label: "New Arrivals",
    url: "/shop#new-arrivals",
    children: [],
  },
  {
    id: 4,
    type: "MenuItem",
    label: "Brands",
    url: "/shop#brands",
    children: [],
  },
];

const TopNavbar = () => {
  return (
    <nav className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-frame items-center justify-between gap-4 px-4 py-4 transition-colors md:gap-6 xl:px-0">
        <div className="flex items-center gap-3 md:gap-6">
          <div className="block md:hidden">
            <ResTopNavbar data={data} />
          </div>
          <Link
            href="/"
            className={cn([
              integralCF.className,
              "text-2xl font-bold tracking-tight md:text-3xl",
            ])}
            aria-label="Volver al inicio"
          >
            SHOP.CO
          </Link>
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="gap-1">
              {data.map((item) => (
                <React.Fragment key={item.id}>
                  {item.type === "MenuItem" && (
                    <MenuItem label={item.label} url={item.url} />
                  )}
                  {item.type === "MenuList" && (
                    <MenuList data={item.children} label={item.label} />
                  )}
                </React.Fragment>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex flex-1 items-center justify-end gap-3 md:gap-4">
          <div className="hidden flex-1 md:flex">
            <InputGroup className="ml-auto w-full max-w-md items-center rounded-full border border-border/70 bg-muted/60 pr-4 text-sm shadow-sm">
              <InputGroup.Text className="bg-transparent">
                <Image
                  priority
                  src="/icons/search.svg"
                  height={20}
                  width={20}
                  alt="search"
                  className="min-h-5 min-w-5 text-muted-foreground"
                />
              </InputGroup.Text>
              <InputGroup.Input
                type="search"
                name="search"
                placeholder="Buscar productos, marcas o categorías"
                className="w-full bg-transparent placeholder:text-muted-foreground focus:outline-none"
              />
            </InputGroup>
          </div>

          <Link
            href="/search"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground md:hidden"
            aria-label="Buscar"
          >
            <Image
              priority
              src="/icons/search-black.svg"
              height={20}
              width={20}
              alt="Buscar"
              className="h-5 w-5"
            />
          </Link>

          <ThemeToggle />
          <FavoritesBtn />
          <CartBtn />
          <ProfileDropdown />
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
