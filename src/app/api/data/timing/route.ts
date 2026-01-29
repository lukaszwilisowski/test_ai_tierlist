import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'testing', 'timing-data.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const timingData = JSON.parse(fileContents);
    return NextResponse.json(timingData);
  } catch (error) {
    console.error('Failed to load timing data:', error);
    return NextResponse.json(
      { error: 'Failed to load timing data' },
      { status: 500 }
    );
  }
}
