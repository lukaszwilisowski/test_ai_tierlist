#!/usr/bin/env node

/**
 * Randomly assigns vegetables to models for double-blind testing
 * Ensures no conflicts and maintains blind evaluation
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VEGETABLES_PATH = path.join(__dirname, '../data/vegetables.json');
const MODELS_CONFIG_PATH = path.join(__dirname, 'timing-data.json');
const OUTPUT_PATH = path.join(__dirname, 'vegetable-assignment.json');

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function assignVegetables() {
  // Read vegetables
  const vegetables = JSON.parse(fs.readFileSync(VEGETABLES_PATH, 'utf8'));
  const vegetableNames = vegetables.map(v => v.name);

  // Read models config
  const config = JSON.parse(fs.readFileSync(MODELS_CONFIG_PATH, 'utf8'));
  const models = config.models;

  // Shuffle vegetables
  const shuffled = shuffleArray(vegetableNames);

  // Assign first N vegetables to N models
  const assignments = {};
  models.forEach((modelInfo, index) => {
    assignments[modelInfo.model] = {
      vegetable: shuffled[index],
      emoji: vegetables.find(v => v.name === shuffled[index]).emoji,
      agent: modelInfo.agent
    };
  });

  // Save assignments
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(assignments, null, 2));

  console.log('✅ Vegetable assignments created:');
  console.log(JSON.stringify(assignments, null, 2));
  console.log(`\n📁 Saved to: ${OUTPUT_PATH}`);
}

// Check if assignment already exists
if (fs.existsSync(OUTPUT_PATH)) {
  console.log('⚠️  Assignment file already exists!');
  console.log('Delete it first if you want to regenerate:');
  console.log(`rm ${OUTPUT_PATH}`);
  process.exit(1);
}

assignVegetables();
