"use client";

import { usePathname } from "next/navigation";
import TopBanner from "@/components/layout/Banner/TopBanner";
import TopNavbar from "@/components/layout/Navbar/TopNavbar";
import Footer from "@/components/layout/Footer";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginOrRegister = pathname === "/login" || pathname === "/register";

  if (isLoginOrRegister) {
    return <>{children}</>;
  }

  return (
    <>
      <TopBanner />
      <TopNavbar />
      {children}
      <Footer />
    </>
  );
}

