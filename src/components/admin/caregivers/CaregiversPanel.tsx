"use client";

import React, { useState } from "react";
import {
  CaregiverChildrenEditor,
  CaregiverCirclesEditor,
  CaregiverDictionaryEditor,
  CaregiverHeroEditor,
  CaregiverSelfCareEditor,
} from "./CaregiversBlocks";

type CaregiverBlock = "hero" | "dictionary" | "children" | "selfcare" | "circles";

const BLOCKS: { id: CaregiverBlock; label: string; Editor: React.ComponentType }[] = [
  { id: "hero", label: "Caregiver Haven", Editor: CaregiverHeroEditor },
  { id: "dictionary", label: "Empathy Dictionary", Editor: CaregiverDictionaryEditor },
  { id: "children", label: "Talking to Children", Editor: CaregiverChildrenEditor },
  { id: "selfcare", label: "Self-Care & Shifts", Editor: CaregiverSelfCareEditor },
  { id: "circles", label: "Caregiver Circles", Editor: CaregiverCirclesEditor },
];

export function CaregiversPanel() {
  const [block, setBlock] = useState<CaregiverBlock>("hero");
  const Active = BLOCKS.find((b) => b.id === block)!.Editor;

  return (
    <div>
      {/* Pestañas de bloques de Caregivers */}
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

