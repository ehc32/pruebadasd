"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { register, clearError, getMe } from "@/lib/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import InputGroup from "@/components/ui/input-group";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/profile");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    if (!agreeToTerms) {
      alert("Debes aceptar los términos y condiciones");
      return;
    }

    try {
      const result = await dispatch(
        register({
          ...formData,
          role: "CLIENTE",
        })
      ).unwrap();
      if (result.token) {
        await dispatch(getMe());
        router.push("/profile");
      }
    } catch (err) {
      console.error("Error al registrarse:", err);
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
      title="Crea tu cuenta"
      subtitle="Accede a lanzamientos exclusivos y beneficios para miembros"
      hero={{
        imageSrc: "/images/pic6.png",
        imageAlt: "Espacio acogedor con sillón y decoración",
        heading: "Experiencias hechas a medida",
        description:
          "Desde muebles hasta accesorios, seleccionamos cada pieza para que tu hogar refleje tu personalidad.",
        highlights: [
          { title: "24/7", subtitle: "Atención personalizada" },
          { title: "+100K", subtitle: "Clientes felices" },
        ],
      }}
      footer={
        <p>
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="font-semibold text-foreground hover:underline">
            Inicia sesión
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-xl border border-rose-400/40 bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground">
              Nombre completo
            </label>
            <InputGroup className="border border-border/70 bg-background">
              <InputGroup.Input
                type="text"
                id="name"
                name="name"
                placeholder="Ingresa tu nombre"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-transparent"
              />
            </InputGroup>
          </div>

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
                placeholder="Crea una contraseña segura"
                value={formData.password}
                onChange={handleChange}
                required
                className="bg-transparent"
              />
            </InputGroup>
          </div>
        </div>

        <label className="flex items-start gap-3 text-sm text-muted-foreground">
          <input
            type="checkbox"
            id="terms"
            checked={agreeToTerms}
            onChange={(e) => setAgreeToTerms(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-border/70"
            required
          />
          <span>
            Acepto los <strong>Términos y Condiciones</strong>, la <strong>Política de Privacidad</strong> y recibir novedades exclusivas.
          </span>
        </label>

        <Button
          type="submit"
          disabled={isLoading || !agreeToTerms}
          className="h-12 w-full rounded-full bg-foreground text-background transition-colors hover:bg-foreground/90 disabled:opacity-60"
        >
          {isLoading ? "Creando cuenta..." : "Crear cuenta"}
        </Button>
      </form>
    </AuthLayout>
  );
}
