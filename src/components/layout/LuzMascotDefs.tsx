"use client";

import React from "react";

export function LuzMascotDefs() {
  return (
    <svg
      style={{
        position: "absolute",
        width: 0,
        height: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="cloudBody3D" cx="38%" cy="28%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#FFFBF5" />
          <stop offset="82%" stopColor="#F2E4D4" />
          <stop offset="100%" stopColor="#DECBB6" />
        </radialGradient>
        <radialGradient id="cloudHighlight" cx="45%" cy="22%" r="45%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="cheekPink" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F08099" stopOpacity="0.85" />
          <stop offset="65%" stopColor="#F08099" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#F08099" stopOpacity="0" />
        </radialGradient>
        <filter id="clayDropShadow" x="-20%" y="-20%" width="140%" height="145%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#3A2A22" floodOpacity="0.22" />
        </filter>

        {/* MASCOTA 1: Nubecita guiñando con brote verde */}
        <symbol id="luz-cloud-wink" viewBox="0 0 120 96">
          <g filter="url(#clayDropShadow)">
            <path
              d="M28 78 C13 78 4 68 4 55 C4 43 13 33 25 32 C29 16 43 6 60 6 C77 6 91 16 95 32 C107 33 116 43 116 55 C116 68 107 78 92 78 Z"
              fill="url(#cloudBody3D)"
              stroke="#E5D5C3"
              strokeWidth="1.2"
            />
            <ellipse cx="56" cy="24" rx="24" ry="13" fill="url(#cloudHighlight)" />
            <ellipse cx="28" cy="48" rx="14" ry="9" fill="url(#cloudHighlight)" />
            <ellipse cx="90" cy="48" rx="14" ry="9" fill="url(#cloudHighlight)" />
            <circle cx="37" cy="54" r="10.5" fill="url(#cheekPink)" />
            <circle cx="83" cy="54" r="10.5" fill="url(#cheekPink)" />
            <circle cx="46" cy="46" r="3.6" fill="#473631" />
            <circle cx="44.8" cy="44.7" r="1.2" fill="#FFFFFF" />
            <path
              d="M69 46.5 Q74 41.5 79 46.5"
              stroke="#473631"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M54.5 52.5 Q60 58 65.5 52.5"
              stroke="#473631"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M60 75 C60 69 60 64 59 61"
              stroke="#4C7B38"
              strokeWidth="2.6"
              strokeLinecap="round"
              fill="none"
            />
            <path d="M60 65 C51 64 48 57 52.5 55 C57 53 60 59.5 60 65 Z" fill="#6BA353" />
            <path d="M60 65 C69 63 72 56 67.5 54 C63 52 60 58.5 60 65 Z" fill="#558B3E" />
          </g>
        </symbol>

        {/* MASCOTA 2: Nubecita serena con ojitos cerrados en calma */}
        <symbol id="luz-cloud-calm" viewBox="0 0 120 96">
          <g filter="url(#clayDropShadow)">
            <path
              d="M28 78 C13 78 4 68 4 55 C4 43 13 33 25 32 C29 16 43 6 60 6 C77 6 91 16 95 32 C107 33 116 43 116 55 C116 68 107 78 92 78 Z"
              fill="url(#cloudBody3D)"
              stroke="#E5D5C3"
              strokeWidth="1.2"
            />
            <ellipse cx="56" cy="24" rx="24" ry="13" fill="url(#cloudHighlight)" />
            <ellipse cx="28" cy="48" rx="14" ry="9" fill="url(#cloudHighlight)" />
            <ellipse cx="90" cy="48" rx="14" ry="9" fill="url(#cloudHighlight)" />
            <circle cx="36" cy="54" r="10.5" fill="url(#cheekPink)" />
            <circle cx="84" cy="54" r="10.5" fill="url(#cheekPink)" />
            <path
              d="M42 45 Q47 50 52 45"
              stroke="#473631"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M68 45 Q73 50 78 45"
              stroke="#473631"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M54.5 53 Q60 58.5 65.5 53"
              stroke="#473631"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M60 75 C60 70 60 66 59.5 63"
              stroke="#4C7B38"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <path d="M60 67 C51 66 48 59 52.5 57 C57 55 60 61.5 60 67 Z" fill="#6BA353" />
            <path d="M60 67 C69 65 72 58 67.5 56 C63 54 60 60.5 60 67 Z" fill="#558B3E" />
          </g>
        </symbol>
      </defs>
    </svg>
  );
}

