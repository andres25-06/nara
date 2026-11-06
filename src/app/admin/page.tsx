"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useNara } from "@/context/NaraContext";

export interface CmsItem {
  id: number;
  item_key: string;
  page: string;
  section: string;
  content_type:
    | "text"
    | "image"
    | "video"
    | "pillar"
    | "stage"
    | "circle"
    | "footer_block"
    | "card";
  title_en: string;
  title_es: string;
  subtitle_en: string;
  subtitle_es: string;
  description_en: string;
  description_es: string;
  media_url: string;
  media_type: "none" | "image" | "video";
  badge_en: string;
  badge_es: string;
  cta_text_en: string;
  cta_text_es: string;
  cta_link: string;
  meta_json: Record<string, unknown>;
  display_order: number;
  status: "active" | "inactive";
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: number;
  cms_item_id: number | null;
  item_title: string;
  page: string;
  section: string;
  content_type: string;
  action: "CREATED" | "UPDATED" | "ACTIVATED" | "DEACTIVATED" | "DELETED";
  previous_status: string | null;
  new_status: string | null;
  changed_by: string;
  details: string;
  created_at: string;
}

// ============================================================================
// MAPA ESTRUCTURAL DE PÁGINAS Y SECCIONES PARA IDENTIFICAR QUÉ PERTENECE A QUÉ
// ============================================================================
interface SectionDef {
  id: string;
  label: string;
  description: string;
  defaultContentType: CmsItem["content_type"];
  defaultMediaType: CmsItem["media_type"];
}

interface PageDef {
  id: string;
  label: string;
  shortLabel: string;
  icon: string;
  publicRoute: string;
  description: string;
  sections: SectionDef[];
}

const SITE_STRUCTURE: PageDef[] = [
  {
    id: "home",
    label: "Página de Inicio (Principal)",
    shortLabel: "Inicio",
    icon: "🏠",
    publicRoute: "/",
    description:
      "Gestiona cada bloque de la portada principal en el orden exacto en que aparece de arriba hacia abajo.",
    sections: [
      {
        id: "hero",
        label: "1. Portada Principal (Hero)",
        description: "Imagen del mar de fondo, insignia del Dr. Efrén Bolívar, título y descripción principal.",
        defaultContentType: "image",
        defaultMediaType: "image",
      },
      {
        id: "marquee",
        label: "2. Cinta en Movimiento (Marquee)",
        description: "Palabras clave separadas por '·' que se desplazan debajo de la portada.",
        defaultContentType: "text",
        defaultMediaType: "none",
      },
      {
        id: "journey",
        label: "3. Las 4 Etapas del Camino",
        description: "Pestañas interactivas: Diagnóstico, Tratamiento Activo, Cirugía/Familia y Remisión.",
        defaultContentType: "stage",
        defaultMediaType: "image",
      },
      {
        id: "pillars",
        label: "4. Los 4 Pilares en Inicio",
        description: "Tarjetas de Nutrición, Biblioteca, Talleres en Video y Familia.",
        defaultContentType: "pillar",
        defaultMediaType: "image",
      },
      {
        id: "masterclasses",
        label: "5. Masterclass Destacada Frente al Mar",
        description: "Video principal de gran formato con el Dr. Efrén Bolívar.",
        defaultContentType: "video",
        defaultMediaType: "video",
      },
      {
        id: "videos",
        label: "6. Cápsulas de Video y Medios",
        description: "Galería filtrable de videos cortos de respiración, nutrición, movilidad y cuidadores.",
        defaultContentType: "video",
        defaultMediaType: "video",
      },
      {
        id: "circles",
        label: "7. Círculos Virtuales de Apoyo",
        description: "Calendario de encuentros en vivo por Zoom y cupos disponibles.",
        defaultContentType: "circle",
        defaultMediaType: "image",
      },
      {
        id: "cta_banner",
        label: "8. Banner Final (Kit Gratuito)",
        description: "Llamado a la acción inferior para descargar el Kit Digital de Bienvenida.",
        defaultContentType: "text",
        defaultMediaType: "none",
      },
    ],
  },
  {
    id: "nosotros",
    label: "Nosotros y Los 4 Pilares",
    shortLabel: "Nosotros / Pilares",
    icon: "🏛️",
    publicRoute: "/pilares",
    description:
      "Información institucional sobre el Dr. Efrén Bolívar, la misión de Love Heals · NARA y el detalle de los 4 pilares.",
    sections: [
      {
        id: "about_hero",
        label: "1. Quiénes Somos y Aval Clínico",
        description: "Historia, misión médica y respaldo especialista de NARA.",
        defaultContentType: "image",
        defaultMediaType: "image",
      },
      {
        id: "about_pillars",
        label: "2. Detalle Profundo de los 4 Pilares",
        description: "Bloques detallados de Nutrición, Biblioteca, Movilidad y Derechos.",
        defaultContentType: "pillar",
        defaultMediaType: "image",
      },
    ],
  },
  {
    id: "paciente",
    label: "Página: Soy Paciente",
    shortLabel: "Soy Paciente",
    icon: "💙",
    publicRoute: "/paciente",
    description:
      "Contenidos exclusivos del santuario para pacientes con diagnóstico o en tratamiento activo.",
    sections: [
      {
        id: "patient_hero",
        label: "1. Portada de Pacientes",
        description: "Mensaje de bienvenida, imagen principal y guía de primeros pasos.",
        defaultContentType: "image",
        defaultMediaType: "image",
      },
      {
        id: "patient_tools",
        label: "2. Diario de Bienestar y Micro-Calma",
        description: "Herramientas interactivas, audios SOS y preguntas para el oncólogo.",
        defaultContentType: "text",
        defaultMediaType: "image",
      },
    ],
  },
  {
    id: "cuidadores",
    label: "Página: Cuidadores y Familia",
    shortLabel: "Cuidadores",
    icon: "🌿",
    publicRoute: "/cuidadores",
    description:
      "Refugio para familiares, parejas e hijos que acompañan el proceso oncológico.",
    sections: [
      {
        id: "caregiver_hero",
        label: "1. Portada de Cuidadores",
        description: "Título, imagen y mensaje de contención para cuidadores.",
        defaultContentType: "image",
        defaultMediaType: "image",
      },
      {
        id: "caregiver_guides",
        label: "2. Diccionario Empático y Logística",
        description: "Guías sobre qué decir, cómo hablar con los hijos y prevención del burnout.",
        defaultContentType: "text",
        defaultMediaType: "image",
      },
    ],
  },
  {
    id: "footer",
    label: "Pie de Página / Footer Global",
    shortLabel: "Footer Global",
    icon: "🦶",
    publicRoute: "/",
    description:
      "Información del pie de página que aparece en todo el sitio: marca, misión, teléfonos 24/7, correo y copyright.",
    sections: [
      {
        id: "footer_brand",
        label: "Columna 1: Marca, Misión y Aval",
        description: "Nombre Love Heals · NARA, subtítulo, párrafo de misión y sello de respaldo médico.",
        defaultContentType: "footer_block",
        defaultMediaType: "none",
      },
      {
        id: "footer_helpline",
        label: "Columna 4: Teléfonos 24/7 y Contacto",
        description: "Línea gratuita 1-800-NARA-LUZ, correo de contacto, horarios de círculos y botón de voz.",
        defaultContentType: "footer_block",
        defaultMediaType: "none",
      },
      {
        id: "footer_legal",
        label: "Barra Inferior: Copyright y Legales",
        description: "Texto de derechos reservados y nota de descargo médico.",
        defaultContentType: "footer_block",
        defaultMediaType: "none",
      },
    ],
  },
];

const ALL_SECTIONS_MAP: Record<string, { pageLabel: string; sectionLabel: string }> = {};
for (const p of SITE_STRUCTURE) {
  for (const s of p.sections) {
    ALL_SECTIONS_MAP[s.id] = {
      pageLabel: p.shortLabel,
      sectionLabel: s.label,
    };
  }
}

export default function AdminDashboardPage() {
  const { adminUser, setAdminUser, logoutAdmin, setIsLoginModalOpen } = useNara();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsLoginModalOpen(false);
  }, [setIsLoginModalOpen]);

  // Estados de login
  const [loginEmail, setLoginEmail] = useState("admin@nara.org");
  const [loginPassword, setLoginPassword] = useState("123");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Datos de PostgreSQL
  const [items, setItems] = useState<CmsItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active_count: 0,
    inactive_count: 0,
    videos_count: 0,
    images_count: 0,
  });
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Navegación del Panel Independiente (Menú Lateral)
  const [selectedPage, setSelectedPage] = useState<string>("home"); // 'home' | 'nosotros' | 'paciente' | 'cuidadores' | 'footer' | 'all' | 'traceability'
  const [selectedSection, setSelectedSection] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterMedia, setFilterMedia] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal de Crear / Editar
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CmsItem | null>(null);
  const [savingForm, setSavingForm] = useState(false);

  // Campos del formulario
  const [formPage, setFormPage] = useState<string>("home");
  const [formSection, setFormSection] = useState<string>("hero");
  const [formContentType, setFormContentType] = useState<CmsItem["content_type"]>("image");
  const [formMediaType, setFormMediaType] = useState<CmsItem["media_type"]>("image");
  const [formTitleEs, setFormTitleEs] = useState("");
  const [formTitleEn, setFormTitleEn] = useState("");
  const [formSubtitleEs, setFormSubtitleEs] = useState("");
  const [formSubtitleEn, setFormSubtitleEn] = useState("");
  const [formDescEs, setFormDescEs] = useState("");
  const [formDescEn, setFormDescEn] = useState("");
  const [formMediaUrl, setFormMediaUrl] = useState("");
  const [formBadgeEs, setFormBadgeEs] = useState("");
  const [formBadgeEn, setFormBadgeEn] = useState("");
  const [formCtaTextEs, setFormCtaTextEs] = useState("");
  const [formCtaTextEn, setFormCtaTextEn] = useState("");
  const [formCtaLink, setFormCtaLink] = useState("");
  const [formDisplayOrder, setFormDisplayOrder] = useState(1);
  const [formStatus, setFormStatus] = useState<"active" | "inactive">("active");
  const [formCategory, setFormCategory] = useState("emotional");
  const [formDuration, setFormDuration] = useState("08:30");

  // Modal de Confirmación de Eliminación
  const [itemToDelete, setItemToDelete] = useState<CmsItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const fetchCmsData = useCallback(async () => {
    setLoading(true);
    setDbError(null);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      const res = await fetch("/api/cms?include_audit=true", {
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setDbError(data.error || "Error al cargar la base de datos PostgreSQL");
      } else {
        setItems(data.items || []);
        setAuditLogs(data.auditLogs || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (err: unknown) {
      setDbError(err instanceof Error ? err.message : "Error de red al consultar /api/cms");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCmsData();
  }, [fetchCmsData]);

  const handleLogin = async (e: React.FormEvent) => {
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
        fetchCmsData();
      }
    } catch {
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
        fetchCmsData();
      } else {
        setLoginError("Error al conectar con el servidor.");
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const currentPageDef = SITE_STRUCTURE.find((p) => p.id === selectedPage);

  // Abrir modal para Crear nuevo registro ubicado exactamente en la página y sección actual
  const openCreateModal = (targetPage?: string, targetSection?: string) => {
    setEditingItem(null);
    const pg =
      targetPage ||
      (selectedPage !== "all" && selectedPage !== "traceability" ? selectedPage : "home");
    const pageDef = SITE_STRUCTURE.find((p) => p.id === pg) || SITE_STRUCTURE[0];
    const sec =
      targetSection && targetSection !== "all"
        ? targetSection
        : selectedSection !== "all"
        ? selectedSection
        : pageDef.sections[0]?.id || "hero";
    const secDef = pageDef.sections.find((s) => s.id === sec) || pageDef.sections[0];

    setFormPage(pg);
    setFormSection(sec);
    setFormContentType(secDef?.defaultContentType || "card");
    setFormMediaType(secDef?.defaultMediaType || "image");
    setFormTitleEs("");
    setFormTitleEn("");
    setFormSubtitleEs("");
    setFormSubtitleEn("");
    setFormDescEs("");
    setFormDescEn("");
    setFormMediaUrl(
      secDef?.defaultMediaType === "none"
        ? ""
        : "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80"
    );
    setFormBadgeEs("");
    setFormBadgeEn("");
    setFormCtaTextEs("");
    setFormCtaTextEn("");
    setFormCtaLink("");
    setFormDisplayOrder(items.filter((i) => i.page === pg && i.section === sec).length + 1);
    setFormStatus("active"); // Por requerimiento: sale como ACTIVO por defecto
    setFormCategory("emotional");
    setFormDuration("08:30");
    setIsFormModalOpen(true);
  };

  // Abrir modal para Editar registro existente
  const openEditModal = (item: CmsItem) => {
    setEditingItem(item);
    setFormPage(item.page || "home");
    setFormSection(item.section);
    setFormContentType(item.content_type);
    setFormMediaType(item.media_type);
    setFormTitleEs(item.title_es || "");
    setFormTitleEn(item.title_en || "");
    setFormSubtitleEs(item.subtitle_es || "");
    setFormSubtitleEn(item.subtitle_en || "");
    setFormDescEs(item.description_es || "");
    setFormDescEn(item.description_en || "");
    setFormMediaUrl(item.media_url || "");
    setFormBadgeEs(item.badge_es || "");
    setFormBadgeEn(item.badge_en || "");
    setFormCtaTextEs(item.cta_text_es || "");
    setFormCtaTextEn(item.cta_text_en || "");
    setFormCtaLink(item.cta_link || "");
    setFormDisplayOrder(item.display_order || 1);
    setFormStatus(item.status);
    setFormCategory((item.meta_json?.category as string) || "emotional");
    setFormDuration((item.meta_json?.duration as string) || "08:30");
    setIsFormModalOpen(true);
  };

  // Guardar (Crear o Actualizar)
  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingForm(true);
    try {
      const locInfo = ALL_SECTIONS_MAP[formSection];
      const metaJson = {
        ...(editingItem?.meta_json || {}),
        category: formCategory,
        duration: formDuration,
        location_hint: locInfo
          ? `${locInfo.pageLabel} → ${locInfo.sectionLabel}`
          : `${formPage} → ${formSection}`,
      };

      const payload = {
        page: formPage,
        section: formSection,
        content_type: formContentType,
        media_type: formMediaType,
        title_es: formTitleEs.trim(),
        title_en: (formTitleEn || formTitleEs).trim(),
        subtitle_es: formSubtitleEs.trim(),
        subtitle_en: (formSubtitleEn || formSubtitleEs).trim(),
        description_es: formDescEs.trim(),
        description_en: (formDescEn || formDescEs).trim(),
        media_url: formMediaUrl.trim(),
        badge_es: formBadgeEs.trim(),
        badge_en: (formBadgeEn || formBadgeEs).trim(),
        cta_text_es: formCtaTextEs.trim(),
        cta_text_en: (formCtaTextEn || formCtaTextEs).trim(),
        cta_link: formCtaLink.trim(),
        display_order: Number(formDisplayOrder),
        status: formStatus,
        meta_json: metaJson,
        changed_by: adminUser?.name || "Admin NARA",
      };

      if (editingItem) {
        const res = await fetch(`/api/cms/${editingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          alert(data.error || "Error al actualizar");
        } else {
          showToast(
            `Actualizado: "${payload.title_es}" en [${
              locInfo ? `${locInfo.pageLabel} → ${locInfo.sectionLabel}` : payload.section
            }]`
          );
          setIsFormModalOpen(false);
          fetchCmsData();
        }
      } else {
        const res = await fetch("/api/cms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, status: "active" }),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          alert(data.error || "Error al crear registro");
        } else {
          showToast(`Nuevo contenido "${payload.title_es}" creado y publicado como ACTIVO.`);
          setIsFormModalOpen(false);
          fetchCmsData();
        }
      }
    } catch {
      alert("Error de conexión al guardar en PostgreSQL.");
    } finally {
      setSavingForm(false);
    }
  };

  // Cambiar rápido entre ACTIVO e INACTIVO
  const handleToggleStatus = async (item: CmsItem) => {
    const nextStatus = item.status === "active" ? "inactive" : "active";
    try {
      const res = await fetch(`/api/cms/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: nextStatus,
          changed_by: adminUser?.name || "Admin NARA",
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        showToast(
          `Estado de "${item.title_es}" cambiado a ${
            nextStatus === "active" ? "ACTIVO (visible en web)" : "INACTIVO (oculto en web)"
          }.`
        );
        fetchCmsData();
      }
    } catch {
      alert("Error al cambiar el estado del elemento.");
    }
  };

  // Confirmar eliminación con modal
  const confirmDeleteItem = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      const changedBy = encodeURIComponent(adminUser?.name || "Admin NARA");
      const res = await fetch(`/api/cms/${itemToDelete.id}?changed_by=${changedBy}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        showToast(
          `Elemento "${itemToDelete.title_es}" eliminado. Respaldo guardado en trazabilidad.`
        );
        setItemToDelete(null);
        fetchCmsData();
      } else {
        alert(data.error || "No se pudo eliminar el registro.");
      }
    } catch {
      alert("Error al eliminar el registro.");
    } finally {
      setDeleting(false);
    }
  };

  // Filtrado por Página, Sección, Estado, Tipo y Búsqueda
  const filteredItems = items.filter((item) => {
    if (selectedPage !== "all" && selectedPage !== "traceability" && item.page !== selectedPage) {
      return false;
    }
    if (selectedSection !== "all" && item.section !== selectedSection) {
      return false;
    }
    if (filterStatus !== "all" && item.status !== filterStatus) return false;
    if (filterMedia === "video" && item.media_type !== "video" && item.content_type !== "video")
      return false;
    if (filterMedia === "image" && item.media_type !== "image" && item.content_type !== "image")
      return false;
    if (filterMedia === "text" && item.media_type !== "none") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle =
        item.title_es?.toLowerCase().includes(q) || item.title_en?.toLowerCase().includes(q);
      const matchDesc =
        item.description_es?.toLowerCase().includes(q) ||
        item.description_en?.toLowerCase().includes(q);
      const matchSec = item.section?.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchSec;
    }
    return true;
  });

  // Esperar a que monte en el cliente para evitar mismatch de hidratación entre SSR y localStorage
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#1B1E2B] flex items-center justify-center p-4">
        <div className="flex items-center gap-3 text-white/80 font-sans text-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping"></span>
          <span>Cargando Panel Administrativo NARA...</span>
        </div>
      </div>
    );
  }

  // Pantalla de Login independiente si no ha iniciado sesión
  if (!adminUser) {
    return (
      <div className="min-h-screen bg-[#1B1E2B] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-200">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-soft text-primary text-xs font-bold mb-3">
            <span>🔒 PORTAL CMS INDEPENDIENTE · POSTGRESQL (`nara`)</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-espresso">
            Administración · Love Heals NARA
          </h1>
          <p className="text-xs text-espresso/70 mt-1 mb-6 leading-relaxed">
            Panel independiente de la web pública para gestionar por página y sección: Inicio,
            Nosotros/Pilares, Pacientes, Cuidadores y Footer Global.
          </p>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-espresso/80 mb-1">
                Usuario o Correo Administrador
              </label>
              <input
                type="text"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-espresso/20 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-espresso/80 mb-1">Contraseña</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-espresso/20 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
              <p className="font-bold">Acceso directo PostgreSQL (`nara`):</p>
              <p className="mt-0.5">
                Usuario: <code>admin@nara.org</code> (o <code>postgres</code>) | Contraseña:{" "}
                <code>123</code>
              </p>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-full bg-primary hover:bg-primary-container text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              {loginLoading ? "Ingresando..." : "Entrar al Panel Administrativo →"}
            </button>
            <div className="text-center pt-2">
              <Link href="/" className="text-xs text-espresso/60 hover:text-primary underline">
                ← Volver a la página pública
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const formPageDef = SITE_STRUCTURE.find((p) => p.id === formPage) || SITE_STRUCTURE[0];

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex flex-col lg:flex-row text-espresso">
      {/* Notificación flotante Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-espresso text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-white/15 flex items-center gap-3 text-xs sm:text-sm font-semibold">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* =====================================================================
           BARRA LATERAL IZQUIERDA (MENÚ DE PÁGINAS Y MÓDULOS INDEPENDIENTE)
           Ajustado para encajar exactamente en la pantalla sin scroll vertical
         ===================================================================== */}
      <aside className="w-full lg:w-72 bg-[#1B1E2B] text-white shrink-0 flex flex-col justify-between lg:h-screen lg:sticky lg:top-0 overflow-y-auto no-scrollbar select-none border-r border-white/5">
        <div className="p-4 space-y-3">
          {/* Marca del Panel CMS */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-widest text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                DB PostgreSQL: `nara`
              </span>
              <h1 className="font-serif text-lg font-bold text-white leading-tight">
                NARA · CMS Admin
              </h1>
              <p className="text-[10px] text-white/55">Panel independiente por páginas</p>
            </div>
          </div>

          {/* Navegación por Página para saber exactamente qué parte se edita */}
          <div className="space-y-1">
            <span className="px-2 text-[9px] font-extrabold uppercase tracking-wider text-white/40 block mb-1">
              1. Selecciona qué página editar
            </span>

            {SITE_STRUCTURE.map((page) => {
              const pageItems = items.filter((i) => i.page === page.id);
              const activeInPage = pageItems.filter((i) => i.status === "active").length;
              const isSelected = selectedPage === page.id;

              return (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => {
                    setSelectedPage(page.id);
                    setSelectedSection("all");
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? "bg-primary text-white font-bold shadow-sm"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm shrink-0">{page.icon}</span>
                    <div className="truncate">
                      <span className="block text-xs font-bold truncate leading-tight">
                        {page.shortLabel}
                      </span>
                      <span
                        className={`block text-[9px] leading-tight ${
                          isSelected ? "text-white/80" : "text-white/45"
                        }`}
                      >
                        {page.sections.length} secciones
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${
                      isSelected ? "bg-white/20 text-white" : "bg-white/10 text-white/70"
                    }`}
                  >
                    {activeInPage}/{pageItems.length}
                  </span>
                </button>
              );
            })}

            <div className="pt-2 mt-2 border-t border-white/10 space-y-1">
              <span className="px-2 text-[9px] font-extrabold uppercase tracking-wider text-white/40 block mb-0.5">
                2. Vistas Globales y Auditoría
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedPage("all");
                  setSelectedSection("all");
                }}
                className={`w-full text-left px-3 py-1.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                  selectedPage === "all"
                    ? "bg-primary text-white font-bold"
                    : "text-white/75 hover:bg-white/10"
                }`}
              >
                <span className="text-[11px]">📦 Todo el Sitio</span>
                <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-[9px]">
                  {items.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPage("traceability")}
                className={`w-full text-left px-3 py-1.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                  selectedPage === "traceability"
                    ? "bg-emerald-600 text-white font-bold"
                    : "text-white/75 hover:bg-white/10"
                }`}
              >
                <span className="text-[11px]">📋 Trazabilidad</span>
                <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-[9px]">
                  {auditLogs.length}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pie de la barra lateral: Usuario y Salir */}
        <div className="p-3.5 border-t border-white/10 bg-black/20 space-y-2">
          <div className="text-xs">
            <p className="font-bold text-white text-[11px] truncate">{adminUser.name}</p>
            <p className="text-[10px] text-white/50 truncate">{adminUser.email}</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <Link
              href={currentPageDef?.publicRoute || "/"}
              target="_blank"
              className="w-full py-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold text-center transition-colors"
            >
              🌐 Ver Web Pública ↗
            </Link>
            <button
              type="button"
              onClick={logoutAdmin}
              className="w-full py-1 px-2.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 text-[11px] font-bold transition-colors cursor-pointer"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* =====================================================================
           ÁREA CENTRAL DE TRABAJO DEL PANEL ADMINISTRATIVO
         ===================================================================== */}
      <main className="flex-1 p-5 sm:p-8 space-y-6 overflow-y-auto">
        {/* CABECERA CONTEXTUAL DE LA PÁGINA SELECCIONADA */}
        <div className="bg-white rounded-3xl p-6 shadow-2xs border border-slate-200/80 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-extrabold uppercase tracking-wider">
                {selectedPage === "traceability"
                  ? "📋 AUDITORÍA DE BASE DE DATOS"
                  : selectedPage === "all"
                  ? "📦 VISTA GLOBAL DE TODAS LAS PÁGINAS"
                  : `${currentPageDef?.icon} EDITANDO: ${currentPageDef?.label}`}
              </span>
              {currentPageDef && (
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                  Ruta pública: <code>{currentPageDef.publicRoute}</code>
                </span>
              )}
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-espresso">
              {selectedPage === "traceability"
                ? "Historial de Trazabilidad (`cms_audit_logs`)"
                : selectedPage === "all"
                ? "Todos los Contenidos del Sitio Web"
                : currentPageDef?.label}
            </h2>
            <p className="text-xs sm:text-sm text-espresso/65 mt-1">
              {selectedPage === "traceability"
                ? "Registro cronológico de todo lo que has creado, editado, activado, inactivado o eliminado."
                : currentPageDef?.description ||
                  "Filtra por página y sección para identificar exactamente a qué parte pertenece cada texto, imagen o video."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={fetchCmsData}
              className="px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-espresso text-xs font-bold transition-colors cursor-pointer"
            >
              🔄 Actualizar
            </button>
            {selectedPage !== "traceability" && (
              <button
                type="button"
                onClick={() => openCreateModal()}
                className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-container text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
              >
                ＋ Agregar a {currentPageDef ? currentPageDef.shortLabel : "la Página"} (Sale Activo)
              </button>
            )}
          </div>
        </div>

        {/* MAPA DE SECCIONES DE LA PÁGINA SELECCIONADA (PARA SABER QUÉ PERTENECE A QUÉ) */}
        {currentPageDef && selectedPage !== "traceability" && (
          <div className="bg-white rounded-3xl p-5 shadow-2xs border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-espresso/60">
                📍 Secciones dentro de &ldquo;{currentPageDef.shortLabel}&rdquo; (Haz clic en una sección para
                ver o editar sus elementos):
              </span>
              {selectedSection !== "all" && (
                <button
                  type="button"
                  onClick={() => setSelectedSection("all")}
                  className="text-xs text-primary font-bold underline cursor-pointer"
                >
                  Ver todas las secciones de {currentPageDef.shortLabel}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedSection("all")}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedSection === "all"
                    ? "bg-espresso text-white border-espresso shadow-xs"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-espresso"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold">Todas las Secciones</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">
                    {items.filter((i) => i.page === currentPageDef.id).length} items
                  </span>
                </div>
                <p
                  className={`text-[11px] mt-1 line-clamp-1 ${
                    selectedSection === "all" ? "text-white/75" : "text-espresso/60"
                  }`}
                >
                  Mostrar todo el contenido de {currentPageDef.shortLabel}
                </p>
              </button>

              {currentPageDef.sections.map((sec) => {
                const secItems = items.filter(
                  (i) => i.page === currentPageDef.id && i.section === sec.id
                );
                const activeSecCount = secItems.filter((i) => i.status === "active").length;
                const isSecSelected = selectedSection === sec.id;

                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setSelectedSection(sec.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSecSelected
                        ? "bg-primary text-white border-primary shadow-xs"
                        : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-espresso"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-extrabold truncate">{sec.label}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                          isSecSelected
                            ? "bg-white/20 text-white"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {activeSecCount} activos
                      </span>
                    </div>
                    <p
                      className={`text-[11px] mt-1 line-clamp-2 ${
                        isSecSelected ? "text-white/85" : "text-espresso/60"
                      }`}
                    >
                      {sec.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {dbError && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold">
            Error de conexión con PostgreSQL: {dbError}
          </div>
        )}

        {/* ==================== VISTA DE CONTENIDOS ==================== */}
        {selectedPage !== "traceability" ? (
          <div className="space-y-5">
            {/* Sub-filtros rápidos: Estado, Tipo de Recurso y Buscador */}
            <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-espresso/60 mb-1">
                  Filtrar por Estado (Trazabilidad)
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                >
                  <option value="all">Todos (Activos + Inactivos)</option>
                  <option value="active">✅ Solo Activos (Publicados en la página)</option>
                  <option value="inactive">⏸️ Solo Inactivos (Ocultos, en trazabilidad)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-espresso/60 mb-1">
                  Filtrar por Tipo de Contenido
                </label>
                <select
                  value={filterMedia}
                  onChange={(e) => setFilterMedia(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                >
                  <option value="all">Todos (Videos, Imágenes y Textos)</option>
                  <option value="video">🎥 Solo Videos</option>
                  <option value="image">🖼️ Solo Imágenes</option>
                  <option value="text">📝 Solo Textos / Footer / Marquee</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-espresso/60 mb-1">
                  Buscar texto, título o palabra clave
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar en esta sección..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                />
              </div>
            </div>

            {/* GRILLA DE ELEMENTOS CON IDENTIFICACIÓN CLARA DE PÁGINA Y SECCIÓN */}
            {loading ? (
              <div className="bg-white rounded-3xl p-12 text-center text-espresso/60 font-semibold">
                Cargando contenidos desde PostgreSQL (`nara`)...
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-slate-200">
                <p className="text-base font-bold text-espresso">
                  No hay elementos en esta sección todavía.
                </p>
                <button
                  type="button"
                  onClick={() => openCreateModal()}
                  className="px-5 py-2.5 rounded-full bg-primary text-white text-xs font-bold cursor-pointer"
                >
                  ＋ Agregar Primer Contenido en esta Sección (Sale Activo)
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredItems.map((item) => {
                  const isActive = item.status === "active";
                  const locInfo = ALL_SECTIONS_MAP[item.section];
                  const pageBadge = locInfo?.pageLabel || item.page.toUpperCase();
                  const sectionBadge = locInfo?.sectionLabel || item.section;

                  return (
                    <div
                      key={item.id}
                      className={`rounded-3xl bg-white border-2 transition-all overflow-hidden flex flex-col justify-between shadow-2xs ${
                        isActive
                          ? "border-emerald-500/35 hover:border-emerald-500/70"
                          : "border-amber-400/60 bg-amber-50/25 opacity-90"
                      }`}
                    >
                      <div>
                        {/* ETIQUETA SUPERIOR DE UBICACIÓN: QUÉ PÁGINA Y QUÉ SECCIÓN ES */}
                        <div className="px-4 py-2.5 bg-[#1B1E2B] text-white flex items-center justify-between gap-2 text-[11px]">
                          <div className="truncate font-bold">
                            <span className="text-rose-brand">{pageBadge}</span>
                            <span className="mx-1.5 text-white/40">→</span>
                            <span className="text-white">{sectionBadge}</span>
                          </div>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase shrink-0 ${
                              isActive
                                ? "bg-emerald-500 text-white"
                                : "bg-amber-500 text-white"
                            }`}
                          >
                            {isActive ? "● ACTIVO" : "⏸ INACTIVO"}
                          </span>
                        </div>

                        {/* Vista previa si tiene imagen o video */}
                        {item.media_url ? (
                          <div className="relative h-40 w-full bg-slate-900 overflow-hidden">
                            <img
                              src={item.media_url}
                              alt={item.title_es}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                            <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px]">
                              <span className="px-2.5 py-0.5 rounded-full bg-black/65 font-bold">
                                {item.media_type === "video" ? "🎥 VIDEO" : "🖼️ IMAGEN"}
                              </span>
                              <span className="opacity-85 font-mono">Orden #{item.display_order}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-[11px] text-slate-600 font-semibold">
                            <span>📝 Bloque de Texto / Configuración</span>
                            <span>Orden #{item.display_order}</span>
                          </div>
                        )}

                        {/* Textos Español e Inglés */}
                        <div className="p-5 space-y-2.5">
                          {item.badge_es && (
                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-rose-soft text-primary text-[10px] font-bold">
                              {item.badge_es}
                            </span>
                          )}

                          <h3 className="font-serif font-bold text-lg text-espresso leading-snug">
                            {item.title_es}
                          </h3>
                          {item.subtitle_es && (
                            <p className="text-xs font-bold text-sage">{item.subtitle_es}</p>
                          )}
                          <p className="text-[11px] text-primary/80 italic line-clamp-1">
                            🇬🇧 EN: {item.title_en}
                          </p>

                          <p className="text-xs text-espresso/75 line-clamp-3 leading-relaxed">
                            {item.description_es}
                          </p>

                          <div className="pt-2 border-t border-slate-100 text-[11px] text-espresso/50 flex items-center justify-between">
                            <span>ID #{item.id}</span>
                            <span>
                              Editado:{" "}
                              {new Date(item.updated_at).toLocaleString("es-CO", {
                                dateStyle: "short",
                                timeStyle: "short",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Botones de Acción */}
                      <div className="p-3.5 bg-slate-50 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="px-3.5 py-2 rounded-xl bg-espresso hover:bg-espresso/90 text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          ✏️ Editar Contenido
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            isActive
                              ? "bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300"
                              : "bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300"
                          }`}
                        >
                          {isActive ? "⏸ Inactivar" : "✅ Activar"}
                        </button>

                        <button
                          type="button"
                          onClick={() => setItemToDelete(item)}
                          className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-colors cursor-pointer"
                          title="Eliminar con confirmación"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* ==================== VISTA DE HISTORIAL DE TRAZABILIDAD ==================== */
          <div className="bg-white rounded-3xl p-6 shadow-2xs border border-slate-200 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-espresso/60 uppercase text-[11px]">
                    <th className="py-3 px-3">Fecha y Hora</th>
                    <th className="py-3 px-3">Acción</th>
                    <th className="py-3 px-3">Página y Sección</th>
                    <th className="py-3 px-3">Elemento</th>
                    <th className="py-3 px-3">Estado</th>
                    <th className="py-3 px-3">Detalle</th>
                    <th className="py-3 px-3">Autor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogs.map((log) => {
                    const loc = ALL_SECTIONS_MAP[log.section];
                    const badgeStyle =
                      log.action === "CREATED"
                        ? "bg-emerald-100 text-emerald-800"
                        : log.action === "ACTIVATED"
                        ? "bg-blue-100 text-blue-800"
                        : log.action === "DEACTIVATED"
                        ? "bg-amber-100 text-amber-800"
                        : log.action === "DELETED"
                        ? "bg-red-100 text-red-800"
                        : "bg-slate-100 text-slate-800";

                    return (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 whitespace-nowrap text-espresso/70">
                          {new Date(log.created_at).toLocaleString("es-CO", {
                            dateStyle: "short",
                            timeStyle: "medium",
                          })}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${badgeStyle}`}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-espresso">
                          {loc ? `${loc.pageLabel} → ${loc.sectionLabel}` : `${log.page} → ${log.section}`}
                        </td>
                        <td className="py-3 px-3 font-bold text-espresso">{log.item_title}</td>
                        <td className="py-3 px-3 font-mono text-[11px]">
                          {log.previous_status || "—"} → <strong>{log.new_status || "—"}</strong>
                        </td>
                        <td className="py-3 px-3 text-espresso/75 max-w-md">{log.details}</td>
                        <td className="py-3 px-3 font-semibold">{log.changed_by}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ==================== MODAL CREAR / EDITAR CONTENIDO ==================== */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold mb-1">
                  {editingItem
                    ? `✏️ EDITANDO ELEMENTO #${editingItem.id}`
                    : "✨ NUEVO CONTENIDO · SALE ACTIVO AUTOMÁTICAMENTE"}
                </span>
                <h2 className="font-serif text-2xl font-bold text-espresso">
                  {editingItem ? editingItem.title_es : "Agregar Nuevo Contenido"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-espresso font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4 mt-5">
              {/* Ubicación Exacta: Página y Sección */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-espresso mb-1">
                    1. ¿A qué Página pertenece?
                  </label>
                  <select
                    value={formPage}
                    onChange={(e) => {
                      const nextPg = e.target.value;
                      setFormPage(nextPg);
                      const pgObj = SITE_STRUCTURE.find((p) => p.id === nextPg);
                      if (pgObj && pgObj.sections[0]) {
                        setFormSection(pgObj.sections[0].id);
                        setFormContentType(pgObj.sections[0].defaultContentType);
                        setFormMediaType(pgObj.sections[0].defaultMediaType);
                      }
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                  >
                    {SITE_STRUCTURE.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.icon} {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-espresso mb-1">
                    2. ¿En qué Sección exacta va?
                  </label>
                  <select
                    value={formSection}
                    onChange={(e) => {
                      const nextSec = e.target.value;
                      setFormSection(nextSec);
                      const secObj = formPageDef.sections.find((s) => s.id === nextSec);
                      if (secObj) {
                        setFormContentType(secObj.defaultContentType);
                        setFormMediaType(secObj.defaultMediaType);
                      }
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                  >
                    {formPageDef.sections.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-espresso mb-1">
                    3. Estado de Publicación
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as "active" | "inactive")}
                    className={`w-full px-3 py-2.5 rounded-xl border text-xs font-bold ${
                      formStatus === "active"
                        ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                        : "bg-amber-50 border-amber-300 text-amber-800"
                    }`}
                  >
                    <option value="active">✅ ACTIVO (Visible en la web)</option>
                    <option value="inactive">⏸️ INACTIVO (Oculto, en DB)</option>
                  </select>
                </div>
              </div>

              {/* Títulos Español e Inglés */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-espresso/80 mb-1">
                    Título Principal (Español) *
                  </label>
                  <input
                    type="text"
                    value={formTitleEs}
                    onChange={(e) => setFormTitleEs(e.target.value)}
                    required
                    placeholder="Título o frase principal en Español"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-espresso/80">
                      Título Principal (Inglés)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setFormTitleEn(formTitleEs);
                        setFormSubtitleEn(formSubtitleEs);
                        setFormDescEn(formDescEs);
                        setFormBadgeEn(formBadgeEs);
                      }}
                      className="text-[11px] text-primary font-bold underline cursor-pointer"
                    >
                      Copiar desde Español
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formTitleEn}
                    onChange={(e) => setFormTitleEn(e.target.value)}
                    placeholder="Title in English (optional)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              {/* Subtítulo / Teléfono / Horario */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-espresso/80 mb-1">
                    Subtítulo / Teléfono / Horario (Español)
                  </label>
                  <input
                    type="text"
                    value={formSubtitleEs}
                    onChange={(e) => setFormSubtitleEs(e.target.value)}
                    placeholder="Ej. Dr. Efrén Bolívar / 1-800-NARA-LUZ / Martes 5:00 PM"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-espresso/80 mb-1">
                    Subtítulo / Teléfono / Horario (Inglés)
                  </label>
                  <input
                    type="text"
                    value={formSubtitleEn}
                    onChange={(e) => setFormSubtitleEn(e.target.value)}
                    placeholder="Subtitle in English"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              {/* Descripción Español e Inglés */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-espresso/80 mb-1">
                    Descripción o Párrafo (Español) *
                  </label>
                  <textarea
                    rows={3}
                    value={formDescEs}
                    onChange={(e) => setFormDescEs(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs leading-relaxed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-espresso/80 mb-1">
                    Descripción o Párrafo (Inglés)
                  </label>
                  <textarea
                    rows={3}
                    value={formDescEn}
                    onChange={(e) => setFormDescEn(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs leading-relaxed"
                  />
                </div>
              </div>

              {/* Multimedia: Tipo, URL de Imagen y URL de Video */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-espresso/80 mb-1">
                      Tipo de Multimedia
                    </label>
                    <select
                      value={formMediaType}
                      onChange={(e) =>
                        setFormMediaType(e.target.value as "none" | "image" | "video")
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                    >
                      <option value="image">🖼️ Imagen / Fotografía</option>
                      <option value="video">🎥 Video (YouTube / MP4)</option>
                      <option value="none">📝 Solo Texto (ej. Footer / Cinta)</option>
                    </select>
                  </div>

                  {formMediaType !== "none" && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-espresso/80 mb-1">
                          URL de la Imagen / Portada
                        </label>
                        <input
                          type="text"
                          value={formMediaUrl}
                          onChange={(e) => setFormMediaUrl(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-espresso/80 mb-1">
                          {formMediaType === "video"
                            ? "URL del Video (YouTube)"
                            : "Enlace del Botón (CTA)"}
                        </label>
                        <input
                          type="text"
                          value={formCtaLink}
                          onChange={(e) => setFormCtaLink(e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                        />
                      </div>
                    </>
                  )}
                </div>

                {formMediaType !== "none" && formMediaUrl && (
                  <div className="flex items-center gap-3 pt-1">
                    <img
                      src={formMediaUrl}
                      alt="Preview"
                      className="w-24 h-14 object-cover rounded-xl border border-slate-300"
                    />
                    <span className="text-xs text-espresso/70">
                      Vista previa de la imagen que se mostrará en{" "}
                      <strong>{ALL_SECTIONS_MAP[formSection]?.sectionLabel || formSection}</strong>.
                    </span>
                  </div>
                )}
              </div>

              {/* Etiqueta y Orden */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-espresso/80 mb-1">
                    Insignia / Etiqueta Superior (ES)
                  </label>
                  <input
                    type="text"
                    value={formBadgeEs}
                    onChange={(e) => setFormBadgeEs(e.target.value)}
                    placeholder="Ej. Avalado por Especialistas"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-espresso/80 mb-1">
                    Texto del Botón (ES)
                  </label>
                  <input
                    type="text"
                    value={formCtaTextEs}
                    onChange={(e) => setFormCtaTextEs(e.target.value)}
                    placeholder="Ej. Ver Cápsula / Reservar Cupo"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-espresso/80 mb-1">
                    Orden de aparición
                  </label>
                  <input
                    type="number"
                    value={formDisplayOrder}
                    onChange={(e) => setFormDisplayOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-espresso text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingForm}
                  className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-container text-white text-xs sm:text-sm font-bold shadow-md cursor-pointer"
                >
                  {savingForm
                    ? "Guardando en PostgreSQL..."
                    : editingItem
                    ? "💾 Guardar Cambios"
                    : "✨ Crear y Publicar como Activo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL DE CONFIRMACIÓN DE ELIMINACIÓN ==================== */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-7 shadow-2xl border-2 border-red-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center text-2xl font-bold">
              ⚠️
            </div>
            <h3 className="font-serif text-2xl font-bold text-espresso">
              ¿Confirmas eliminar este elemento?
            </h3>
            <p className="text-xs text-espresso/75 leading-relaxed">
              Vas a eliminar <strong className="text-espresso">&ldquo;{itemToDelete.title_es}&rdquo;</strong>{" "}
              ubicado en{" "}
              <strong>
                {ALL_SECTIONS_MAP[itemToDelete.section]
                  ? `${ALL_SECTIONS_MAP[itemToDelete.section].pageLabel} → ${
                      ALL_SECTIONS_MAP[itemToDelete.section].sectionLabel
                    }`
                  : itemToDelete.section}
              </strong>
              .
            </p>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
              💡 Si solo deseas ocultarlo sin borrarlo, haz clic en{" "}
              <strong>&ldquo;Solo Pasar a Inactivo&rdquo;</strong>. Si lo eliminas, se guardará un registro de
              respaldo en el Historial de Trazabilidad.
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                disabled={deleting}
                className="px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-espresso text-xs font-bold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  handleToggleStatus(itemToDelete);
                  setItemToDelete(null);
                }}
                className="px-4 py-2.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold cursor-pointer"
              >
                Solo Pasar a Inactivo
              </button>
              <button
                type="button"
                onClick={confirmDeleteItem}
                disabled={deleting}
                className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow cursor-pointer"
              >
                {deleting ? "Eliminando..." : "Sí, Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
