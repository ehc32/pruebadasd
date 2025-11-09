"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { getMe } from "@/lib/features/auth/authSlice";

export default function AuthInitializer() {
  const dispatch = useAppDispatch();
  const { token, user, isLoading } = useAppSelector((state) => state.auth);
  const hasLoaded = useRef<string | null>(null);

  useEffect(() => {
    // Si hay un token nuevo (diferente al anterior), cargar datos
    if (token && token !== hasLoaded.current && !user && !isLoading) {
      hasLoaded.current = token;
      dispatch(getMe());
    }
    
    // Si no hay token, resetear el ref
    if (!token) {
      hasLoaded.current = null;
    }
  }, [token, user, isLoading, dispatch]);

  return null;
}

