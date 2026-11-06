"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useNara } from "@/context/NaraContext";
import type { CmsItem } from "@/app/admin/page";

type JourneyTabId = "etapa-1" | "etapa-2" | "etapa-3" | "etapa-4";
type VideoFilterId = "all" | "psycho" | "mobility" | "family" | "meditation";

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const { adminUser } = useNara();
  const isEs = i18n.language?.startsWith("es");

  const [activeJourneyTab, setActiveJourneyTab] = useState<JourneyTabId>("etapa-1");
  const [activeVideoFilter, setActiveVideoFilter] = useState<VideoFilterId>("all");
  const [reservedCircles, setReservedCircles] = useState<Record<string, boolean>>({});
  const [kitEmail, setKitEmail] = useState("");
  const [kitSubmitted, setKitSubmitted] = useState(false);

  // Datos activos en vivo desde PostgreSQL (nara)
  const [cmsItems, setCmsItems] = useState<CmsItem[]>([]);
  const [playingVideoUrl, setPlayingVideoUrl] = useState<string | null>(null);
  const [playingVideoTitle, setPlayingVideoTitle] = useState<string>("");

  useEffect(() => {
    fetch("/api/cms?page=home&status=active", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data?.ok && Array.isArray(data.items)) {
          setCmsItems(data.items);
        }
      })
      .catch(() => {});
  }, []);

  const heroCms = cmsItems.find((i) => i.section === "hero");
  const marqueeCms = cmsItems.find((i) => i.section === "marquee");
  const featuredMasterclassCms = cmsItems.find((i) => i.section === "masterclasses");
  const videoCapsulesCms = cmsItems.filter((i) => i.section === "videos");
  const circlesCms = cmsItems.filter((i) => i.section === "circles");
  const journeyStagesCms = cmsItems.filter((i) => i.section === "journey");
  const pillarsCms = cmsItems.filter((i) => i.section === "pillars");
  const ctaBannerCms = cmsItems.find((i) => i.section === "cta_banner");

  const openVideoModal = (url: string, title: string) => {
    let embedUrl = url || "https://www.youtube.com/embed/inpok4MKVLM";
    if (embedUrl.includes("watch?v=")) {
      const videoId = embedUrl.split("watch?v=")[1]?.split("&")[0];
      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
    setPlayingVideoTitle(title);
    setPlayingVideoUrl(embedUrl);
  };

  const toggleCircleReservation = (id: string) => {
    setReservedCircles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleKitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kitEmail.trim()) return;
    setKitSubmitted(true);
  };

  const customMarqueeString = marqueeCms
    ? isEs
      ? marqueeCms.title_es
      : marqueeCms.title_en
    : "";

  const marqueeWords = customMarqueeString
    ? customMarqueeString
        .split("·")
        .map((w) => w.trim())
        .filter(Boolean)
        .map((text, idx) => ({ text, outline: idx % 2 === 1 }))
    : [
        { text: t("home.marquee.w1"), outline: false },
        { text: t("home.marquee.w2"), outline: true },
        { text: t("home.marquee.w3"), outline: false },
        { text: t("home.marquee.w4"), outline: true },
        { text: t("home.marquee.w5"), outline: false },
        { text: t("home.marquee.w6"), outline: true },
      ];

  return (
    <>
      {/* Barra rápida si el Administrador tiene sesión iniciada */}
      {adminUser && (
        <div className="bg-espresso text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>
              <strong>Modo Administrador Activo</strong> ({adminUser.name}) · Sincronizado con
              PostgreSQL (`nara`) · Mostrando {cmsItems.length} elementos activos en esta página.
            </span>
          </div>
          <Link
            href="/admin"
            className="px-3 py-1 rounded-full bg-primary hover:bg-primary-container text-white font-bold transition-colors"
          >
            ⚙️ Ir al Panel Administrativo para Editar Contenidos →
          </Link>
        </div>
      )}

      {/* =========================================================
           1. HERO CON TRANSICIÓN BLANCO CÁLIDO -> IMAGEN DEL MAR
              Y TARJETA DE CRISTAL FLOTANTE (Soy Paciente / Soy Cuidador)
           ========================================================= */}
      <section
        id="inicio"
        className="relative min-h-[85vh] w-full overflow-hidden flex flex-col justify-between"
      >
        {/* Fondo del Mar con Transición Suave desde el Blanco/Crema Izquierdo */}
        <div className="absolute inset-0 z-0">
          <img
            src={
              heroCms?.media_url ||
              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85"
            }
            alt="Serene ocean at sunset"
            className="w-full h-full object-cover object-right lg:object-center scale-105"
          />

          {/* Degradado de Transición Horizontal */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, #FAF7F2 0%, #FAF7F2 36%, rgba(250,247,242,0.88) 47%, rgba(250,247,242,0.12) 60%, rgba(38,35,34,0.10) 100%)",
            }}
          ></div>

          {/* Resplandor Rosa Suave sobre la parte izquierda */}
          <div
            className="pointer-events-none absolute -left-28 top-20 w-[520px] h-[520px] rounded-full opacity-60 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(226,125,144,0.38) 0%, rgba(250,247,242,0) 70%)",
            }}
          ></div>

          {/* Fundido inferior suave */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-cream to-transparent"></div>
        </div>

        {/* Contenido Central del Hero */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-12 py-10 lg:py-14 w-full my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Columna Izquierda */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm border border-espresso/10">
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse"></span>
                <span className="font-label-md text-label-md text-on-surface-variant font-semibold">
                  {(heroCms && (isEs ? heroCms.badge_es : heroCms.badge_en)) ||
                    t("home.hero.badge")}
                </span>
                <svg
                  className="w-4 h-4 text-primary shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                </svg>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[58px] leading-[1.05] tracking-tight text-espresso font-extrabold">
                <span className="block">{t("home.hero.titleLine1")}</span>
                <span className="block font-serif italic font-normal text-rose-brand my-1">
                  {t("home.hero.titleLine2")}
                </span>
                <span className="block">{t("home.hero.titleLine3")}</span>
              </h1>

              <p className="text-sm sm:text-base text-espresso/80 max-w-xl leading-relaxed">
                {(heroCms && (isEs ? heroCms.description_es : heroCms.description_en)) ||
                  t("home.hero.description")}
              </p>

              {/* Píldoras Encadenadas del Recorrido */}
              <div className="pt-1 space-y-2.5">
                <span className="block text-[10px] font-extrabold uppercase tracking-[0.18em] text-espresso/60">
                  {t("home.hero.orderLabel")}
                </span>
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <a
                    href="#etapas"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-espresso/15 font-semibold text-espresso shadow-2xs hover:border-primary transition-colors"
                  >
                    <span className="w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                      1
                    </span>
                    <span>{t("home.hero.steps.step1")}</span>
                  </a>
                  <span className="text-espresso/40 font-bold">→</span>
                  <a
                    href="#pilares"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-espresso/15 font-semibold text-espresso shadow-2xs hover:border-primary transition-colors"
                  >
                    <span className="w-4 h-4 rounded-full bg-tertiary text-white text-[10px] font-bold flex items-center justify-center">
                      2
                    </span>
                    <span>{t("home.hero.steps.step2")}</span>
                  </a>
                  <span className="text-espresso/40 font-bold">→</span>
                  <a
                    href="#masterclasses"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-espresso/15 font-semibold text-espresso shadow-2xs hover:border-primary transition-colors"
                  >
                    <span className="w-4 h-4 rounded-full bg-rose-brand text-white text-[10px] font-bold flex items-center justify-center">
                      3
                    </span>
                    <span>{t("home.hero.steps.step3")}</span>
                  </a>
                  <span className="text-espresso/40 font-bold">→</span>
                  <a
                    href="#circulos"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-espresso/15 font-semibold text-espresso shadow-2xs hover:border-primary transition-colors"
                  >
                    <span className="w-4 h-4 rounded-full bg-secondary text-white text-[10px] font-bold flex items-center justify-center">
                      4
                    </span>
                    <span>{t("home.hero.steps.step4")}</span>
                  </a>
                </div>
              </div>

              {/* Estadísticas de Confianza */}
              <div className="pt-3 flex flex-wrap items-center gap-5 text-xs font-semibold text-espresso/75">
                <span className="inline-flex items-center gap-1.5">
                  <span className="text-tertiary font-extrabold">✓</span> {t("home.hero.trust.stat1")}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="text-tertiary font-extrabold">✓</span> {t("home.hero.trust.stat2")}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="text-tertiary font-extrabold">✓</span> {t("home.hero.trust.stat3")}
                </span>
              </div>
            </div>

            {/* Columna Derecha: Tarjeta Glassmorphism sobre el Mar */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <div className="w-full max-w-[560px] rounded-[32px] bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_24px_60px_rgba(38,35,34,0.14)] p-6 sm:p-8 space-y-5">
                <div className="space-y-1">
                  <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-[#C4546A] bg-[#FFE8ED] px-3.5 py-1 rounded-full border border-[#FAD0D9]">
                    {t("home.hero.glassCard.badge")}
                  </span>
                  <h2 className="text-2xl sm:text-[26px] font-serif font-bold text-espresso drop-shadow-xs">
                    {t("home.hero.glassCard.title")}
                  </h2>
                  <p className="text-xs sm:text-sm text-espresso/80 font-medium">
                    {t("home.hero.glassCard.subtitle")}
                  </p>
                </div>

                {/* Las 2 Tarjetas (Soy Paciente | Soy Familiar o Cuidador) con armonía de color */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Path 1: Soy Paciente (Armonía Rosa / Coral Vital) */}
                  <Link
                    href="/paciente"
                    className="group relative bg-gradient-to-br from-white via-[#FFF7F9] to-[#FCEBED] rounded-2xl p-5 shadow-[0_8px_28px_rgba(226,125,144,0.12)] hover:shadow-[0_18px_40px_rgba(226,125,144,0.28)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden border border-[#F5C2CC]"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#FCD6DE]/60 to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-125"></div>
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFE4E8] to-[#FAD4DC] flex items-center justify-center mb-3 text-[#C4546A] shadow-inner group-hover:bg-[#C4546A] group-hover:text-white transition-colors duration-300">
                        <span
                          className="material-symbols-outlined notranslate text-[26px]"
                          translate="no"
                        >
                          &#xeb4c;
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="font-label-sm text-[10px] uppercase tracking-wider text-[#C4546A] font-extrabold px-2 py-0.5 rounded-full bg-[#FFE8ED]">
                          {t("home.hero.glassCard.patient.tag")}
                        </span>
                      </div>
                      <h3 className="font-headline-md text-xl text-espresso mb-1 group-hover:text-[#C4546A] transition-colors font-bold">
                        {t("home.hero.glassCard.patient.title")}
                      </h3>
                      <p className="text-xs text-espresso/70 leading-relaxed">
                        {t("home.hero.glassCard.patient.desc")}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#F5D5DC] flex items-center justify-between">
                      <span className="text-xs text-[#C4546A] font-extrabold flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
                        {t("home.hero.glassCard.patient.cta")}
                        <span
                          className="material-symbols-outlined notranslate text-[16px]"
                          translate="no"
                        >
                          &#xe5c8;
                        </span>
                      </span>
                      <span className="text-[10px] text-espresso/70 bg-white/80 px-2.5 py-0.5 rounded-full font-bold shadow-2xs border border-white">
                        {t("home.hero.glassCard.patient.badge")}
                      </span>
                    </div>
                  </Link>

                  {/* Path 2: Soy Familiar o Cuidador (Armonía Salvia / Bosque Sanador) */}
                  <Link
                    href="/cuidadores"
                    className="group relative bg-gradient-to-br from-white via-[#F5FAF7] to-[#E3F2EB] rounded-2xl p-5 shadow-[0_8px_28px_rgba(69,101,88,0.12)] hover:shadow-[0_18px_40px_rgba(69,101,88,0.28)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden border border-[#BDDFCC]"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#D0ECDD]/60 to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-125"></div>
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E3F1E9] to-[#D0ECDD] flex items-center justify-center mb-3 text-[#2E664F] shadow-inner group-hover:bg-[#2E664F] group-hover:text-white transition-colors duration-300">
                        <span
                          className="material-symbols-outlined notranslate text-[26px]"
                          translate="no"
                        >
                          &#xf8d7;
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="font-label-sm text-[10px] uppercase tracking-wider text-[#2E664F] font-extrabold px-2 py-0.5 rounded-full bg-[#D7EFE2]">
                          {t("home.hero.glassCard.caregiver.tag")}
                        </span>
                      </div>
                      <h3 className="font-headline-md text-xl text-espresso mb-1 group-hover:text-[#2E664F] transition-colors font-bold">
                        {t("home.hero.glassCard.caregiver.title")}
                      </h3>
                      <p className="text-xs text-espresso/70 leading-relaxed">
                        {t("home.hero.glassCard.caregiver.desc")}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#CFE7DA] flex items-center justify-between">
                      <span className="text-xs text-[#2E664F] font-extrabold flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
                        {t("home.hero.glassCard.caregiver.cta")}
                        <span
                          className="material-symbols-outlined notranslate text-[16px]"
                          translate="no"
                        >
                          &#xe5c8;
                        </span>
                      </span>
                      <span className="text-[10px] text-espresso/70 bg-white/80 px-2.5 py-0.5 rounded-full font-bold shadow-2xs border border-white">
                        {t("home.hero.glassCard.caregiver.badge")}
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
           CINTA EN MOVIMIENTO CON BOLITA ROSADA (MARQUEE)
           ========================================================= */}
      <div className="border-y border-espresso/10 py-6 overflow-hidden bg-cream select-none">
        <div className="flex w-max whitespace-nowrap animate-marquee items-center">
          {[0, 1].map((blockIdx) => (
            <React.Fragment key={blockIdx}>
              {marqueeWords.map((item, idx) => (
                <React.Fragment key={`${blockIdx}-${idx}`}>
                  <span
                    className={`text-4xl sm:text-5xl lg:text-[54px] mx-7 ${
                      item.outline
                        ? "text-outline-italic"
                        : "font-light tracking-tight text-espresso"
                    }`}
                  >
                    {item.text}
                  </span>
                  <span className="w-3 h-3 rounded-full bg-[#E27D90] shrink-0 mx-2"></span>
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* =========================================================
           MAIN CONTENT
           ========================================================= */}
      <main className="w-full bg-background">
        <div className="flex flex-col w-full">
          {/* SECTION 2: INTERACTIVE JOURNEY TABS */}
          <section
            className="w-full py-space-xl bg-surface-container-low/60 relative overflow-hidden"
            id="etapas"
          >
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-tertiary-fixed/30 blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none"></div>

            <div className="max-w-[1200px] mx-auto px-margin-sm lg:px-margin relative z-10">
              <div className="text-center max-w-2xl mx-auto mb-space-lg">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                  {t("home.journey.badge")}
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mt-1 mb-space-xs">
                  {t("home.journey.title")}
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {t("home.journey.subtitle")}
                </p>
              </div>

              {/* Navigation Tabs Container con Colores Combinados y Distintivos */}
              <div className="flex flex-wrap items-center justify-center gap-2 p-2 bg-white/90 backdrop-blur-md border border-espresso/10 rounded-full max-w-4xl mx-auto mb-space-lg shadow-sm">
                {[
                  {
                    id: "etapa-1" as JourneyTabId,
                    icon: "\uf109",
                    label: t("home.journey.tabs.tab1"),
                    activeClass: "bg-gradient-to-r from-[#D45D74] to-[#C44A62] text-white shadow-md shadow-rose-900/20",
                  },
                  {
                    id: "etapa-2" as JourneyTabId,
                    icon: "\ue798",
                    label: t("home.journey.tabs.tab2"),
                    activeClass: "bg-gradient-to-r from-[#3D7A62] to-[#2B614D] text-white shadow-md shadow-emerald-900/20",
                  },
                  {
                    id: "etapa-3" as JourneyTabId,
                    icon: "\ue3f3",
                    label: t("home.journey.tabs.tab3"),
                    activeClass: "bg-gradient-to-r from-[#C26748] to-[#A85135] text-white shadow-md shadow-orange-900/20",
                  },
                  {
                    id: "etapa-4" as JourneyTabId,
                    icon: "\ue430",
                    label: t("home.journey.tabs.tab4"),
                    activeClass: "bg-gradient-to-r from-[#C9861E] to-[#AA6C12] text-white shadow-md shadow-amber-900/20",
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveJourneyTab(tab.id)}
                    className={`px-5 py-2.5 rounded-full font-label-md text-label-md transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                      activeJourneyTab === tab.id
                        ? `${tab.activeClass} font-bold scale-[1.02]`
                        : "text-espresso/75 hover:text-espresso hover:bg-espresso/5"
                    }`}
                  >
                    <span className="material-symbols-outlined notranslate text-[18px]" translate="no">
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content Cards */}
              <div className="relative min-h-[380px]">
                {/* Tab 1: Diagnóstico */}
                {activeJourneyTab === "etapa-1" && (
                  <div className="bg-surface-container-lowest rounded-2xl p-space-lg lg:p-space-xl shadow-[0_8px_32px_rgba(45,49,66,0.06)] grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
                    <div className="lg:col-span-7 flex flex-col gap-space-sm">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm w-fit">
                        <span className="material-symbols-outlined notranslate text-[14px]" translate="no">
                          &#xea4a;
                        </span>
                        {t("home.journey.stage1.pill")}
                      </span>
                      <h3 className="font-headline-md text-headline-md text-on-surface font-serif">
                        {t("home.journey.stage1.title")}
                      </h3>
                      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                        {t("home.journey.stage1.desc")}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm pt-space-xs">
                        <div className="bg-surface-container-low p-space-sm rounded-xl flex items-start gap-space-xs">
                          <span
                            className="material-symbols-outlined notranslate text-primary text-[22px] shrink-0 mt-0.5"
                            translate="no"
                          >
                            &#xe6b1;
                          </span>
                          <div>
                            <h4 className="font-label-md text-label-md text-on-surface font-bold">
                              {t("home.journey.stage1.card1Title")}
                            </h4>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                              {t("home.journey.stage1.card1Desc")}
                            </p>
                          </div>
                        </div>
                        <div className="bg-surface-container-low p-space-sm rounded-xl flex items-start gap-space-xs">
                          <span
                            className="material-symbols-outlined notranslate text-tertiary text-[22px] shrink-0 mt-0.5"
                            translate="no"
                          >
                            &#xe943;
                          </span>
                          <div>
                            <h4 className="font-label-md text-label-md text-on-surface font-bold">
                              {t("home.journey.stage1.card2Title")}
                            </h4>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                              {t("home.journey.stage1.card2Desc")}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="pt-space-sm flex flex-wrap items-center gap-space-sm">
                        <Link
                          href="/pilares#pilar-biblioteca"
                          className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-space-lg py-2.5 rounded-full transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          <span className="material-symbols-outlined notranslate text-[18px]" translate="no">
                            &#xf090;
                          </span>
                          {t("home.journey.stage1.btnPrimary")}
                        </Link>
                        <Link
                          href="/paciente#micro-calma"
                          className="bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md px-space-md py-2.5 rounded-full transition-all"
                        >
                          {t("home.journey.stage1.btnSecondary")}
                        </Link>
                      </div>
                    </div>
                    <div className="lg:col-span-5 relative">
                      <div className="rounded-xl overflow-hidden shadow-md aspect-4/3 relative bg-surface-container">
                        <img
                          className="w-full h-full object-cover"
                          alt="Compassionate counseling"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpeCMwSIPvOJs1URMTqmZ80oNH-ruK7XAO3alK0VtoSlBVEuWN-hv0LADlz_l6baeEoz9ZwAjajMZc3pBkQHhViXt9GJ6xn8tZeaH0r8AMOoymtiG1_3UuvbAfhj9kIYVCcwtcus1tr9rcvc7ZptCK7h3Krb88kL1496gb0eaSZI2ffbmEgPixPDs4qmWLwKSfzaItiwsh4mbLgiPnAcJ999JxKsGiKYZZbdkB59c"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-variant/70 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4 bg-surface-container-lowest/90 backdrop-blur-sm p-3 rounded-lg">
                          <p className="font-label-sm text-label-sm text-primary font-semibold">
                            {t("home.journey.stage1.tipLabel")}
                          </p>
                          <p className="font-body-sm text-body-sm text-on-surface italic">
                            {t("home.journey.stage1.tipQuote")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: Tratamientos Activos */}
                {activeJourneyTab === "etapa-2" && (
                  <div className="bg-surface-container-lowest rounded-2xl p-space-lg lg:p-space-xl shadow-[0_8px_32px_rgba(45,49,66,0.06)] grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
                    <div className="lg:col-span-7 flex flex-col gap-space-sm">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm w-fit">
                        <span className="material-symbols-outlined notranslate text-[14px]" translate="no">
                          &#xea4b;
                        </span>
                        {t("home.journey.stage2.pill")}
                      </span>
                      <h3 className="font-headline-md text-headline-md text-on-surface font-serif">
                        {t("home.journey.stage2.title")}
                      </h3>
                      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                        {t("home.journey.stage2.desc")}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm pt-space-xs">
                        <div className="bg-surface-container-low p-space-sm rounded-xl flex items-start gap-space-xs">
                          <span
                            className="material-symbols-outlined notranslate text-secondary text-[22px] shrink-0 mt-0.5"
                            translate="no"
                          >
                            &#xe7d3;
                          </span>
                          <div>
                            <h4 className="font-label-md text-label-md text-on-surface font-bold">
                              {t("home.journey.stage2.card1Title")}
                            </h4>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                              {t("home.journey.stage2.card1Desc")}
                            </p>
                          </div>
                        </div>
                        <div className="bg-surface-container-low p-space-sm rounded-xl flex items-start gap-space-xs">
                          <span
                            className="material-symbols-outlined notranslate text-primary text-[22px] shrink-0 mt-0.5"
                            translate="no"
                          >
                            &#xf233;
                          </span>
                          <div>
                            <h4 className="font-label-md text-label-md text-on-surface font-bold">
                              {t("home.journey.stage2.card2Title")}
                            </h4>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                              {t("home.journey.stage2.card2Desc")}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="pt-space-sm flex flex-wrap items-center gap-space-sm">
                        <Link
                          href="/pilares#pilar-nutricion"
                          className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-space-lg py-2.5 rounded-full transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          <span className="material-symbols-outlined notranslate text-[18px]" translate="no">
                            &#xe561;
                          </span>
                          {t("home.journey.stage2.btnPrimary")}
                        </Link>
                        <Link
                          href="/pilares#pilar-nutricion"
                          className="bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md px-space-md py-2.5 rounded-full transition-all"
                        >
                          {t("home.journey.stage2.btnSecondary")}
                        </Link>
                      </div>
                    </div>
                    <div className="lg:col-span-5 relative">
                      <div className="rounded-xl overflow-hidden shadow-md aspect-4/3 relative bg-surface-container">
                        <img
                          className="w-full h-full object-cover"
                          alt="Infusion and comfort"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8o4iagpJ028QF0rCMwYzHnZ32OvOhbcGRfkfHp8gZPzbvKbyq-owVefc02AsfoXETG6rbGp59BHF2hd_OF29PBhBvX9aYw0eSTOCzEK_aaTfoUWdMeMBMi7YLsCtPKXJO0NK9DhpQ9UCiv4vTOouJX0GZgn6724OCEsWtn3k0I7RR-A7uIq2TcPq4ovehH0UTBlSgXXoGYFr1ABuJAwlT6z1wGeh4QMuE63EbCes"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-variant/70 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4 bg-surface-container-lowest/90 backdrop-blur-sm p-3 rounded-lg">
                          <p className="font-label-sm text-label-sm text-tertiary font-semibold">
                            {t("home.journey.stage2.tipLabel")}
                          </p>
                          <p className="font-body-sm text-body-sm text-on-surface italic">
                            {t("home.journey.stage2.tipQuote")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 3: Cirugía */}
                {activeJourneyTab === "etapa-3" && (
                  <div className="bg-surface-container-lowest rounded-2xl p-space-lg lg:p-space-xl shadow-[0_8px_32px_rgba(45,49,66,0.06)] grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
                    <div className="lg:col-span-7 flex flex-col gap-space-sm">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm w-fit">
                        <span className="material-symbols-outlined notranslate text-[14px]" translate="no">
                          &#xe92c;
                        </span>
                        {t("home.journey.stage3.pill")}
                      </span>
                      <h3 className="font-headline-md text-headline-md text-on-surface font-serif">
                        {t("home.journey.stage3.title")}
                      </h3>
                      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                        {t("home.journey.stage3.desc")}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm pt-space-xs">
                        <div className="bg-surface-container-low p-space-sm rounded-xl flex items-start gap-space-xs">
                          <span
                            className="material-symbols-outlined notranslate text-primary text-[22px] shrink-0 mt-0.5"
                            translate="no"
                          >
                            &#xeb44;
                          </span>
                          <div>
                            <h4 className="font-label-md text-label-md text-on-surface font-bold">
                              {t("home.journey.stage3.card1Title")}
                            </h4>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                              {t("home.journey.stage3.card1Desc")}
                            </p>
                          </div>
                        </div>
                        <div className="bg-surface-container-low p-space-sm rounded-xl flex items-start gap-space-xs">
                          <span
                            className="material-symbols-outlined notranslate text-tertiary text-[22px] shrink-0 mt-0.5"
                            translate="no"
                          >
                            &#xe87d;
                          </span>
                          <div>
                            <h4 className="font-label-md text-label-md text-on-surface font-bold">
                              {t("home.journey.stage3.card2Title")}
                            </h4>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                              {t("home.journey.stage3.card2Desc")}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="pt-space-sm flex flex-wrap items-center gap-space-sm">
                        <Link
                          href="/pilares#pilar-movilidad"
                          className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-space-lg py-2.5 rounded-full transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          <span className="material-symbols-outlined notranslate text-[18px]" translate="no">
                            &#xe037;
                          </span>
                          {t("home.journey.stage3.btnPrimary")}
                        </Link>
                        <Link
                          href="/pilares#pilar-derechos"
                          className="bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md px-space-md py-2.5 rounded-full transition-all"
                        >
                          {t("home.journey.stage3.btnSecondary")}
                        </Link>
                      </div>
                    </div>
                    <div className="lg:col-span-5 relative">
                      <div className="rounded-xl overflow-hidden shadow-md aspect-4/3 relative bg-surface-container">
                        <img
                          className="w-full h-full object-cover"
                          alt="Gentle mobility"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWT7byJL05kJZUsHnDmAqk9hC_YPD9rquQtjaedeaPvffUMCO9tbKk9xnwsWbPEmem1WLXOt6hXvPTeW1ziTPXoHz2Rae7hL83cnYZ8jpCBv2PZchlFfvD8iqJVryNtSAhgP3T0yKTSRs8jFY6mRj1DpuNNrwuedIQw030CE60QDEGeyubLVdnYP8xF2U6OEMbcriuPnQTfj6EJ6mYI8yr-bglmb7sJsfjQiwQ_Bw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-variant/70 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4 bg-surface-container-lowest/90 backdrop-blur-sm p-3 rounded-lg">
                          <p className="font-label-sm text-label-sm text-primary font-semibold">
                            {t("home.journey.stage3.tipLabel")}
                          </p>
                          <p className="font-body-sm text-body-sm text-on-surface italic">
                            {t("home.journey.stage3.tipQuote")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 4: Remisión */}
                {activeJourneyTab === "etapa-4" && (
                  <div className="bg-surface-container-lowest rounded-2xl p-space-lg lg:p-space-xl shadow-[0_8px_32px_rgba(45,49,66,0.06)] grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
                    <div className="lg:col-span-7 flex flex-col gap-space-sm">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm w-fit">
                        <span className="material-symbols-outlined notranslate text-[14px]" translate="no">
                          &#xe743;
                        </span>
                        {t("home.journey.stage4.pill")}
                      </span>
                      <h3 className="font-headline-md text-headline-md text-on-surface font-serif">
                        {t("home.journey.stage4.title")}
                      </h3>
                      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                        {t("home.journey.stage4.desc")}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm pt-space-xs">
                        <div className="bg-surface-container-low p-space-sm rounded-xl flex items-start gap-space-xs">
                          <span
                            className="material-symbols-outlined notranslate text-primary text-[22px] shrink-0 mt-0.5"
                            translate="no"
                          >
                            &#xeaf6;
                          </span>
                          <div>
                            <h4 className="font-label-md text-label-md text-on-surface font-bold">
                              {t("home.journey.stage4.card1Title")}
                            </h4>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                              {t("home.journey.stage4.card1Desc")}
                            </p>
                          </div>
                        </div>
                        <div className="bg-surface-container-low p-space-sm rounded-xl flex items-start gap-space-xs">
                          <span
                            className="material-symbols-outlined notranslate text-tertiary text-[22px] shrink-0 mt-0.5"
                            translate="no"
                          >
                            &#xea63;
                          </span>
                          <div>
                            <h4 className="font-label-md text-label-md text-on-surface font-bold">
                              {t("home.journey.stage4.card2Title")}
                            </h4>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                              {t("home.journey.stage4.card2Desc")}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="pt-space-sm flex flex-wrap items-center gap-space-sm">
                        <a
                          href="#circulos"
                          className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-space-lg py-2.5 rounded-full transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          <span className="material-symbols-outlined notranslate text-[18px]" translate="no">
                            &#xe7ef;
                          </span>
                          {t("home.journey.stage4.btnPrimary")}
                        </a>
                        <Link
                          href="/pilares#pilar-biblioteca"
                          className="bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md px-space-md py-2.5 rounded-full transition-all"
                        >
                          {t("home.journey.stage4.btnSecondary")}
                        </Link>
                      </div>
                    </div>
                    <div className="lg:col-span-5 relative">
                      <div className="rounded-xl overflow-hidden shadow-md aspect-4/3 relative bg-surface-container">
                        <img
                          className="w-full h-full object-cover"
                          alt="Woman in remission"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfLLVgFnfv2Tpd9xdMeDFNh2tKX2QtK0xtluQjzcOiyZCU2rAwge8n1STvWCB5de7YD7zbQqfIx3DkylUFtebqhNRarXqDVXfQmz0rBFt1kXKPk1TbotP4SkpmcboYkgmoplqk9gRGLxPLrmZP9qfX7uK4VkANQdtmCHaPHxlYUzwzOpxL_qcjxEozF_YFkpimGhMktNKE8StjRy4W8ch1ISsmeAazpEdqkzPfQ8g"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-variant/70 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4 bg-surface-container-lowest/90 backdrop-blur-sm p-3 rounded-lg">
                          <p className="font-label-sm text-label-sm text-tertiary font-semibold">
                            {t("home.journey.stage4.tipLabel")}
                          </p>
                          <p className="font-body-sm text-body-sm text-on-surface italic">
                            {t("home.journey.stage4.tipQuote")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* SECTION 3: THE 4 PILLARS OF COMPREHENSIVE CARE */}
          <section className="w-full py-space-xl bg-background" id="pilares">
            <div className="max-w-[1200px] mx-auto px-margin-sm lg:px-margin">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl">
                <div className="max-w-xl">
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                    {t("home.pillars.badge")}
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface mt-1">
                    {t("home.pillars.title")}
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                    {t("home.pillars.subtitle")}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <Link
                    href="/pilares"
                    className="inline-flex items-center gap-1.5 text-on-surface-variant hover:text-primary font-label-md text-label-md bg-surface-container hover:bg-secondary-fixed/60 px-space-md py-2 rounded-full transition-colors"
                  >
                    <span
                      className="material-symbols-outlined notranslate text-primary text-[18px]"
                      translate="no"
                    >
                      &#xe898;
                    </span>
                    <span>{t("home.pillars.viewAll")}</span>
                  </Link>
                </div>
              </div>

              {/* 4 Pillars Grid con Paletas de Color Armonizadas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
                {/* Pillar 1: Clinical Nutrition (Verde Esmeralda Nutritivo) */}
                <div className="bg-gradient-to-b from-[#F2F9F5] via-white to-[#F7FAF8] rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(69,101,88,0.08)] hover:shadow-[0_16px_40px_rgba(69,101,88,0.18)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group border border-emerald-200/80">
                  <div>
                    <div className="relative h-44 w-full overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80"
                        alt="Nutrition and digestive wellness"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#F2F9F5] via-[#F2F9F5]/40 to-transparent"></div>
                      <div className="absolute top-3.5 left-3.5 w-12 h-12 rounded-2xl bg-white/95 backdrop-blur-md shadow-sm flex items-center justify-center text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <span
                          className="material-symbols-outlined notranslate text-[24px]"
                          translate="no"
                        >
                          &#xea61;
                        </span>
                      </div>
                    </div>

                    <div className="px-space-lg pt-2">
                      <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-label-sm text-[10px] uppercase tracking-wider font-extrabold mb-space-xs">
                        {t("home.pillars.p1.tag")}
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-espresso mb-space-xs font-serif font-bold">
                        {t("home.pillars.p1.title")}
                      </h3>
                      <p className="font-body-sm text-body-sm text-espresso/75 leading-relaxed mb-space-md">
                        {t("home.pillars.p1.desc")}
                      </p>
                      <ul className="flex flex-col gap-2 mb-space-md font-body-sm text-body-sm text-espresso/80">
                        <li className="flex items-center gap-1.5">
                          <span
                            className="material-symbols-outlined notranslate text-emerald-600 text-[16px]"
                            translate="no"
                          >
                            &#xe86c;
                          </span>{" "}
                          {t("home.pillars.p1.b1")}
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span
                            className="material-symbols-outlined notranslate text-emerald-600 text-[16px]"
                            translate="no"
                          >
                            &#xe86c;
                          </span>{" "}
                          {t("home.pillars.p1.b2")}
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span
                            className="material-symbols-outlined notranslate text-emerald-600 text-[16px]"
                            translate="no"
                          >
                            &#xe86c;
                          </span>{" "}
                          {t("home.pillars.p1.b3")}
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="px-space-lg pb-space-lg">
                    <Link
                      className="w-full inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-label-md text-label-md py-2.5 rounded-full transition-all shadow-xs cursor-pointer"
                      href="/pilares#pilar-nutricion"
                    >
                      <span>{t("home.pillars.p1.cta")}</span>
                      <span className="material-symbols-outlined notranslate text-[16px]" translate="no">
                        &#xe5c8;
                      </span>
                    </Link>
                  </div>
                </div>

                {/* Pillar 2: Biblioteca & Cuadernos (Terracota & Ámbar Cálido) */}
                <div className="bg-gradient-to-b from-[#FFF7F2] via-white to-[#FAF4F0] rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(220,154,126,0.08)] hover:shadow-[0_16px_40px_rgba(220,154,126,0.18)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group border border-orange-200/80">
                  <div>
                    <div className="relative h-44 w-full overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80"
                        alt="Library and workbooks"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#FFF7F2] via-[#FFF7F2]/40 to-transparent"></div>
                      <div className="absolute top-3.5 left-3.5 w-12 h-12 rounded-2xl bg-white/95 backdrop-blur-md shadow-sm flex items-center justify-center text-orange-700 group-hover:bg-[#D97757] group-hover:text-white transition-colors">
                        <span
                          className="material-symbols-outlined notranslate text-[24px]"
                          translate="no"
                        >
                          &#xe666;
                        </span>
                      </div>
                    </div>

                    <div className="px-space-lg pt-2">
                      <div className="inline-block px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 font-label-sm text-[10px] uppercase tracking-wider font-extrabold mb-space-xs">
                        {t("home.pillars.p2.tag")}
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-espresso mb-space-xs font-serif font-bold">
                        {t("home.pillars.p2.title")}
                      </h3>
                      <p className="font-body-sm text-body-sm text-espresso/75 leading-relaxed mb-space-md">
                        {t("home.pillars.p2.desc")}
                      </p>
                      <ul className="flex flex-col gap-2 mb-space-md font-body-sm text-body-sm text-espresso/80">
                        <li className="flex items-center gap-1.5">
                          <span
                            className="material-symbols-outlined notranslate text-orange-600 text-[16px]"
                            translate="no"
                          >
                            &#xe86c;
                          </span>{" "}
                          {t("home.pillars.p2.b1")}
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span
                            className="material-symbols-outlined notranslate text-orange-600 text-[16px]"
                            translate="no"
                          >
                            &#xe86c;
                          </span>{" "}
                          {t("home.pillars.p2.b2")}
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span
                            className="material-symbols-outlined notranslate text-orange-600 text-[16px]"
                            translate="no"
                          >
                            &#xe86c;
                          </span>{" "}
                          {t("home.pillars.p2.b3")}
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="px-space-lg pb-space-lg">
                    <Link
                      className="w-full inline-flex items-center justify-center gap-1.5 bg-[#D97757] hover:bg-[#C26748] text-white font-label-md text-label-md py-2.5 rounded-full transition-all shadow-xs cursor-pointer"
                      href="/pilares#pilar-biblioteca"
                    >
                      <span>{t("home.pillars.p2.cta")}</span>
                      <span className="material-symbols-outlined notranslate text-[16px]" translate="no">
                        &#xf090;
                      </span>
                    </Link>
                  </div>
                </div>

                {/* Pillar 3: Talleres en Video & Movilidad (Azul Océano Serena) */}
                <div className="bg-gradient-to-b from-[#F0F7FF] via-white to-[#F4F8FD] rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(59,130,246,0.08)] hover:shadow-[0_16px_40px_rgba(59,130,246,0.18)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group border border-blue-200/80">
                  <div>
                    <div className="relative h-44 w-full overflow-hidden">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZsgwks_RyAgE_KXp4z3vJo3vyauRAVNcN7i-vaSIYvA5ldslg6CkSx3WXip2kURyqMb-_E-BIgEhwqt3OggYZSs53WtZ7xmfJMgB4nWYGyHD5voFeJPtXoQO_OBVM7lLpTzHNEjEuuXLqvEOTkLaCoKZH1397SiR0Nkwdz05mkOgdUslVoZHeoVPmoyPY_uXBnwkSAoYxrPoSkY2a6ulpjiPRpRUQKjHrmIOsgEM"
                        alt="Video workshops and gentle mobility"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#F0F7FF] via-[#F0F7FF]/40 to-transparent"></div>
                      <div className="absolute top-3.5 left-3.5 w-12 h-12 rounded-2xl bg-white/95 backdrop-blur-md shadow-sm flex items-center justify-center text-blue-700 group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                        <span
                          className="material-symbols-outlined notranslate text-[24px]"
                          translate="no"
                        >
                          &#xe63a;
                        </span>
                      </div>
                    </div>

                    <div className="px-space-lg pt-2">
                      <div className="inline-block px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-label-sm text-[10px] uppercase tracking-wider font-extrabold mb-space-xs">
                        {t("home.pillars.p3.tag")}
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-espresso mb-space-xs font-serif font-bold">
                        {t("home.pillars.p3.title")}
                      </h3>
                      <p className="font-body-sm text-body-sm text-espresso/75 leading-relaxed mb-space-md">
                        {t("home.pillars.p3.desc")}
                      </p>
                      <ul className="flex flex-col gap-2 mb-space-md font-body-sm text-body-sm text-espresso/80">
                        <li className="flex items-center gap-1.5">
                          <span
                            className="material-symbols-outlined notranslate text-blue-600 text-[16px]"
                            translate="no"
                          >
                            &#xe86c;
                          </span>{" "}
                          {t("home.pillars.p3.b1")}
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span
                            className="material-symbols-outlined notranslate text-blue-600 text-[16px]"
                            translate="no"
                          >
                            &#xe86c;
                          </span>{" "}
                          {t("home.pillars.p3.b2")}
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span
                            className="material-symbols-outlined notranslate text-blue-600 text-[16px]"
                            translate="no"
                          >
                            &#xe86c;
                          </span>{" "}
                          {t("home.pillars.p3.b3")}
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="px-space-lg pb-space-lg">
                    <Link
                      className="w-full inline-flex items-center justify-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-label-md text-label-md py-2.5 rounded-full transition-all shadow-xs cursor-pointer"
                      href="/pilares#pilar-movilidad"
                    >
                      <span>{t("home.pillars.p3.cta")}</span>
                      <span className="material-symbols-outlined notranslate text-[16px]" translate="no">
                        &#xe037;
                      </span>
                    </Link>
                  </div>
                </div>

                {/* Pillar 4: Familia y Cuidadores (Rosa & Acompañamiento) */}
                <div className="bg-gradient-to-b from-[#FDF3F5] via-white to-[#FAF2F4] rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(226,125,144,0.08)] hover:shadow-[0_16px_40px_rgba(226,125,144,0.18)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group border border-rose-200/80">
                  <div>
                    <div className="relative h-44 w-full overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80"
                        alt="Family, partners and children"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#FDF3F5] via-[#FDF3F5]/40 to-transparent"></div>
                      <div className="absolute top-3.5 left-3.5 w-12 h-12 rounded-2xl bg-white/95 backdrop-blur-md shadow-sm flex items-center justify-center text-rose-700 group-hover:bg-[#C4546A] group-hover:text-white transition-colors">
                        <span
                          className="material-symbols-outlined notranslate text-[24px]"
                          translate="no"
                        >
                          &#xe8d3;
                        </span>
                      </div>
                    </div>

                    <div className="px-space-lg pt-2">
                      <div className="inline-block px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-label-sm text-[10px] uppercase tracking-wider font-extrabold mb-space-xs">
                        {t("home.pillars.p4.tag")}
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-espresso mb-space-xs font-serif font-bold">
                        {t("home.pillars.p4.title")}
                      </h3>
                      <p className="font-body-sm text-body-sm text-espresso/75 leading-relaxed mb-space-md">
                        {t("home.pillars.p4.desc")}
                      </p>
                      <ul className="flex flex-col gap-2 mb-space-md font-body-sm text-body-sm text-espresso/80">
                        <li className="flex items-center gap-1.5">
                          <span
                            className="material-symbols-outlined notranslate text-rose-600 text-[16px]"
                            translate="no"
                          >
                            &#xe86c;
                          </span>{" "}
                          {t("home.pillars.p4.b1")}
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span
                            className="material-symbols-outlined notranslate text-rose-600 text-[16px]"
                            translate="no"
                          >
                            &#xe86c;
                          </span>{" "}
                          {t("home.pillars.p4.b2")}
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span
                            className="material-symbols-outlined notranslate text-rose-600 text-[16px]"
                            translate="no"
                          >
                            &#xe86c;
                          </span>{" "}
                          {t("home.pillars.p4.b3")}
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="px-space-lg pb-space-lg">
                    <Link
                      className="w-full inline-flex items-center justify-center gap-1.5 bg-[#C4546A] hover:bg-[#A83D52] text-white font-label-md text-label-md py-2.5 rounded-full transition-all shadow-xs cursor-pointer"
                      href="/cuidadores"
                    >
                      <span>{t("home.pillars.p4.cta")}</span>
                      <span className="material-symbols-outlined notranslate text-[16px]" translate="no">
                        &#xf1bd;
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: MASTERCLASSES & VIDEO-CÁPSULAS FRENTE AL MAR */}
          <section
            className="w-full py-space-xl bg-surface-container-low/60 relative overflow-hidden"
            id="masterclasses"
          >
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-tertiary-fixed/30 blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none"></div>
            <div className="max-w-[1200px] mx-auto px-margin-sm lg:px-margin relative z-10">
              <div className="text-center max-w-3xl mx-auto mb-space-lg">
                <div className="inline-flex items-center gap-space-xs bg-tertiary-fixed text-on-tertiary-fixed-variant px-3 py-1 rounded-full font-label-sm text-label-sm mb-space-xs">
                  <span className="material-symbols-outlined notranslate text-[16px]" translate="no">
                    &#xe02c;
                  </span>
                  <span>{t("home.masterclasses.badge")}</span>
                </div>
                <h2 className="font-display-lg text-display-lg text-on-surface font-serif">
                  {t("home.masterclasses.title")}
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto mt-2">
                  {t("home.masterclasses.subtitle")}
                </p>
              </div>

              {/* Filter buttons con Armonía de Colores */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-space-lg">
                {(
                  [
                    { id: "all", label: t("home.masterclasses.filters.all") },
                    { id: "psycho", label: t("home.masterclasses.filters.psycho") },
                    { id: "mobility", label: t("home.masterclasses.filters.mobility") },
                    { id: "family", label: t("home.masterclasses.filters.family") },
                    { id: "meditation", label: t("home.masterclasses.filters.meditation") },
                  ] as const
                ).map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => setActiveVideoFilter(filter.id)}
                    className={`px-4 py-2 rounded-full font-label-md text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                      activeVideoFilter === filter.id
                        ? "bg-gradient-to-r from-[#C4546A] to-[#E27D90] text-white font-bold shadow-md shadow-rose-900/15 scale-[1.02]"
                        : "bg-white hover:bg-rose-50 text-espresso/70 hover:text-espresso border border-espresso/10"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              {/* Featured Masterclass (Conectada a PostgreSQL cms_items) */}
              {featuredMasterclassCms && (
                <div className="bg-surface-container-lowest rounded-3xl p-space-md lg:p-space-lg shadow-[0_16px_40px_rgba(45,49,66,0.08)] mb-space-xl grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
                  <div
                    onClick={() =>
                      openVideoModal(
                        featuredMasterclassCms.cta_link,
                        isEs ? featuredMasterclassCms.title_es : featuredMasterclassCms.title_en
                      )
                    }
                    className="lg:col-span-7 relative rounded-2xl overflow-hidden shadow-md group cursor-pointer"
                  >
                    <img
                      alt={isEs ? featuredMasterclassCms.title_es : featuredMasterclassCms.title_en}
                      className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
                      src={
                        featuredMasterclassCms.media_url ||
                        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85"
                      }
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent flex flex-col justify-between p-space-md">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1 rounded-full font-label-sm text-label-sm text-on-surface font-semibold">
                          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                          {(isEs
                            ? featuredMasterclassCms.badge_es
                            : featuredMasterclassCms.badge_en) ||
                            t("home.masterclasses.featured.badge")}
                        </span>
                        <span className="bg-inverse-surface/80 text-inverse-on-surface px-2.5 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1">
                          <span
                            className="material-symbols-outlined notranslate text-[14px]"
                            translate="no"
                          >
                            &#xe8b5;
                          </span>
                          {(featuredMasterclassCms.meta_json?.duration as string) ||
                            t("home.masterclasses.featured.duration")}
                        </span>
                      </div>
                      <div className="flex items-center justify-center my-auto">
                        <button
                          type="button"
                          className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-[0_8px_24px_rgba(143,75,61,0.5)] group-hover:scale-110 transition-transform cursor-pointer"
                        >
                          <span
                            className="material-symbols-outlined notranslate text-[36px]"
                            translate="no"
                          >
                            &#xe037;
                          </span>
                        </button>
                      </div>
                      <div className="flex items-center justify-between text-inverse-on-surface font-label-sm text-label-sm">
                        <span className="flex items-center gap-1">
                          <span
                            className="material-symbols-outlined notranslate text-[16px]"
                            translate="no"
                          >
                            &#xe050;
                          </span>{" "}
                          {t("home.masterclasses.featured.audioSub")}
                        </span>
                        <span className="bg-surface-container-lowest/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full">
                          4K Ultra HD
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-5 flex flex-col gap-space-sm">
                    <div>
                      <div className="flex items-center gap-2 mb-space-xs">
                        <span className="bg-secondary-fixed text-on-secondary-fixed px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold">
                          {t("home.masterclasses.featured.tag1")}
                        </span>
                        <span className="bg-tertiary-fixed text-on-tertiary-fixed px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold">
                          {t("home.masterclasses.featured.tag2")}
                        </span>
                      </div>
                      <h3 className="font-headline-md text-headline-md text-on-surface font-serif">
                        {isEs ? featuredMasterclassCms.title_es : featuredMasterclassCms.title_en}
                      </h3>
                      <p className="font-label-md text-label-md text-primary font-semibold mt-1">
                        {(isEs
                          ? featuredMasterclassCms.subtitle_es
                          : featuredMasterclassCms.subtitle_en) ||
                          t("home.masterclasses.featured.speaker")}
                      </p>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      {isEs
                        ? featuredMasterclassCms.description_es
                        : featuredMasterclassCms.description_en}
                    </p>
                    <div className="flex flex-col gap-2 bg-surface-container-low p-space-sm rounded-xl font-body-sm text-body-sm text-on-surface-variant">
                      <div className="flex items-center gap-2">
                        <span
                          className="material-symbols-outlined notranslate text-primary text-[18px]"
                          translate="no"
                        >
                          &#xe86c;
                        </span>{" "}
                        {t("home.masterclasses.featured.item1")}
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="material-symbols-outlined notranslate text-primary text-[18px]"
                          translate="no"
                        >
                          &#xe86c;
                        </span>{" "}
                        {t("home.masterclasses.featured.item2")}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
                      <button
                        type="button"
                        onClick={() =>
                          openVideoModal(
                            featuredMasterclassCms.cta_link,
                            isEs
                              ? featuredMasterclassCms.title_es
                              : featuredMasterclassCms.title_en
                          )
                        }
                        className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-space-lg py-2.5 rounded-full transition-all inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <span
                          className="material-symbols-outlined notranslate text-[18px]"
                          translate="no"
                        >
                          &#xe037;
                        </span>{" "}
                        {t("home.masterclasses.featured.playBtn")}
                      </button>
                      <Link
                        href="/pilares#pilar-biblioteca"
                        className="bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md px-space-md py-2.5 rounded-full transition-all inline-flex items-center gap-1.5"
                      >
                        <span
                          className="material-symbols-outlined notranslate text-[18px]"
                          translate="no"
                        >
                          &#xf090;
                        </span>{" "}
                        {t("home.masterclasses.featured.downloadBtn")}
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Tarjetas de Video Dinámicas desde PostgreSQL (solo elementos ACTIVOS) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                {videoCapsulesCms
                  .filter((vid) => {
                    if (activeVideoFilter === "all") return true;
                    const cat = (vid.meta_json?.category as string) || "emotional";
                    if (activeVideoFilter === "psycho") return cat === "emotional";
                    if (activeVideoFilter === "mobility") return cat === "movement";
                    if (activeVideoFilter === "family") return cat === "caregivers";
                    if (activeVideoFilter === "meditation") return cat === "nutrition" || cat === "emotional";
                    return true;
                  })
                  .map((vid) => {
                    const vidTitle = isEs ? vid.title_es : vid.title_en;
                    const vidDesc = isEs ? vid.description_es : vid.description_en;
                    const vidBadge = (isEs ? vid.badge_es : vid.badge_en) || "Video NARA";
                    const vidDuration = (vid.meta_json?.duration as string) || "10 min";
                    return (
                      <div
                        key={vid.id}
                        className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between"
                      >
                        <div
                          onClick={() => openVideoModal(vid.cta_link, vidTitle)}
                          className="relative aspect-video overflow-hidden bg-surface-container cursor-pointer"
                        >
                          <img
                            alt={vidTitle}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            src={
                              vid.media_url ||
                              "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=700&q=80"
                            }
                          />
                          <div className="absolute bottom-2 right-2 bg-inverse-surface/85 text-inverse-on-surface px-2 py-0.5 rounded-md font-label-sm text-label-sm flex items-center gap-1">
                            <span
                              className="material-symbols-outlined notranslate text-[13px]"
                              translate="no"
                            >
                              &#xe8b5;
                            </span>{" "}
                            {vidDuration}
                          </div>
                          <div className="absolute inset-0 bg-inverse-surface/20 group-hover:bg-inverse-surface/40 transition-colors flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-surface-container-lowest/90 text-primary flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                              <span
                                className="material-symbols-outlined notranslate text-[24px]"
                                translate="no"
                              >
                                &#xe037;
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="p-space-md flex flex-col justify-between flex-1">
                          <div className="mb-space-sm">
                            <span className="text-tertiary font-label-sm text-label-sm font-semibold uppercase tracking-wider block mb-1">
                              {vidBadge}
                            </span>
                            <h4 className="font-headline-sm text-headline-sm text-on-surface font-serif">
                              {vidTitle}
                            </h4>
                            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                              {vidDesc}
                            </p>
                          </div>
                          <div className="pt-space-xs flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
                            <span className="flex items-center gap-1">
                              <span
                                className="material-symbols-outlined notranslate text-[15px] text-tertiary"
                                translate="no"
                              >
                                &#xeb4c;
                              </span>{" "}
                              {(isEs ? vid.subtitle_es : vid.subtitle_en) || vidBadge}
                            </span>
                            <button
                              type="button"
                              onClick={() => openVideoModal(vid.cta_link, vidTitle)}
                              className="text-primary font-semibold hover:underline cursor-pointer"
                            >
                              {(isEs ? vid.cta_text_es : vid.cta_text_en) ||
                                t("home.masterclasses.cards.c1.cta")}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </section>

          {/* SECTION 5: COMMUNITY & HEALING CIRCLES */}
          <section className="w-full py-space-xl bg-surface" id="circulos">
            <div className="max-w-[1200px] mx-auto px-margin-sm lg:px-margin">
              <div className="text-center max-w-2xl mx-auto mb-space-xl">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                  {t("home.circles.badge")}
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mt-1 mb-space-xs">
                  {t("home.circles.title")}
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {t("home.circles.subtitle")}
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-space-xl">
                {/* Left: Upcoming Schedule (7 cols) dinámico desde PostgreSQL con Colores Armonizados */}
                <div className="lg:col-span-7 flex flex-col gap-space-sm">
                  {circlesCms.map((circle, idx) => {
                    const circleKey = String(circle.id);
                    const isReserved = !!reservedCircles[circleKey];
                    const circleTitle = isEs ? circle.title_es : circle.title_en;
                    const circleSub = isEs ? circle.subtitle_es : circle.subtitle_en;
                    const circleBadge = isEs ? circle.badge_es : circle.badge_en;
                    const circleDesc = isEs ? circle.description_es : circle.description_en;

                    // Paletas por tipo de círculo (Pacientes = Rosa, Cuidadores = Salvia, Remisión = Dorado)
                    const theme =
                      idx % 3 === 0
                        ? {
                            badgeBg: "bg-gradient-to-br from-[#FFE8ED] to-[#FAD4DC] text-[#C4546A] border border-[#F5C2CC]",
                            pillBg: "bg-[#FFE8ED] text-[#C4546A]",
                            iconColor: "text-[#C4546A]",
                            btnClass: "bg-gradient-to-r from-[#C4546A] to-[#E27D90] hover:from-[#A83D52] hover:to-[#C4546A] text-white shadow-rose-900/15",
                          }
                        : idx % 3 === 1
                        ? {
                            badgeBg: "bg-gradient-to-br from-[#E3F1E9] to-[#D0ECDD] text-[#2E664F] border border-[#BDDFCC]",
                            pillBg: "bg-[#D7EFE2] text-[#2E664F]",
                            iconColor: "text-[#2E664F]",
                            btnClass: "bg-gradient-to-r from-[#2E664F] to-[#458B6D] hover:from-[#214D3B] hover:to-[#2E664F] text-white shadow-emerald-900/15",
                          }
                        : {
                            badgeBg: "bg-gradient-to-br from-[#FEF4E4] to-[#FDE4BA] text-[#A66C15] border border-[#F8D595]",
                            pillBg: "bg-[#FEF1D8] text-[#A66C15]",
                            iconColor: "text-[#A66C15]",
                            btnClass: "bg-gradient-to-r from-[#C9861E] to-[#E09D34] hover:from-[#A4670E] hover:to-[#C9861E] text-white shadow-amber-900/15",
                          };

                    return (
                      <div
                        key={circle.id}
                        className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgba(45,49,66,0.05)] hover:shadow-[0_16px_36px_rgba(45,49,66,0.10)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md border border-espresso/8"
                      >
                        <div className="flex items-start gap-space-sm">
                          <div
                            className={`${theme.badgeBg} rounded-2xl p-3 text-center shrink-0 min-w-[70px] shadow-inner`}
                          >
                            <span className="font-label-sm text-[10px] uppercase block font-extrabold tracking-wider">
                              NARA
                            </span>
                            <span className="font-headline-sm text-2xl font-bold block leading-tight">
                              0{idx + 1}
                            </span>
                            <span className="font-label-sm text-[10px] font-bold block">LIVE</span>
                          </div>
                          <div>
                            <span
                              className={`px-2.5 py-0.5 rounded-full font-label-sm text-[10px] font-extrabold uppercase ${theme.pillBg}`}
                            >
                              {circleBadge}
                            </span>
                            <h3 className="font-headline-sm text-lg font-bold text-espresso mt-1">
                              {circleTitle}
                            </h3>
                            <p className="font-body-sm text-xs font-semibold text-espresso/70 flex items-center gap-1.5 mt-1">
                              <span
                                className={`material-symbols-outlined notranslate text-[16px] ${theme.iconColor}`}
                                translate="no"
                              >
                                &#xe8b5;
                              </span>{" "}
                              {circleSub}
                            </p>
                            <p className="font-body-sm text-xs text-espresso/65 mt-1 leading-relaxed">
                              {circleDesc}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleCircleReservation(circleKey)}
                          className={`w-full sm:w-auto shrink-0 font-label-md text-xs font-bold px-5 py-2.5 rounded-full transition-all shadow-xs cursor-pointer ${
                            isReserved
                              ? "bg-emerald-600 text-white shadow-emerald-900/20"
                              : theme.btnClass
                          }`}
                        >
                          {isReserved
                            ? `✓ ${t("home.circles.reservedLabel")}`
                            : (isEs ? circle.cta_text_es : circle.cta_text_en) ||
                              "Reservar Cupo"}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Right: Human Testimonial Card (5 cols) con Diseño Cálido */}
                <div className="lg:col-span-5">
                  <div className="bg-gradient-to-br from-white via-[#FCF9F7] to-[#FDF4EF] rounded-3xl p-6 sm:p-8 shadow-[0_16px_40px_rgba(45,49,66,0.06)] h-full flex flex-col justify-between relative overflow-hidden border border-[#F5D8CF]">
                    <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-rose-200/40 to-transparent rounded-full blur-2xl pointer-events-none"></div>
                    <div>
                      <div className="flex items-center gap-1 text-[#C4546A] mb-space-md">
                        <span className="material-symbols-outlined notranslate text-[26px]" translate="no">
                          &#xe244;
                        </span>
                        <span className="material-symbols-outlined notranslate text-[26px]" translate="no">
                          &#xe244;
                        </span>
                      </div>
                      <blockquote className="font-headline-sm text-lg sm:text-xl font-serif text-espresso leading-snug mb-space-md italic">
                        {t("home.circles.testimonial.quote")}
                      </blockquote>
                    </div>
                    <div className="pt-space-md border-t border-[#F7E4DC] flex items-center gap-space-md">
                      <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 shadow-md ring-2 ring-[#C4546A]/20">
                        <img
                          className="w-full h-full object-cover"
                          alt={t("home.circles.testimonial.name")}
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCknKbbb_J5IkWahwH28bHoxUFjIpY3H5DHpa8gIFHXhHquSuUFShYwIa7WBqQBv81FoGcFFbJDIJR4LigP3StEzjZLT0_ZUkmyEsP-XylcAMg6lWC6Xa74tpFfuQ19dMySnahHxjJpLJUZefa3Plra2YQCWWBU2dgojW65qz187fNv75ZBN74OlWLS2_4N_1UVsInfn03cIh4lGyyzAdVEEZHou3ClSoTeAS_l6P4"
                        />
                      </div>
                      <div>
                        <h4 className="font-label-lg text-sm text-espresso font-bold">
                          {t("home.circles.testimonial.name")}
                        </h4>
                        <p className="font-body-sm text-xs text-espresso/65">
                          {t("home.circles.testimonial.role")}
                        </p>
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-[#FFE8ED] text-[#C4546A] text-[10px] font-extrabold">
                          {t("home.circles.testimonial.badge")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 6: COMFORTING FINAL CALL TO ACTION BANNER */}
          <section className="w-full py-space-xl bg-gradient-to-b from-surface via-surface-container-low to-surface-container">
            <div className="max-w-[1200px] mx-auto px-margin-sm lg:px-margin">
              <div className="bg-gradient-to-r from-surface-container-lowest via-surface-container-lowest to-surface-container-low rounded-3xl p-space-lg lg:p-space-xl shadow-[0_16px_40px_rgba(45,49,66,0.08)] relative overflow-hidden">
                <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-primary-fixed/40 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -top-16 -left-16 w-64 h-64 bg-tertiary-fixed/40 rounded-full blur-3xl pointer-events-none"></div>
                <div className="relative z-10 max-w-3xl mx-auto text-center">
                  <div className="w-16 h-16 rounded-full bg-secondary-fixed text-primary flex items-center justify-center mx-auto mb-space-md shadow-sm">
                    <span className="material-symbols-outlined notranslate text-[32px]" translate="no">
                      &#xea70;
                    </span>
                  </div>
                  <h2 className="font-display-lg text-display-lg text-on-surface mb-space-xs font-serif">
                    {(ctaBannerCms &&
                      (isEs ? ctaBannerCms.title_es : ctaBannerCms.title_en)) ||
                      t("home.ctaBanner.title")}
                  </h2>
                  <p className="font-body-lg text-body-lg text-on-surface-variant mb-space-lg max-w-xl mx-auto leading-relaxed">
                    {ctaBannerCms ? (
                      isEs ? (
                        ctaBannerCms.description_es
                      ) : (
                        ctaBannerCms.description_en
                      )
                    ) : (
                      <>
                        {t("home.ctaBanner.descPart1")}
                        <strong className="text-on-surface font-semibold">
                          {t("home.ctaBanner.descHighlight")}
                        </strong>
                        {t("home.ctaBanner.descPart2")}
                      </>
                    )}
                  </p>

                  {/* Opt-in Form */}
                  <div className="max-w-md mx-auto">
                    <form
                      className="flex flex-col sm:flex-row items-center gap-2 mb-space-xs"
                      onSubmit={handleKitSubmit}
                    >
                      <input
                        className="w-full bg-surface-container-lowest rounded-full px-5 py-3.5 font-body-md text-body-md text-on-surface shadow-xs focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-on-surface-variant/70 border border-outline-variant/40"
                        placeholder={t("home.ctaBanner.emailPlaceholder")}
                        required
                        type="email"
                        value={kitEmail}
                        onChange={(e) => setKitEmail(e.target.value)}
                        disabled={kitSubmitted}
                      />
                      <button
                        className="w-full sm:w-auto shrink-0 bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg px-space-lg py-3.5 rounded-full shadow-[0_8px_20px_rgba(212,131,114,0.3)] transition-all cursor-pointer"
                        type="submit"
                      >
                        {t("home.ctaBanner.submitBtn")}
                      </button>
                    </form>
                    {kitSubmitted && (
                      <div className="text-tertiary font-label-md text-label-md mt-2 flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined notranslate text-[18px]" translate="no">
                          &#xe87d;
                        </span>
                        {t("home.ctaBanner.successMsg")}
                      </div>
                    )}
                    <p className="font-label-sm text-label-sm text-on-surface-variant mt-2 text-center">
                      {t("home.ctaBanner.privacyNote")}
                    </p>
                  </div>

                  {/* Direct Phone Support Highlight */}
                  <div className="mt-space-lg pt-space-md flex flex-wrap items-center justify-center gap-space-md text-on-surface-variant font-label-md text-label-md">
                    <span className="flex items-center gap-1.5">
                      <span
                        className="material-symbols-outlined notranslate text-primary text-[20px]"
                        translate="no"
                      >
                        &#xe0b0;
                      </span>
                      {t("home.ctaBanner.needTalk")}{" "}
                      <strong className="text-on-surface">{t("home.ctaBanner.phone")}</strong>{" "}
                      {t("home.ctaBanner.tollFree")}
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="flex items-center gap-1.5">
                      <span
                        className="material-symbols-outlined notranslate text-tertiary text-[20px]"
                        translate="no"
                      >
                        &#xe0b7;
                      </span>
                      {t("home.ctaBanner.crisisChat")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* MODAL REPRODUCTOR DE VIDEO EN VIVO */}
      {playingVideoUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPlayingVideoUrl(null)}
        >
          <div
            className="bg-espresso rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-white/15"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 text-white">
              <h3 className="font-serif font-bold text-lg truncate">{playingVideoTitle}</h3>
              <button
                type="button"
                onClick={() => setPlayingVideoUrl(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                src={playingVideoUrl}
                title={playingVideoTitle}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
