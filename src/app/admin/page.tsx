"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AdminSidebar, type AdminSection } from "@/components/admin/AdminSidebar";
import { HomePanel } from "@/components/admin/home/HomePanel";
import { PatientPanel } from "@/components/admin/patient/PatientPanel";
import { CaregiversPanel } from "@/components/admin/caregivers/CaregiversPanel";
import { ResourcesPanel } from "@/components/admin/resources/ResourcesPanel";
import { FooterPanel } from "@/components/admin/footer/FooterPanel";

const SECTION_LABEL_KEYS: Record<AdminSection, string> = {
  home: "nav.home",
  patient: "nav.patient.label",
  caregivers: "nav.caregivers.label",
  resources: "nav.resources.label",
  footer: "Footer",
};

export default function AdminPage() {
  const { t } = useTranslation();
  const [section, setSection] = useState<AdminSection>("home");

  return (
    <div className="min-h-screen flex bg-background">
      <AdminSidebar active={section} onSelect={setSection} />

      <main className="flex-1 p-8 lg:p-10">
        <h1 className="text-2xl font-extrabold tracking-tight text-espresso mb-6">
          {section === "footer" ? "Footer" : t(SECTION_LABEL_KEYS[section])}
        </h1>

        {section === "home" && <HomePanel />}
        {section === "patient" && <PatientPanel />}
        {section === "caregivers" && <CaregiversPanel />}
        {section === "resources" && <ResourcesPanel />}
        {section === "footer" && <FooterPanel />}
      </main>
    </div>
  );
}
