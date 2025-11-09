"use client";

import { useEffect } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { getMe, logout } from "@/lib/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { integralCF } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isLoading, token } = useAppSelector((state) => state.auth);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [hasCheckedToken, setHasCheckedToken] = React.useState(false);

  // Verificar token del localStorage al montar
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const localToken = localStorage.getItem("auth_token");
      // Si no hay token en localStorage ni en Redux, redirigir a login
      if (!localToken && !token) {
        router.push("/login");
        return;
      }
      // Marcar que ya se verificó el token
      setHasCheckedToken(true);
    }
  }, []);

  useEffect(() => {
    // Si estamos cerrando sesión, no hacer nada
    if (isLoggingOut) {
      return;
    }

    // Esperar a que se verifique el token
    if (!hasCheckedToken) {
      return;
    }

    // Verificar token del localStorage como respaldo
    const localToken = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    const hasToken = token || localToken;

    // Si no hay token en ningún lado, redirigir a login
    if (!hasToken) {
      router.push("/login");
      return;
    }

    // Si hay token pero no hay usuario y no está cargando, cargar datos
    if (hasToken && !user && !isLoading) {
      dispatch(getMe());
    }
  }, [token, user, isLoading, router, dispatch, isLoggingOut, hasCheckedToken]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    dispatch(logout());
    router.push("/");
  };

  // Verificar token del localStorage como respaldo
  const localToken = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const hasToken = token || localToken;

  // Mostrar pantalla de carga si está cargando O si hay token pero no hay usuario (esperando datos)
  if (!hasCheckedToken || isLoading || (hasToken && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  // Si no hay token, no mostrar nada (se redirigirá)
  if (!hasToken) {
    return null;
  }

  return (
    <main className="min-h-screen pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0 py-8">
        <h1
          className={cn([
            integralCF.className,
            "text-3xl md:text-4xl font-bold text-black uppercase mb-8",
          ])}
        >
          Mi Perfil
        </h1>

        <div className="bg-white border border-black/10 rounded-[20px] p-6 md:p-8 max-w-2xl">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-600">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-black mb-1">{user?.name || "Usuario"}</h2>
              <p className="text-gray-600">{user?.email || ""}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                {user?.role || "Usuario"}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre completo
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900">{user?.name || "N/A"}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900">{user?.email || "N/A"}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900">{user?.role || "N/A"}</p>
              </div>
            </div>

            {user?.id && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ID de Usuario</label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-900 font-mono text-sm">{user.id}</p>
                </div>
              </div>
            )}

            {user?.companyId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ID de Empresa</label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-900 font-mono text-sm">{user.companyId}</p>
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-gray-200">
              <Button
                onClick={handleLogout}
                className="w-full bg-black text-white hover:bg-gray-800 rounded-full py-6 text-base font-medium"
              >
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}



