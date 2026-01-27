# Tierlist App Specification

## Purpose

A drag-and-drop tierlist interface for the presentation reveal. Shows expectations vs reality side-by-side, with dramatic reveal when fruit/vegetable is double-clicked to show the actual agent/model.

---

## Features

### Core Functionality

1. **Two Side-by-Side Tierlists**
   - Left: "My Expectations" (drag agent/model logos)
   - Right: "Reality" (drag fruit/vegetable icons)

2. **Tier Rows**: S, A, B, C, D, F
   - Drag items between tiers
   - Items stay where dropped

3. **Reveal Mechanism**
   - Double-click on fruit/vegetable
   - Animated transformation to actual agent/model logo
   - Particle effect or flip animation

4. **Reset on Refresh**
   - No persistence
   - Fresh start each page load

---

## UI Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AI Tierlist Comparison                              │
│                     [Coding Agents] [LLM Models]                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────┐      ┌─────────────────────────┐              │
│  │    MY EXPECTATIONS      │      │       REALITY           │              │
│  ├─────────────────────────┤      ├─────────────────────────┤              │
│  │ S │ [Cursor] [Claude]   │      │ S │ [🍎] [🍌]           │              │
│  │ A │ [Copilot]           │      │ A │ [🍒]                 │              │
│  │ B │ [Cline]             │      │ B │ [🍇] [🍋]           │              │
│  │ C │ [Roo]               │      │ C │ [🥝]                 │              │
│  │ D │                     │      │ D │ [🍑]                 │              │
│  │ F │                     │      │ F │                      │              │
│  └─────────────────────────┘      └─────────────────────────┘              │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ Unranked: [Antigravity] [Codex]     │     [🍊] [🍓] [🍉]               ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                             │
│                        [Reset] [Switch to Models]                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Data Structure

### Agent/Model Mappings

**.secrets/fruits/apple.json**:
```json
{
  "agent": "Claude Code",
  "logo": "/logos/claude-code.svg",
  "color": "#D97706"
}
```

**.secrets/vegetables/carrot.json**:
```json
{
  "model": "Sonnet 4.5",
  "logo": "/logos/anthropic.svg",
  "color": "#D97706"
}
```

### Tier Definition

```typescript
interface Tier {
  id: string;
  label: string;
  color: string;
}

const TIERS: Tier[] = [
  { id: 's', label: 'S', color: '#FF7F7F' },
  { id: 'a', label: 'A', color: '#FFBF7F' },
  { id: 'b', label: 'B', color: '#FFDF7F' },
  { id: 'c', label: 'C', color: '#FFFF7F' },
  { id: 'd', label: 'D', color: '#BFFF7F' },
  { id: 'f', label: 'F', color: '#7F7F7F' },
];
```

### Item Definition

```typescript
interface TierItem {
  id: string;
  type: 'agent' | 'fruit' | 'model' | 'vegetable';
  displayName: string;
  icon: string; // Emoji for fruit/vegetable, path for agent/model logo
  revealed: boolean;
  actualName?: string; // Shown after reveal
  actualLogo?: string;
}
```

---

## Component Structure

### TierlistPage

**src/app/tierlist/page.tsx**:
```typescript
'use client';

import { useState } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { TierlistBoard } from '@/components/tierlist/TierlistBoard';
import { ItemPool } from '@/components/tierlist/ItemPool';

type Category = 'agents' | 'models';

export default function TierlistPage() {
  const [category, setCategory] = useState<Category>('agents');

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-4">
        AI Tierlist Comparison
      </h1>

      {/* Category Toggle */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setCategory('agents')}
          className={`px-4 py-2 rounded ${
            category === 'agents'
              ? 'bg-orange-500'
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          Coding Agents
        </button>
        <button
          onClick={() => setCategory('models')}
          className={`px-4 py-2 rounded ${
            category === 'models'
              ? 'bg-purple-500'
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          LLM Models
        </button>
      </div>

      {/* Side by Side Tierlists */}
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-center">
            My Expectations
          </h2>
          <TierlistBoard
            side="expectations"
            category={category}
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Reality
          </h2>
          <TierlistBoard
            side="reality"
            category={category}
          />
        </div>
      </div>

      {/* Reset Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded"
        >
          Reset All
        </button>
      </div>
    </div>
  );
}
```

### TierlistBoard

```typescript
'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  closestCenter,
} from '@dnd-kit/core';
import { TierRow } from './TierRow';
import { ItemPool } from './ItemPool';

interface TierlistBoardProps {
  side: 'expectations' | 'reality';
  category: 'agents' | 'models';
}

const TIERS = ['s', 'a', 'b', 'c', 'd', 'f'];

export function TierlistBoard({ side, category }: TierlistBoardProps) {
  const [tierItems, setTierItems] = useState<Record<string, TierItem[]>>({
    s: [],
    a: [],
    b: [],
    c: [],
    d: [],
    f: [],
    pool: getInitialItems(side, category),
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const itemId = active.id as string;
    const targetTier = over.id as string;

    // Find and move item
    setTierItems((prev) => {
      const newState = { ...prev };

      // Remove from current location
      for (const tier of [...TIERS, 'pool']) {
        newState[tier] = newState[tier].filter((item) => item.id !== itemId);
      }

      // Find the item
      const item = Object.values(prev)
        .flat()
        .find((i) => i.id === itemId);

      if (item) {
        newState[targetTier] = [...newState[targetTier], item];
      }

      return newState;
    });
  };

  const handleReveal = (itemId: string) => {
    setTierItems((prev) => {
      const newState = { ...prev };
      for (const tier of [...TIERS, 'pool']) {
        newState[tier] = newState[tier].map((item) =>
          item.id === itemId ? { ...item, revealed: true } : item
        );
      }
      return newState;
    });
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="bg-gray-800 rounded-lg p-4">
        {TIERS.map((tier) => (
          <TierRow
            key={tier}
            tier={tier}
            items={tierItems[tier]}
            onReveal={handleReveal}
          />
        ))}
        <ItemPool items={tierItems.pool} onReveal={handleReveal} />
      </div>
    </DndContext>
  );
}
```

### TierRow

```typescript
'use client';

import { useDroppable } from '@dnd-kit/core';
import { DraggableItem } from './DraggableItem';

const TIER_COLORS: Record<string, string> = {
  s: 'bg-red-500',
  a: 'bg-orange-500',
  b: 'bg-yellow-500',
  c: 'bg-green-500',
  d: 'bg-blue-500',
  f: 'bg-gray-500',
};

interface TierRowProps {
  tier: string;
  items: TierItem[];
  onReveal: (id: string) => void;
}

export function TierRow({ tier, items, onReveal }: TierRowProps) {
  const { setNodeRef, isOver } = useDroppable({ id: tier });

  return (
    <div
      ref={setNodeRef}
      className={`flex items-center mb-2 min-h-[80px] ${
        isOver ? 'ring-2 ring-white' : ''
      }`}
    >
      <div
        className={`w-16 h-16 flex items-center justify-center text-2xl font-bold ${TIER_COLORS[tier]} rounded-l`}
      >
        {tier.toUpperCase()}
      </div>
      <div className="flex-1 bg-gray-700 min-h-[64px] p-2 flex flex-wrap gap-2 rounded-r">
        {items.map((item) => (
          <DraggableItem key={item.id} item={item} onReveal={onReveal} />
        ))}
      </div>
    </div>
  );
}
```

### DraggableItem with Reveal Animation

```typescript
'use client';

import { useDraggable } from '@dnd-kit/core';
import { useState } from 'react';

interface DraggableItemProps {
  item: TierItem;
  onReveal: (id: string) => void;
}

export function DraggableItem({ item, onReveal }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item.id,
  });
  const [isRevealing, setIsRevealing] = useState(false);

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  const handleDoubleClick = () => {
    if (item.revealed || item.type === 'agent' || item.type === 'model') return;

    setIsRevealing(true);
    setTimeout(() => {
      onReveal(item.id);
      setIsRevealing(false);
    }, 500);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onDoubleClick={handleDoubleClick}
      className={`
        w-16 h-16 flex items-center justify-center
        bg-gray-600 rounded cursor-grab
        transition-transform duration-500
        ${isRevealing ? 'animate-flip scale-0' : ''}
        ${item.revealed ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : ''}
      `}
      title={item.revealed ? item.actualName : item.displayName}
    >
      {item.revealed ? (
        <img
          src={item.actualLogo}
          alt={item.actualName}
          className="w-12 h-12 object-contain"
        />
      ) : (
        <span className="text-3xl">{item.icon}</span>
      )}
    </div>
  );
}
```

---

## Reveal Animation CSS

**src/app/globals.css** addition:
```css
@keyframes flip {
  0% {
    transform: rotateY(0deg) scale(1);
  }
  50% {
    transform: rotateY(90deg) scale(0.8);
  }
  100% {
    transform: rotateY(180deg) scale(1);
  }
}

.animate-flip {
  animation: flip 0.5s ease-in-out;
}

/* Optional: particle burst effect */
@keyframes burst {
  0% {
    opacity: 1;
    transform: scale(0);
  }
  100% {
    opacity: 0;
    transform: scale(2);
  }
}

.reveal-burst::after {
  content: '';
  position: absolute;
  inset: -10px;
  background: radial-gradient(circle, gold 0%, transparent 70%);
  animation: burst 0.5s ease-out;
  pointer-events: none;
}
```

---

## Loading Secret Mappings

**src/lib/load-secrets.ts**:
```typescript
import fs from 'fs/promises';
import path from 'path';

interface SecretMapping {
  [key: string]: {
    agent?: string;
    model?: string;
    logo: string;
    color: string;
  };
}

export async function loadSecrets(
  category: 'fruits' | 'vegetables'
): Promise<SecretMapping> {
  const secretsPath = path.join(process.cwd(), '.secrets', category);
  const mappings: SecretMapping = {};

  try {
    const files = await fs.readdir(secretsPath);
    for (const file of files) {
      if (file.endsWith('.json')) {
        const name = file.replace('.json', '');
        const content = await fs.readFile(
          path.join(secretsPath, file),
          'utf-8'
        );
        mappings[name] = JSON.parse(content);
      }
    }
  } catch {
    console.warn(`No secrets found for ${category}`);
  }

  return mappings;
}
```

**API endpoint** - **src/app/api/secrets/[category]/route.ts**:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { loadSecrets } from '@/lib/load-secrets';

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  const category = params.category as 'fruits' | 'vegetables';

  if (category !== 'fruits' && category !== 'vegetables') {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }

  const secrets = await loadSecrets(category);
  return NextResponse.json(secrets);
}
```

---

## Agent/Model Logos

Create `public/logos/` directory with:

```
public/logos/
├── cursor.svg
├── copilot.svg
├── claude-code.svg
├── roo-code.svg
├── cline.svg
├── antigravity.svg
├── codex.svg
├── anthropic.svg      (for Claude models)
├── openai.svg         (for GPT/Codex models)
├── google.svg         (for Gemini)
├── deepseek.svg
└── default.svg        (fallback)
```

---

## Initial Items Configuration

```typescript
// src/lib/tierlist-items.ts

export const AGENTS = [
  { id: 'cursor', name: 'Cursor', logo: '/logos/cursor.svg' },
  { id: 'copilot', name: 'GitHub Copilot', logo: '/logos/copilot.svg' },
  { id: 'claude-code', name: 'Claude Code', logo: '/logos/claude-code.svg' },
  { id: 'roo-code', name: 'Roo Code', logo: '/logos/roo-code.svg' },
  { id: 'cline', name: 'Cline', logo: '/logos/cline.svg' },
  { id: 'antigravity', name: 'Antigravity', logo: '/logos/antigravity.svg' },
  { id: 'codex', name: 'Codex CLI', logo: '/logos/codex.svg' },
];

export const MODELS = [
  { id: 'sonnet-45', name: 'Sonnet 4.5', logo: '/logos/anthropic.svg' },
  { id: 'opus-45', name: 'Opus 4.5', logo: '/logos/anthropic.svg' },
  { id: 'codex-52', name: 'Codex 5.2', logo: '/logos/openai.svg' },
  { id: 'codex-51-max', name: 'Codex 5.1 Max', logo: '/logos/openai.svg' },
  { id: 'gemini-flash', name: 'Gemini Flash', logo: '/logos/google.svg' },
  { id: 'deepseek', name: 'DeepSeek', logo: '/logos/deepseek.svg' },
];

export const FRUITS = [
  { id: 'apple', name: 'Apple', icon: '🍎' },
  { id: 'banana', name: 'Banana', icon: '🍌' },
  { id: 'cherry', name: 'Cherry', icon: '🍒' },
  { id: 'grape', name: 'Grape', icon: '🍇' },
  { id: 'lemon', name: 'Lemon', icon: '🍋' },
  { id: 'kiwi', name: 'Kiwi', icon: '🥝' },
  { id: 'peach', name: 'Peach', icon: '🍑' },
];

export const VEGETABLES = [
  { id: 'carrot', name: 'Carrot', icon: '🥕' },
  { id: 'potato', name: 'Potato', icon: '🥔' },
  { id: 'broccoli', name: 'Broccoli', icon: '🥦' },
  { id: 'corn', name: 'Corn', icon: '🌽' },
  { id: 'eggplant', name: 'Eggplant', icon: '🍆' },
  { id: 'pepper', name: 'Pepper', icon: '🌶️' },
];
```

---

## Presentation Flow

1. **Show "My Expectations" tierlist**
   - Drag agent/model logos to tiers
   - Explain your reasoning

2. **Show "Reality" tierlist**
   - Drag fruits/vegetables based on your actual testing
   - Don't reveal yet

3. **The Reveal**
   - Double-click each fruit/vegetable
   - Watch it transform to actual agent/model
   - Compare with expectations
   - Discuss surprises

4. **Switch to Models tab**
   - Repeat process for LLM comparison
