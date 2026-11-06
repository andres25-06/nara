"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useNara } from "@/context/NaraContext";
import type { CmsItem } from "@/types/cms";

interface ShiftTask {
  id: string;
  task: string;
  helper: string;
  day: string;
  done: boolean;
}

const DEFAULT_SHIFTS: ShiftTask[] = [
  { id: "1", task: "Bring warm lunch & broth", helper: "Sister / Aunt", day: "Tuesday 1:00 PM", done: false },
  { id: "2", task: "Ride to oncology clinic & take notes", helper: "Partner", day: "Thursday 9:30 AM", done: false },
  { id: "3", task: "2-hour afternoon rest shift for primary caregiver", helper: "Close friend", day: "Saturday 4:00 PM", done: false },
];

export default function CaregiversPage() {
  const { adminUser } = useNara();
  const [cmsItems, setCmsItems] = useState<CmsItem[]>([]);
  const [reservedCircles, setReservedCircles] = useState<Record<string, boolean>>({});

  // Estado interactivo del organizador de turnos familiares (#autocuidado)
  const [shifts, setShifts] = useState<ShiftTask[]>(DEFAULT_SHIFTS);
  const [newTask, setNewTask] = useState("");
  const [newHelper, setNewHelper] = useState("");
  const [newDay, setNewDay] = useState("");

  useEffect(() => {
    fetch("/api/cms?page=cuidadores&status=active", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data?.ok && Array.isArray(data.items)) {
          setCmsItems(data.items);
        }
      })
      .catch(() => {});

    try {
      const saved = localStorage.getItem("nara-caregiver-shifts");
      if (saved) setShifts(JSON.parse(saved));
    } catch {}
  }, []);

  const persistShifts = (next: ShiftTask[]) => {
    setShifts(next);
    try {
      localStorage.setItem("nara-caregiver-shifts", JSON.stringify(next));
    } catch {}
  };

  const addShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const item: ShiftTask = {
      id: String(Date.now()),
      task: newTask.trim(),
      helper: newHelper.trim() || "Family member",
      day: newDay.trim() || "This week",
      done: false,
    };
    persistShifts([item, ...shifts]);
    setNewTask("");
    setNewHelper("");
    setNewDay("");
  };

  const heroCms = cmsItems.find((i) => i.section === "caregiver_hero");
  const dictCms = cmsItems
    .filter((i) => i.section === "caregiver_dictionary")
    .sort((a, b) => a.display_order - b.display_order || a.id - b.id);
  const childrenCms = cmsItems
    .filter((i) => i.section === "caregiver_children")
    .sort((a, b) => a.display_order - b.display_order || a.id - b.id);
  const selfcareCms = cmsItems.find((i) => i.section === "caregiver_selfcare");
  const circlesCms = cmsItems
    .filter((i) => i.section === "caregiver_circles")
    .sort((a, b) => a.display_order - b.display_order || a.id - b.id);

  return (
    <div className="min-h-screen bg-background text-espresso">
      {/* Barra rápida si el Administrador tiene sesión iniciada */}
      {adminUser && (
        <div className="bg-espresso text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              <strong>Admin Mode Active</strong> ({adminUser.name}) · Caregivers Page (`cuidadores`) ·{" "}
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
          1. HERO · CAREGIVER HAVEN
         ========================================================= */}
      <section className="relative overflow-hidden py-14 lg:py-20 bg-gradient-to-b from-[#F2F9F5] via-[#FAF8F5] to-background border-b border-espresso/8">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-2xs border border-espresso/10 text-xs font-extrabold text-tertiary">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
              {heroCms?.badge_en || "Caregiver Haven"}
            </span>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
              {heroCms?.subtitle_en || "FOR SPOUSES, CHILDREN, PARENTS & FRIENDS"}
            </p>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-espresso leading-[1.12]">
              {heroCms?.title_en || "Caring for the Caregiver: Sustaining Without Burning Out"}
            </h1>
            <p className="text-base text-espresso/75 leading-relaxed max-w-2xl">
              {heroCms?.description_en ||
                "Practical dictionary of what to say and what to avoid, how to talk to children, and how to organize family shifts without guilt."}
            </p>

            {/* Accesos rápidos a las secciones */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={heroCms?.cta_link || "#diccionario"}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-tertiary hover:bg-tertiary/90 text-white text-xs sm:text-sm font-bold shadow-sm transition-all"
              >
                <span className="material-symbols-outlined notranslate text-[18px]" translate="no">
                  &#xe0b7;
                </span>
                {heroCms?.cta_text_en || "Open Empathy Dictionary"}
              </a>
              <a
                href="#hijos"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-tertiary-fixed/40 text-espresso border border-espresso/15 text-xs sm:text-sm font-bold transition-colors"
              >
                <span className="material-symbols-outlined notranslate text-tertiary text-[18px]" translate="no">
                  &#xf1bd;
                </span>
                Talking to Children
              </a>
              <a
                href="#autocuidado"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-tertiary-fixed/40 text-espresso border border-espresso/15 text-xs sm:text-sm font-bold transition-colors"
              >
                <span className="material-symbols-outlined notranslate text-primary text-[18px]" translate="no">
                  &#xe1a3;
                </span>
                Shift Planner & Self-Care
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(38,35,34,0.14)] border-4 border-white aspect-4/3 bg-surface-container">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  heroCms?.media_url ||
                  "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&w=1200&q=80"
                }
                alt={heroCms?.title_en || "Caregiver Haven"}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          2. EMPATHY DICTIONARY (#diccionario) · QUÉ DECIR Y QUÉ EVITAR
         ========================================================= */}
      <section id="diccionario" className="py-16 lg:py-20 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-tertiary font-extrabold">
            EMPATHY DICTIONARY
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-espresso mt-1">
            What Helps to Hear & What to Avoid
          </h2>
          <p className="text-sm sm:text-base text-espresso/70 mt-2">
            Good intentions sometimes sound heavy when someone is in treatment. Use these loving alternatives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dictCms.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-3xl p-6 border border-espresso/10 shadow-[0_8px_30px_rgba(38,35,34,0.05)] flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4">
                {card.badge_en && (
                  <span className="inline-block px-3 py-1 rounded-full bg-tertiary/10 text-tertiary text-[10px] font-extrabold uppercase tracking-wider">
                    {card.badge_en}
                  </span>
                )}

                {card.subtitle_en && (
                  <div className="p-3.5 rounded-2xl bg-red-50/70 border border-red-200/70 text-xs text-red-900/80">
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-red-700 mb-0.5">
                      ✕ Avoid saying
                    </span>
                    {card.subtitle_en.replace(/^Instead of:\s*/i, "")}
                  </div>
                )}

                <div className="p-4 rounded-2xl bg-[#E3F1E9]/70 border border-[#BDDFCC] space-y-1">
                  <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#2E664F]">
                    ✓ Say instead
                  </span>
                  <h3 className="font-serif text-base font-bold text-espresso leading-snug">
                    {card.title_en}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-espresso/75 leading-relaxed">
                  {card.description_en}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          3. TALKING TO CHILDREN & TEENS (#hijos) · GUÍA POR EDADES
         ========================================================= */}
      <section
        id="hijos"
        className="py-16 lg:py-20 bg-surface-container-low/60 border-y border-espresso/8"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-primary font-extrabold">
              FAMILY COMMUNICATION
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-espresso mt-1">
              How to Talk to Children & Teenagers
            </h2>
            <p className="text-sm sm:text-base text-espresso/70 mt-2">
              Children sense when something is happening. Gentle honesty protects their trust and calms their imagination.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {childrenCms.map((stage) => {
              const script = (stage.meta_json?.script_en as string) || "";
              return (
                <div
                  key={stage.id}
                  className="bg-white rounded-3xl overflow-hidden border border-espresso/10 shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    {stage.media_url && (
                      <div className="relative h-44 w-full overflow-hidden bg-surface-container">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={stage.media_url}
                          alt={stage.title_en}
                          className="w-full h-full object-cover"
                        />
                        {stage.badge_en && (
                          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 text-tertiary text-[10px] font-extrabold uppercase tracking-wider shadow-2xs">
                            {stage.badge_en}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="p-6 space-y-3">
                      {stage.subtitle_en && (
                        <span className="block text-[11px] font-extrabold uppercase tracking-wider text-primary">
                          {stage.subtitle_en}
                        </span>
                      )}
                      <h3 className="font-serif text-xl font-bold text-espresso leading-snug">
                        {stage.title_en}
                      </h3>
                      <p className="text-xs sm:text-sm text-espresso/75 leading-relaxed">
                        {stage.description_en}
                      </p>
                      {script && (
                        <div className="p-3.5 rounded-2xl bg-[#FFF7F9] border border-[#F5C2CC]/70 space-y-1">
                          <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#C4546A]">
                            ✦ Reassuring phrase to use
                          </span>
                          <p className="text-xs font-serif italic text-espresso/90">“{script}”</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          4. SELF-CARE & FAMILY SHIFT PLANNER (#autocuidado)
         ========================================================= */}
      <section id="autocuidado" className="py-16 lg:py-20 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Columna izquierda editable desde Admin */}
          <div className="lg:col-span-5 space-y-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary/10 text-tertiary text-xs font-extrabold">
              <span className="material-symbols-outlined notranslate text-[16px]" translate="no">
                &#xe1a3;
              </span>
              {selfcareCms?.badge_en || "Caregiver Balance"}
            </span>
            <p className="text-xs font-extrabold uppercase tracking-wider text-primary">
              {selfcareCms?.subtitle_en || "RESTING IS NOT ABANDONING · IT IS SUSTAINING"}
            </p>
            <h2 className="text-3xl font-serif font-bold text-espresso">
              {selfcareCms?.title_en || "Family Shift Planner & Caregiver Self-Care"}
            </h2>
            <p className="text-sm text-espresso/75 leading-relaxed">
              {selfcareCms?.description_en ||
                "Caregiver burnout happens silently when one person carries medications, appointments, meals, and emotional support alone. Divide concrete tasks across your support ring."}
            </p>

            <div className="bg-white rounded-2xl p-5 border border-espresso/10 space-y-3">
              <span className="block text-xs font-extrabold uppercase tracking-wider text-espresso">
                3 Golden Rules Against Caregiver Burnout
              </span>
              {[
                (selfcareCms?.meta_json?.tip1_en as string) ||
                  "Name one “communications captain” to update extended family in a single group message.",
                (selfcareCms?.meta_json?.tip2_en as string) ||
                  "Schedule at least two 2-hour windows per week where another trusted person takes over.",
                (selfcareCms?.meta_json?.tip3_en as string) ||
                  "Keep a shared list of concrete errands ready for when friends ask “How can I help?”.",
              ]
                .filter(Boolean)
                .map((tip, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-espresso/80">
                    <span className="w-5 h-5 rounded-full bg-tertiary/15 text-tertiary font-extrabold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span>{tip}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Columna derecha: Organizador interactivo de turnos familiares */}
          <div className="lg:col-span-7 space-y-6">
            <form
              onSubmit={addShift}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-espresso/10 shadow-[0_12px_36px_rgba(38,35,34,0.06)] space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold text-espresso">
                  Shared Family Support Tasks
                </h3>
                <span className="text-xs font-semibold text-espresso/50">Saved on this device</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Concrete task (e.g. Pick up prescriptions)"
                  className="sm:col-span-3 rounded-xl border border-espresso/15 bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-espresso placeholder:text-espresso/40 focus:outline-none focus:border-primary"
                />
                <input
                  type="text"
                  value={newHelper}
                  onChange={(e) => setNewHelper(e.target.value)}
                  placeholder="Who helps? (e.g. Brother Carlos)"
                  className="sm:col-span-2 rounded-xl border border-espresso/15 bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-espresso placeholder:text-espresso/40 focus:outline-none focus:border-primary"
                />
                <input
                  type="text"
                  value={newDay}
                  onChange={(e) => setNewDay(e.target.value)}
                  placeholder="Day & time (e.g. Friday 5 PM)"
                  className="rounded-xl border border-espresso/15 bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-espresso placeholder:text-espresso/40 focus:outline-none focus:border-primary"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-tertiary hover:bg-tertiary/90 text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
              >
                + {selfcareCms?.cta_text_en || "Add Task to Family Plan"}
              </button>

              <div className="space-y-2.5 pt-3 border-t border-espresso/8">
                {shifts.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#FAF8F5] border border-espresso/8"
                  >
                    <label className="flex items-start gap-3 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={s.done}
                        onChange={() =>
                          persistShifts(
                            shifts.map((x) => (x.id === s.id ? { ...x, done: !x.done } : x))
                          )
                        }
                        className="mt-1 accent-tertiary"
                      />
                      <div>
                        <span
                          className={`block text-xs sm:text-sm font-bold ${
                            s.done ? "line-through text-espresso/45" : "text-espresso"
                          }`}
                        >
                          {s.task}
                        </span>
                        <span className="block text-[11px] text-espresso/60">
                          Assigned to: <strong>{s.helper}</strong> · {s.day}
                        </span>
                      </div>
                    </label>
                    <button
                      type="button"
                      onClick={() => persistShifts(shifts.filter((x) => x.id !== s.id))}
                      className="text-xs text-espresso/40 hover:text-red-700 font-bold px-2 cursor-pointer"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* =========================================================
          5. CAREGIVER SUPPORT CIRCLES (#circulos)
         ========================================================= */}
      <section
        id="circulos"
        className="py-16 lg:py-20 bg-gradient-to-b from-surface via-surface-container-low to-surface-container border-t border-espresso/8"
      >
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-widest text-tertiary font-extrabold">
              CAREGIVER CIRCLES
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-espresso mt-1">
              A Safe Space for Those Who Sustain
            </h2>
            <p className="text-sm text-espresso/70 mt-2">
              Connect with other spouses, parents, and family caregivers guided by oncology psychologists.
            </p>
          </div>

          <div className="space-y-4">
            {circlesCms.map((circle, idx) => {
              const key = String(circle.id);
              const reserved = !!reservedCircles[key];
              return (
                <div
                  key={circle.id}
                  className="bg-white rounded-3xl p-6 border border-espresso/10 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl p-3 text-center shrink-0 min-w-[68px] bg-gradient-to-br from-[#E3F1E9] to-[#D0ECDD] text-[#2E664F] border border-[#BDDFCC]">
                      <span className="text-[10px] uppercase block font-extrabold">NARA</span>
                      <span className="text-2xl font-bold block leading-tight">0{idx + 1}</span>
                      <span className="text-[10px] font-bold block">LIVE</span>
                    </div>
                    <div className="space-y-1">
                      {circle.badge_en && (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#D7EFE2] text-[#2E664F]">
                          {circle.badge_en}
                        </span>
                      )}
                      <h3 className="text-lg font-bold text-espresso">{circle.title_en}</h3>
                      <p className="text-xs font-semibold text-espresso/70">{circle.subtitle_en}</p>
                      <p className="text-xs text-espresso/65 leading-relaxed">{circle.description_en}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReservedCircles((p) => ({ ...p, [key]: !p[key] }))}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                      reserved
                        ? "bg-emerald-600 text-white"
                        : "bg-[#2E664F] hover:bg-[#214D3B] text-white"
                    }`}
                  >
                    {reserved ? "✓ Spot Reserved" : circle.cta_text_en || "Reserve Free Spot"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

