"use client";

import React, { useState } from "react";
import { HeroEditor } from "./HeroEditor";
import {
  CirclesEditor,
  CtaBannerEditor,
  FeaturedMasterclassEditor,
  JourneyEditor,
  MarqueeEditor,
  PillarsEditor,
  VideoCapsulesEditor,
} from "./HomeBlocks";

type HomeBlock =
  | "hero"
  | "marquee"
  | "journey"
  | "pillars"
  | "masterclass"
  | "videos"
  | "circles"
  | "cta_banner";

const BLOCKS: { id: HomeBlock; label: string; Editor: React.ComponentType }[] = [
  { id: "hero", label: "Hero", Editor: HeroEditor },
  { id: "marquee", label: "Marquee", Editor: MarqueeEditor },
  { id: "journey", label: "Journey stages", Editor: JourneyEditor },
  { id: "pillars", label: "4 Pillars", Editor: PillarsEditor },
  { id: "masterclass", label: "Featured masterclass", Editor: FeaturedMasterclassEditor },
  { id: "videos", label: "Video capsules", Editor: VideoCapsulesEditor },
  { id: "circles", label: "Healing circles", Editor: CirclesEditor },
  { id: "cta_banner", label: "Final banner", Editor: CtaBannerEditor },
];

export function HomePanel() {
  const [block, setBlock] = useState<HomeBlock>("hero");
  const Active = BLOCKS.find((b) => b.id === block)!.Editor;

  return (
    <div>
      {/* Pestañas de bloques del Home */}
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
