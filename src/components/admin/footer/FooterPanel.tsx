"use client";

import React, { useState } from "react";
import {
  FooterBrandEditor,
  FooterHelplineEditor,
  FooterLegalEditor,
} from "./FooterBlocks";

type FooterBlock = "brand" | "helpline" | "legal";

const BLOCKS: { id: FooterBlock; label: string; Editor: React.ComponentType }[] = [
  { id: "brand", label: "Brand & Mission", Editor: FooterBrandEditor },
  { id: "helpline", label: "24/7 Helpline & Contact", Editor: FooterHelplineEditor },
  { id: "legal", label: "Copyright & Legal", Editor: FooterLegalEditor },
];

export function FooterPanel() {
  const [block, setBlock] = useState<FooterBlock>("brand");
  const Active = BLOCKS.find((b) => b.id === block)!.Editor;

  return (
    <div>
      {/* Pestañas de bloques del Footer */}
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

