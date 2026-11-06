"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useNara } from "@/context/NaraContext";

export function Navbar() {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const { toggleVoiceWidget, toggleLoginModal, adminUser, logoutAdmin } = useNara();

  const currentLang = i18n.language?.startsWith("es") ? "es" : "en";

  const changeLanguage = (lang: "en" | "es") => {
    i18n.changeLanguage(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("nara-lang", lang);
      document.documentElement.lang = lang;
    }
  };

  return (
    <header
      className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-espresso/8 shadow-[0_4px_20px_rgba(38,35,34,0.04)]"
      translate="no"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between gap-4">
        {/* LOGO / MARCA */}
        <Link href="/" className="inline-flex items-center gap-3.5 group shrink-0">
          <div className="w-10 h-10 rounded-full bg-rose-soft flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
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
              {t("nav.brandSubtitle")}
            </span>
          </div>
        </Link>

        {/* NAVEGACIÓN DESPLEGABLE COMPACTA */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {/* 1. Inicio */}
          <Link
            href="/"
            className={`px-3.5 py-2 rounded-xl text-xs lg:text-sm font-bold transition-colors ${
              pathname === "/"
                ? "text-espresso bg-espresso/5"
                : "text-espresso/80 hover:text-espresso hover:bg-espresso/5"
            }`}
          >
            {t("nav.home")}
          </Link>

          {/* 2. Menú Desplegable Paciente */}
          <div className="relative group">
            <Link
              href="/paciente"
              className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs lg:text-sm font-bold transition-colors ${
                pathname === "/paciente"
                  ? "text-primary bg-primary/10"
                  : "text-espresso/80 group-hover:text-primary group-hover:bg-primary/5"
              }`}
            >
              <span>{t("nav.patient.label")}</span>
              <svg
                className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform text-espresso/60 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
            <div className="absolute left-0 top-full pt-2 w-72 hidden group-hover:block transition-all z-50">
              <div className="bg-white rounded-2xl shadow-xl border border-espresso/10 p-2 space-y-1">
                <Link
                  href="/paciente"
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-secondary-fixed/30 transition-colors"
                >
                  <span className="material-symbols-outlined notranslate text-primary text-[20px] mt-0.5" translate="no">
                    &#xe922;
                  </span>
                  <div>
                    <span className="block text-xs font-bold text-espresso">
                      {t("nav.patient.items.journey.title")}
                    </span>
                    <span className="block text-[11px] text-espresso/60">
                      {t("nav.patient.items.journey.desc")}
                    </span>
                  </div>
                </Link>
                <Link
                  href="/paciente#diario-bienestar"
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-secondary-fixed/30 transition-colors"
                >
                  <span className="material-symbols-outlined notranslate text-primary text-[20px] mt-0.5" translate="no">
                    &#xe745;
                  </span>
                  <div>
                    <span className="block text-xs font-bold text-espresso">
                      {t("nav.patient.items.diary.title")}
                    </span>
                    <span className="block text-[11px] text-espresso/60">
                      {t("nav.patient.items.diary.desc")}
                    </span>
                  </div>
                </Link>
                <Link
                  href="/paciente#micro-calma"
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-secondary-fixed/30 transition-colors"
                >
                  <span className="material-symbols-outlined notranslate text-primary text-[20px] mt-0.5" translate="no">
                    &#xe176;
                  </span>
                  <div>
                    <span className="block text-xs font-bold text-espresso">
                      {t("nav.patient.items.calm.title")}
                    </span>
                    <span className="block text-[11px] text-espresso/60">
                      {t("nav.patient.items.calm.desc")}
                    </span>
                  </div>
                </Link>
                <Link
                  href="/paciente#circulos-paciente"
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-secondary-fixed/30 transition-colors"
                >
                  <span className="material-symbols-outlined notranslate text-primary text-[20px] mt-0.5" translate="no">
                    &#xe7ef;
                  </span>
                  <div>
                    <span className="block text-xs font-bold text-espresso">
                      {t("nav.patient.items.circles.title")}
                    </span>
                    <span className="block text-[11px] text-espresso/60">
                      {t("nav.patient.items.circles.desc")}
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* 3. Menú Desplegable Cuidadores */}
          <div className="relative group">
            <Link
              href="/cuidadores"
              className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs lg:text-sm font-bold transition-colors ${
                pathname === "/cuidadores"
                  ? "text-tertiary bg-tertiary/10"
                  : "text-espresso/80 group-hover:text-tertiary group-hover:bg-tertiary/5"
              }`}
            >
              <span>{t("nav.caregivers.label")}</span>
              <svg
                className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform text-espresso/60 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
            <div className="absolute left-0 top-full pt-2 w-72 hidden group-hover:block transition-all z-50">
              <div className="bg-white rounded-2xl shadow-xl border border-espresso/10 p-2 space-y-1">
                <Link
                  href="/cuidadores"
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-tertiary-fixed/40 transition-colors"
                >
                  <span className="material-symbols-outlined notranslate text-tertiary text-[20px] mt-0.5" translate="no">
                    &#xea70;
                  </span>
                  <div>
                    <span className="block text-xs font-bold text-espresso">
                      {t("nav.caregivers.items.haven.title")}
                    </span>
                    <span className="block text-[11px] text-espresso/60">
                      {t("nav.caregivers.items.haven.desc")}
                    </span>
                  </div>
                </Link>
                <Link
                  href="/cuidadores#diccionario"
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-tertiary-fixed/40 transition-colors"
                >
                  <span className="material-symbols-outlined notranslate text-tertiary text-[20px] mt-0.5" translate="no">
                    &#xe0b7;
                  </span>
                  <div>
                    <span className="block text-xs font-bold text-espresso">
                      {t("nav.caregivers.items.dictionary.title")}
                    </span>
                    <span className="block text-[11px] text-espresso/60">
                      {t("nav.caregivers.items.dictionary.desc")}
                    </span>
                  </div>
                </Link>
                <Link
                  href="/cuidadores#hijos"
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-tertiary-fixed/40 transition-colors"
                >
                  <span className="material-symbols-outlined notranslate text-tertiary text-[20px] mt-0.5" translate="no">
                    &#xf1bd;
                  </span>
                  <div>
                    <span className="block text-xs font-bold text-espresso">
                      {t("nav.caregivers.items.children.title")}
                    </span>
                    <span className="block text-[11px] text-espresso/60">
                      {t("nav.caregivers.items.children.desc")}
                    </span>
                  </div>
                </Link>
                <Link
                  href="/cuidadores#autocuidado"
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-tertiary-fixed/40 transition-colors"
                >
                  <span className="material-symbols-outlined notranslate text-tertiary text-[20px] mt-0.5" translate="no">
                    &#xe1a3;
                  </span>
                  <div>
                    <span className="block text-xs font-bold text-espresso">
                      {t("nav.caregivers.items.selfcare.title")}
                    </span>
                    <span className="block text-[11px] text-espresso/60">
                      {t("nav.caregivers.items.selfcare.desc")}
                    </span>
                  </div>
                </Link>
                <Link
                  href="/cuidadores#circulos"
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-tertiary-fixed/40 transition-colors"
                >
                  <span className="material-symbols-outlined notranslate text-tertiary text-[20px] mt-0.5" translate="no">
                    &#xe7ef;
                  </span>
                  <div>
                    <span className="block text-xs font-bold text-espresso">
                      {t("nav.caregivers.items.circles.title")}
                    </span>
                    <span className="block text-[11px] text-espresso/60">
                      {t("nav.caregivers.items.circles.desc")}
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* 4. Menú Desplegable Recursos & Pilares */}
          <div className="relative group">
            <Link
              href="/pilares"
              className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs lg:text-sm font-bold transition-colors ${
                pathname === "/pilares"
                  ? "text-primary bg-primary/10"
                  : "text-espresso/80 group-hover:text-primary group-hover:bg-primary/5"
              }`}
            >
              <span>{t("nav.resources.label")}</span>
              <svg
                className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform text-espresso/60 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
            <div className="absolute left-0 top-full pt-2 w-72 hidden group-hover:block transition-all z-50">
              <div className="bg-white rounded-2xl shadow-xl border border-espresso/10 p-2 space-y-1">
                <Link
                  href="/pilares#pilar-nutricion"
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-secondary-fixed/30 transition-colors"
                >
                  <span className="material-symbols-outlined notranslate text-primary text-[20px] mt-0.5" translate="no">
                    &#xe56c;
                  </span>
                  <div>
                    <span className="block text-xs font-bold text-espresso">
                      {t("nav.resources.items.nutrition.title")}
                    </span>
                    <span className="block text-[11px] text-espresso/60">
                      {t("nav.resources.items.nutrition.desc")}
                    </span>
                  </div>
                </Link>
                <Link
                  href="/pilares#pilar-biblioteca"
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-secondary-fixed/30 transition-colors"
                >
                  <span className="material-symbols-outlined notranslate text-primary text-[20px] mt-0.5" translate="no">
                    &#xe865;
                  </span>
                  <div>
                    <span className="block text-xs font-bold text-espresso">
                      {t("nav.resources.items.library.title")}
                    </span>
                    <span className="block text-[11px] text-espresso/60">
                      {t("nav.resources.items.library.desc")}
                    </span>
                  </div>
                </Link>
                <Link
                  href="/pilares#pilar-movilidad"
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-secondary-fixed/30 transition-colors"
                >
                  <span className="material-symbols-outlined notranslate text-primary text-[20px] mt-0.5" translate="no">
                    &#xe943;
                  </span>
                  <div>
                    <span className="block text-xs font-bold text-espresso">
                      {t("nav.resources.items.mobility.title")}
                    </span>
                    <span className="block text-[11px] text-espresso/60">
                      {t("nav.resources.items.mobility.desc")}
                    </span>
                  </div>
                </Link>
                <Link
                  href="/pilares#pilar-derechos"
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-secondary-fixed/30 transition-colors"
                >
                  <span className="material-symbols-outlined notranslate text-primary text-[20px] mt-0.5" translate="no">
                    &#xea80;
                  </span>
                  <div>
                    <span className="block text-xs font-bold text-espresso">
                      {t("nav.resources.items.rights.title")}
                    </span>
                    <span className="block text-[11px] text-espresso/60">
                      {t("nav.resources.items.rights.desc")}
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* 5. Menú Desplegable Community */}
          <div className="relative group">
            <button
              type="button"
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs lg:text-sm font-bold text-espresso/80 group-hover:text-primary group-hover:bg-primary/5 transition-colors"
            >
              <span>{t("nav.community.label")}</span>
              <svg
                className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform text-espresso/60 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute right-0 top-full pt-2 w-72 hidden group-hover:block transition-all z-50">
              <div className="bg-white rounded-2xl shadow-xl border border-espresso/10 p-2 space-y-1">
                <Link
                  href="/#circulos"
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-primary/5 transition-colors"
                >
                  <span className="material-symbols-outlined notranslate text-primary text-[20px] mt-0.5" translate="no">
                    &#xe7ef;
                  </span>
                  <div>
                    <span className="block text-xs font-bold text-espresso">
                      {t("nav.community.items.circles.title")}
                    </span>
                    <span className="block text-[11px] text-espresso/60">
                      {t("nav.community.items.circles.desc")}
                    </span>
                  </div>
                </Link>
                <Link
                  href="/#masterclasses"
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-primary/5 transition-colors"
                >
                  <span className="material-symbols-outlined notranslate text-primary text-[20px] mt-0.5" translate="no">
                    &#xe037;
                  </span>
                  <div>
                    <span className="block text-xs font-bold text-espresso">
                      {t("nav.community.items.videos.title")}
                    </span>
                    <span className="block text-[11px] text-espresso/60">
                      {t("nav.community.items.videos.desc")}
                    </span>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={toggleVoiceWidget}
                  className="w-full text-left flex items-start gap-3 p-2.5 rounded-xl hover:bg-secondary-fixed/40 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined notranslate text-primary text-[20px] mt-0.5" translate="no">
                    &#xe91f;
                  </span>
                  <div>
                    <span className="block text-xs font-bold text-espresso">
                      {t("nav.community.items.voice.title")}
                    </span>
                    <span className="block text-[11px] text-espresso/60">
                      {t("nav.community.items.voice.desc")}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* BOTONES DE ACCIÓN DERECHA */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector EN | ES */}
          <div
            className="inline-flex items-center bg-white border border-espresso/15 rounded-full p-0.5 shadow-2xs text-xs font-bold shrink-0"
            title={t("nav.switchLangTitle")}
          >
            <button
              type="button"
              onClick={() => changeLanguage("es")}
              className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                currentLang === "es"
                  ? "bg-primary text-white shadow-2xs"
                  : "text-espresso/70 hover:text-espresso"
              }`}
            >
              ES
            </button>
            <button
              type="button"
              onClick={() => changeLanguage("en")}
              className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                currentLang === "en"
                  ? "bg-primary text-white shadow-2xs"
                  : "text-espresso/70 hover:text-espresso"
              }`}
            >
              EN
            </button>
          </div>

          {/* Botón Voz NARA */}
          <button
            type="button"
            onClick={toggleVoiceWidget}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-secondary-fixed/70 hover:bg-secondary-fixed text-primary text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse"></span>
            <span className="material-symbols-outlined notranslate text-[16px]" translate="no">
              &#xe029;
            </span>
            <span className="hidden sm:inline">{t("nav.voiceBtn")}</span>
          </button>

          {/* Botón Login / Panel Admin */}
          {adminUser ? (
            <div className="inline-flex items-center gap-1.5">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-sage hover:bg-sage/90 text-white text-xs font-bold shadow-sm transition-all"
              >
                <span className="material-symbols-outlined notranslate text-[16px]" translate="no">
                  &#xe8b8;
                </span>
                <span>{currentLang === "es" ? "Panel Admin" : "Admin Panel"}</span>
              </Link>
              <button
                type="button"
                onClick={logoutAdmin}
                title={currentLang === "es" ? "Cerrar sesión" : "Log out"}
                className="w-8 h-8 rounded-full bg-espresso/10 hover:bg-red-100 hover:text-red-700 text-espresso flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={toggleLoginModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary hover:bg-primary-container text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined notranslate text-[16px]" translate="no">
                &#xe7fd;
              </span>
              <span>{t("nav.signIn")}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

