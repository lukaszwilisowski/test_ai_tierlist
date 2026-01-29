#!/usr/bin/env node

/**
 * Fruit Assignment Script
 * Randomly assigns 6 fruits to 6 coding agents for Phase 2 testing
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load data
const fruitsPath = path.join(__dirname, '..', 'data', 'fruits.json');
const agentsPath = path.join(__dirname, '..', 'data', 'coding-agents.json');
const outputPath = path.join(__dirname, 'fruit-assignment.json');

const fruits = JSON.parse(fs.readFileSync(fruitsPath, 'utf8'));
const agents = JSON.parse(fs.readFileSync(agentsPath, 'utf8'));

// Shuffle array (Fisher-Yates)
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Get 6 random fruits
const selectedFruits = shuffle(fruits).slice(0, 6);

// Create assignments
const assignments = {};
agents.forEach((agent, index) => {
  const fruit = selectedFruits[index];
  assignments[agent.name] = {
    fruit: fruit.name,
    emoji: fruit.emoji,
  };
});

// Save assignments
fs.writeFileSync(outputPath, JSON.stringify(assignments, null, 2));

console.log('\n🍎 Fruit Assignment Complete!');
console.log('═══════════════════════════════════\n');

Object.entries(assignments).forEach(([agent, data]) => {
  console.log(`${data.emoji}  ${data.fruit.padEnd(12)} → ${agent}`);
});

console.log('\n═══════════════════════════════════');
console.log(`\n📁 Saved to: ${outputPath}`);
console.log('\n✅ Ready for Phase 2 testing!\n');