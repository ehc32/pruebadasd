"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { login, clearError, getMe } from "@/lib/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import InputGroup from "@/components/ui/input-group";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    try {
      const result = await dispatch(login(formData)).unwrap();
      if (result.token) {
        await dispatch(getMe());
        router.push("/");
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <AuthLayout
      title="Bienvenido de vuelta"
      subtitle="Ingresa tus credenciales para continuar comprando"
      hero={{
        imageSrc: "/images/pic12.png",
        imageAlt: "Colección de muebles y decoración",
        heading: "Diseña espacios extraordinarios",
        description:
          "Creamos ambientes que combinan estilo y comodidad con piezas seleccionadas por nuestros expertos.",
        highlights: [
          { title: "500+", subtitle: "Productos seleccionados" },
          { title: "30 días", subtitle: "De prueba gratuita" },
        ],
      }}
      footer={
        <p>
          ¿No tienes una cuenta?{" "}
          <Link href="/register" className="font-semibold text-foreground hover:underline">
            Regístrate gratis
          </Link>
        </p>
      }
    >
      <div className="space-y-5">
        <Button
          type="button"
          variant="outline"
          className="h-12 w-full rounded-full border-border/70 text-sm font-semibold"
        >
          Continuar con Google
        </Button>
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          O ingresa con tu email
          <span className="h-px flex-1 bg-border" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-xl border border-rose-400/40 bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <InputGroup className="border border-border/70 bg-background">
                <InputGroup.Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Ingresa tu email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-transparent"
                />
              </InputGroup>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm font-medium text-foreground">
                <label htmlFor="password">Contraseña</label>
                <button
                  type="button"
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              <InputGroup className="border border-border/70 bg-background">
                <InputGroup.Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Ingresa tu contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="bg-transparent"
                />
              </InputGroup>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4 rounded border-border/70" />
              <span>Recuérdame</span>
            </label>
            <button type="button" className="font-semibold text-foreground hover:underline">
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="h-12 w-full rounded-full bg-foreground text-background transition-colors hover:bg-foreground/90"
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}

