"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import type { CmsItem } from "@/types/cms";
import { useNara } from "@/context/NaraContext";
import {
  BlockHeader,
  FieldCard,
  ImageField,
  SaveBar,
  TextField,
} from "@/components/admin/ui/BlockEditorUI";

/** Valores por defecto (los mismos textos en inglés que usa hoy la página). */
const DEFAULTS = {
  badge: "Endorsed by psycho-oncologists & clinical nutrition",
  titleLine1: "You don't walk alone.",
  titleLine2: "We walk beside you",
  titleLine3: "and those you love.",
  description:
    "Comprehensive emotional, clinical, and practical support to guide you through diagnosis, active treatment, and breast cancer recovery together with your family, partner, and friends in a warm haven.",
  image:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85",
};

interface HeroForm {
  badge: string;
  titleLine1: string;
  titleLine2: string;
  titleLine3: string;
  description: string;
  image: string;
}

function itemToForm(item: CmsItem | null): HeroForm {
  const meta = (item?.meta_json ?? {}) as Record<string, unknown>;
  const str = (v: unknown, fallback: string) =>
    typeof v === "string" && v.trim() ? v : fallback;
  return {
    badge: str(item?.badge_en, DEFAULTS.badge),
    titleLine1: str(meta.title_line1, DEFAULTS.titleLine1),
    titleLine2: str(meta.title_line2, DEFAULTS.titleLine2),
    titleLine3: str(meta.title_line3, DEFAULTS.titleLine3),
    description: str(item?.description_en, DEFAULTS.description),
    image: str(item?.media_url, DEFAULTS.image),
  };
}

export function HeroEditor() {
  const { adminUser } = useNara();
  const [item, setItem] = useState<CmsItem | null>(null);
  const [saved, setSaved] = useState<HeroForm>(itemToForm(null));
  const [form, setForm] = useState<HeroForm>(itemToForm(null));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  /* ---------- Cargar el bloque Hero desde la base de datos ---------- */
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms?page=home&section=hero", { cache: "no-store" });
      const data = await res.json();
      const hero: CmsItem | null = data?.ok && data.items?.length ? data.items[0] : null;
      setItem(hero);
      const f = itemToForm(hero);
      setSaved(f);
      setForm(f);
    } catch {
      setMessage({ type: "error", text: "Could not load the Hero block." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(saved), [form, saved]);

  const update = (key: keyof HeroForm) => (value: string) => {
    setMessage(null);
    setForm((f) => ({ ...f, [key]: value }));
  };

  /* ---------- Guardar ---------- */
  const save = async () => {
    if (!form.image.trim()) {
      setMessage({ type: "error", text: "The background image URL is required." });
      return;
    }
    setSaving(true);
    setMessage(null);
    const payload = {
      page: "home",
      section: "hero",
      content_type: "image",
      item_key: "home_hero_main",
      title_en: item?.title_en || form.titleLine1,
      badge_en: form.badge,
      description_en: form.description,
      media_url: form.image.trim(),
      media_type: "image",
      meta_json: {
        ...((item?.meta_json as Record<string, unknown>) ?? {}),
        title_line1: form.titleLine1,
        title_line2: form.titleLine2,
        title_line3: form.titleLine3,
      },
      changed_by: adminUser?.name || adminUser?.email || "Admin NARA",
    };

    try {
      const res = await fetch(item ? `/api/cms/${item.id}` : "/api/cms", {
        method: item ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data?.ok) throw new Error(data?.error || "Error saving");
      setItem(data.item);
      setSaved(form);
      setMessage({ type: "success", text: "Hero saved successfully." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Error saving",
      });
    } finally {
      setSaving(false);
    }
  };

  const discard = () => {
    setForm(saved);
    setMessage(null);
  };

  if (loading) {
    return <div className="text-sm text-espresso/60 py-10">Loading Hero block...</div>;
  }

  return (
    <div>
      <BlockHeader
        title="Hero"
        description="The first section visitors see on the home page: badge, main title, description and background image."
        viewHref="/#inicio"
      />

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 items-start">
        {/* ---------- Formulario ---------- */}
        <div className="xl:col-span-3 space-y-6">
          <FieldCard title="Texts" icon={"\ue262"}>
            <TextField
              label="Badge"
              hint="Small label shown above the title."
              value={form.badge}
              onChange={update("badge")}
              maxLength={80}
            />
            <div className="grid grid-cols-1 gap-4">
              <TextField
                label="Title · line 1"
                value={form.titleLine1}
                onChange={update("titleLine1")}
                maxLength={40}
              />
              <TextField
                label="Title · line 2 (highlighted in pink italic)"
                value={form.titleLine2}
                onChange={update("titleLine2")}
                maxLength={40}
              />
              <TextField
                label="Title · line 3"
                value={form.titleLine3}
                onChange={update("titleLine3")}
                maxLength={40}
              />
            </div>
            <TextField
              label="Description"
              value={form.description}
              onChange={update("description")}
              multiline
              rows={4}
              maxLength={300}
            />
          </FieldCard>

          <FieldCard title="Background image" icon={"\ue3f4"}>
            <ImageField
              label="Image URL"
              hint="Paste the link to a large landscape image (recommended 2000px wide)."
              value={form.image}
              onChange={update("image")}
            />
          </FieldCard>
        </div>

        {/* ---------- Vista previa ---------- */}
        <div className="xl:col-span-2 xl:sticky xl:top-6">
          <span className="block text-[10px] font-extrabold uppercase tracking-[0.18em] text-espresso/50 mb-2">
            Live preview
          </span>
          <div className="relative rounded-2xl overflow-hidden border border-espresso/10 shadow-[0_8px_28px_rgba(38,35,34,0.08)] aspect-4/3">
            {form.image.trim() && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.image.trim()}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, #FAF7F2 0%, #FAF7F2 45%, rgba(250,247,242,0.85) 60%, rgba(250,247,242,0.1) 85%)",
              }}
            />
            <div className="relative h-full p-5 flex flex-col justify-center space-y-3 max-w-[75%]">
              <span className="self-start inline-flex items-center gap-1.5 bg-white/90 px-2.5 py-1 rounded-full border border-espresso/10 text-[9px] font-semibold text-espresso/80">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                {form.badge}
              </span>
              <h1 className="text-xl leading-[1.1] tracking-tight text-espresso font-extrabold">
                <span className="block">{form.titleLine1}</span>
                <span className="block font-serif italic font-normal text-rose-brand">
                  {form.titleLine2}
                </span>
                <span className="block">{form.titleLine3}</span>
              </h1>
              <p className="text-[10px] text-espresso/75 leading-relaxed line-clamp-4">
                {form.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <SaveBar
        dirty={dirty}
        saving={saving}
        onSave={save}
        onDiscard={discard}
        message={message}
      />
    </div>
  );
}

