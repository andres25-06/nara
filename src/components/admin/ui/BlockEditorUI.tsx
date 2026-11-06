"use client";

/**
 * Componentes de UI reutilizables para los editores de bloques del panel admin.
 * Todos los bloques (Hero, Pilares, Círculos, etc.) usan estas mismas piezas
 * para mantener un diseño consistente.
 */

import React from "react";

/* ---------- Encabezado del bloque ---------- */
export function BlockHeader({
  title,
  description,
  viewHref,
  active,
}: {
  title: string;
  description: string;
  viewHref?: string;
  active?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
      <div>
        <div className="flex items-center gap-2.5">
          <h2 className="text-xl font-extrabold tracking-tight text-espresso">{title}</h2>
          {active !== undefined && (
            <span
              className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                active ? "bg-sage/15 text-sage" : "bg-espresso/10 text-espresso/60"
              }`}
            >
              {active ? "Visible" : "Hidden"}
            </span>
          )}
        </div>
        <p className="text-sm text-espresso/60 mt-1">{description}</p>
      </div>
      {viewHref && (
        <a
          href={viewHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-espresso/15 text-xs font-bold text-espresso hover:border-primary hover:text-primary transition-colors shadow-2xs"
        >
          <span className="material-symbols-outlined notranslate text-[16px]" translate="no">
            &#xe89e;
          </span>
          View on site
        </a>
      )}
    </div>
  );
}

/* ---------- Tarjeta que agrupa campos ---------- */
export function FieldCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-2xl border border-espresso/10 shadow-[0_4px_20px_rgba(38,35,34,0.04)] p-5 sm:p-6">
      <h3 className="flex items-center gap-2 text-sm font-extrabold text-espresso mb-4">
        {icon && (
          <span className="material-symbols-outlined notranslate text-primary text-[20px]" translate="no">
            {icon}
          </span>
        )}
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

/* ---------- Campo de texto / textarea ---------- */
const inputClass =
  "w-full rounded-xl border border-espresso/15 bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-espresso placeholder:text-espresso/35 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition";

export function TextField({
  label,
  hint,
  value,
  onChange,
  placeholder,
  multiline,
  rows = 4,
  maxLength,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-xs font-bold text-espresso">{label}</span>
        {maxLength && (
          <span className="text-[11px] text-espresso/45">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      {multiline ? (
        <textarea
          className={`${inputClass} resize-y leading-relaxed`}
          rows={rows}
          value={value}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type="text"
          className={inputClass}
          value={value}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {hint && <span className="block text-[11px] text-espresso/50 mt-1">{hint}</span>}
    </label>
  );
}

/* ---------- Campo de imagen (URL + vista previa) ---------- */
export function ImageField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [broken, setBroken] = React.useState(false);
  React.useEffect(() => setBroken(false), [value]);

  return (
    <div className="space-y-2">
      <TextField
        label={label}
        hint={hint}
        value={value}
        onChange={onChange}
        placeholder="https://..."
      />
      <div className="relative aspect-16/7 rounded-xl overflow-hidden border border-espresso/10 bg-[#FAF8F5] flex items-center justify-center">
        {value.trim() && !broken ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value.trim()}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={() => setBroken(true)}
          />
        ) : (
          <span className="text-xs text-espresso/45 font-semibold">
            {broken ? "The image could not be loaded" : "No image"}
          </span>
        )}
      </div>
    </div>
  );
}

/* ---------- Interruptor visible / oculto ---------- */
export function ToggleField({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <span className="block text-xs font-bold text-espresso">{label}</span>
        {hint && <span className="block text-[11px] text-espresso/50">{hint}</span>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${
          checked ? "bg-sage" : "bg-espresso/20"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
    </div>
  );
}

/* ---------- Lista de palabras (chips) ---------- */
export function WordsField({
  label,
  hint,
  value,
  onChange,
  separator = " · ",
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  separator?: string;
}) {
  const [draft, setDraft] = React.useState("");
  const words = value
    .split("·")
    .map((w) => w.trim())
    .filter(Boolean);

  const commit = (list: string[]) => onChange(list.join(separator));
  const add = () => {
    const w = draft.trim().replace(/·/g, "");
    if (!w) return;
    commit([...words, w]);
    setDraft("");
  };
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= words.length) return;
    const next = [...words];
    [next[i], next[j]] = [next[j], next[i]];
    commit(next);
  };

  return (
    <div>
      <span className="block text-xs font-bold text-espresso mb-1.5">{label}</span>
      <div className="flex flex-wrap gap-2 mb-3">
        {words.length === 0 && <span className="text-xs text-espresso/45">No words yet</span>}
        {words.map((w, i) => (
          <span
            key={`${w}-${i}`}
            className="inline-flex items-center gap-1 pl-3 pr-1 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold"
          >
            <button
              type="button"
              onClick={() => move(i, -1)}
              disabled={i === 0}
              className="opacity-60 hover:opacity-100 disabled:opacity-20 cursor-pointer"
              title="Move left"
            >
              ‹
            </button>
            {w}
            <button
              type="button"
              onClick={() => move(i, 1)}
              disabled={i === words.length - 1}
              className="opacity-60 hover:opacity-100 disabled:opacity-20 cursor-pointer"
              title="Move right"
            >
              ›
            </button>
            <button
              type="button"
              onClick={() => commit(words.filter((_, k) => k !== i))}
              className="w-5 h-5 rounded-full hover:bg-primary/20 flex items-center justify-center cursor-pointer"
              title="Remove"
            >
              ✕
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          className={inputClass}
          value={draft}
          placeholder="Type a word and press Enter"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <button
          type="button"
          onClick={add}
          className="px-4 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container transition-colors cursor-pointer shrink-0"
        >
          Add
        </button>
      </div>
      {hint && <span className="block text-[11px] text-espresso/50 mt-1">{hint}</span>}
    </div>
  );
}

/* ---------- Selector (dropdown) ---------- */
export function SelectField({
  label,
  hint,
  value,
  onChange,
  options,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="block text-xs font-bold text-espresso mb-1.5">{label}</span>
      <select
        className={`${inputClass} cursor-pointer`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && <span className="block text-[11px] text-espresso/50 mt-1">{hint}</span>}
    </label>
  );
}

/* ---------- Selector de elementos (para bloques con varios elementos) ---------- */
export function ItemTabs({
  items,
  activeId,
  onSelect,
  onAdd,
  addLabel = "Add",
}: {
  items: { id: string; label: string; hidden?: boolean }[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onAdd?: () => void;
  addLabel?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 mb-6">
      {items.map((it) => {
        const isActive = it.id === activeId;
        return (
          <button
            key={it.id}
            type="button"
            onClick={() => onSelect(it.id)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer max-w-[240px] ${
              isActive
                ? "text-primary bg-primary/10 border-primary/30"
                : "text-espresso/80 bg-white border-espresso/10 hover:text-primary hover:border-primary/30"
            }`}
          >
            {it.hidden && (
              <span className="material-symbols-outlined notranslate text-[14px] text-espresso/40" translate="no">
                &#xe8f5;
              </span>
            )}
            <span className="truncate">{it.label}</span>
          </button>
        );
      })}
      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold border border-dashed border-primary/40 text-primary hover:bg-primary/5 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined notranslate text-[16px]" translate="no">
            &#xe145;
          </span>
          {addLabel}
        </button>
      )}
    </div>
  );
}

/* ---------- Barra inferior de guardado ---------- */
export function SaveBar({
  dirty,
  saving,
  onSave,
  onDiscard,
  message,
}: {
  dirty: boolean;
  saving: boolean;
  onSave: () => void;
  onDiscard: () => void;
  message?: { type: "success" | "error"; text: string } | null;
}) {
  return (
    <div className="sticky bottom-0 z-10 mt-6 -mx-8 lg:-mx-10 px-8 lg:px-10 py-4 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-espresso/8 flex flex-wrap items-center justify-between gap-3">
      <div className="text-xs font-semibold">
        {message ? (
          <span className={message.type === "success" ? "text-sage" : "text-red-700"}>
            {message.text}
          </span>
        ) : dirty ? (
          <span className="inline-flex items-center gap-1.5 text-primary">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Unsaved changes
          </span>
        ) : (
          <span className="text-espresso/50">All changes saved</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onDiscard}
          disabled={!dirty || saving}
          className="px-4 py-2 rounded-full text-xs font-bold text-espresso/80 hover:bg-espresso/5 disabled:opacity-40 disabled:cursor-not-allowed enabled:cursor-pointer transition-colors"
        >
          Discard
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={!dirty || saving}
          className="px-5 py-2 rounded-full bg-primary hover:bg-primary-container text-white text-xs font-bold shadow-sm disabled:opacity-40 disabled:cursor-not-allowed enabled:cursor-pointer transition-all"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}

