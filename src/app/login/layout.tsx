import type { Metadata } from "next";
import Providers from "../providers";

export const metadata: Metadata = {
  title: "Iniciar sesión - Shopco",
  description: "Inicia sesión en tu cuenta de Shopco",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Providers>{children}</Providers>;
}



