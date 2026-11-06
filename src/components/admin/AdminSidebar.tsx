"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useNara } from "@/context/NaraContext";

export type AdminSection = "home" | "patient" | "caregivers" | "resources" | "footer";

interface MenuItem {
  id: AdminSection;
  labelKey?: string;
  label?: string;
  icon: string; // Material Symbols codepoint (mismos íconos del Navbar)
}

const MENU_ITEMS: MenuItem[] = [
  { id: "home", labelKey: "nav.home", icon: "\ue88a" },
  { id: "patient", labelKey: "nav.patient.label", icon: "\ue922" },
  { id: "caregivers", labelKey: "nav.caregivers.label", icon: "\uea70" },
  { id: "resources", labelKey: "nav.resources.label", icon: "\ue865" },
  { id: "footer", label: "Footer", icon: "\ue0b0" },
];

interface AdminSidebarProps {
  active: AdminSection;
  onSelect: (section: AdminSection) => void;
}

export function AdminSidebar({ active, onSelect }: AdminSidebarProps) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { logoutAdmin } = useNara();
  const isEs = i18n.language?.startsWith("es");

  const handleLogout = () => {
    logoutAdmin();
    router.push("/");
  };

  return (
    <aside
      className="sticky top-0 h-screen w-64 shrink-0 flex flex-col bg-[#FAF8F5]/95 backdrop-blur-md border-r border-espresso/8 shadow-[4px_0_20px_rgba(38,35,34,0.04)]"
      translate="no"
    >
      {/* LOGO / MARCA (igual que el Navbar) */}
      <Link href="/" className="h-20 px-5 flex items-center gap-3.5 group border-b border-espresso/8">
        <div className="w-10 h-10 rounded-full bg-rose-soft flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs shrink-0">
          <svg viewBox="0 0 36 36" className="w-6 h-6" fill="none">
            <path
              d="M18 30C18 30 6 21.8 6 13C6 9.1 9.1 6 13 6C15.3 6 17.3 7.2 18 9C18.7 7.2 20.7 6 23 6C26.9 6 30 9.1 30 13C30 21.8 18 30 18 30Z"
              fill="#E27D90"
            />
            <path
              d="M18 29V16.5M18 20C18 17.2 20.8 15 23.5 15.5C23 18.2 20.8 20 18 20ZM18 22.2C18 20 15.5 18.3 13 18.8C13.5 21 15.5 22.2 18 22.2Z"
              stroke="#415938"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="leading-tight">
          <span className="block font-extrabold text-base tracking-tight text-espresso">
            Love Heals <span className="text-primary">· NARA</span>
          </span>
          <span className="block font-serif italic text-xs text-tertiary -mt-0.5">
            {isEs ? "Panel de administración" : "Admin panel"}
          </span>
        </div>
      </Link>

      {/* NAVEGACIÓN */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {MENU_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-left transition-colors cursor-pointer ${
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-espresso/80 hover:text-primary hover:bg-primary/5"
              }`}
            >
              <span className="material-symbols-outlined notranslate text-[20px]" translate="no">
                {item.icon}
              </span>
              <span>{item.label ?? (item.labelKey ? t(item.labelKey) : "")}</span>
            </button>
          );
        })}
      </nav>

      {/* PIE: ver sitio + cerrar sesión */}
      <div className="p-3 border-t border-espresso/8 space-y-1">
        <Link
          href="/"
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-espresso/80 hover:text-espresso hover:bg-espresso/5 transition-colors"
        >
          <span className="material-symbols-outlined notranslate text-[20px]" translate="no">
            &#xe89e;
          </span>
          <span>{isEs ? "Ver sitio" : "View site"}</span>
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-espresso/80 hover:text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined notranslate text-[20px]" translate="no">
            &#xe9ba;
          </span>
          <span>{isEs ? "Cerrar sesión" : "Log out"}</span>
        </button>
      </div>
    </aside>
  );
}

