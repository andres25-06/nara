"use client";

import React, { useState } from "react";
import {
  PatientCalmEditor,
  PatientCirclesEditor,
  PatientDiaryEditor,
  PatientHeroEditor,
  PatientJourneyEditor,
} from "./PatientBlocks";

type PatientBlock = "hero" | "journey" | "diary" | "calm" | "circles";

const BLOCKS: { id: PatientBlock; label: string; Editor: React.ComponentType }[] = [
  { id: "hero", label: "Hero", Editor: PatientHeroEditor },
  { id: "journey", label: "My Journey & Stages", Editor: PatientJourneyEditor },
  { id: "diary", label: "Symptom Diary", Editor: PatientDiaryEditor },
  { id: "calm", label: "Sensory Micro-Calm", Editor: PatientCalmEditor },
  { id: "circles", label: "Weekly Circles", Editor: PatientCirclesEditor },
];

export function PatientPanel() {
  const [block, setBlock] = useState<PatientBlock>("hero");
  const Active = BLOCKS.find((b) => b.id === block)!.Editor;

  return (
    <div>
      {/* Pestañas de bloques de Patient */}
      <div className="flex flex-wrap gap-1.5 mb-8 p-1.5 bg-white rounded-2xl border border-espresso/10 shadow-2xs w-fit">
        {BLOCKS.map((b) => {
          const isActive = block === b.id;
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => setBlock(b.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-espresso/80 hover:text-primary hover:bg-primary/5"
              }`}
            >
              {b.label}
            </button>
          );
        })}
      </div>

      <Active key={block} />
    </div>
  );
}

