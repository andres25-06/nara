"use client";

/**
 * Bloques editables de la página Cuidadores (/cuidadores) en el panel admin.
 * Todos usan CollectionEditor con el mismo diseño del panel de Home y Patient.
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

/* =========================================================
   1. CAREGIVER HERO (portada de /cuidadores)
   ========================================================= */
const heroGroups: FieldGroup[] = [
  {
    title: "Texts",
    icon: ICON_TEXT,
    fields: [
      { key: "badge_en", label: "Badge", hint: "Small pill above the title.", maxLength: 50 },
      { key: "subtitle_en", label: "Subtitle / Eyebrow", maxLength: 60 },
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
      { key: "cta_link", label: "Button link", placeholder: "#diccionario" },
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

export function CaregiverHeroEditor() {
  return (
    <CollectionEditor
      page="cuidadores"
      section="caregiver_hero"
      contentType="image"
      mode="single"
      itemKeyPrefix="cuidadores_hero_main"
      title="Caregiver Haven (Hero)"
      description="The top welcome section of the Caregivers page: badge, title, description, button and main image."
      viewHref="/cuidadores"
      groups={heroGroups}
      defaults={{
        badge_en: "Caregiver Haven",
        subtitle_en: "FOR SPOUSES, CHILDREN, PARENTS & FRIENDS",
        title_en: "Caring for the Caregiver: Sustaining Without Burning Out",
        description_en:
          "Practical dictionary of what to say and what to avoid, how to talk to children, and how to organize family shifts without guilt.",
        cta_text_en: "Open Empathy Dictionary",
        cta_link: "#diccionario",
        media_url:
          "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&w=1200&q=80",
      }}
      preview={(v) => (
        <div className={`${previewFrame} p-5 bg-gradient-to-b from-[#F2F9F5] to-white space-y-3`}>
          <PreviewImg src={v.media_url} className="w-full aspect-4/3 rounded-xl" />
          {v.badge_en && (
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-white border border-espresso/10 text-[10px] font-extrabold text-tertiary">
              {v.badge_en}
            </span>
          )}
          {v.subtitle_en && (
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
              {v.subtitle_en}
            </p>
          )}
          <h3 className="font-serif text-lg font-bold text-espresso leading-snug">{v.title_en}</h3>
          <p className="text-xs text-espresso/75 leading-relaxed line-clamp-3">
            {v.description_en}
          </p>
          {v.cta_text_en && (
            <span className="inline-block px-4 py-2 rounded-full bg-tertiary text-white text-[11px] font-bold">
              {v.cta_text_en}
            </span>
          )}
        </div>
      )}
    />
  );
}

/* =========================================================
   2. EMPATHY DICTIONARY (#diccionario)
   ========================================================= */
const dictGroups: FieldGroup[] = [
  {
    title: "Dictionary card",
    icon: ICON_TEXT,
    fields: [
      { key: "badge_en", label: "Category tag", placeholder: "Emotional Validation", maxLength: 40 },
      {
        key: "subtitle_en",
        label: "Phrase to avoid",
        placeholder: "Instead of: “You have to stay positive!”",
        maxLength: 140,
      },
      {
        key: "title_en",
        label: "Recommended loving phrase (Say instead)",
        type: "textarea",
        rows: 2,
        maxLength: 160,
        required: true,
      },
      {
        key: "description_en",
        label: "Why this matters",
        type: "textarea",
        rows: 3,
        maxLength: 280,
      },
    ],
  },
];

export function CaregiverDictionaryEditor() {
  return (
    <CollectionEditor
      page="cuidadores"
      section="caregiver_dictionary"
      contentType="card"
      mode="list"
      itemKeyPrefix="cuidadores_dict"
      title="Empathy Dictionary"
      description="Cards showing phrases to avoid vs. loving phrases that truly comfort the patient."
      viewHref="/cuidadores#diccionario"
      groups={dictGroups}
      addLabel="Add phrase"
      defaults={{
        badge_en: "Empathy Guide",
        subtitle_en: "Instead of: “Let me know if you need anything!”",
        title_en: "“I am here with you today.”",
      }}
      itemLabel={(v, i) => v.badge_en || `Phrase ${i + 1}`}
      preview={(v) => (
        <div className={`${previewFrame} p-5 space-y-3`}>
          {v.badge_en && (
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-tertiary/10 text-tertiary text-[10px] font-extrabold uppercase">
              {v.badge_en}
            </span>
          )}
          {v.subtitle_en && (
            <div className="p-3 rounded-xl bg-red-50/70 border border-red-200/70 text-[11px] text-red-900/80">
              <strong className="block text-[9px] uppercase text-red-700">✕ Avoid saying</strong>
              {v.subtitle_en.replace(/^Instead of:\s*/i, "")}
            </div>
          )}
          <div className="p-3 rounded-xl bg-[#E3F1E9]/70 border border-[#BDDFCC]">
            <strong className="block text-[9px] uppercase text-[#2E664F]">✓ Say instead</strong>
            <p className="font-serif text-sm font-bold text-espresso mt-0.5">{v.title_en}</p>
          </div>
          <p className="text-xs text-espresso/75 leading-relaxed">{v.description_en}</p>
        </div>
      )}
    />
  );
}

/* =========================================================
   3. TALKING TO CHILDREN & TEENS (#hijos)
   ========================================================= */
const childrenGroups: FieldGroup[] = [
  {
    title: "Age group guide",
    icon: ICON_TEXT,
    fields: [
      { key: "badge_en", label: "Age badge", placeholder: "Ages 4–8", maxLength: 30 },
      {
        key: "subtitle_en",
        label: "Age subtitle",
        placeholder: "AGES 4 TO 8 · EARLY CHILDHOOD",
        maxLength: 60,
      },
      { key: "title_en", label: "Title", maxLength: 90, required: true },
      { key: "description_en", label: "Guidance", type: "textarea", rows: 4, maxLength: 320 },
      {
        key: "meta.script_en",
        label: "Reassuring phrase to use with them",
        type: "textarea",
        rows: 2,
        maxLength: 180,
      },
    ],
  },
  {
    title: "Image",
    icon: ICON_IMAGE,
    fields: [{ key: "media_url", label: "Card image URL", type: "image" }],
  },
];

export function CaregiverChildrenEditor() {
  return (
    <CollectionEditor
      page="cuidadores"
      section="caregiver_children"
      contentType="stage"
      mode="list"
      itemKeyPrefix="cuidadores_child"
      title="Talking to Children"
      description="Age-adapted guidance and reassuring scripts for talking to young children, pre-teens, and teenagers."
      viewHref="/cuidadores#hijos"
      groups={childrenGroups}
      addLabel="Add age group"
      defaults={{
        badge_en: "Ages",
        subtitle_en: "AGE GROUP",
        title_en: "New age group guide",
      }}
      itemLabel={(v, i) => v.badge_en || v.title_en || `Group ${i + 1}`}
      preview={(v) => (
        <div className={previewFrame}>
          <PreviewImg src={v.media_url} className="w-full h-36" />
          <div className="p-4 space-y-2">
            {v.subtitle_en && (
              <span className="block text-[10px] font-extrabold uppercase tracking-wider text-primary">
                {v.subtitle_en}
              </span>
            )}
            <h3 className="font-serif text-base font-bold text-espresso">{v.title_en}</h3>
            <p className="text-xs text-espresso/75 leading-relaxed">{v.description_en}</p>
            {v["meta.script_en"] && (
              <div className="p-2.5 rounded-xl bg-[#FFF7F9] border border-[#F5C2CC] text-[11px] italic text-espresso/90">
                “{v["meta.script_en"]}”
              </div>
            )}
          </div>
        </div>
      )}
    />
  );
}

/* =========================================================
   4. SELF-CARE & SHIFT PLANNER (#autocuidado)
   ========================================================= */
const selfcareGroups: FieldGroup[] = [
  {
    title: "Texts",
    icon: ICON_TEXT,
    fields: [
      { key: "badge_en", label: "Badge", maxLength: 40 },
      { key: "subtitle_en", label: "Subtitle", maxLength: 70 },
      { key: "title_en", label: "Title", maxLength: 80, required: true },
      { key: "description_en", label: "Description", type: "textarea", rows: 3, maxLength: 280 },
      { key: "cta_text_en", label: "Add task button text", maxLength: 40 },
    ],
  },
  {
    title: "3 Golden Rules Against Burnout",
    icon: ICON_LINK,
    fields: [
      { key: "meta.tip1_en", label: "Rule 1", maxLength: 160 },
      { key: "meta.tip2_en", label: "Rule 2", maxLength: 160 },
      { key: "meta.tip3_en", label: "Rule 3", maxLength: 160 },
    ],
  },
];

export function CaregiverSelfCareEditor() {
  return (
    <CollectionEditor
      page="cuidadores"
      section="caregiver_selfcare"
      contentType="text"
      mode="single"
      itemKeyPrefix="cuidadores_selfcare_main"
      title="Self-Care & Shifts"
      description="The introduction and 3 golden rules shown next to the interactive Family Shift Planner."
      viewHref="/cuidadores#autocuidado"
      groups={selfcareGroups}
      defaults={{
        badge_en: "Caregiver Balance",
        subtitle_en: "RESTING IS NOT ABANDONING · IT IS SUSTAINING",
        title_en: "Family Shift Planner & Caregiver Self-Care",
        cta_text_en: "Add Task to Family Plan",
      }}
      preview={(v) => (
        <div className={`${previewFrame} p-5 space-y-2.5`}>
          {v.badge_en && (
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-tertiary/10 text-tertiary text-[10px] font-extrabold">
              {v.badge_en}
            </span>
          )}
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
            {v.subtitle_en}
          </p>
          <h3 className="font-serif text-lg font-bold text-espresso">{v.title_en}</h3>
          <p className="text-xs text-espresso/75 leading-relaxed">{v.description_en}</p>
          <ul className="space-y-1.5 pt-2 border-t border-espresso/8 text-[11px] text-espresso/80">
            {[v["meta.tip1_en"], v["meta.tip2_en"], v["meta.tip3_en"]]
              .filter(Boolean)
              .map((tip, i) => (
                <li key={i}>
                  <strong>{i + 1}.</strong> {tip}
                </li>
              ))}
          </ul>
        </div>
      )}
    />
  );
}

/* =========================================================
   5. CAREGIVER CIRCLES (#circulos)
   ========================================================= */
const circlesGroups: FieldGroup[] = [
  {
    title: "Circle details",
    icon: ICON_TEXT,
    fields: [
      { key: "badge_en", label: "Group tag", placeholder: "PARTNERS & SPOUSES", maxLength: 35 },
      { key: "title_en", label: "Title", maxLength: 90, required: true },
      {
        key: "subtitle_en",
        label: "Schedule & format",
        placeholder: "Thursdays · 6:30 PM EST · Confidential Zoom",
        maxLength: 80,
      },
      { key: "description_en", label: "Description", type: "textarea", rows: 3, maxLength: 240 },
      { key: "cta_text_en", label: "Button text", placeholder: "Reserve Free Spot", maxLength: 30 },
    ],
  },
];

export function CaregiverCirclesEditor() {
  return (
    <CollectionEditor
      page="cuidadores"
      section="caregiver_circles"
      contentType="circle"
      mode="list"
      itemKeyPrefix="cuidadores_circle"
      title="Caregiver Circles"
      description="Live support groups exclusively for spouses, parents, children, and family caregivers."
      viewHref="/cuidadores#circulos"
      groups={circlesGroups}
      addLabel="Add circle"
      defaults={{
        badge_en: "CAREGIVERS",
        title_en: "New caregiver circle",
        cta_text_en: "Reserve Free Spot",
      }}
      itemLabel={(v) => v.title_en || "Untitled"}
      preview={(v) => (
        <div className={`${previewFrame} p-5 flex items-start gap-3`}>
          <div className="rounded-2xl p-3 text-center shrink-0 min-w-[60px] bg-gradient-to-br from-[#E3F1E9] to-[#D0ECDD] text-[#2E664F] border border-[#BDDFCC]">
            <span className="text-[9px] uppercase block font-extrabold">NARA</span>
            <span className="text-xl font-bold block leading-tight">01</span>
            <span className="text-[9px] font-bold block">LIVE</span>
          </div>
          <div className="space-y-1">
            {v.badge_en && (
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#D7EFE2] text-[#2E664F]">
                {v.badge_en}
              </span>
            )}
            <h3 className="text-base font-bold text-espresso">{v.title_en}</h3>
            <p className="text-[11px] font-semibold text-espresso/70">{v.subtitle_en}</p>
            <p className="text-[11px] text-espresso/65 leading-relaxed">{v.description_en}</p>
          </div>
        </div>
      )}
    />
  );
}

