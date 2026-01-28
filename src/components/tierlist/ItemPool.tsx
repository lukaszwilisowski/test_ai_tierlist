'use client';

import { useDroppable } from '@dnd-kit/core';

interface ItemPoolProps {
  children: React.ReactNode;
  label: string;
}

export function ItemPool({ children, label }: ItemPoolProps) {
  const { setNodeRef, isOver } = useDroppable({ id: 'pool' });

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-300">{label}</h3>
      <div
        ref={setNodeRef}
        className={`bg-gray-800 rounded-lg p-4 min-h-[120px] flex flex-wrap gap-3 transition-all ${
          isOver ? 'ring-4 ring-white shadow-xl' : ''
        }`}
      >
        {children}
      </div>
    </div>
  );
}
