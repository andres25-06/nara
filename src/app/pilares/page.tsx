"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useNara } from "@/context/NaraContext";
import type { CmsItem } from "@/types/cms";

export default function PillarsPage() {
  const { adminUser } = useNara();
  const [cmsItems, setCmsItems] = useState<CmsItem[]>([]);
  const [playingVideoUrl, setPlayingVideoUrl] = useState<string | null>(null);
  const [playingVideoTitle, setPlayingVideoTitle] = useState<string>("");

  useEffect(() => {
    fetch("/api/cms?page=pilares&status=active", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data?.ok && Array.isArray(data.items)) {
          setCmsItems(data.items);
        }
      })
      .catch(() => {});
  }, []);

  const openVideoModal = (url: string, title: string) => {
    let embedUrl = url || "https://www.youtube.com/embed/inpok4MKVLM";
    if (embedUrl.includes("watch?v=")) {
      const videoId = embedUrl.split("watch?v=")[1]?.split("&")[0];
      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
    setPlayingVideoTitle(title);
    setPlayingVideoUrl(embedUrl);
  };

  const heroCms = cmsItems.find((i) => i.section === "pillars_hero");
  const nutritionCms = cmsItems
    .filter((i) => i.section === "pillars_nutrition")
    .sort((a, b) => a.display_order - b.display_order || a.id - b.id);
  const libraryCms = cmsItems
    .filter((i) => i.section === "pillars_library")
    .sort((a, b) => a.display_order - b.display_order || a.id - b.id);
  const mobilityCms = cmsItems
    .filter((i) => i.section === "pillars_mobility")
    .sort((a, b) => a.display_order - b.display_order || a.id - b.id);
  const rightsCms = cmsItems
    .filter((i) => i.section === "pillars_rights")
    .sort((a, b) => a.display_order - b.display_order || a.id - b.id);

  return (
    <div className="min-h-screen bg-background text-espresso">
      {/* Barra rápida si el Administrador tiene sesión iniciada */}
      {adminUser && (
        <div className="bg-espresso text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              <strong>Admin Mode Active</strong> ({adminUser.name}) · Resources & Pillars (`pilares`) ·{" "}
              {cmsItems.length} active items.
            </span>
          </div>
          <Link
            href="/admin"
            className="px-3 py-1 rounded-full bg-primary hover:bg-primary-container text-white font-bold transition-colors"
          >
            ⚙️ Edit in Admin Panel →
          </Link>
        </div>
      )}

      {/* =========================================================
          1. HERO · THE 4 PILLARS OF INTEGRATIVE ONCOLOGY SUPPORT
         ========================================================= */}
      <section className="relative overflow-hidden py-14 lg:py-20 bg-gradient-to-b from-[#FEF8F2] via-[#FAF8F5] to-background border-b border-espresso/8">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-2xs border border-espresso/10 text-xs font-extrabold text-primary">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {heroCms?.badge_en || "Resources & 4 Pillars"}
            </span>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-tertiary">
              {heroCms?.subtitle_en || "NUTRITION · LIBRARY · MINDFUL MOVEMENT · PATIENT RIGHTS"}
            </p>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-espresso leading-[1.12]">
              {heroCms?.title_en || "The 4 Pillars of Integrative Oncology Support"}
            </h1>
            <p className="text-base text-espresso/75 leading-relaxed max-w-2xl">
              {heroCms?.description_en ||
                "Evidence-based resources created with oncology specialists to nourish your body, organize your medical appointments, restore mobility safely, and protect your rights."}
            </p>

            {/* Accesos rápidos a los 4 pilares */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <a
                href={heroCms?.cta_link || "#pilar-nutricion"}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary-container text-white text-xs font-bold shadow-sm transition-all"
              >
                <span className="material-symbols-outlined notranslate text-[17px]" translate="no">
                  &#xe56c;
                </span>
                {heroCms?.cta_text_en || "Explore Nutrition Recipes"}
              </a>
              <a
                href="#pilar-biblioteca"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-secondary-fixed/40 text-espresso border border-espresso/15 text-xs font-bold transition-colors"
              >
                <span className="material-symbols-outlined notranslate text-primary text-[17px]" translate="no">
                  &#xe865;
                </span>
                Guides & Workbooks
              </a>
              <a
                href="#pilar-movilidad"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-secondary-fixed/40 text-espresso border border-espresso/15 text-xs font-bold transition-colors"
              >
                <span className="material-symbols-outlined notranslate text-tertiary text-[17px]" translate="no">
                  &#xe943;
                </span>
                Mindful Movement
              </a>
              <a
                href="#pilar-derechos"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-secondary-fixed/40 text-espresso border border-espresso/15 text-xs font-bold transition-colors"
              >
                <span className="material-symbols-outlined notranslate text-primary text-[17px]" translate="no">
                  &#xea80;
                </span>
                Rights & Benefits
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(38,35,34,0.14)] border-4 border-white aspect-4/3 bg-surface-container">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  heroCms?.media_url ||
                  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=80"
                }
                alt={heroCms?.title_en || "Resources & 4 Pillars"}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          2. PILLAR 1: NUTRITION & RECIPES (#pilar-nutricion)
         ========================================================= */}
      <section id="pilar-nutricion" className="py-16 lg:py-20 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-tertiary font-extrabold">
            PILLAR 01 · ONCOLOGY NUTRITION
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-espresso mt-1">
            Nourishing Recipes for Treatment & Recovery
          </h2>
          <p className="text-sm sm:text-base text-espresso/70 mt-2">
            Gentle, anti-inflammatory preparations designed to soothe nausea, hydrate cells, and rebuild strength.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {nutritionCms.map((recipe) => {
            const tip = (recipe.meta_json?.tip_en as string) || "";
            return (
              <div
                key={recipe.id}
                className="bg-white rounded-3xl overflow-hidden border border-espresso/10 shadow-[0_8px_30px_rgba(38,35,34,0.05)] flex flex-col justify-between"
              >
                <div>
                  {recipe.media_url && (
                    <div className="relative h-48 w-full overflow-hidden bg-surface-container">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={recipe.media_url}
                        alt={recipe.title_en}
                        className="w-full h-full object-cover"
                      />
                      {recipe.badge_en && (
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 text-[#2E664F] text-[10px] font-extrabold uppercase tracking-wider shadow-2xs">
                          {recipe.badge_en}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="p-6 space-y-3">
                    {recipe.subtitle_en && (
                      <span className="block text-[11px] font-extrabold uppercase tracking-wider text-tertiary">
                        {recipe.subtitle_en}
                      </span>
                    )}
                    <h3 className="font-serif text-xl font-bold text-espresso leading-snug">
                      {recipe.title_en}
                    </h3>
                    <p className="text-xs sm:text-sm text-espresso/75 leading-relaxed">
                      {recipe.description_en}
                    </p>
                    {tip && (
                      <div className="p-3.5 rounded-2xl bg-[#F2F9F5] border border-[#BDDFCC] space-y-1">
                        <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#2E664F]">
                          ✦ Clinical nutrition tip
                        </span>
                        <p className="text-xs text-espresso/85">{tip}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          3. PILLAR 2: GUIDES & WORKBOOKS PDF (#pilar-biblioteca)
         ========================================================= */}
      <section
        id="pilar-biblioteca"
        className="py-16 lg:py-20 bg-surface-container-low/60 border-y border-espresso/8"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-primary font-extrabold">
              PILLAR 02 · LIBRARY & WORKBOOKS
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-espresso mt-1">
              Practical Guides & Checklists for Appointments
            </h2>
            <p className="text-sm sm:text-base text-espresso/70 mt-2">
              Clear, printable resources so you never feel lost before or after a medical consultation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {libraryCms.map((guide) => (
              <div
                key={guide.id}
                className="bg-white rounded-3xl p-6 border border-espresso/10 shadow-2xs flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined notranslate text-[24px]" translate="no">
                        &#xe865;
                      </span>
                    </span>
                    {guide.badge_en && (
                      <span className="px-3 py-1 rounded-full bg-[#FFE8ED] text-[#C4546A] text-[10px] font-extrabold uppercase tracking-wider">
                        {guide.badge_en}
                      </span>
                    )}
                  </div>
                  {guide.subtitle_en && (
                    <span className="block text-[11px] font-extrabold uppercase tracking-wider text-tertiary">
                      {guide.subtitle_en}
                    </span>
                  )}
                  <h3 className="font-serif text-xl font-bold text-espresso leading-snug">
                    {guide.title_en}
                  </h3>
                  <p className="text-xs sm:text-sm text-espresso/75 leading-relaxed">
                    {guide.description_en}
                  </p>
                </div>

                {guide.cta_text_en && (
                  <Link
                    href={guide.cta_link || "/paciente"}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-full bg-espresso/5 hover:bg-primary hover:text-white text-espresso text-xs font-bold transition-colors"
                  >
                    <span>{guide.cta_text_en}</span>
                    <span className="material-symbols-outlined notranslate text-[16px]" translate="no">
                      &#xe5c8;
                    </span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          4. PILLAR 3: MINDFUL MOVEMENT (#pilar-movilidad)
         ========================================================= */}
      <section id="pilar-movilidad" className="py-16 lg:py-20 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-tertiary font-extrabold">
            PILLAR 03 · MINDFUL MOVEMENT
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-espresso mt-1">
            Safe Mobility, Chair Yoga & Lymphatic Care
          </h2>
          <p className="text-sm sm:text-base text-espresso/70 mt-2">
            Gentle routines adapted to your energy level to reduce treatment fatigue and protect your joints.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mobilityCms.map((vid) => {
            const duration = (vid.meta_json?.duration as string) || "10 min";
            return (
              <div
                key={vid.id}
                className="bg-white rounded-3xl overflow-hidden border border-espresso/10 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group"
              >
                <div>
                  <div
                    onClick={() => openVideoModal(vid.cta_link, vid.title_en)}
                    className="relative aspect-video bg-surface-container cursor-pointer overflow-hidden"
                  >
                    {vid.media_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={vid.media_url}
                        alt={vid.title_en}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute inset-0 bg-espresso/20 group-hover:bg-espresso/35 transition-colors flex items-center justify-center">
                      <span className="w-12 h-12 rounded-full bg-white/95 text-primary flex items-center justify-center shadow-md">
                        <span className="material-symbols-outlined notranslate text-[28px]" translate="no">
                          &#xe037;
                        </span>
                      </span>
                    </div>
                    <span className="absolute bottom-2 right-2 bg-espresso/85 text-white px-2.5 py-0.5 rounded-md text-[11px] font-semibold">
                      {duration}
                    </span>
                  </div>
                  <div className="p-5 space-y-1.5">
                    {vid.badge_en && (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-tertiary">
                        {vid.badge_en}
                      </span>
                    )}
                    <h3 className="font-serif text-lg font-bold text-espresso">{vid.title_en}</h3>
                    <p className="text-xs text-espresso/70 leading-relaxed">{vid.description_en}</p>
                  </div>
                </div>
                <div className="px-5 pb-5 pt-2 flex items-center justify-between text-xs border-t border-espresso/8">
                  <span className="text-espresso/60 font-medium">{vid.subtitle_en}</span>
                  <button
                    type="button"
                    onClick={() => openVideoModal(vid.cta_link, vid.title_en)}
                    className="text-primary font-extrabold hover:underline cursor-pointer"
                  >
                    {vid.cta_text_en || "Watch Routine"} →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          5. PILLAR 4: RIGHTS & BENEFITS (#pilar-derechos)
         ========================================================= */}
      <section
        id="pilar-derechos"
        className="py-16 lg:py-20 bg-gradient-to-b from-surface via-surface-container-low to-surface-container border-t border-espresso/8"
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-primary font-extrabold">
              PILLAR 04 · RIGHTS & BENEFITS
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-espresso mt-1">
              Know Your Clinical & Workplace Rights
            </h2>
            <p className="text-sm text-espresso/70 mt-2">
              Practical orientation on medical records, second opinions, workplace leave, and comprehensive coverage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rightsCms.map((right) => (
              <div
                key={right.id}
                className="bg-white rounded-3xl p-6 border border-espresso/10 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-2xl bg-tertiary/10 text-tertiary flex items-center justify-center">
                    <span className="material-symbols-outlined notranslate text-[22px]" translate="no">
                      &#xea80;
                    </span>
                  </span>
                  {right.badge_en && (
                    <span className="px-3 py-1 rounded-full bg-tertiary/10 text-tertiary text-[10px] font-extrabold uppercase tracking-wider">
                      {right.badge_en}
                    </span>
                  )}
                </div>
                {right.subtitle_en && (
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-primary">
                    {right.subtitle_en}
                  </p>
                )}
                <h3 className="font-serif text-lg font-bold text-espresso leading-snug">
                  {right.title_en}
                </h3>
                <p className="text-xs sm:text-sm text-espresso/75 leading-relaxed">
                  {right.description_en}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal de video */}
      {playingVideoUrl && (
        <div
          className="fixed inset-0 z-50 bg-espresso/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPlayingVideoUrl(null)}
        >
          <div
            className="bg-white rounded-3xl overflow-hidden max-w-3xl w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-espresso/10">
              <h4 className="font-serif font-bold text-sm text-espresso truncate">
                {playingVideoTitle}
              </h4>
              <button
                type="button"
                onClick={() => setPlayingVideoUrl(null)}
                className="w-8 h-8 rounded-full bg-espresso/10 hover:bg-espresso/20 flex items-center justify-center text-xs font-bold cursor-pointer"
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
    </div>
  );
}

