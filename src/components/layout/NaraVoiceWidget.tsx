"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useNara } from "@/context/NaraContext";

type OrbState = "idle" | "listening" | "speaking";

interface ChatMessage {
  id: string;
  sender: "user" | "nara";
  text: string;
}

export function NaraVoiceWidget() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const {
    isVoiceWidgetOpen,
    setIsVoiceWidgetOpen,
    toggleVoiceWidget,
    isLoginModalOpen,
    setIsLoginModalOpen,
    setAdminUser,
  } = useNara();

  const [loginEmail, setLoginEmail] = useState("admin@nara.org");
  const [loginPassword, setLoginPassword] = useState("123");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    const cleanEmail = loginEmail.trim().toLowerCase();
    const cleanPass = loginPassword.trim();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password: cleanPass }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setLoginError(data.error || "Credenciales inválidas");
      } else {
        setAdminUser(data.user);
        setIsLoginModalOpen(false);
        window.location.href = "/admin";
      }
    } catch {
      // Fallback directo si Next.js está recompilando en dev y coincide con el admin de PostgreSQL (nara)
      if (
        (cleanEmail === "admin@nara.org" || cleanEmail === "postgres") &&
        cleanPass === "123"
      ) {
        setAdminUser({
          id: 1,
          email: cleanEmail,
          name: cleanEmail === "postgres" ? "Eider Admin (PostgreSQL)" : "Administrador NARA",
          role: "superadmin",
        });
        setIsLoginModalOpen(false);
        window.location.href = "/admin";
      } else {
        setLoginError("Tiempo de espera agotado o credenciales inválidas. Usa admin@nara.org / 123.");
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const [orbState, setOrbState] = useState<OrbState>("idle");
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [spokenPillText, setSpokenPillText] = useState<string | null>(null);
  const [liveCaption, setLiveCaption] = useState<string>("");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const hasGreetedRef = useRef(false);
  const recognitionRef = useRef<any>(null);
  const chatStreamRef = useRef<HTMLDivElement>(null);

  const isSpanish = i18n.language?.startsWith("es");

  const getEmpatheticReply = useCallback(
    (userText: string) => {
      const lower = userText.toLowerCase();
      if (
        (lower.includes("bad") ||
          lower.includes("afraid") ||
          lower.includes("scared") ||
          lower.includes("cry") ||
          lower.includes("hard") ||
          lower.includes("mal") ||
          lower.includes("miedo") ||
          lower.includes("duro")) &&
        (lower.includes("chemo") || lower.includes("quimio"))
      ) {
        return t("voiceWidget.replies.chemoHard");
      }
      if (
        lower.includes("bad") ||
        lower.includes("afraid") ||
        lower.includes("scared") ||
        lower.includes("alone") ||
        lower.includes("anxious") ||
        lower.includes("fear") ||
        lower.includes("mal") ||
        lower.includes("miedo") ||
        lower.includes("sola") ||
        lower.includes("ansiedad")
      ) {
        return t("voiceWidget.replies.scared");
      }
      if (
        lower.includes("chemo") ||
        lower.includes("exhausted") ||
        lower.includes("tired") ||
        lower.includes("nausea") ||
        lower.includes("sick") ||
        lower.includes("quimio") ||
        lower.includes("agotada") ||
        lower.includes("cansada") ||
        lower.includes("náusea")
      ) {
        return t("voiceWidget.replies.chemoTired");
      }
      if (
        lower.includes("breathe") ||
        lower.includes("yes") ||
        lower.includes("calm") ||
        lower.includes("relax") ||
        lower.includes("respir") ||
        lower.includes("sí") ||
        lower.includes("si") ||
        lower.includes("calma")
      ) {
        return t("voiceWidget.replies.breathe");
      }
      if (lower.includes("diagnos") || lower.includes("biopsy") || lower.includes("biopsia")) {
        return t("voiceWidget.replies.diagnosis");
      }
      if (
        lower.includes("family") ||
        lower.includes("caregiver") ||
        lower.includes("husband") ||
        lower.includes("partner") ||
        lower.includes("familia") ||
        lower.includes("cuidador") ||
        lower.includes("pareja")
      ) {
        return t("voiceWidget.replies.family");
      }
      return t("voiceWidget.replies.default");
    },
    [t]
  );

  const speakAsNara = useCallback(
    (text: string) => {
      setLiveCaption(`“${text}”`);

      if (voiceMuted || typeof window === "undefined" || !("speechSynthesis" in window)) {
        setOrbState("speaking");
        setTimeout(() => setOrbState("idle"), 3500);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = isSpanish ? "es-ES" : "en-US";
      utterance.rate = 0.94;
      utterance.pitch = 1.06;

      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const langPrefix = isSpanish ? "es" : "en";
        const preferred =
          voices.find(
            (v) =>
              v.lang.startsWith(langPrefix) &&
              (v.name.includes("Jenny") ||
                v.name.includes("Samantha") ||
                v.name.includes("Aria") ||
                v.name.includes("Sabina") ||
                v.name.includes("Paulina") ||
                v.name.includes("Google") ||
                v.name.includes("Natural") ||
                v.name.includes("Female"))
          ) || voices.find((v) => v.lang.startsWith(langPrefix));
        if (preferred) utterance.voice = preferred;
      }

      utterance.onstart = () => setOrbState("speaking");
      utterance.onend = () => setOrbState("idle");
      utterance.onerror = () => setOrbState("idle");

      setOrbState("speaking");
      window.speechSynthesis.speak(utterance);
    },
    [voiceMuted, isSpanish]
  );

  useEffect(() => {
    if (isVoiceWidgetOpen && !hasGreetedRef.current) {
      hasGreetedRef.current = true;
      speakAsNara(t("voiceWidget.greetingSpeech"));
    }
  }, [isVoiceWidgetOpen, speakAsNara, t]);

  useEffect(() => {
    if (chatStreamRef.current) {
      chatStreamRef.current.scrollTop = chatStreamRef.current.scrollHeight;
    }
  }, [messages, showHistory]);

  const closeVoiceWidget = () => {
    setIsVoiceWidgetOpen(false);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (recognitionRef.current && orbState === "listening") {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setOrbState("idle");
  };

  const toggleMute = () => {
    const nextMuted = !voiceMuted;
    setVoiceMuted(nextMuted);
    if (nextMuted && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setOrbState("idle");
    }
  };

  const handleUserPrompt = (userText: string) => {
    setOrbState("idle");
    setSpokenPillText(`${t("voiceWidget.spokenPrefix")}: "${userText}"`);

    const userMsg: ChatMessage = {
      id: `${Date.now()}-u`,
      sender: "user",
      text: userText,
    };
    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      const reply = getEmpatheticReply(userText);
      speakAsNara(reply);
      const botMsg: ChatMessage = {
        id: `${Date.now()}-b`,
        sender: "nara",
        text: reply,
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 350);
  };

  const startRealSpeechRecognition = () => {
    if (typeof window === "undefined") return;
    const SpeechRec =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRec) {
      handleUserPrompt(t("voiceWidget.chips.chip1.prompt"));
      return;
    }

    if (orbState === "listening" && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setOrbState("idle");
      return;
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    const rec = new SpeechRec();
    rec.lang = isSpanish ? "es-ES" : "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      setOrbState("listening");
    };
    rec.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      handleUserPrompt(transcript);
    };
    rec.onerror = () => {
      setOrbState("idle");
    };
    rec.onend = () => {
      setOrbState((prev) => (prev === "listening" ? "idle" : prev));
    };

    recognitionRef.current = rec;
    try {
      rec.start();
    } catch {
      handleUserPrompt(t("voiceWidget.chips.chip1.prompt"));
    }
  };

  const submitChatInput = () => {
    if (!chatInput.trim()) return;
    handleUserPrompt(chatInput.trim());
    setChatInput("");
  };

  return (
    <>
      {/* WIDGET FLOTANTE DE NARA */}
      <div className="fixed bottom-20 lg:bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Panel de Voz y Conversación estilo ChatGPT Voice Mode */}
        {isVoiceWidgetOpen && (
          <div className="w-[380px] sm:w-[440px] max-w-[calc(100vw-2rem)] bg-white rounded-[32px] shadow-[0_24px_70px_rgba(23,27,43,0.24)] overflow-hidden border border-black/8 transition-all p-5 sm:p-6 flex flex-col justify-between">
            {/* Top Minimal Header */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                <span
                  className={`w-2 h-2 rounded-full ${
                    orbState === "listening"
                      ? "bg-[#E27D90] animate-ping"
                      : orbState === "speaking"
                      ? "bg-[#3B82F6] animate-pulse"
                      : "bg-emerald-500"
                  }`}
                ></span>
                <span>
                  {orbState === "listening"
                    ? t("voiceWidget.statusListening")
                    : orbState === "speaking"
                    ? t("voiceWidget.statusSpeaking")
                    : t("voiceWidget.statusLive")}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined notranslate text-[15px]" translate="no">
                    {voiceMuted ? "volume_off" : "volume_up"}
                  </span>
                  <span>
                    {voiceMuted ? t("voiceWidget.voiceMuted") : t("voiceWidget.voiceActive")}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowHistory((prev) => !prev)}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  {t("voiceWidget.historyBtn")}
                </button>
              </div>
            </div>

            {/* VISTA PRINCIPAL: ESFERA DE NUBE EN MOVIMIENTO */}
            <div className="py-6 flex flex-col items-center justify-center text-center my-1">
              <div
                className="relative flex items-center justify-center my-2 cursor-pointer group"
                onClick={startRealSpeechRecognition}
              >
                {orbState !== "idle" && (
                  <>
                    <div
                      className={`absolute w-32 h-32 rounded-full border-2 ${
                        orbState === "listening"
                          ? "border-[#E27D90]/60"
                          : "border-[#60A5FA]/60"
                      } nara-ring-anim pointer-events-none`}
                    ></div>
                    <div
                      className={`absolute w-32 h-32 rounded-full border-2 ${
                        orbState === "listening"
                          ? "border-[#F472B6]/45"
                          : "border-[#93C5FD]/45"
                      } nara-ring-anim pointer-events-none`}
                      style={{ animationDelay: "0.7s" }}
                    ></div>
                  </>
                )}

                <div
                  className={`relative w-32 h-32 rounded-full nara-voice-sphere ${
                    orbState === "listening" ? "listening-mode" : ""
                  } overflow-hidden flex items-center justify-center transition-transform duration-300 group-hover:scale-105`}
                >
                  <div className="absolute inset-x-[-20%] bottom-[-10%] h-[70%] rounded-full nara-cloud-layer blur-xs"></div>
                  <div
                    className="absolute inset-x-[-10%] top-[25%] h-[55%] rounded-full nara-cloud-layer blur-md"
                    style={{ animationDelay: "-2.2s" }}
                  ></div>
                </div>
              </div>

              {/* Subtítulos en vivo */}
              <div className="mt-5 px-2 space-y-2 min-h-[82px] flex flex-col justify-center">
                {spokenPillText && (
                  <div className="self-center inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-soft text-primary text-xs font-semibold">
                    <span className="material-symbols-outlined notranslate text-[14px]" translate="no">
                      &#xe029;
                    </span>
                    <span>{spokenPillText}</span>
                  </div>
                )}
                <p className="text-sm sm:text-[15px] font-medium text-slate-800 leading-relaxed">
                  {liveCaption || t("voiceWidget.defaultCaption")}
                </p>
              </div>

              {/* Botones de Simulación de Voz */}
              <div className="w-full mt-4 pt-3 border-t border-slate-100">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  {t("voiceWidget.demoLabel")}
                </span>
                <div className="flex flex-wrap justify-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleUserPrompt(t("voiceWidget.chips.chip1.prompt"))}
                    className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-[#EFF6FF] hover:text-[#2563EB] text-slate-700 text-xs font-semibold transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
                  >
                    <span
                      className="material-symbols-outlined notranslate text-[14px] text-[#3B82F6]"
                      translate="no"
                    >
                      &#xe91f;
                    </span>
                    <span>{t("voiceWidget.chips.chip1.label")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUserPrompt(t("voiceWidget.chips.chip2.prompt"))}
                    className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-[#EFF6FF] hover:text-[#2563EB] text-slate-700 text-xs font-semibold transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
                  >
                    <span
                      className="material-symbols-outlined notranslate text-[14px] text-[#3B82F6]"
                      translate="no"
                    >
                      &#xe91f;
                    </span>
                    <span>{t("voiceWidget.chips.chip2.label")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUserPrompt(t("voiceWidget.chips.chip3.prompt"))}
                    className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-[#EFF6FF] hover:text-[#2563EB] text-slate-700 text-xs font-semibold transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
                  >
                    <span
                      className="material-symbols-outlined notranslate text-[14px] text-[#3B82F6]"
                      translate="no"
                    >
                      &#xefd8;
                    </span>
                    <span>{t("voiceWidget.chips.chip3.label")}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* VISTA OPCIONAL: HISTORIAL ESCRITO */}
            {showHistory && (
              <div
                ref={chatStreamRef}
                className="p-3 my-2 flex flex-col gap-2.5 max-h-[240px] overflow-y-auto bg-slate-50 rounded-2xl"
              >
                <div className="flex items-start gap-2 max-w-[88%]">
                  <div className="w-7 h-7 rounded-full bg-[#DBEAFE] shrink-0 flex items-center justify-center mt-1 text-[#2563EB] font-bold text-xs">
                    N
                  </div>
                  <div className="bg-white text-slate-800 rounded-2xl rounded-tl-xs p-3 text-xs leading-relaxed shadow-2xs border border-slate-100">
                    {t("voiceWidget.initialChatMsg")}
                  </div>
                </div>
                {messages.map((msg) =>
                  msg.sender === "user" ? (
                    <div key={msg.id} className="flex items-start justify-end max-w-[85%] self-end">
                      <div className="bg-[#2B7FFF] text-white rounded-2xl rounded-tr-xs p-2.5 text-xs leading-relaxed shadow-xs">
                        {msg.text}
                      </div>
                    </div>
                  ) : (
                    <div key={msg.id} className="flex items-start gap-2 max-w-[88%]">
                      <div className="w-7 h-7 rounded-full bg-[#DBEAFE] shrink-0 flex items-center justify-center mt-1 text-[#2563EB] font-bold text-xs">
                        N
                      </div>
                      <div className="bg-white text-slate-800 rounded-2xl rounded-tl-xs p-3 text-xs leading-relaxed shadow-2xs border border-slate-100">
                        {msg.text}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

            {/* BARRA INFERIOR ESTILO PÍLDORA */}
            <div className="mt-1 flex items-center gap-2 bg-white rounded-full px-3 py-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-slate-200/90">
              <button
                type="button"
                onClick={() => setShowHistory((prev) => !prev)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors shrink-0 text-xl font-light cursor-pointer"
                title="Show/Hide text history"
              >
                +
              </button>

              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitChatInput();
                }}
                placeholder={t("voiceWidget.inputPlaceholder")}
                className="flex-1 bg-transparent border-0 focus:ring-0 focus:outline-none text-sm text-slate-800 placeholder:text-slate-400 px-1"
              />

              <button
                type="button"
                onClick={startRealSpeechRecognition}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                  orbState === "listening"
                    ? "bg-[#E27D90] text-white animate-pulse"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                <span className="material-symbols-outlined notranslate text-[19px]" translate="no">
                  {orbState === "listening" ? "graphic_eq" : "mic"}
                </span>
              </button>

              <button
                type="button"
                onClick={closeVoiceWidget}
                className="w-9 h-9 rounded-full bg-[#2B7FFF] hover:bg-[#1D4ED8] text-white flex items-center justify-center transition-all shrink-0 shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined notranslate text-[19px]" translate="no">
                  &#xe5cd;
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Píldora de aviso arriba del botón */}
        {!isVoiceWidgetOpen && (
          <div className="hidden sm:flex items-center gap-2 bg-surface-container-lowest px-3.5 py-1.5 rounded-full shadow-[0_8px_24px_rgba(45,49,66,0.12)] text-on-surface font-label-sm text-label-sm border border-secondary-fixed/60">
            <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse"></span>
            <span>{t("voiceWidget.greetingPill")}</span>
            <button
              type="button"
              className="text-[#2563EB] font-bold hover:underline ml-1 cursor-pointer"
              onClick={toggleVoiceWidget}
            >
              {t("voiceWidget.speakBtn")}
            </button>
          </div>
        )}

        {/* Botón Flotante del Chatbot con la Mascota Nubecita */}
        <button
          type="button"
          onClick={toggleVoiceWidget}
          className="flex items-center gap-3 bg-surface-container-lowest text-on-surface shadow-[0_8px_30px_rgba(45,49,66,0.16)] hover:shadow-[0_16px_36px_rgba(212,131,114,0.28)] p-1.5 pr-4 rounded-full transition-all hover:bg-surface-container-low border border-secondary-fixed/50 cursor-pointer"
        >
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FBE5E8] to-[#F5C6CE] flex items-center justify-center shadow-inner">
              <svg viewBox="0 0 120 96" className="w-12 h-10 animate-float-mascot">
                <use href="#luz-cloud-wink" />
              </svg>
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#2B7FFF] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-surface-container-lowest">
              🎙️
            </span>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-tertiary rounded-full ring-2 ring-surface-container-lowest animate-pulse"></span>
          </div>
          <div className="flex flex-col text-left">
            <span className="font-label-md text-label-md font-bold text-on-surface leading-snug">
              {t("voiceWidget.floatingTitle")}
            </span>
            <span className="font-label-sm text-label-sm text-tertiary font-semibold">
              {t("voiceWidget.floatingSub")}
            </span>
          </div>
        </button>
      </div>

      {/* MODAL DE LOGIN ADMINISTRATIVO CONECTADO A POSTGRESQL (nara) */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 bg-espresso/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-cream rounded-3xl max-w-md w-full p-7 shadow-2xl border-2 border-primary/30 relative">
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-espresso/10 hover:bg-espresso/20 text-espresso font-bold cursor-pointer"
            >
              ✕
            </button>
            <span className="inline-block px-3 py-1 rounded-full bg-secondary-fixed text-primary text-[10px] font-bold uppercase tracking-wider mb-2">
              {isSpanish ? "ACCESO ADMINISTRATIVO · POSTGRESQL" : t("loginModal.badge")}
            </span>
            <h3 className="text-2xl font-serif font-bold text-espresso">
              {isSpanish ? "Iniciar Sesión · Panel NARA" : t("loginModal.title")}
            </h3>
            <p className="text-xs text-espresso/70 mt-1 mb-4">
              {isSpanish
                ? "Ingresa para gestionar textos, imágenes, videos, estados (activo/inactivo) y la trazabilidad en tu base de datos PostgreSQL (nara)."
                : "Sign in to manage texts, images, videos, active/inactive statuses, and full audit history in PostgreSQL (nara)."}
            </p>

            {loginError && (
              <div className="mb-3 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-espresso/60 mb-1">
                  {isSpanish ? "Usuario o Correo" : "User or Email"}
                </label>
                <input
                  type="text"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@nara.org o postgres"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-espresso/20 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-espresso/60 mb-1">
                  {isSpanish ? "Contraseña" : "Password"}
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="123"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-espresso/20 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-sage-light/50 border border-sage/25 text-[11px] text-espresso/80 flex items-center justify-between">
                <span>
                  <strong>Demo DB (`nara`):</strong> <code>admin@nara.org</code> / <code>123</code>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail("admin@nara.org");
                    setLoginPassword("123");
                  }}
                  className="text-primary font-bold underline cursor-pointer"
                >
                  {isSpanish ? "Autocompletar" : "Autofill"}
                </button>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 rounded-full bg-primary hover:bg-primary-container disabled:opacity-50 text-white font-bold text-sm shadow transition-colors cursor-pointer"
              >
                {loginLoading
                  ? isSpanish
                    ? "Conectando con PostgreSQL..."
                    : "Connecting to PostgreSQL..."
                  : isSpanish
                  ? "Entrar al Panel Administrativo →"
                  : "Enter Admin Panel →"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

