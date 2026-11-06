"use client";

/**
 * Configuración de cada bloque del Home usando el editor genérico.
 * Todos comparten el mismo diseño que el editor del Hero.
 */

import React from "react";
import { CollectionEditor, type FieldGroup, type FormValues } from "@/components/admin/ui/CollectionEditor";

/* ---------- Utilidades de vista previa ---------- */
function PreviewImg({ src, className }: { src?: string; className?: string }) {
  if (!src?.trim()) {
    return (
      <div className={`${className} bg-[#FAF8F5] flex items-center justify-center text-[10px] text-espresso/40 font-semibold`}>
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
   1. MARQUEE
   ========================================================= */
const marqueeGroups: FieldGroup[] = [
  {
    title: "Words",
    icon: ICON_TEXT,
    fields: [
      {
        key: "title_en",
        label: "Scrolling words",
        type: "words",
        hint: "Words alternate automatically between filled and outline style.",
        required: true,
      },
    ],
  },
];

export function MarqueeEditor() {
  return (
    <CollectionEditor
      section="marquee"
      contentType="text"
      mode="single"
      itemKeyPrefix="home_marquee_words"
      title="Marquee"
      description="The band of large animated words that scrolls below the Hero."
      viewHref="/#inicio"
      groups={marqueeGroups}
      defaults={{ title_en: "Together · Rest · Breathe · Support · Heal · Love" }}
      preview={(v) => (
        <div className={`${previewFrame} p-5 bg-[#FAF8F5]`}>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {(v.title_en || "")
              .split("·")
              .map((w) => w.trim())
              .filter(Boolean)
              .map((w, i) => (
                <span
                  key={i}
                  className={`text-2xl font-extrabold tracking-tight ${
                    i % 2 === 1 ? "text-transparent" : "text-espresso"
                  }`}
                  style={i % 2 === 1 ? { WebkitTextStroke: "1px #262322" } : undefined}
                >
                  {w}
                </span>
              ))}
          </div>
        </div>
      )}
    />
  );
}

/* =========================================================
   2. JOURNEY STAGES (4 fijas)
   ========================================================= */
const journeyGroups: FieldGroup[] = [
  {
    title: "Texts",
    icon: ICON_TEXT,
    fields: [
      { key: "subtitle_en", label: "Tab label", hint: "Text of the tab button.", maxLength: 40 },
      { key: "badge_en", label: "Pill label", hint: "Small label above the title.", maxLength: 60 },
      { key: "title_en", label: "Title", type: "textarea", rows: 2, maxLength: 120, required: true },
      { key: "description_en", label: "Description", type: "textarea", rows: 4, maxLength: 400 },
    ],
  },
  {
    title: "Main button",
    icon: ICON_LINK,
    fields: [
      { key: "cta_text_en", label: "Button text", maxLength: 40 },
      { key: "cta_link", label: "Button link", placeholder: "/paciente" },
    ],
  },
  {
    title: "Image",
    icon: ICON_IMAGE,
    fields: [{ key: "media_url", label: "Image URL", type: "image", hint: "Recommended 900px wide, 4:3." }],
  },
];

export function JourneyEditor() {
  return (
    <CollectionEditor
      section="journey"
      contentType="stage"
      mode="fixed"
      fixedCount={4}
      itemKeyPrefix="journey_stage"
      title="Journey stages"
      description="The 4 tabs of the interactive journey: diagnosis, treatment, caregivers and remission."
      viewHref="/#etapas"
      groups={journeyGroups}
      itemLabel={(v, i) => `Stage ${i + 1}${v.subtitle_en ? ` · ${v.subtitle_en}` : ""}`}
      preview={(v) => (
        <div className={`${previewFrame} p-4 space-y-3`}>
          <PreviewImg src={v.media_url} className="w-full aspect-4/3 rounded-xl" />
          {v.badge_en && (
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-semibold">
              {v.badge_en}
            </span>
          )}
          <h3 className="font-serif text-lg font-bold text-espresso leading-snug">{v.title_en}</h3>
          <p className="text-xs text-espresso/70 leading-relaxed line-clamp-4">{v.description_en}</p>
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
   3. PILLARS (4 fijos)
   ========================================================= */
const pillarsGroups: FieldGroup[] = [
  {
    title: "Texts",
    icon: ICON_TEXT,
    fields: [
      { key: "badge_en", label: "Tag", hint: "Small label above the title.", maxLength: 40 },
      { key: "title_en", label: "Title", maxLength: 60, required: true },
      { key: "description_en", label: "Description", type: "textarea", rows: 3, maxLength: 220 },
    ],
  },
  {
    title: "Button",
    icon: ICON_LINK,
    fields: [
      { key: "cta_text_en", label: "Button text", maxLength: 30 },
      { key: "cta_link", label: "Button link", placeholder: "/pilares#pilar-nutricion" },
    ],
  },
  {
    title: "Image",
    icon: ICON_IMAGE,
    fields: [{ key: "media_url", label: "Image URL", type: "image", hint: "Recommended 800px wide." }],
  },
];

export function PillarsEditor() {
  return (
    <CollectionEditor
      section="pillars"
      contentType="pillar"
      mode="fixed"
      fixedCount={4}
      itemKeyPrefix="pillar"
      title="4 Pillars"
      description="The 4 cards of comprehensive care shown on the home page."
      viewHref="/#pilares"
      groups={pillarsGroups}
      itemLabel={(v, i) => `Pillar ${i + 1}${v.title_en ? ` · ${v.title_en}` : ""}`}
      preview={(v) => (
        <div className={`${previewFrame} max-w-[300px]`}>
          <PreviewImg src={v.media_url} className="w-full h-40" />
          <div className="p-4 space-y-2">
            {v.badge_en && (
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] uppercase tracking-wider font-extrabold">
                {v.badge_en}
              </span>
            )}
            <h3 className="font-serif text-lg font-bold text-espresso">{v.title_en}</h3>
            <p className="text-xs text-espresso/75 leading-relaxed">{v.description_en}</p>
            {v.cta_text_en && (
              <span className="block text-center w-full py-2 rounded-full bg-emerald-600 text-white text-[11px] font-bold">
                {v.cta_text_en}
              </span>
            )}
          </div>
        </div>
      )}
    />
  );
}

/* =========================================================
   4. FEATURED MASTERCLASS
   ========================================================= */
const masterclassGroups: FieldGroup[] = [
  {
    title: "Texts",
    icon: ICON_TEXT,
    fields: [
      { key: "badge_en", label: "Badge", hint: "Label on top of the video cover.", maxLength: 40 },
      { key: "title_en", label: "Title", maxLength: 100, required: true },
      { key: "subtitle_en", label: "Speaker", maxLength: 80 },
      { key: "description_en", label: "Description", type: "textarea", rows: 4, maxLength: 400 },
      { key: "meta.duration", label: "Duration", placeholder: "45 min", maxLength: 20 },
    ],
  },
  {
    title: "Video",
    icon: ICON_VIDEO,
    fields: [
      { key: "cta_link", label: "Video URL (YouTube)", placeholder: "https://www.youtube.com/watch?v=..." },
      { key: "media_url", label: "Cover image URL", type: "image" },
    ],
  },
];

export function FeaturedMasterclassEditor() {
  return (
    <CollectionEditor
      section="masterclasses"
      contentType="video"
      mode="single"
      itemKeyPrefix="home_masterclass_featured"
      mediaType="image"
      title="Featured masterclass"
      description="The large highlighted video at the top of the Masterclasses section."
      viewHref="/#masterclasses"
      groups={masterclassGroups}
      preview={(v) => <VideoPreview v={v} large />}
    />
  );
}

/* =========================================================
   5. VIDEO CAPSULES (lista)
   ========================================================= */
const videoGroups: FieldGroup[] = [
  {
    title: "Texts",
    icon: ICON_TEXT,
    fields: [
      { key: "badge_en", label: "Badge", maxLength: 40 },
      { key: "title_en", label: "Title", maxLength: 80, required: true },
      { key: "description_en", label: "Description", type: "textarea", rows: 3, maxLength: 220 },
      { key: "subtitle_en", label: "Footer label", hint: "Shown at the bottom-left of the card.", maxLength: 40 },
      { key: "cta_text_en", label: "Button text", maxLength: 30 },
    ],
  },
  {
    title: "Video",
    icon: ICON_VIDEO,
    fields: [
      { key: "cta_link", label: "Video URL (YouTube)", placeholder: "https://www.youtube.com/watch?v=..." },
      { key: "meta.duration", label: "Duration", placeholder: "10 min", maxLength: 20 },
      {
        key: "meta.category",
        label: "Category (filter)",
        type: "select",
        options: [
          { value: "emotional", label: "Psycho-oncology / Emotional" },
          { value: "movement", label: "Mobility / Movement" },
          { value: "caregivers", label: "Family & caregivers" },
          { value: "nutrition", label: "Nutrition / Meditation" },
        ],
      },
      { key: "media_url", label: "Thumbnail image URL", type: "image" },
    ],
  },
];

export function VideoCapsulesEditor() {
  return (
    <CollectionEditor
      section="videos"
      contentType="video"
      mode="list"
      itemKeyPrefix="home_video"
      mediaType="image"
      title="Video capsules"
      description="The short video cards below the featured masterclass."
      viewHref="/#masterclasses"
      groups={videoGroups}
      addLabel="Add video"
      defaults={{ title_en: "New video", "meta.category": "emotional", "meta.duration": "10 min" }}
      itemLabel={(v) => v.title_en || "Untitled"}
      preview={(v) => <VideoPreview v={v} />}
    />
  );
}

function VideoPreview({ v, large }: { v: FormValues; large?: boolean }) {
  return (
    <div className={`${previewFrame} ${large ? "" : "max-w-[320px]"}`}>
      <div className="relative">
        <PreviewImg src={v.media_url} className="w-full aspect-video" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="w-11 h-11 rounded-full bg-white/90 text-primary flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined notranslate text-[26px]" translate="no">
              &#xe037;
            </span>
          </span>
        </div>
        {v.badge_en && (
          <span className="absolute top-2 left-2 bg-white/90 px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-espresso">
            {v.badge_en}
          </span>
        )}
        {v["meta.duration"] && (
          <span className="absolute bottom-2 right-2 bg-espresso/85 text-white px-2 py-0.5 rounded-md text-[10px]">
            {v["meta.duration"]}
          </span>
        )}
      </div>
      <div className="p-4 space-y-1.5">
        <h4 className="font-serif text-base font-bold text-espresso">{v.title_en}</h4>
        {large && v.subtitle_en && <p className="text-xs text-primary font-semibold">{v.subtitle_en}</p>}
        <p className="text-xs text-espresso/70 leading-relaxed line-clamp-3">{v.description_en}</p>
        {!large && (
          <div className="flex items-center justify-between pt-1 text-[11px] text-espresso/60">
            <span>{v.subtitle_en || v.badge_en}</span>
            <span className="text-primary font-semibold">{v.cta_text_en || "Watch"}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   6. HEALING CIRCLES (lista)
   ========================================================= */
const circlesGroups: FieldGroup[] = [
  {
    title: "Texts",
    icon: ICON_TEXT,
    fields: [
      { key: "badge_en", label: "Tag", hint: "E.g. PATIENTS, CAREGIVERS.", maxLength: 30 },
      { key: "title_en", label: "Title", maxLength: 80, required: true },
      { key: "subtitle_en", label: "Schedule", hint: "Day and time, e.g. Tuesdays · 6:00 PM", maxLength: 60 },
      { key: "description_en", label: "Description", type: "textarea", rows: 3, maxLength: 220 },
      { key: "cta_text_en", label: "Button text", placeholder: "Reserve a spot", maxLength: 30 },
    ],
  },
];

export function CirclesEditor() {
  return (
    <CollectionEditor
      section="circles"
      contentType="circle"
      mode="list"
      itemKeyPrefix="home_circle"
      title="Healing circles"
      description="The schedule of live support circles shown in the Community section."
      viewHref="/#circulos"
      groups={circlesGroups}
      addLabel="Add circle"
      defaults={{ title_en: "New circle", cta_text_en: "Reserve a spot" }}
      itemLabel={(v) => v.title_en || "Untitled"}
      preview={(v) => (
        <div className={`${previewFrame} p-5 flex items-start gap-3`}>
          <div className="rounded-2xl p-3 text-center shrink-0 min-w-[64px] bg-gradient-to-br from-[#FFE8ED] to-[#FAD4DC] text-[#C4546A] border border-[#F5C2CC]">
            <span className="text-[9px] uppercase block font-extrabold tracking-wider">NARA</span>
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
            <span className="inline-block mt-1 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#C4546A] to-[#E27D90] text-white text-[11px] font-bold">
              {v.cta_text_en || "Reserve a spot"}
            </span>
          </div>
        </div>
      )}
    />
  );
}

/* =========================================================
   7. FINAL BANNER
   ========================================================= */
const ctaGroups: FieldGroup[] = [
  {
    title: "Texts",
    icon: ICON_TEXT,
    fields: [
      { key: "title_en", label: "Title", maxLength: 80, required: true },
      { key: "description_en", label: "Description", type: "textarea", rows: 4, maxLength: 300 },
    ],
  },
];

export function CtaBannerEditor() {
  return (
    <CollectionEditor
      section="cta_banner"
      contentType="text"
      mode="single"
      itemKeyPrefix="home_cta_kit"
      title="Final banner"
      description="The closing call to action at the bottom of the home page, with the email form."
      groups={ctaGroups}
      defaults={{ title_en: "Let us accompany you, step by step." }}
      preview={(v) => (
        <div className={`${previewFrame} p-6 text-center bg-gradient-to-b from-white to-[#FAF8F5] space-y-3`}>
          <h2 className="font-serif text-xl font-bold text-espresso">{v.title_en}</h2>
          <p className="text-xs text-espresso/70 leading-relaxed">{v.description_en}</p>
          <div className="flex gap-2 pt-1">
            <span className="flex-1 rounded-full border border-espresso/15 bg-white px-3 py-2 text-[11px] text-espresso/40 text-left">
              your@email.com
            </span>
            <span className="px-4 py-2 rounded-full bg-primary text-white text-[11px] font-bold">Send</span>
          </div>
        </div>
      )}
    />
  );
}

