"use client";

/**
 * Bloques editables del Footer global (page = 'footer') en el panel admin.
 * Usa CollectionEditor con el mismo diseño y vista previa en vivo.
 */

import React from "react";
import {
  CollectionEditor,
  type FieldGroup,
} from "@/components/admin/ui/CollectionEditor";

const previewFrame =
  "rounded-2xl overflow-hidden border border-espresso/10 shadow-[0_8px_28px_rgba(38,35,34,0.08)] bg-[#F3EFEA] text-espresso";

const ICON_TEXT = "\ue262";
const ICON_PHONE = "\ue0b0";
const ICON_LEGAL = "\ue86c";

/* =========================================================
   1. BRAND & MISSION (Columna 1 del Footer: footer_brand)
   ========================================================= */
const brandGroups: FieldGroup[] = [
  {
    title: "Brand & Mission (Column 1)",
    icon: ICON_TEXT,
    fields: [
      { key: "title_en", label: "Brand title", maxLength: 50, required: true },
      { key: "subtitle_en", label: "Brand subtitle", maxLength: 70 },
      {
        key: "description_en",
        label: "Mission statement",
        type: "textarea",
        rows: 4,
        maxLength: 320,
      },
      {
        key: "badge_en",
        label: "Clinical endorsement line",
        maxLength: 90,
      },
    ],
  },
];

export function FooterBrandEditor() {
  return (
    <CollectionEditor
      page="footer"
      section="footer_brand"
      contentType="footer_block"
      mode="single"
      itemKeyPrefix="footer_col1_brand"
      title="Brand & Mission"
      description="The first column of the global footer: brand name, subtitle, mission, and clinical endorsement."
      viewHref="/"
      groups={brandGroups}
      defaults={{
        title_en: "Love Heals · NARA",
        subtitle_en: "Emotional & Oncological Sanctuary",
        description_en:
          "Comprehensive human and educational accompaniment for patients and families walking through an oncological diagnosis. Created with love and clinical rigor.",
        badge_en: "Endorsed by Oncology & Psycho-Oncology Specialists",
      }}
      preview={(v) => (
        <div className={`${previewFrame} p-5 space-y-3`}>
          <div>
            <span className="block font-serif text-lg font-bold text-primary">{v.title_en}</span>
            <span className="block text-xs text-espresso/60">{v.subtitle_en}</span>
          </div>
          <p className="text-xs text-espresso/75 leading-relaxed">{v.description_en}</p>
          {v.badge_en && (
            <div className="flex items-center gap-1.5 text-tertiary text-xs font-semibold pt-1">
              <span className="material-symbols-outlined notranslate text-[16px]" translate="no">
                &#xef76;
              </span>
              <span>{v.badge_en}</span>
            </div>
          )}
        </div>
      )}
    />
  );
}

/* =========================================================
   2. 24/7 HELPLINE & CONTACT (Columna 4 del Footer: footer_helpline)
   ========================================================= */
const helplineGroups: FieldGroup[] = [
  {
    title: "24/7 Helpline & Contact (Column 4)",
    icon: ICON_PHONE,
    fields: [
      { key: "title_en", label: "Column heading", maxLength: 60, required: true },
      { key: "subtitle_en", label: "Phone line", maxLength: 80 },
      { key: "meta.phone_sub_en", label: "Phone sub-label", maxLength: 80 },
      { key: "description_en", label: "Email / Contact line", maxLength: 120 },
      { key: "meta.email_sub_en", label: "Email sub-label", maxLength: 80 },
      { key: "meta.circles_title_en", label: "Circles line title", maxLength: 70 },
      { key: "meta.circles_sub_en", label: "Circles schedule sub-label", maxLength: 80 },
      { key: "cta_text_en", label: "Voice assistant button text", maxLength: 45 },
    ],
  },
];

export function FooterHelplineEditor() {
  return (
    <CollectionEditor
      page="footer"
      section="footer_helpline"
      contentType="footer_block"
      mode="single"
      itemKeyPrefix="footer_col4_helpline"
      title="24/7 Helpline & Contact"
      description="Phone lines, email, weekly circles schedule, and voice companion button in the footer."
      viewHref="/"
      groups={helplineGroups}
      defaults={{
        title_en: "24/7 Emotional Support & Contact Lines",
        subtitle_en: "1-800-NARA-LUZ · Toll-free emotional listening line",
        "meta.phone_sub_en": "24/7 toll-free emotional listening line",
        description_en: "contacto@nara-loveheals.org",
        "meta.email_sub_en": "Warm response in under 24 hours",
        "meta.circles_title_en": "Weekly Live Healing Circles",
        "meta.circles_sub_en": "Tuesdays, Thursdays & Saturdays via Zoom",
        cta_text_en: "Activate Voice Companion",
      }}
      preview={(v) => (
        <div className={`${previewFrame} p-5 space-y-3`}>
          <h4 className="font-bold text-sm text-espresso">{v.title_en}</h4>
          <div className="space-y-2 text-xs">
            <div>
              <span className="font-bold block text-espresso">{v.subtitle_en}</span>
              <span className="text-espresso/60">{v["meta.phone_sub_en"]}</span>
            </div>
            <div>
              <span className="font-bold block text-espresso">{v.description_en}</span>
              <span className="text-espresso/60">{v["meta.email_sub_en"]}</span>
            </div>
            <div>
              <span className="font-bold block text-espresso">{v["meta.circles_title_en"]}</span>
              <span className="text-espresso/60">{v["meta.circles_sub_en"]}</span>
            </div>
          </div>
          {v.cta_text_en && (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-secondary-fixed text-primary text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
              {v.cta_text_en}
            </span>
          )}
        </div>
      )}
    />
  );
}

/* =========================================================
   3. COPYRIGHT & LEGAL BAR (Barra inferior del Footer: footer_legal)
   ========================================================= */
const legalGroups: FieldGroup[] = [
  {
    title: "Copyright & Medical Disclaimer",
    icon: ICON_LEGAL,
    fields: [
      { key: "title_en", label: "Copyright line", maxLength: 120, required: true },
      {
        key: "subtitle_en",
        label: "Medical disclaimer note",
        maxLength: 140,
      },
    ],
  },
];

export function FooterLegalEditor() {
  return (
    <CollectionEditor
      page="footer"
      section="footer_legal"
      contentType="footer_block"
      mode="single"
      itemKeyPrefix="footer_bottom_legal"
      title="Copyright & Legal"
      description="The bottom copyright notice and medical disclaimer shown across all pages."
      viewHref="/"
      groups={legalGroups}
      defaults={{
        title_en: "© 2026 Love Heals · NARA Foundation. All rights reserved.",
        subtitle_en: "Educational content — Never replaces your oncologist’s medical advice.",
      }}
      preview={(v) => (
        <div className={`${previewFrame} p-5 space-y-2 text-xs text-espresso/70`}>
          <p className="font-semibold text-espresso">{v.title_en}</p>
          {v.subtitle_en && <p className="text-[11px] text-espresso/60">{v.subtitle_en}</p>}
        </div>
      )}
    />
  );
}

