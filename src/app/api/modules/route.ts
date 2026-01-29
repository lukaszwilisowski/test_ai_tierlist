import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface ModuleInfo {
  name: string;
  category: 'fruits' | 'vegetables';
  emoji: string;
  score?: number;
  maxScore?: number;
  timeDisplay?: string;
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

    // Load timing data
    const timingMap = new Map<string, string>();
    try {
      const timingPath = path.join(process.cwd(), 'testing/timing-data.json');
      const timingContent = await fs.readFile(timingPath, 'utf8');
      const timingData = JSON.parse(timingContent);

      // Map agent names to their timeDisplay
      for (const agent of timingData.agents) {
        timingMap.set(agent.agent, agent.timeDisplay || '00:00');
      }

      // Map model names to their timeDisplay
      for (const model of timingData.models) {
        timingMap.set(model.model, model.timeDisplay || '00:00');
      }
    } catch (err) {
      console.log('No timing data found yet');
    }

    // Helper function to get timing for a module
    async function getTimingForModule(category: 'fruits' | 'vegetables', moduleName: string): Promise<string | undefined> {
      try {
        const secretPath = path.join(process.cwd(), '.secrets', category, `${moduleName}.json`);
        const secretContent = await fs.readFile(secretPath, 'utf8');
        const secretData = JSON.parse(secretContent);
        const secretName = secretData.agent || secretData.model;
        return timingMap.get(secretName);
      } catch (err) {
        return undefined;
      }
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
          const timeDisplay = await getTimingForModule('fruits', dir);
          modules.push({
            name: dir,
            category: 'fruits',
            emoji: fruitsMap.get(dir) || '🍎',
            score: scoreData?.score,
            maxScore: scoreData?.maxScore,
            timeDisplay,
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
          const timeDisplay = await getTimingForModule('vegetables', dir);
          modules.push({
            name: dir,
            category: 'vegetables',
            emoji: vegetablesMap.get(dir) || '🥕',
            score: scoreData?.score,
            maxScore: scoreData?.maxScore,
            timeDisplay,
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
