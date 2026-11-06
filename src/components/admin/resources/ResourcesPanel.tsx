"use client";

import React, { useState } from "react";
import {
  ResourcesHeroEditor,
  ResourcesLibraryEditor,
  ResourcesMobilityEditor,
  ResourcesNutritionEditor,
  ResourcesRightsEditor,
} from "./ResourcesBlocks";

type ResourcesBlock = "hero" | "nutrition" | "library" | "mobility" | "rights";

const BLOCKS: { id: ResourcesBlock; label: string; Editor: React.ComponentType }[] = [
  { id: "hero", label: "Hero (4 Pillars)", Editor: ResourcesHeroEditor },
  { id: "nutrition", label: "Nutrition & Recipes", Editor: ResourcesNutritionEditor },
  { id: "library", label: "Guides & Workbooks", Editor: ResourcesLibraryEditor },
  { id: "mobility", label: "Mindful Movement", Editor: ResourcesMobilityEditor },
  { id: "rights", label: "Rights & Benefits", Editor: ResourcesRightsEditor },
];

export function ResourcesPanel() {
  const [block, setBlock] = useState<ResourcesBlock>("hero");
  const Active = BLOCKS.find((b) => b.id === block)!.Editor;

  return (
    <div>
      {/* Pestañas de bloques de Resources */}
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

