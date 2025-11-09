"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { getMe, logout } from "@/lib/features/auth/authSlice";

export default function ProfileDropdown() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, token, isLoading } = useAppSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Si hay token pero no hay usuario, cargar datos del usuario
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

  // Mostrar link a login solo si no hay token
  if (!token) {
    return (
      <Link href="/login" className="p-1">
        <Image
          priority
          src="/icons/user.svg"
          height={100}
          width={100}
          alt="user"
          className="max-w-[22px] max-h-[22px]"
        />
      </Link>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded-full"
        aria-label="Perfil"
      >
        <Image
          priority
          src="/icons/user.svg"
          height={100}
          width={100}
          alt="user"
          className="max-w-[22px] max-h-[22px]"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-900">{user?.name || "Usuario"}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email || ""}</p>
          </div>

          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Mi perfil
          </Link>

          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}



