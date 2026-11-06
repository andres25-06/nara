"use client";

/**
 * Editor genérico de bloques del CMS.
 * Usa el mismo diseño que el editor del Hero (encabezado, tarjetas de campos,
 * vista previa en vivo y barra de guardado) y sirve para 3 tipos de bloque:
 *  - "single": un único elemento (ej. Marquee, Banner final).
 *  - "fixed":  un número fijo de elementos (ej. 4 Etapas, 4 Pilares).
 *  - "list":   lista libre: agregar, ocultar, ordenar y eliminar (ej. Círculos).
 */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import type { CmsItem } from "@/types/cms";
import { useNara } from "@/context/NaraContext";
import {
  BlockHeader,
  FieldCard,
  ImageField,
  ItemTabs,
  SaveBar,
  SelectField,
  TextField,
  ToggleField,
  WordsField,
} from "./BlockEditorUI";

export type FormValues = Record<string, string>;

export interface FieldDef {
  /** Columna de cms_items (ej. "title_en") o "meta.<clave>" para meta_json */
  key: string;
  label: string;
  hint?: string;
  type?: "text" | "textarea" | "image" | "words" | "select";
  options?: { value: string; label: string }[];
  maxLength?: number;
  rows?: number;
  placeholder?: string;
  required?: boolean;
}

export interface FieldGroup {
  title: string;
  icon?: string;
  fields: FieldDef[];
}

interface CollectionEditorProps {
  page?: string;
  section: string;
  contentType: CmsItem["content_type"];
  title: string;
  description: string;
  viewHref?: string;
  mode: "single" | "fixed" | "list";
  groups: FieldGroup[];
  /** Valores por defecto (bloque single, o nuevos elementos en modo list) */
  defaults?: FormValues;
  /** Prefijo para item_key al crear elementos */
  itemKeyPrefix: string;
  /** Número de elementos en modo "fixed" */
  fixedCount?: number;
  /** Etiqueta para cada elemento en el selector */
  itemLabel?: (values: FormValues, index: number) => string;
  addLabel?: string;
  mediaType?: "image" | "video";
  preview?: (values: FormValues) => React.ReactNode;
}

type Slot = { slotId: string; item: CmsItem | null; order: number };

const allFields = (groups: FieldGroup[]) => groups.flatMap((g) => g.fields);

function readValue(item: CmsItem | null, key: string): string {
  if (!item) return "";
  if (key.startsWith("meta.")) {
    const v = (item.meta_json ?? {})[key.slice(5)];
    return v === undefined || v === null ? "" : String(v);
  }
  const v = (item as unknown as Record<string, unknown>)[key];
  return v === undefined || v === null ? "" : String(v);
}

function toValues(
  item: CmsItem | null,
  groups: FieldGroup[],
  defaults: FormValues,
  useDefaults: boolean
): FormValues {
  const values: FormValues = {};
  for (const f of allFields(groups)) {
    const v = readValue(item, f.key);
    values[f.key] = v.trim() ? v : useDefaults ? defaults[f.key] ?? "" : "";
  }
  values.status = item?.status ?? "active";
  return values;
}

export function CollectionEditor({
  page = "home",
  section,
  contentType,
  title,
  description,
  viewHref,
  mode,
  groups,
  defaults = {},
  itemKeyPrefix,
  fixedCount = 4,
  itemLabel,
  addLabel = "Add",
  mediaType = "image",
  preview,
}: CollectionEditorProps) {
  const { adminUser } = useNara();
  const changedBy = adminUser?.name || adminUser?.email || "Admin NARA";

  const [items, setItems] = useState<CmsItem[]>([]);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [saved, setSaved] = useState<FormValues>({});
  const [form, setForm] = useState<FormValues>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  /* ---------- Slots (elementos editables) según el modo ---------- */
  const slots: Slot[] = useMemo(() => {
    const sorted = [...items].sort(
      (a, b) => a.display_order - b.display_order || a.id - b.id
    );
    if (mode === "single") {
      return [{ slotId: "single", item: sorted[0] ?? null, order: sorted[0]?.display_order ?? 1 }];
    }
    if (mode === "fixed") {
      return Array.from({ length: fixedCount }, (_, i) => ({
        slotId: `fixed-${i + 1}`,
        item: sorted.find((it) => it.display_order === i + 1) ?? null,
        order: i + 1,
      }));
    }
    return sorted.map((it) => ({ slotId: String(it.id), item: it, order: it.display_order }));
  }, [items, mode, fixedCount]);

  const currentIndex = slots.findIndex((s) => s.slotId === activeSlot);
  const current = currentIndex >= 0 ? slots[currentIndex] : null;
  const useDefaults = mode === "single";

  /* ---------- Cargar ---------- */
  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/cms?page=${page}&section=${section}`, { cache: "no-store" });
      const data = await res.json();
      if (!data?.ok) throw new Error(data?.error);
      setItems(data.items as CmsItem[]);
      return data.items as CmsItem[];
    } catch {
      setMessage({ type: "error", text: "Could not load this block." });
      return [];
    } finally {
      setLoading(false);
    }
  }, [page, section]);

  useEffect(() => {
    load();
  }, [load]);

  // Seleccionar el primer elemento al cargar
  useEffect(() => {
    if (!loading && !activeSlot && slots.length > 0) setActiveSlot(slots[0].slotId);
  }, [loading, activeSlot, slots]);

  // Sincronizar el formulario cuando cambia el elemento seleccionado
  useEffect(() => {
    if (!current) {
      setSaved({});
      setForm({});
      return;
    }
    const v = toValues(current.item, groups, defaults, useDefaults);
    setSaved(v);
    setForm(v);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.slotId, current?.item?.updated_at]);

  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(saved), [form, saved]);

  const set = (key: string) => (value: string) => {
    setMessage(null);
    setForm((f) => ({ ...f, [key]: value }));
  };

  const confirmLeave = () =>
    !dirty || window.confirm("You have unsaved changes. Discard them?");

  const selectSlot = (id: string) => {
    if (id === activeSlot || !confirmLeave()) return;
    setMessage(null);
    setActiveSlot(id);
  };

  /* ---------- Guardar ---------- */
  const save = async () => {
    if (!current) return;
    const missing = allFields(groups).find((f) => f.required && !form[f.key]?.trim());
    if (missing) {
      setMessage({ type: "error", text: `"${missing.label}" is required.` });
      return;
    }

    setSaving(true);
    setMessage(null);
    const item = current.item;
    const meta: Record<string, unknown> = { ...(item?.meta_json ?? {}) };
    const payload: Record<string, unknown> = {
      page,
      section,
      content_type: contentType,
      changed_by: changedBy,
    };
    for (const f of allFields(groups)) {
      const value = (form[f.key] ?? "").trim();
      if (f.key.startsWith("meta.")) meta[f.key.slice(5)] = value;
      else payload[f.key] = value;
    }
    payload.meta_json = meta;
    if ("media_url" in payload) payload.media_type = payload.media_url ? mediaType : "none";
    // En bloques fijos/únicos no hay opción de ocultar: guardar siempre los deja visibles
    payload.status = mode === "list" ? form.status : "active";
    if (!item) {
      payload.item_key = mode === "single" ? itemKeyPrefix : `${itemKeyPrefix}_${Date.now()}`;
      payload.display_order = current.order;
      payload.status = "active";
    }

    try {
      const res = await fetch(item ? `/api/cms/${item.id}` : "/api/cms", {
        method: item ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data?.ok) throw new Error(data?.error || "Error saving");
      const updated = data.item as CmsItem;
      setItems((list) =>
        item ? list.map((it) => (it.id === updated.id ? updated : it)) : [...list, updated]
      );
      setSaved(form);
      setMessage({ type: "success", text: "Changes saved successfully." });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Error saving" });
    } finally {
      setSaving(false);
    }
  };

  /* ---------- Agregar (modo list) ---------- */
  const addItem = async () => {
    if (!confirmLeave()) return;
    setSaving(true);
    setMessage(null);
    const meta: Record<string, unknown> = {};
    const payload: Record<string, unknown> = {
      page,
      section,
      content_type: contentType,
      item_key: `${itemKeyPrefix}_${Date.now()}`,
      display_order: Math.max(0, ...items.map((i) => i.display_order)) + 1,
      status: "inactive", // se crea oculto hasta que se complete y active
      changed_by: changedBy,
    };
    for (const f of allFields(groups)) {
      const value = defaults[f.key] ?? "";
      if (f.key.startsWith("meta.")) meta[f.key.slice(5)] = value;
      else payload[f.key] = value;
    }
    payload.meta_json = meta;
    if (payload.media_url) payload.media_type = mediaType;
    try {
      const res = await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data?.ok) throw new Error(data?.error || "Error creating");
      setItems((list) => [...list, data.item]);
      setActiveSlot(String(data.item.id));
      setMessage({ type: "success", text: "New item created (hidden). Edit it and make it visible." });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Error creating" });
    } finally {
      setSaving(false);
    }
  };

  /* ---------- Eliminar (modo list) ---------- */
  const removeItem = async () => {
    const item = current?.item;
    if (!item) return;
    if (!window.confirm("Delete this item permanently? A backup is kept in the history.")) return;
    setSaving(true);
    try {
      const res = await fetch(
        `/api/cms/${item.id}?changed_by=${encodeURIComponent(changedBy)}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!data?.ok) throw new Error(data?.error || "Error deleting");
      const remaining = items.filter((i) => i.id !== item.id);
      setItems(remaining);
      setActiveSlot(null);
      setMessage({ type: "success", text: "Item deleted." });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Error deleting" });
    } finally {
      setSaving(false);
    }
  };

  /* ---------- Reordenar (modo list) ---------- */
  const moveItem = async (dir: -1 | 1) => {
    const j = currentIndex + dir;
    if (currentIndex < 0 || j < 0 || j >= slots.length) return;
    const ordered = slots.map((s) => s.item as CmsItem);
    [ordered[currentIndex], ordered[j]] = [ordered[j], ordered[currentIndex]];
    const changes = ordered
      .map((it, idx) => ({ it, order: idx + 1 }))
      .filter(({ it, order }) => it.display_order !== order);
    setSaving(true);
    try {
      const results = await Promise.all(
        changes.map(({ it, order }) =>
          fetch(`/api/cms/${it.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ display_order: order, changed_by: changedBy }),
          }).then((r) => r.json())
        )
      );
      const updatedById = new Map<number, CmsItem>();
      results.forEach((r) => r?.ok && updatedById.set(r.item.id, r.item));
      setItems((list) => list.map((it) => updatedById.get(it.id) ?? it));
    } catch {
      setMessage({ type: "error", text: "Could not change the order." });
    } finally {
      setSaving(false);
    }
  };

  /* ---------- Render ---------- */
  if (loading) {
    return <div className="text-sm text-espresso/60 py-10">Loading {title}...</div>;
  }

  const renderField = (f: FieldDef) => {
    const common = { label: f.label, hint: f.hint, value: form[f.key] ?? "", onChange: set(f.key) };
    switch (f.type) {
      case "textarea":
        return (
          <TextField key={f.key} {...common} multiline rows={f.rows ?? 4} maxLength={f.maxLength} placeholder={f.placeholder} />
        );
      case "image":
        return <ImageField key={f.key} {...common} />;
      case "words":
        return <WordsField key={f.key} {...common} />;
      case "select":
        return <SelectField key={f.key} {...common} options={f.options ?? []} />;
      default:
        return <TextField key={f.key} {...common} maxLength={f.maxLength} placeholder={f.placeholder} />;
    }
  };

  const tabItems = slots.map((s, i) => ({
    id: s.slotId,
    label: itemLabel
      ? itemLabel(toValues(s.item, groups, defaults, useDefaults), i)
      : `Item ${i + 1}`,
    hidden: s.item?.status === "inactive",
  }));

  return (
    <div>
      <BlockHeader
        title={title}
        description={description}
        viewHref={viewHref}
        active={mode === "list" && current?.item ? form.status === "active" : undefined}
      />

      {mode !== "single" && (
        <ItemTabs
          items={tabItems}
          activeId={activeSlot}
          onSelect={selectSlot}
          onAdd={mode === "list" ? addItem : undefined}
          addLabel={addLabel}
        />
      )}

      {mode === "list" && slots.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-espresso/20 p-10 text-center text-sm text-espresso/60">
          There are no items yet. Click <strong>{addLabel}</strong> to create the first one.
        </div>
      ) : (
        current && (
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 items-start">
            {/* ---------- Formulario ---------- */}
            <div className="xl:col-span-3 space-y-6">
              {groups.map((g) => (
                <FieldCard key={g.title} title={g.title} icon={g.icon}>
                  {g.fields.map(renderField)}
                </FieldCard>
              ))}

              {mode === "list" && current.item && (
                <FieldCard title="Visibility & order" icon={"\ue8f4"}>
                  <ToggleField
                    label="Visible on the site"
                    hint="Hidden items are kept but not shown on the home page."
                    checked={form.status === "active"}
                    onChange={(v) => set("status")(v ? "active" : "inactive")}
                  />
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-espresso/8">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => moveItem(-1)}
                        disabled={saving || currentIndex <= 0}
                        className="px-3.5 py-2 rounded-full bg-[#FAF8F5] border border-espresso/15 text-xs font-bold text-espresso hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed enabled:cursor-pointer"
                      >
                        ← Move earlier
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItem(1)}
                        disabled={saving || currentIndex >= slots.length - 1}
                        className="px-3.5 py-2 rounded-full bg-[#FAF8F5] border border-espresso/15 text-xs font-bold text-espresso hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed enabled:cursor-pointer"
                      >
                        Move later →
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={removeItem}
                      disabled={saving}
                      className="px-3.5 py-2 rounded-full text-xs font-bold text-red-700 hover:bg-red-100 disabled:opacity-40 cursor-pointer"
                    >
                      Delete item
                    </button>
                  </div>
                </FieldCard>
              )}
            </div>

            {/* ---------- Vista previa ---------- */}
            {preview && (
              <div className="xl:col-span-2 xl:sticky xl:top-6">
                <span className="block text-[10px] font-extrabold uppercase tracking-[0.18em] text-espresso/50 mb-2">
                  Live preview
                </span>
                {preview(form)}
              </div>
            )}
          </div>
        )
      )}

      <SaveBar
        dirty={dirty}
        saving={saving}
        onSave={save}
        onDiscard={() => {
          setForm(saved);
          setMessage(null);
        }}
        message={message}
      />
    </div>
  );
}
