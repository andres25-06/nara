"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface NaraContextType {
  isVoiceWidgetOpen: boolean;
  setIsVoiceWidgetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleVoiceWidget: () => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleLoginModal: () => void;
  adminUser: AdminUser | null;
  setAdminUser: (user: AdminUser | null) => void;
  logoutAdmin: () => void;
}

const NaraContext = createContext<NaraContextType | undefined>(undefined);

export function NaraProvider({ children }: { children: React.ReactNode }) {
  const [isVoiceWidgetOpen, setIsVoiceWidgetOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [adminUser, setAdminUserState] = useState<AdminUser | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("nara_admin_user");
      if (saved) {
        setAdminUserState(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const setAdminUser = (user: AdminUser | null) => {
    setAdminUserState(user);
    try {
      if (user) {
        localStorage.setItem("nara_admin_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("nara_admin_user");
      }
    } catch {}
  };

  const logoutAdmin = () => {
    setAdminUser(null);
  };

  const toggleVoiceWidget = () => setIsVoiceWidgetOpen((prev) => !prev);
  const toggleLoginModal = () => setIsLoginModalOpen((prev) => !prev);

  return (
    <NaraContext.Provider
      value={{
        isVoiceWidgetOpen,
        setIsVoiceWidgetOpen,
        toggleVoiceWidget,
        isLoginModalOpen,
        setIsLoginModalOpen,
        toggleLoginModal,
        adminUser,
        setAdminUser,
        logoutAdmin,
      }}
    >
      {children}
    </NaraContext.Provider>
  );
}

export function useNara() {
  const ctx = useContext(NaraContext);
  if (!ctx) {
    throw new Error("useNara must be used within a NaraProvider");
  }
  return ctx;
}
