'use client';

import { useDroppable } from '@dnd-kit/core';

const TIER_COLORS: Record<string, string> = {
  s: '#FF7F7F',
  a: '#FFBF7F',
  b: '#FFDF7F',
  c: '#FFFF7F',
  d: '#BFFF7F',
  f: '#7F7F7F',
};

interface TierRowProps {
  tier: string;
  children: React.ReactNode;
}

export function TierRow({ tier, children }: TierRowProps) {
  const { setNodeRef, isOver } = useDroppable({ id: tier });

  return (
    <div
      className={`flex items-stretch mb-2 min-h-[80px] rounded-lg overflow-hidden transition-all ${
        isOver ? 'ring-4 ring-white shadow-xl scale-[1.02]' : ''
      }`}
    >
      <div
        className="w-20 flex items-center justify-center text-3xl font-bold text-gray-900"
        style={{ backgroundColor: TIER_COLORS[tier] }}
      >
        {tier.toUpperCase()}
      </div>
      <div
        ref={setNodeRef}
        className="flex-1 bg-gray-800 p-3 flex flex-wrap gap-3 items-center"
      >
        {children}
      </div>
    </div>
  );
}
