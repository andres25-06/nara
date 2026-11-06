"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useNara } from "@/context/NaraContext";
import type { CmsItem } from "@/app/admin/page";

export function Footer() {
  const { t, i18n } = useTranslation();
  const { toggleVoiceWidget } = useNara();
  const isEs = i18n.language?.startsWith("es");

  const [footerItems, setFooterItems] = useState<CmsItem[]>([]);

  useEffect(() => {
    fetch("/api/cms?page=footer&status=active", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data?.ok && Array.isArray(data.items)) {
          setFooterItems(data.items);
        }
      })
      .catch(() => {});
  }, []);

  const brandBlock = footerItems.find((i) => i.section === "footer_brand");
  const helplineBlock = footerItems.find((i) => i.section === "footer_helpline");
  const legalBlock = footerItems.find((i) => i.section === "footer_legal");

  const brandTitle =
    (brandBlock && (isEs ? brandBlock.title_es : brandBlock.title_en)) || "Love Heals · NARA";
  const brandSubtitle =
    (brandBlock && (isEs ? brandBlock.subtitle_es : brandBlock.subtitle_en)) ||
    t("footer.subtitle");
  const brandMission =
    (brandBlock && (isEs ? brandBlock.description_es : brandBlock.description_en)) ||
    t("footer.mission");
  const brandEndorsed =
    (brandBlock && (isEs ? brandBlock.badge_es : brandBlock.badge_en)) || t("footer.endorsed");

  const helplineTitle =
    (helplineBlock && (isEs ? helplineBlock.title_es : helplineBlock.title_en)) ||
    t("footer.colHelpline.title");
  const helplinePhone =
    (helplineBlock && (isEs ? helplineBlock.subtitle_es : helplineBlock.subtitle_en)) ||
    t("footer.colHelpline.phone");
  const helplineDesc =
    (helplineBlock && (isEs ? helplineBlock.description_es : helplineBlock.description_en)) ||
    t("footer.colHelpline.chat");
  const helplineVoiceBtn =
    (helplineBlock && (isEs ? helplineBlock.cta_text_es : helplineBlock.cta_text_en)) ||
    t("footer.colHelpline.voiceCta");

  const copyrightText =
    (legalBlock && (isEs ? legalBlock.title_es : legalBlock.title_en)) || t("footer.copyright");

  return (
    <footer className="w-full bg-[#F3EFEA] border-t border-espresso/10 text-espresso shadow-[0_-4px_24px_rgba(45,49,66,0.03)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Marca y Misión (Sincronizada con PostgreSQL page='footer', section='footer_brand') */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-soft flex items-center justify-center shadow-2xs">
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
              <div>
                <span className="block font-headline-md text-headline-md text-primary font-serif font-bold">
                  {brandTitle}
                </span>
                <span className="block text-xs text-espresso/60 -mt-0.5">{brandSubtitle}</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-espresso/75 leading-relaxed">{brandMission}</p>
            <div className="flex items-center gap-2 text-tertiary text-xs font-semibold">
              <span className="material-symbols-outlined notranslate text-[18px]" translate="no">
                &#xef76;
              </span>
              <span>{brandEndorsed}</span>
            </div>
          </div>

          {/* Col 2: Care Pathways */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-espresso tracking-tight">
              {t("footer.colPathways.title")}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-espresso/70">
              <li>
                <Link
                  href="/paciente"
                  className="hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
                  {t("footer.colPathways.patientJourney")}
                </Link>
              </li>
              <li>
                <Link
                  href="/paciente#diario-bienestar"
                  className="hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
                  {t("footer.colPathways.symptomDiary")}
                </Link>
              </li>
              <li>
                <Link
                  href="/paciente#micro-calma"
                  className="hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
                  {t("footer.colPathways.microCalm")}
                </Link>
              </li>
              <li>
                <Link
                  href="/cuidadores"
                  className="hover:text-tertiary transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary/60"></span>
                  {t("footer.colPathways.caregiverHaven")}
                </Link>
              </li>
              <li>
                <Link
                  href="/cuidadores#diccionario"
                  className="hover:text-tertiary transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary/60"></span>
                  {t("footer.colPathways.whatToSay")}
                </Link>
              </li>
              <li>
                <Link
                  href="/cuidadores#hijos"
                  className="hover:text-tertiary transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary/60"></span>
                  {t("footer.colPathways.talkChildren")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Los 4 Pilares & Recursos */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-espresso tracking-tight">
              {t("footer.colPillars.title")}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-espresso/70">
              <li>
                <Link
                  href="/pilares#pilar-nutricion"
                  className="hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
                  {t("footer.colPillars.nutrition")}
                </Link>
              </li>
              <li>
                <Link
                  href="/pilares#pilar-biblioteca"
                  className="hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
                  {t("footer.colPillars.guides")}
                </Link>
              </li>
              <li>
                <Link
                  href="/pilares#pilar-movilidad"
                  className="hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
                  {t("footer.colPillars.mobility")}
                </Link>
              </li>
              <li>
                <Link
                  href="/pilares#pilar-derechos"
                  className="hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
                  {t("footer.colPillars.rights")}
                </Link>
              </li>
              <li>
                <Link
                  href="/pilares#pilar-derechos"
                  className="hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
                  {t("footer.colPillars.prosthetics")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Líneas de Apoyo y Contacto (Sincronizada con PostgreSQL section='footer_helpline') */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-espresso tracking-tight">{helplineTitle}</h4>
            <ul className="space-y-3 text-xs sm:text-sm text-espresso/75">
              <li className="flex items-start gap-2.5">
                <span
                  className="material-symbols-outlined notranslate text-primary text-[19px] shrink-0 mt-0.5"
                  translate="no"
                >
                  &#xe0b0;
                </span>
                <div>
                  <span className="font-bold text-espresso block">{helplinePhone}</span>
                  <span className="text-xs text-espresso/60">{t("footer.colHelpline.phoneSub")}</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span
                  className="material-symbols-outlined notranslate text-tertiary text-[19px] shrink-0 mt-0.5"
                  translate="no"
                >
                  &#xe0b7;
                </span>
                <div>
                  <span className="font-bold text-espresso block">{helplineDesc}</span>
                  <span className="text-xs text-espresso/60">{t("footer.colHelpline.chatSub")}</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span
                  className="material-symbols-outlined notranslate text-primary text-[19px] shrink-0 mt-0.5"
                  translate="no"
                >
                  &#xe7ef;
                </span>
                <div>
                  <span className="font-bold text-espresso block">
                    {t("footer.colHelpline.circles")}
                  </span>
                  <span className="text-xs text-espresso/60">
                    {t("footer.colHelpline.circlesSub")}
                  </span>
                </div>
              </li>
              <li className="pt-1">
                <button
                  type="button"
                  onClick={toggleVoiceWidget}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary-fixed text-primary text-xs font-bold hover:bg-secondary-fixed-dim transition-colors cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse"></span>
                  <span>{helplineVoiceBtn}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra inferior de copyright y términos (Sincronizada con PostgreSQL section='footer_legal') */}
        <div className="pt-6 border-t border-espresso/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-espresso/60">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined notranslate text-primary text-[16px]" translate="no">
              &#xea70;
            </span>
            <span>{copyrightText}</span>
          </div>
          <div className="flex items-center gap-5">
            <a className="hover:text-espresso transition-colors" href="#privacy">
              {t("footer.privacy")}
            </a>
            <a className="hover:text-espresso transition-colors" href="#terms">
              {t("footer.terms")}
            </a>
            <a className="hover:text-espresso transition-colors" href="#disclaimer">
              {t("footer.disclaimer")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
