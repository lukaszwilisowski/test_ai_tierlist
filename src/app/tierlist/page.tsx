'use client';

import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { TierRow } from '@/components/tierlist/TierRow';
import { ItemPool } from '@/components/tierlist/ItemPool';
import { DraggableItem } from '@/components/tierlist/DraggableItem';
import Link from 'next/link';

type Category = 'agents' | 'models';
type Side = 'expectations' | 'reality';
type TierId = 's' | 'a' | 'b' | 'c' | 'd' | 'f' | 'pool';

interface TierItem {
  id: string;
  type: 'agent' | 'model' | 'fruit' | 'vegetable';
  displayText: string;
  emoji?: string;
  color?: string;
  textColor?: string;
  revealed?: boolean;
  revealedText?: string;
  revealedColor?: string;
  revealedTextColor?: string;
  category?: 'fruits' | 'vegetables';
  moduleName?: string;
  score?: number;
  maxScore?: number;
}

interface AgentData {
  name: string;
  color: string;
  textColor: string;
}

interface ModelData {
  name: string;
  color: string;
  textColor: string;
}

interface ModuleData {
  name: string;
  category: 'fruits' | 'vegetables';
  emoji: string;
  score?: number;
  maxScore?: number;
}

const TIERS: TierId[] = ['s', 'a', 'b', 'c', 'd', 'f'];

export default function TierlistPage() {
  const [category, setCategory] = useState<Category>('agents');
  const [agents, setAgents] = useState<AgentData[]>([]);
  const [models, setModels] = useState<ModelData[]>([]);
  const [modules, setModules] = useState<ModuleData[]>([]);
  const [loading, setLoading] = useState(true);

  // Separate state for each side
  const [expectationsTiers, setExpectationsTiers] = useState<Record<TierId, TierItem[]>>({
    s: [], a: [], b: [], c: [], d: [], f: [], pool: [],
  });
  const [realityTiers, setRealityTiers] = useState<Record<TierId, TierItem[]>>({
    s: [], a: [], b: [], c: [], d: [], f: [], pool: [],
  });

  // Load data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [agentsRes, modelsRes, modulesRes] = await Promise.all([
          fetch('/api/data/agents'),
          fetch('/api/data/models'),
          fetch('/api/modules'),
        ]);

        const agentsData = await agentsRes.json();
        const modelsData = await modelsRes.json();
        const modulesData = await modulesRes.json();

        setAgents(agentsData);
        setModels(modelsData);
        setModules(modulesData.data || []);

        // Initialize expectations pool
        const expectationsItems: TierItem[] = agentsData.map((agent: AgentData) => ({
          id: `exp-${agent.name}`,
          type: 'agent' as const,
          displayText: agent.name,
          color: agent.color,
          textColor: agent.textColor,
        }));

        setExpectationsTiers({
          s: [], a: [], b: [], c: [], d: [], f: [],
          pool: expectationsItems,
        });

        setLoading(false);
      } catch (error) {
        console.error('Failed to load data:', error);
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Update reality pool when category or modules change
  useEffect(() => {
    if (loading) return;

    const filteredModules = modules.filter((m) =>
      category === 'agents' ? m.category === 'fruits' : m.category === 'vegetables'
    );

    const realityItems: TierItem[] = filteredModules.map((module) => ({
      id: `reality-${module.category}-${module.name}`,
      type: module.category === 'fruits' ? 'fruit' : 'vegetable',
      displayText: module.name,
      emoji: module.emoji,
      category: module.category,
      moduleName: module.name,
      score: module.score,
      maxScore: module.maxScore,
    }));

    setRealityTiers({
      s: [], a: [], b: [], c: [], d: [], f: [],
      pool: realityItems,
    });
  }, [category, modules, loading]);

  // Update expectations pool when category changes
  useEffect(() => {
    if (loading) return;

    const items = category === 'agents' ? agents : models;
    const expectationsItems: TierItem[] = items.map((item: AgentData | ModelData) => ({
      id: `exp-${item.name}`,
      type: category === 'agents' ? 'agent' : 'model',
      displayText: item.name,
      color: item.color,
      textColor: item.textColor,
    }));

    setExpectationsTiers({
      s: [], a: [], b: [], c: [], d: [], f: [],
      pool: expectationsItems,
    });
  }, [category, agents, models, loading]);

  const handleDragEnd = (event: DragEndEvent, side: Side) => {
    const { active, over } = event;
    if (!over) return;

    const itemId = active.id as string;
    const targetTier = over.id as TierId;

    const setTiers = side === 'expectations' ? setExpectationsTiers : setRealityTiers;

    setTiers((prev) => {
      const newState = { ...prev };

      // Remove from current location
      for (const tier of [...TIERS, 'pool' as TierId]) {
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

  const handleReveal = async (item: TierItem) => {
    if (!item.category || !item.moduleName) return;
    if (item.revealed) return;

    try {
      const res = await fetch(`/api/modules/${item.category}/${item.moduleName}/secret`);
      const data = await res.json();

      if (data.success) {
        const secret = data.data.secret;
        const referenceData = category === 'agents' ? agents : models;
        const revealed = referenceData.find((d: AgentData | ModelData) => d.name === secret);

        if (revealed) {
          setRealityTiers((prev) => {
            const newState = { ...prev };

            for (const tier of [...TIERS, 'pool' as TierId]) {
              newState[tier] = newState[tier].map((i) =>
                i.id === item.id
                  ? {
                      ...i,
                      revealed: true,
                      revealedText: revealed.name,
                      revealedColor: revealed.color,
                      revealedTextColor: revealed.textColor,
                    }
                  : i
              );
            }

            return newState;
          });
        }
      }
    } catch (error) {
      console.error('Failed to reveal:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-2xl">Loading tierlist...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">AI Tierlist Comparison</h1>
          <Link
            href="/"
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
          >
            Back to Home
          </Link>
        </div>

        {/* Category Toggle */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setCategory('agents')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              category === 'agents'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Coding Agents
          </button>
          <button
            onClick={() => setCategory('models')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              category === 'models'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            LLM Models
          </button>
        </div>

        {/* Side by Side Tierlists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Expectations */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-center text-blue-400">
              My Expectations
            </h2>
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={(e) => handleDragEnd(e, 'expectations')}
            >
              <div className="bg-gray-800 rounded-lg p-4">
                {TIERS.map((tier) => (
                  <TierRow key={tier} tier={tier}>
                    {expectationsTiers[tier].map((item) => (
                      <DraggableItem
                        key={item.id}
                        id={item.id}
                        displayText={item.displayText}
                        emoji={item.emoji}
                        color={item.color}
                        textColor={item.textColor}
                        revealed={false}
                        onDoubleClick={() => {}}
                      />
                    ))}
                  </TierRow>
                ))}
                <ItemPool label="Unranked">
                  {expectationsTiers.pool.map((item) => (
                    <DraggableItem
                      key={item.id}
                      id={item.id}
                      displayText={item.displayText}
                      emoji={item.emoji}
                      color={item.color}
                      textColor={item.textColor}
                      revealed={false}
                      onDoubleClick={() => {}}
                    />
                  ))}
                </ItemPool>
              </div>
            </DndContext>
          </div>

          {/* Reality */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-center text-green-400">
              Reality
            </h2>
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={(e) => handleDragEnd(e, 'reality')}
            >
              <div className="bg-gray-800 rounded-lg p-4">
                {TIERS.map((tier) => (
                  <TierRow key={tier} tier={tier}>
                    {realityTiers[tier].map((item) => (
                      <DraggableItem
                        key={item.id}
                        id={item.id}
                        displayText={item.displayText}
                        emoji={item.emoji}
                        color={item.color}
                        textColor={item.textColor}
                        revealed={item.revealed || false}
                        revealedText={item.revealedText}
                        revealedColor={item.revealedColor}
                        revealedTextColor={item.revealedTextColor}
                        score={item.score}
                        maxScore={item.maxScore}
                        onDoubleClick={() => handleReveal(item)}
                      />
                    ))}
                  </TierRow>
                ))}
                <ItemPool label="Unranked">
                  {realityTiers.pool.map((item) => (
                    <DraggableItem
                      key={item.id}
                      id={item.id}
                      displayText={item.displayText}
                      emoji={item.emoji}
                      color={item.color}
                      textColor={item.textColor}
                      revealed={item.revealed || false}
                      revealedText={item.revealedText}
                      revealedColor={item.revealedColor}
                      revealedTextColor={item.revealedTextColor}
                      score={item.score}
                      maxScore={item.maxScore}
                      onDoubleClick={() => handleReveal(item)}
                    />
                  ))}
                </ItemPool>
              </div>
            </DndContext>
          </div>
        </div>

        {/* Reset Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition"
          >
            Reset All
          </button>
        </div>
      </div>
    </div>
  );
}
