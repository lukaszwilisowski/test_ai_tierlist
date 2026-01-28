import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'coding-agents.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const agentsData = JSON.parse(fileContents);
    return NextResponse.json(agentsData);
  } catch (error) {
    console.error('Failed to load agents data:', error);
    return NextResponse.json(
      { error: 'Failed to load agents data' },
      { status: 500 }
    );
  }
}
