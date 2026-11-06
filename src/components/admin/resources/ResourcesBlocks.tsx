"use client";

/**
 * Bloques editables de la página Recursos & 4 Pilares (/pilares) en el panel admin.
 * Todos usan CollectionEditor con el mismo diseño del resto del panel.
 */

import React from "react";
import {
  CollectionEditor,
  type FieldGroup,
} from "@/components/admin/ui/CollectionEditor";

function PreviewImg({ src, className }: { src?: string; className?: string }) {
  if (!src?.trim()) {
    return (
      <div
        className={`${className} bg-[#FAF8F5] flex items-center justify-center text-[10px] text-espresso/40 font-semibold`}
      >
        No image
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src.trim()} alt="" className={`${className} object-cover`} />;
}

const previewFrame =
  "rounded-2xl overflow-hidden border border-espresso/10 shadow-[0_8px_28px_rgba(38,35,34,0.08)] bg-white";

const ICON_TEXT = "\ue262";
const ICON_IMAGE = "\ue3f4";
const ICON_LINK = "\ue157";
const ICON_VIDEO = "\ue04b";

/* =========================================================
   1. RESOURCES HERO (/pilares)
   ========================================================= */
const heroGroups: FieldGroup[] = [
  {
    title: "Texts",
    icon: ICON_TEXT,
    fields: [
      { key: "badge_en", label: "Badge", maxLength: 50 },
      { key: "subtitle_en", label: "Subtitle / Eyebrow", maxLength: 70 },
      {
        key: "title_en",
        label: "Main title",
        type: "textarea",
        rows: 2,
        maxLength: 120,
        required: true,
      },
      {
        key: "description_en",
        label: "Description",
        type: "textarea",
        rows: 4,
        maxLength: 320,
      },
    ],
  },
  {
    title: "Main button",
    icon: ICON_LINK,
    fields: [
      { key: "cta_text_en", label: "Button text", maxLength: 40 },
      { key: "cta_link", label: "Button link", placeholder: "#pilar-nutricion" },
    ],
  },
  {
    title: "Image",
    icon: ICON_IMAGE,
    fields: [
      {
        key: "media_url",
        label: "Hero image URL",
        type: "image",
        hint: "Recommended 1200px wide, 4:3.",
        required: true,
      },
    ],
  },
];

export function ResourcesHeroEditor() {
  return (
    <CollectionEditor
      page="pilares"
      section="pillars_hero"
      contentType="image"
      mode="single"
      itemKeyPrefix="pilares_hero_main"
      title="Hero (4 Pillars)"
      description="The top welcome section of the Resources & Pillars page."
      viewHref="/pilares"
      groups={heroGroups}
      defaults={{
        badge_en: "Resources & 4 Pillars",
        subtitle_en: "NUTRITION · LIBRARY · MINDFUL MOVEMENT · PATIENT RIGHTS",
        title_en: "The 4 Pillars of Integrative Oncology Support",
        description_en:
          "Evidence-based resources created with oncology specialists to nourish your body, organize your medical appointments, restore mobility safely, and protect your rights.",
        cta_text_en: "Explore Nutrition Recipes",
        cta_link: "#pilar-nutricion",
        media_url:
          "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=80",
      }}
      preview={(v) => (
        <div className={`${previewFrame} p-5 bg-gradient-to-b from-[#FEF8F2] to-white space-y-3`}>
          <PreviewImg src={v.media_url} className="w-full aspect-4/3 rounded-xl" />
          {v.badge_en && (
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-white border border-espresso/10 text-[10px] font-extrabold text-primary">
              {v.badge_en}
            </span>
          )}
          {v.subtitle_en && (
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-tertiary">
              {v.subtitle_en}
            </p>
          )}
          <h3 className="font-serif text-lg font-bold text-espresso leading-snug">{v.title_en}</h3>
          <p className="text-xs text-espresso/75 leading-relaxed line-clamp-3">
            {v.description_en}
          </p>
        </div>
      )}
    />
  );
}

/* =========================================================
   2. NUTRITION & RECIPES (#pilar-nutricion)
   ========================================================= */
const nutritionGroups: FieldGroup[] = [
  {
    title: "Recipe / Nutrition card",
    icon: ICON_TEXT,
    fields: [
      { key: "badge_en", label: "Benefit tag", placeholder: "Nausea Relief", maxLength: 40 },
      {
        key: "subtitle_en",
        label: "Category subtitle",
        placeholder: "Hydration & Electrolyte Recovery",
        maxLength: 60,
      },
      { key: "title_en", label: "Recipe title", maxLength: 90, required: true },
      {
        key: "description_en",
        label: "Preparation & ingredients",
        type: "textarea",
        rows: 4,
        maxLength: 320,
      },
      {
        key: "meta.tip_en",
        label: "Clinical nutrition tip",
        type: "textarea",
        rows: 2,
        maxLength: 180,
      },
    ],
  },
  {
    title: "Image",
    icon: ICON_IMAGE,
    fields: [{ key: "media_url", label: "Recipe image URL", type: "image" }],
  },
];

export function ResourcesNutritionEditor() {
  return (
    <CollectionEditor
      page="pilares"
      section="pillars_nutrition"
      contentType="card"
      mode="list"
      itemKeyPrefix="pilares_nutri"
      title="Nutrition & Recipes"
      description="Anti-inflammatory meals, broths, and smoothies adapted for treatment days."
      viewHref="/pilares#pilar-nutricion"
      groups={nutritionGroups}
      addLabel="Add recipe"
      defaults={{
        badge_en: "Nutrition",
        subtitle_en: "Oncology Nutrition",
        title_en: "New nourishing recipe",
      }}
      itemLabel={(v, i) => v.title_en || `Recipe ${i + 1}`}
      preview={(v) => (
        <div className={previewFrame}>
          <PreviewImg src={v.media_url} className="w-full h-40" />
          <div className="p-4 space-y-2">
            {v.badge_en && (
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#E3F1E9] text-[#2E664F] text-[10px] font-extrabold uppercase">
                {v.badge_en}
              </span>
            )}
            <h3 className="font-serif text-base font-bold text-espresso">{v.title_en}</h3>
            <p className="text-xs text-espresso/75 leading-relaxed">{v.description_en}</p>
            {v["meta.tip_en"] && (
              <div className="p-2.5 rounded-xl bg-[#F2F9F5] border border-[#BDDFCC] text-[11px] text-espresso/85">
                <strong>Tip:</strong> {v["meta.tip_en"]}
              </div>
            )}
          </div>
        </div>
      )}
    />
  );
}

/* =========================================================
   3. GUIDES & WORKBOOKS PDF (#pilar-biblioteca)
   ========================================================= */
const libraryGroups: FieldGroup[] = [
  {
    title: "Guide details",
    icon: ICON_TEXT,
    fields: [
      { key: "badge_en", label: "Badge", placeholder: "Essential Workbook", maxLength: 40 },
      {
        key: "subtitle_en",
        label: "Format / Pages",
        placeholder: "PDF Printable Guide · 12 Pages",
        maxLength: 60,
      },
      { key: "title_en", label: "Title", maxLength: 90, required: true },
      { key: "description_en", label: "Description", type: "textarea", rows: 3, maxLength: 280 },
    ],
  },
  {
    title: "Action button",
    icon: ICON_LINK,
    fields: [
      { key: "cta_text_en", label: "Button text", placeholder: "Open Interactive Checklist", maxLength: 40 },
      { key: "cta_link", label: "Button link", placeholder: "/paciente#diario-bienestar" },
    ],
  },
];

export function ResourcesLibraryEditor() {
  return (
    <CollectionEditor
      page="pilares"
      section="pillars_library"
      contentType="card"
      mode="list"
      itemKeyPrefix="pilares_lib"
      title="Guides & Workbooks"
      description="Printable checklists, appointment workbooks, and practical handbooks."
      viewHref="/pilares#pilar-biblioteca"
      groups={libraryGroups}
      addLabel="Add guide"
      defaults={{
        badge_en: "Workbook",
        subtitle_en: "Printable Guide",
        title_en: "New clinical guide",
        cta_text_en: "Open Guide",
        cta_link: "/paciente",
      }}
      itemLabel={(v, i) => v.title_en || `Guide ${i + 1}`}
      preview={(v) => (
        <div className={`${previewFrame} p-5 space-y-2.5`}>
          {v.badge_en && (
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FFE8ED] text-[#C4546A] text-[10px] font-extrabold uppercase">
              {v.badge_en}
            </span>
          )}
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-tertiary">
            {v.subtitle_en}
          </p>
          <h3 className="font-serif text-base font-bold text-espresso">{v.title_en}</h3>
          <p className="text-xs text-espresso/75 leading-relaxed">{v.description_en}</p>
          {v.cta_text_en && (
            <span className="inline-block px-4 py-1.5 rounded-full bg-espresso/5 text-espresso text-[11px] font-bold">
              {v.cta_text_en} →
            </span>
          )}
        </div>
      )}
    />
  );
}

/* =========================================================
   4. MINDFUL MOVEMENT (#pilar-movilidad)
   ========================================================= */
const mobilityGroups: FieldGroup[] = [
  {
    title: "Routine texts",
    icon: ICON_TEXT,
    fields: [
      { key: "badge_en", label: "Tag", placeholder: "Seated Routine", maxLength: 40 },
      { key: "title_en", label: "Title", maxLength: 90, required: true },
      {
        key: "subtitle_en",
        label: "Subtitle / Intensity",
        placeholder: "Zero Joint Impact · 8 Minutes",
        maxLength: 60,
      },
      { key: "description_en", label: "Description", type: "textarea", rows: 3, maxLength: 260 },
      { key: "cta_text_en", label: "Button text", placeholder: "Watch Routine", maxLength: 30 },
    ],
  },
  {
    title: "Video & thumbnail",
    icon: ICON_VIDEO,
    fields: [
      { key: "cta_link", label: "YouTube URL", placeholder: "https://www.youtube.com/watch?v=..." },
      { key: "meta.duration", label: "Duration", placeholder: "8 min", maxLength: 20 },
      { key: "media_url", label: "Thumbnail image URL", type: "image" },
    ],
  },
];

export function ResourcesMobilityEditor() {
  return (
    <CollectionEditor
      page="pilares"
      section="pillars_mobility"
      contentType="video"
      mode="list"
      itemKeyPrefix="pilares_mob"
      mediaType="image"
      title="Mindful Movement"
      description="Chair yoga, post-surgery lymphatic mobility, and restorative walking routines."
      viewHref="/pilares#pilar-movilidad"
      groups={mobilityGroups}
      addLabel="Add routine"
      defaults={{
        badge_en: "Mobility",
        title_en: "New movement routine",
        cta_text_en: "Watch Routine",
        "meta.duration": "10 min",
      }}
      itemLabel={(v, i) => v.title_en || `Routine ${i + 1}`}
      preview={(v) => (
        <div className={`${previewFrame} max-w-[320px]`}>
          <div className="relative">
            <PreviewImg src={v.media_url} className="w-full aspect-video" />
            {v["meta.duration"] && (
              <span className="absolute bottom-2 right-2 bg-espresso/85 text-white px-2 py-0.5 rounded-md text-[10px]">
                {v["meta.duration"]}
              </span>
            )}
          </div>
          <div className="p-4 space-y-1.5">
            {v.badge_en && (
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-tertiary">
                {v.badge_en}
              </span>
            )}
            <h4 className="font-serif text-base font-bold text-espresso">{v.title_en}</h4>
            <p className="text-xs text-espresso/70 leading-relaxed">{v.description_en}</p>
          </div>
        </div>
      )}
    />
  );
}

/* =========================================================
   5. RIGHTS & BENEFITS (#pilar-derechos)
   ========================================================= */
const rightsGroups: FieldGroup[] = [
  {
    title: "Right or benefit card",
    icon: ICON_TEXT,
    fields: [
      { key: "badge_en", label: "Badge", placeholder: "Clinical Rights", maxLength: 40 },
      {
        key: "subtitle_en",
        label: "Category subtitle",
        placeholder: "PATIENT AUTONOMY & CLINICAL TRANSPARENCY",
        maxLength: 70,
      },
      { key: "title_en", label: "Title", maxLength: 100, required: true },
      { key: "description_en", label: "Description", type: "textarea", rows: 4, maxLength: 320 },
    ],
  },
];

export function ResourcesRightsEditor() {
  return (
    <CollectionEditor
      page="pilares"
      section="pillars_rights"
      contentType="card"
      mode="list"
      itemKeyPrefix="pilares_rights"
      title="Rights & Benefits"
      description="Clear orientation on clinical records, second opinions, workplace leave, and coverage."
      viewHref="/pilares#pilar-derechos"
      groups={rightsGroups}
      addLabel="Add right"
      defaults={{
        badge_en: "Patient Rights",
        subtitle_en: "RIGHTS & BENEFITS",
        title_en: "New patient right",
      }}
      itemLabel={(v, i) => v.badge_en || v.title_en || `Right ${i + 1}`}
      preview={(v) => (
        <div className={`${previewFrame} p-5 space-y-2.5`}>
          {v.badge_en && (
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-tertiary/10 text-tertiary text-[10px] font-extrabold uppercase">
              {v.badge_en}
            </span>
          )}
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
            {v.subtitle_en}
          </p>
          <h3 className="font-serif text-base font-bold text-espresso">{v.title_en}</h3>
          <p className="text-xs text-espresso/75 leading-relaxed">{v.description_en}</p>
        </div>
      )}
    />
  );
}

