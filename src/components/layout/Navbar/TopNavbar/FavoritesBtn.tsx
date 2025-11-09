"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks/redux";
import { Heart } from "lucide-react";
import Link from "next/link";

const FavoritesBtn = () => {
  const router = useRouter();
  const { favorites } = useAppSelector((state) => state.favorites);
  const { token } = useAppSelector((state) => state.auth);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="mr-3 h-9 w-9 rounded-full bg-muted animate-pulse" />;
  }

  const favoriteCount = favorites.length;

  if (!token) {
    return (
      <button
        type="button"
        onClick={() => router.push("/login")}
        className="relative mr-3 flex h-9 w-9 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
        aria-label="Inicia sesión para ver favoritos"
      >
        <Heart className="h-4 w-4" />
      </button>
    );
  }

  return (
    <Link
      href="/favorites"
      className="relative mr-3 flex h-9 w-9 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
      aria-label="Ver favoritos"
    >
      <Heart
        className={`h-4 w-4 transition-colors ${
          favoriteCount > 0 ? "fill-rose-500 text-rose-500" : ""
        }`}
      />
      {favoriteCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white">
          {favoriteCount > 9 ? "9+" : favoriteCount}
        </span>
      )}
    </Link>
  );
};

export default FavoritesBtn;

