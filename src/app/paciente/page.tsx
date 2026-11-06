"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useNara } from "@/context/NaraContext";
import type { CmsItem } from "@/types/cms";

interface DiaryEntry {
  id: string;
  date: string;
  energy: number;
  mood: string;
  symptoms: string[];
  notes: string;
}

const SYMPTOM_OPTIONS = [
  "Fatigue",
  "Nausea",
  "Low appetite",
  "Tingling",
  "Pain / Discomfort",
  "Insomnia",
  "Anxiety",
  "Brain fog",
];

const MOOD_OPTIONS = [
  { id: "calm", label: "Calm", icon: "\ue7f2" },
  { id: "hopeful", label: "Hopeful", icon: "\ue87d" },
  { id: "tired", label: "Tired", icon: "\uebed" },
  { id: "anxious", label: "Anxious", icon: "\ue9e4" },
  { id: "overwhelmed", label: "Sensitive", icon: "\ue87e" },
];

export default function PatientPage() {
  const { adminUser } = useNara();
  const [cmsItems, setCmsItems] = useState<CmsItem[]>([]);
  const [playingVideoUrl, setPlayingVideoUrl] = useState<string | null>(null);
  const [playingVideoTitle, setPlayingVideoTitle] = useState<string>("");
  const [reservedCircles, setReservedCircles] = useState<Record<string, boolean>>({});

  // Estado interactivo del Diario de Bienestar
  const [energy, setEnergy] = useState<number>(3);
  const [mood, setMood] = useState<string>("calm");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>("");
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [diarySavedMsg, setDiarySavedMsg] = useState(false);

  // Estado interactivo de Respiración Piko-Piko / 4-7-8
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"Inhale (4s)" | "Hold (7s)" | "Exhale (8s)">("Inhale (4s)");

  useEffect(() => {
    fetch("/api/cms?page=paciente&status=active", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data?.ok && Array.isArray(data.items)) {
          setCmsItems(data.items);
        }
      })
      .catch(() => {});

    try {
      const saved = localStorage.getItem("nara-patient-diary");
      if (saved) setEntries(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    if (!breathingActive) return;
    let timeout1: ReturnType<typeof setTimeout>;
    let timeout2: ReturnType<typeof setTimeout>;
    const cycle = () => {
      setBreathPhase("Inhale (4s)");
      timeout1 = setTimeout(() => {
        setBreathPhase("Hold (7s)");
        timeout2 = setTimeout(() => {
          setBreathPhase("Exhale (8s)");
        }, 7000);
      }, 4000);
    };
    cycle();
    const interval = setInterval(cycle, 19000);
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearInterval(interval);
    };
  }, [breathingActive]);

  const heroCms = cmsItems.find((i) => i.section === "patient_hero");
  const journeyCms = cmsItems
    .filter((i) => i.section === "patient_journey")
    .sort((a, b) => a.display_order - b.display_order || a.id - b.id);
  const diaryCms = cmsItems.find((i) => i.section === "patient_diary");
  const calmCms = cmsItems
    .filter((i) => i.section === "patient_calm")
    .sort((a, b) => a.display_order - b.display_order || a.id - b.id);
  const circlesCms = cmsItems
    .filter((i) => i.section === "patient_circles")
    .sort((a, b) => a.display_order - b.display_order || a.id - b.id);

  const openVideoModal = (url: string, title: string) => {
    let embedUrl = url || "https://www.youtube.com/embed/inpok4MKVLM";
    if (embedUrl.includes("watch?v=")) {
      const videoId = embedUrl.split("watch?v=")[1]?.split("&")[0];
      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
    setPlayingVideoTitle(title);
    setPlayingVideoUrl(embedUrl);
  };

  const toggleSymptom = (s: string) => {
    setSymptoms((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const saveDiaryEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: DiaryEntry = {
      id: String(Date.now()),
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      energy,
      mood,
      symptoms,
      notes: notes.trim(),
    };
    const next = [newEntry, ...entries].slice(0, 10);
    setEntries(next);
    try {
      localStorage.setItem("nara-patient-diary", JSON.stringify(next));
    } catch {}
    setNotes("");
    setSymptoms([]);
    setDiarySavedMsg(true);
    setTimeout(() => setDiarySavedMsg(false), 3500);
  };

  return (
    <div className="min-h-screen bg-background text-espresso">
      {/* Barra rápida si el Administrador tiene sesión iniciada */}
      {adminUser && (
        <div className="bg-espresso text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              <strong>Admin Mode Active</strong> ({adminUser.name}) · Patient Page (`paciente`) ·{" "}
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
          1. HERO · PORTADA DEL PACIENTE
         ========================================================= */}
      <section className="relative overflow-hidden py-14 lg:py-20 bg-gradient-to-b from-[#FFF7F9] via-[#FAF8F5] to-background border-b border-espresso/8">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-2xs border border-espresso/10 text-xs font-extrabold text-primary">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {heroCms?.badge_en || "Patient Sanctuary"}
            </span>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-tertiary">
              {heroCms?.subtitle_en || "BREATHE · UNDERSTAND · HEAL"}
            </p>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-espresso leading-[1.12]">
              {heroCms?.title_en || "Your Safe Harbor: Step-by-Step Companion for Patients"}
            </h1>
            <p className="text-base text-espresso/75 leading-relaxed max-w-2xl">
              {heroCms?.description_en ||
                "Tools designed for every day of your process: symptom diary, questions for your oncologist, and 3-minute emotional regulation audios."}
            </p>

            {/* Accesos rápidos a las secciones de la página */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={heroCms?.cta_link || "#diario-bienestar"}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary-container text-white text-xs sm:text-sm font-bold shadow-sm transition-all"
              >
                <span className="material-symbols-outlined notranslate text-[18px]" translate="no">
                  &#xe745;
                </span>
                {heroCms?.cta_text_en || "Start My Symptom Diary"}
              </a>
              <a
                href="#micro-calma"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-secondary-fixed/40 text-espresso border border-espresso/15 text-xs sm:text-sm font-bold transition-colors"
              >
                <span className="material-symbols-outlined notranslate text-primary text-[18px]" translate="no">
                  &#xe176;
                </span>
                3-Min Micro-Calm
              </a>
              <a
                href="#circulos-paciente"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-secondary-fixed/40 text-espresso border border-espresso/15 text-xs sm:text-sm font-bold transition-colors"
              >
                <span className="material-symbols-outlined notranslate text-tertiary text-[18px]" translate="no">
                  &#xe7ef;
                </span>
                Weekly Circles
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(38,35,34,0.14)] border-4 border-white aspect-4/3 bg-surface-container">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  heroCms?.media_url ||
                  "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=1200&q=80"
                }
                alt={heroCms?.title_en || "Patient Sanctuary"}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          2. MY JOURNEY & STAGES · GUÍA PASO A PASO + PREGUNTAS AL ONCÓLOGO
         ========================================================= */}
      <section id="camino" className="py-16 lg:py-20 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-primary font-extrabold">
            MY JOURNEY & STAGES
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-espresso mt-1">
            Clear Steps & Questions for Your Oncologist
          </h2>
          <p className="text-sm sm:text-base text-espresso/70 mt-2">
            Each stage brings different needs. Focus only on the step in front of you today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {journeyCms.map((step, idx) => {
            const question = (step.meta_json?.question_en as string) || "";
            return (
              <div
                key={step.id}
                className="bg-white rounded-3xl overflow-hidden border border-espresso/10 shadow-[0_8px_30px_rgba(38,35,34,0.05)] flex flex-col justify-between"
              >
                <div>
                  {step.media_url && (
                    <div className="relative h-44 w-full overflow-hidden bg-surface-container">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={step.media_url}
                        alt={step.title_en}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 text-primary text-[10px] font-extrabold uppercase tracking-wider shadow-2xs">
                        {step.badge_en || `Step 0${idx + 1}`}
                      </span>
                    </div>
                  )}
                  <div className="p-6 space-y-3">
                    {step.subtitle_en && (
                      <span className="block text-[11px] font-extrabold uppercase tracking-wider text-tertiary">
                        {step.subtitle_en}
                      </span>
                    )}
                    <h3 className="font-serif text-xl font-bold text-espresso leading-snug">
                      {step.title_en}
                    </h3>
                    <p className="text-xs sm:text-sm text-espresso/75 leading-relaxed">
                      {step.description_en}
                    </p>
                    {question && (
                      <div className="p-3.5 rounded-2xl bg-[#FFF7F9] border border-[#F5C2CC]/70 space-y-1">
                        <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#C4546A]">
                          ✦ Key question for your doctor
                        </span>
                        <p className="text-xs font-serif italic text-espresso/90">“{question}”</p>
                      </div>
                    )}
                  </div>
                </div>
                {step.cta_text_en && (
                  <div className="px-6 pb-6">
                    <a
                      href={step.cta_link || "#diario-bienestar"}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-full bg-espresso/5 hover:bg-primary hover:text-white text-espresso text-xs font-bold transition-colors"
                    >
                      <span>{step.cta_text_en}</span>
                      <span className="material-symbols-outlined notranslate text-[16px]" translate="no">
                        &#xe5c8;
                      </span>
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          3. SYMPTOM DIARY · DIARIO DE BIENESTAR INTERACTIVO
         ========================================================= */}
      <section
        id="diario-bienestar"
        className="py-16 lg:py-20 bg-surface-container-low/70 border-y border-espresso/8"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Explicación editable desde Admin */}
          <div className="lg:col-span-5 space-y-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-extrabold">
              <span className="material-symbols-outlined notranslate text-[16px]" translate="no">
                &#xe745;
              </span>
              {diaryCms?.badge_en || "Interactive Tool"}
            </span>
            <p className="text-xs font-extrabold uppercase tracking-wider text-tertiary">
              {diaryCms?.subtitle_en || "SHARE CLEAR NOTES WITH YOUR ONCOLOGIST"}
            </p>
            <h2 className="text-3xl font-serif font-bold text-espresso">
              {diaryCms?.title_en || "Daily Symptom & Wellness Diary"}
            </h2>
            <p className="text-sm text-espresso/75 leading-relaxed">
              {diaryCms?.description_en ||
                "Recording how you feel in 60 seconds helps you notice patterns between sessions and gives your medical team accurate information to adjust your care."}
            </p>

            <div className="bg-white rounded-2xl p-5 border border-espresso/10 space-y-3">
              <span className="block text-xs font-extrabold uppercase tracking-wider text-espresso">
                How to use your diary
              </span>
              {[
                (diaryCms?.meta_json?.tip1_en as string) ||
                  "Log your energy and symptoms around the same time each day.",
                (diaryCms?.meta_json?.tip2_en as string) ||
                  "Write down questions the moment they appear so your mind can rest.",
                (diaryCms?.meta_json?.tip3_en as string) ||
                  "Bring your saved summary to your next oncology appointment.",
              ]
                .filter(Boolean)
                .map((tip, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-espresso/80">
                    <span className="w-5 h-5 rounded-full bg-sage/15 text-sage font-extrabold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span>{tip}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Formulario interactivo del paciente */}
          <div className="lg:col-span-7 space-y-6">
            <form
              onSubmit={saveDiaryEntry}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-espresso/10 shadow-[0_12px_36px_rgba(38,35,34,0.06)] space-y-5"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold text-espresso">How do you feel today?</h3>
                <span className="text-xs font-semibold text-espresso/50">Saved on this device</span>
              </div>

              {/* Nivel de energía */}
              <div>
                <label className="block text-xs font-bold text-espresso mb-2">
                  Energy level: <span className="text-primary">{energy} / 5</span>
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setEnergy(n)}
                      className={`py-2.5 rounded-xl text-xs font-extrabold border transition-colors cursor-pointer ${
                        energy === n
                          ? "bg-primary text-white border-primary shadow-2xs"
                          : "bg-[#FAF8F5] text-espresso/70 border-espresso/10 hover:border-primary/40"
                      }`}
                    >
                      {n} {n === 1 ? "· Very low" : n === 5 ? "· Good" : ""}
                    </button>
                  ))}
                </div>
              </div>

              {/* Estado emocional */}
              <div>
                <span className="block text-xs font-bold text-espresso mb-2">Emotional state</span>
                <div className="flex flex-wrap gap-2">
                  {MOOD_OPTIONS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMood(m.id)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                        mood === m.id
                          ? "bg-tertiary text-white border-tertiary"
                          : "bg-[#FAF8F5] text-espresso/75 border-espresso/10 hover:border-tertiary/40"
                      }`}
                    >
                      <span className="material-symbols-outlined notranslate text-[16px]" translate="no">
                        {m.icon}
                      </span>
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Síntomas físicos */}
              <div>
                <span className="block text-xs font-bold text-espresso mb-2">
                  Physical symptoms (select any that apply)
                </span>
                <div className="flex flex-wrap gap-2">
                  {SYMPTOM_OPTIONS.map((s) => {
                    const active = symptoms.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleSymptom(s)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                          active
                            ? "bg-[#FFE8ED] text-[#C4546A] border-[#C4546A]/40 font-bold"
                            : "bg-[#FAF8F5] text-espresso/70 border-espresso/10"
                        }`}
                      >
                        {active ? `✓ ${s}` : s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notas para el oncólogo */}
              <div>
                <label className="block text-xs font-bold text-espresso mb-1.5">
                  Notes or questions for my next appointment
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="E.g. Mild nausea in the morning after taking medication, slept 6 hours..."
                  className="w-full rounded-xl border border-espresso/15 bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-espresso placeholder:text-espresso/35 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-container text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
                >
                  {diaryCms?.cta_text_en || "Save Today’s Entry"}
                </button>
                {diarySavedMsg && (
                  <span className="text-xs font-bold text-sage">
                    ✓ Entry saved in your personal log
                  </span>
                )}
              </div>
            </form>

            {/* Historial reciente */}
            {entries.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-espresso/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-espresso">
                    Recent entries ({entries.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setEntries([]);
                      localStorage.removeItem("nara-patient-diary");
                    }}
                    className="text-[11px] font-bold text-espresso/45 hover:text-red-700 cursor-pointer"
                  >
                    Clear log
                  </button>
                </div>
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {entries.map((en) => (
                    <div
                      key={en.id}
                      className="p-3 rounded-xl bg-[#FAF8F5] border border-espresso/8 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-bold text-espresso">
                        <span>
                          {en.date} · Energy {en.energy}/5 · Mood: {en.mood}
                        </span>
                      </div>
                      {en.symptoms.length > 0 && (
                        <p className="text-espresso/70">Symptoms: {en.symptoms.join(", ")}</p>
                      )}
                      {en.notes && <p className="text-espresso/80 italic">“{en.notes}”</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================
          4. SENSORY MICRO-CALM · RESPIRACIÓN Y CÁPSULAS DE AUDIO/VIDEO
         ========================================================= */}
      <section id="micro-calma" className="py-16 lg:py-20 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
          <div className="lg:col-span-7 space-y-2">
            <span className="text-xs uppercase tracking-widest text-primary font-extrabold">
              SENSORY MICRO-CALM
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-espresso">
              3-7 Minute Audios & Breathing Guides
            </h2>
            <p className="text-sm sm:text-base text-espresso/70">
              Designed for the waiting room, chemotherapy chair, or quiet nights at home.
            </p>
          </div>

          {/* Widget rápido de respiración 4-7-8 */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#E3F1E9] to-[#F2F9F5] rounded-3xl p-5 border border-[#BDDFCC] flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2E664F]">
                ✦ Instant Vagus-Nerve Reset
              </span>
              <h3 className="font-serif text-lg font-bold text-espresso mt-0.5">
                {breathingActive ? breathPhase : "4-7-8 Guided Breathing"}
              </h3>
              <p className="text-xs text-espresso/70">
                {breathingActive
                  ? "Follow the rhythm gently with your shoulders relaxed."
                  : "Press start to practice 1 minute of calming breath."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setBreathingActive((v) => !v)}
              className="px-4 py-2.5 rounded-full bg-[#2E664F] hover:bg-[#214D3B] text-white text-xs font-bold shrink-0 cursor-pointer transition-colors"
            >
              {breathingActive ? "Pause" : "Start"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {calmCms.map((cap) => {
            const duration = (cap.meta_json?.duration as string) || "5 min";
            return (
              <div
                key={cap.id}
                className="bg-white rounded-3xl overflow-hidden border border-espresso/10 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group"
              >
                <div>
                  <div
                    onClick={() => openVideoModal(cap.cta_link, cap.title_en)}
                    className="relative aspect-video bg-surface-container cursor-pointer overflow-hidden"
                  >
                    {cap.media_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cap.media_url}
                        alt={cap.title_en}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute inset-0 bg-espresso/20 group-hover:bg-espresso/35 transition-colors flex items-center justify-center">
                      <span className="w-12 h-12 rounded-full bg-white/95 text-primary flex items-center justify-center shadow-md">
                        <span className="material-symbols-outlined notranslate text-[28px]" translate="no">
                          &#xe037;
                        </span>
                      </span>
                    </div>
                    <span className="absolute bottom-2 right-2 bg-espresso/85 text-white px-2.5 py-0.5 rounded-md text-[11px] font-semibold">
                      {duration}
                    </span>
                  </div>
                  <div className="p-5 space-y-1.5">
                    {cap.badge_en && (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-tertiary">
                        {cap.badge_en}
                      </span>
                    )}
                    <h3 className="font-serif text-lg font-bold text-espresso">{cap.title_en}</h3>
                    <p className="text-xs text-espresso/70 leading-relaxed">{cap.description_en}</p>
                  </div>
                </div>
                <div className="px-5 pb-5 pt-2 flex items-center justify-between text-xs border-t border-espresso/8">
                  <span className="text-espresso/60 font-medium">{cap.subtitle_en || "NARA Guide"}</span>
                  <button
                    type="button"
                    onClick={() => openVideoModal(cap.cta_link, cap.title_en)}
                    className="text-primary font-extrabold hover:underline cursor-pointer"
                  >
                    {cap.cta_text_en || "Listen Now"} →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          5. WEEKLY INTIMATE CIRCLES · CÍRCULOS DE PACIENTES
         ========================================================= */}
      <section
        id="circulos-paciente"
        className="py-16 lg:py-20 bg-gradient-to-b from-surface via-surface-container-low to-surface-container border-t border-espresso/8"
      >
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-widest text-primary font-extrabold">
              WEEKLY INTIMATE CIRCLES
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-espresso mt-1">
              You Don’t Have to Explain Everything Here
            </h2>
            <p className="text-sm text-espresso/70 mt-2">
              Small, confidential groups moderated by oncology psychologists so you can speak freely.
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
                    <div className="rounded-2xl p-3 text-center shrink-0 min-w-[68px] bg-gradient-to-br from-[#FFE8ED] to-[#FAD4DC] text-[#C4546A] border border-[#F5C2CC]">
                      <span className="text-[10px] uppercase block font-extrabold">NARA</span>
                      <span className="text-2xl font-bold block leading-tight">0{idx + 1}</span>
                      <span className="text-[10px] font-bold block">LIVE</span>
                    </div>
                    <div className="space-y-1">
                      {circle.badge_en && (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#FFE8ED] text-[#C4546A]">
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
                        : "bg-primary hover:bg-primary-container text-white"
                    }`}
                  >
                    {reserved ? "✓ Spot Reserved" : circle.cta_text_en || "Reserve My Spot"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modal de video/audio */}
      {playingVideoUrl && (
        <div
          className="fixed inset-0 z-50 bg-espresso/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPlayingVideoUrl(null)}
        >
          <div
            className="bg-white rounded-3xl overflow-hidden max-w-3xl w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-espresso/10">
              <h4 className="font-serif font-bold text-sm text-espresso truncate">
                {playingVideoTitle}
              </h4>
              <button
                type="button"
                onClick={() => setPlayingVideoUrl(null)}
                className="w-8 h-8 rounded-full bg-espresso/10 hover:bg-espresso/20 flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                src={playingVideoUrl}
                title={playingVideoTitle}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

