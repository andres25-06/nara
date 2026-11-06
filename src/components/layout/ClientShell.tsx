"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import "@/i18n/config";
import i18n from "@/i18n/config";
import { NaraProvider } from "@/context/NaraContext";
import { LuzMascotDefs } from "./LuzMascotDefs";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { NaraVoiceWidget } from "./NaraVoiceWidget";

export function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    const saved = localStorage.getItem("nara-lang");
    if (saved === "es" || saved === "en") {
      i18n.changeLanguage(saved);
      document.documentElement.lang = saved;
    } else {
      i18n.changeLanguage("en");
      document.documentElement.lang = "en";
    }
  }, []);

  return (
    <NaraProvider>
      <LuzMascotDefs />
      {!isAdminRoute && <Navbar />}
      {children}
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <NaraVoiceWidget />}
    </NaraProvider>
  );
}
