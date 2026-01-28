import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'llm-models.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const modelsData = JSON.parse(fileContents);
    return NextResponse.json(modelsData);
  } catch (error) {
    console.error('Failed to load models data:', error);
    return NextResponse.json(
      { error: 'Failed to load models data' },
      { status: 500 }
    );
  }
}
