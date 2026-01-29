'use client';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface DraggableItemProps {
  id: string;
  displayText: string;
  emoji?: string;
  color?: string;
  textColor?: string;
  revealed: boolean;
  revealedText?: string;
  revealedColor?: string;
  revealedTextColor?: string;
  score?: number;
  maxScore?: number;
  timeDisplay?: string;
  onDoubleClick: () => void;
}

export function DraggableItem({
  id,
  displayText,
  emoji,
  color,
  textColor,
  revealed,
  revealedText,
  revealedColor,
  revealedTextColor,
  score,
  maxScore,
  timeDisplay,
  onDoubleClick,
}: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
  });

  const bgColor = revealed && revealedColor ? revealedColor : color || '#6B7280';
  const txtColor = revealed && revealedTextColor ? revealedTextColor : textColor || '#FFFFFF';
  const text = revealed && revealedText ? revealedText : displayText;

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: bgColor,
    color: txtColor,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onDoubleClick={onDoubleClick}
      className={`
        min-w-[120px] px-4 py-3 rounded-lg cursor-grab active:cursor-grabbing
        flex flex-col items-center justify-center text-center font-semibold text-sm
        transition-all duration-300
        ${revealed ? 'ring-2 ring-yellow-400 shadow-lg' : 'shadow'}
        hover:scale-105
      `}
      title={revealed ? revealedText : 'Double-click to reveal'}
    >
      <div className="flex items-center">
        {emoji && !revealed && <span className="text-2xl mr-2">{emoji}</span>}
        <span className="whitespace-nowrap">{text}</span>
      </div>
      {score !== undefined && maxScore !== undefined && (
        <div className="text-xs mt-1 opacity-80 font-normal">
          {score}/{maxScore}
        </div>
      )}
      {timeDisplay && timeDisplay !== "00:00" && (
        <div className="text-xs mt-0.5 opacity-70 font-mono">
          ⏱️ {timeDisplay}
        </div>
      )}
    </div>
  );
}
