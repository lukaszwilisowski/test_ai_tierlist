import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface ModuleInfo {
  name: string;
  category: 'fruits' | 'vegetables';
  emoji: string;
  score?: number;
  maxScore?: number;
}

export async function GET() {
  try {
    // Load JSON files
    const fruitsJsonPath = path.join(process.cwd(), 'data', 'fruits.json');
    const vegetablesJsonPath = path.join(process.cwd(), 'data', 'vegetables.json');

    const fruitsJsonContent = await fs.readFile(fruitsJsonPath, 'utf8');
    const vegetablesJsonContent = await fs.readFile(vegetablesJsonPath, 'utf8');

    const fruitsData = JSON.parse(fruitsJsonContent);
    const vegetablesData = JSON.parse(vegetablesJsonContent);

    const fruitsMap = new Map<string, string>(fruitsData.map((f: any) => [f.name, f.emoji]));
    const vegetablesMap = new Map<string, string>(vegetablesData.map((v: any) => [v.name, v.emoji]));

    // Load test results
    const scoresMap = new Map<string, { score: number; maxScore: number }>();
    try {
      const csvPath = path.join(process.cwd(), 'testing/results/results.csv');
      const csvContent = await fs.readFile(csvPath, 'utf8');
      const lines = csvContent.split('\n').slice(1); // Skip header

      for (const line of lines) {
        if (!line.trim()) continue;
        const [module, , , , , , , , , , totalScore] = line.split(',');
        if (module && totalScore) {
          scoresMap.set(module, { score: parseInt(totalScore, 10), maxScore: 55 });
        }
      }
    } catch (err) {
      console.log('No test results found yet');
    }

    const modules: ModuleInfo[] = [];

    // Scan fruits modules
    const fruitsPath = path.join(process.cwd(), 'src/modules/fruits');
    try {
      const fruitDirs = await fs.readdir(fruitsPath);
      for (const dir of fruitDirs) {
        const stats = await fs.stat(path.join(fruitsPath, dir));
        if (stats.isDirectory()) {
          const scoreData = scoresMap.get(dir);
          modules.push({
            name: dir,
            category: 'fruits',
            emoji: fruitsMap.get(dir) || '🍎',
            score: scoreData?.score,
            maxScore: scoreData?.maxScore,
          });
        }
      }
    } catch (err) {
      console.log('No fruits modules yet');
    }

    // Scan vegetables modules
    const vegetablesPath = path.join(process.cwd(), 'src/modules/vegetables');
    try {
      const vegetableDirs = await fs.readdir(vegetablesPath);
      for (const dir of vegetableDirs) {
        const stats = await fs.stat(path.join(vegetablesPath, dir));
        if (stats.isDirectory()) {
          const scoreData = scoresMap.get(dir);
          modules.push({
            name: dir,
            category: 'vegetables',
            emoji: vegetablesMap.get(dir) || '🥕',
            score: scoreData?.score,
            maxScore: scoreData?.maxScore,
          });
        }
      }
    } catch (err) {
      console.log('No vegetables modules yet');
    }

    return NextResponse.json({ success: true, data: modules });
  } catch (error) {
    console.error('Failed to scan modules:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to scan modules' },
      { status: 500 }
    );
  }
}
