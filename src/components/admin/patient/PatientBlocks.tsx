"use client";

/**
 * Bloques editables de la página Soy Paciente (/paciente) en el panel admin.
 * Todos usan CollectionEditor con el mismo diseño del panel de Home.
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
   1. PATIENT HERO (portada de /paciente)
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
      { key: "cta_link", label: "Button link", placeholder: "#diario-bienestar" },
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

export function PatientHeroEditor() {
  return (
    <CollectionEditor
      page="paciente"
      section="patient_hero"
      contentType="image"
      mode="single"
      itemKeyPrefix="paciente_hero_main"
      title="Hero"
      description="The top welcome section of the Patient page: badge, title, description, button and main image."
      viewHref="/paciente"
      groups={heroGroups}
      defaults={{
        badge_en: "Patient Sanctuary",
        subtitle_en: "BREATHE · UNDERSTAND · HEAL",
        title_en: "Your Safe Harbor: Step-by-Step Companion for Patients",
        description_en:
          "Tools designed for every day of your process: symptom diary, questions for your oncologist, and 3-minute emotional regulation audios.",
        cta_text_en: "Start My Symptom Diary",
        cta_link: "#diario-bienestar",
        media_url:
          "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=1200&q=80",
      }}
      preview={(v) => (
        <div className={`${previewFrame} p-5 bg-gradient-to-b from-[#FFF7F9] to-white space-y-3`}>
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
          {v.cta_text_en && (
            <span className="inline-block px-4 py-2 rounded-full bg-primary text-white text-[11px] font-bold">
              {v.cta_text_en}
            </span>
          )}
        </div>
      )}
    />
  );
}

/* =========================================================
   2. MY JOURNEY & STAGES (lista de pasos + pregunta al oncólogo)
   ========================================================= */
const journeyGroups: FieldGroup[] = [
  {
    title: "Step content",
    icon: ICON_TEXT,
    fields: [
      { key: "badge_en", label: "Badge", placeholder: "First Week", maxLength: 40 },
      { key: "subtitle_en", label: "Step label", placeholder: "STEP 01 · RECENT DIAGNOSIS", maxLength: 60 },
      { key: "title_en", label: "Title", maxLength: 90, required: true },
      { key: "description_en", label: "Description", type: "textarea", rows: 4, maxLength: 320 },
      {
        key: "meta.question_en",
        label: "Key question for the oncologist",
        hint: "Highlighted inside a pink box on the card.",
        type: "textarea",
        rows: 2,
        maxLength: 180,
      },
    ],
  },
  {
    title: "Button & image",
    icon: ICON_IMAGE,
    fields: [
      { key: "cta_text_en", label: "Button text", maxLength: 40 },
      { key: "cta_link", label: "Button link", placeholder: "#diario-bienestar" },
      { key: "media_url", label: "Card image URL", type: "image" },
    ],
  },
];

export function PatientJourneyEditor() {
  return (
    <CollectionEditor
      page="paciente"
      section="patient_journey"
      contentType="stage"
      mode="list"
      itemKeyPrefix="paciente_step"
      title="My Journey & Stages"
      description="Step-by-step cards with practical guidance and key questions to ask the oncologist."
      viewHref="/paciente#camino"
      groups={journeyGroups}
      addLabel="Add step"
      defaults={{
        badge_en: "New Step",
        subtitle_en: "STEP · GUIDANCE",
        title_en: "New journey step",
        cta_text_en: "Log in Symptom Diary",
        cta_link: "#diario-bienestar",
      }}
      itemLabel={(v, i) => v.title_en || `Step ${i + 1}`}
      preview={(v) => (
        <div className={previewFrame}>
          <PreviewImg src={v.media_url} className="w-full h-36" />
          <div className="p-4 space-y-2">
            {v.subtitle_en && (
              <span className="block text-[10px] font-extrabold uppercase tracking-wider text-tertiary">
                {v.subtitle_en}
              </span>
            )}
            <h3 className="font-serif text-base font-bold text-espresso">{v.title_en}</h3>
            <p className="text-xs text-espresso/75 leading-relaxed">{v.description_en}</p>
            {v["meta.question_en"] && (
              <div className="p-2.5 rounded-xl bg-[#FFF7F9] border border-[#F5C2CC] text-[11px] italic text-espresso/90">
                “{v["meta.question_en"]}”
              </div>
            )}
          </div>
        </div>
      )}
    />
  );
}

/* =========================================================
   3. SYMPTOM DIARY (encabezado y consejos del diario interactivo)
   ========================================================= */
const diaryGroups: FieldGroup[] = [
  {
    title: "Texts",
    icon: ICON_TEXT,
    fields: [
      { key: "badge_en", label: "Badge", maxLength: 40 },
      { key: "subtitle_en", label: "Subtitle", maxLength: 70 },
      { key: "title_en", label: "Title", maxLength: 80, required: true },
      { key: "description_en", label: "Description", type: "textarea", rows: 3, maxLength: 280 },
      { key: "cta_text_en", label: "Save button text", maxLength: 40 },
    ],
  },
  {
    title: "Tips (How to use your diary)",
    icon: ICON_LINK,
    fields: [
      { key: "meta.tip1_en", label: "Tip 1", maxLength: 140 },
      { key: "meta.tip2_en", label: "Tip 2", maxLength: 140 },
      { key: "meta.tip3_en", label: "Tip 3", maxLength: 140 },
    ],
  },
];

export function PatientDiaryEditor() {
  return (
    <CollectionEditor
      page="paciente"
      section="patient_diary"
      contentType="text"
      mode="single"
      itemKeyPrefix="paciente_diary_main"
      title="Symptom Diary"
      description="The introduction and tips shown next to the interactive daily symptom tracker."
      viewHref="/paciente#diario-bienestar"
      groups={diaryGroups}
      defaults={{
        badge_en: "Interactive Tool",
        subtitle_en: "SHARE CLEAR NOTES WITH YOUR ONCOLOGIST",
        title_en: "Daily Symptom & Wellness Diary",
        cta_text_en: "Save Today’s Entry",
      }}
      preview={(v) => (
        <div className={`${previewFrame} p-5 space-y-2.5`}>
          {v.badge_en && (
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-extrabold">
              {v.badge_en}
            </span>
          )}
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-tertiary">
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
   4. SENSORY MICRO-CALM (lista de cápsulas de audio / video)
   ========================================================= */
const calmGroups: FieldGroup[] = [
  {
    title: "Texts",
    icon: ICON_TEXT,
    fields: [
      { key: "badge_en", label: "Moment / Tag", placeholder: "Before Chemo / Scans", maxLength: 40 },
      { key: "title_en", label: "Title", maxLength: 80, required: true },
      { key: "subtitle_en", label: "Guide / Specialist", maxLength: 60 },
      { key: "description_en", label: "Description", type: "textarea", rows: 3, maxLength: 240 },
      { key: "cta_text_en", label: "Button text", placeholder: "Listen Now", maxLength: 30 },
    ],
  },
  {
    title: "Audio / Video",
    icon: ICON_VIDEO,
    fields: [
      {
        key: "cta_link",
        label: "Audio / YouTube URL",
        placeholder: "https://www.youtube.com/watch?v=...",
      },
      { key: "meta.duration", label: "Duration", placeholder: "4 min", maxLength: 20 },
      { key: "media_url", label: "Cover image URL", type: "image" },
    ],
  },
];

export function PatientCalmEditor() {
  return (
    <CollectionEditor
      page="paciente"
      section="patient_calm"
      contentType="video"
      mode="list"
      itemKeyPrefix="paciente_calm"
      mediaType="image"
      title="Sensory Micro-Calm"
      description="3-7 minute breathing and emotional regulation capsules for patients."
      viewHref="/paciente#micro-calma"
      groups={calmGroups}
      addLabel="Add capsule"
      defaults={{
        badge_en: "Micro-Calm",
        title_en: "New calming capsule",
        cta_text_en: "Listen Now",
        "meta.duration": "5 min",
      }}
      itemLabel={(v) => v.title_en || "Untitled"}
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
            <p className="text-xs text-espresso/70 leading-relaxed line-clamp-3">
              {v.description_en}
            </p>
            <div className="flex items-center justify-between pt-1 text-[11px] text-espresso/60">
              <span>{v.subtitle_en}</span>
              <span className="text-primary font-bold">{v.cta_text_en || "Listen Now"} →</span>
            </div>
          </div>
        </div>
      )}
    />
  );
}

/* =========================================================
   5. WEEKLY INTIMATE CIRCLES (lista de círculos de pacientes)
   ========================================================= */
const circlesGroups: FieldGroup[] = [
  {
    title: "Circle details",
    icon: ICON_TEXT,
    fields: [
      { key: "badge_en", label: "Stage tag", placeholder: "FIRST CYCLES", maxLength: 35 },
      { key: "title_en", label: "Title", maxLength: 90, required: true },
      {
        key: "subtitle_en",
        label: "Schedule & format",
        placeholder: "Tuesdays · 6:00 PM EST · Confidential Zoom",
        maxLength: 80,
      },
      { key: "description_en", label: "Description", type: "textarea", rows: 3, maxLength: 240 },
      { key: "cta_text_en", label: "Button text", placeholder: "Reserve My Spot", maxLength: 30 },
    ],
  },
];

export function PatientCirclesEditor() {
  return (
    <CollectionEditor
      page="paciente"
      section="patient_circles"
      contentType="circle"
      mode="list"
      itemKeyPrefix="paciente_circle"
      title="Weekly Intimate Circles"
      description="Live confidential support groups exclusively for patients."
      viewHref="/paciente#circulos-paciente"
      groups={circlesGroups}
      addLabel="Add circle"
      defaults={{
        badge_en: "PATIENTS",
        title_en: "New patient circle",
        cta_text_en: "Reserve My Spot",
      }}
      itemLabel={(v) => v.title_en || "Untitled"}
      preview={(v) => (
        <div className={`${previewFrame} p-5 flex items-start gap-3`}>
          <div className="rounded-2xl p-3 text-center shrink-0 min-w-[60px] bg-gradient-to-br from-[#FFE8ED] to-[#FAD4DC] text-[#C4546A] border border-[#F5C2CC]">
            <span className="text-[9px] uppercase block font-extrabold">NARA</span>
            <span className="text-xl font-bold block leading-tight">01</span>
            <span className="text-[9px] font-bold block">LIVE</span>
          </div>
          <div className="space-y-1">
            {v.badge_en && (
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#FFE8ED] text-[#C4546A]">
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

