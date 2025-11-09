"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { getMe, logout } from "@/lib/features/auth/authSlice";

const menuItems = [
  { label: "Mi perfil", href: "/profile" },
  { label: "Mis pedidos", href: "/profile?section=orders" },
  { label: "Favoritos", href: "/favorites" },
];

export default function ProfileDropdown() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, token, isLoading } = useAppSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (token && !user && !isLoading) {
      dispatch(getMe());
    }
  }, [token, user, isLoading, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
    router.push("/");
  };

  if (!isMounted) {
    return <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />;
  }

  const isLoggedIn = Boolean(token && isAuthenticated);

  if (!isLoggedIn) {
    return (
      <Link
        href="/login"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
        aria-label="Iniciar sesión"
      >
        <Image
          priority
          src="/icons/user.svg"
          height={32}
          width={32}
          alt="user"
          className="h-5 w-5"
        />
      </Link>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/40 focus:ring-offset-2"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Abrir menú de usuario"
        type="button"
      >
        <Image
          priority
          src="/icons/user.svg"
          height={32}
          width={32}
          alt="user"
          className="h-5 w-5"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-border/80 bg-background/95 shadow-xl backdrop-blur">
          <div className="bg-muted/60 px-4 py-4">
            <p className="text-sm font-semibold text-foreground">{user?.name || "Usuario"}</p>
            <p className="text-xs text-muted-foreground">{user?.email || ""}</p>
          </div>
          <nav className="flex flex-col px-2 py-2 text-sm text-muted-foreground">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-3 py-2 font-medium transition-colors hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-border/80 px-3 py-3">
            <button
              onClick={handleLogout}
              className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-rose-500 transition-colors hover:bg-rose-500/10"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}



