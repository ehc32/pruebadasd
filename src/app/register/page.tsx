"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { register, clearError, getMe } from "@/lib/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import InputGroup from "@/components/ui/input-group";
import { integralCF } from "@/styles/fonts";
import { cn } from "@/lib/utils";

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
        // Cargar datos del usuario
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
    <div className="min-h-screen flex">
      {/* Left Section - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-12 xl:px-20 py-12">
        <Link href="/" className={cn([integralCF.className, "text-2xl lg:text-3xl mb-8"])}>
          SHOP.CO
        </Link>

        <div className="max-w-md mx-auto w-full">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">Crea tu cuenta</h1>
          <p className="text-gray-600 mb-8">Comienza con tu cuenta gratuita</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre
                </label>
                <InputGroup>
                  <InputGroup.Input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Ingresa tu nombre"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </InputGroup>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <InputGroup>
                  <InputGroup.Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Ingresa tu email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </InputGroup>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <InputGroup>
                  <InputGroup.Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Ingresa tu contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                  <InputGroup.Text>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? "Ocultar" : "Mostrar"}
                    </button>
                  </InputGroup.Text>
                </InputGroup>
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="mt-1 mr-2"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                Acepto todos los Términos, Política de Privacidad y Tarifas
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !agreeToTerms}
              className="w-full bg-black text-white hover:bg-gray-800 rounded-full py-6 text-base font-medium disabled:opacity-50"
            >
              {isLoading ? "Registrando..." : "Registrarse"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="text-black font-semibold hover:underline">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Promotional Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-green-50 to-green-100">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center space-y-6 max-w-md">
            <h2 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">
              Descubre los mejores productos para tu hogar
            </h2>
            <p className="text-lg text-white/90 drop-shadow-md">
              Nuestra práctica es diseñar ambientes completos con productos excepcionales para tu hogar y estilo personal
            </p>
          </div>
        </div>
        <div className="absolute bottom-8 left-8 right-8 flex gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
            <Image src="/icons/check.svg" alt="Check" width={20} height={20} />
            <span className="text-white text-sm font-medium">Garantía 100%</span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
            <Image src="/icons/check.svg" alt="Truck" width={20} height={20} />
            <span className="text-white text-sm font-medium">Envío gratis</span>
          </div>
        </div>
      </div>
    </div>
  );
}

