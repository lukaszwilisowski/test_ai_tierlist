import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string; name: string }> }
) {
  try {
    const { category, name } = await params;

    if (category !== 'fruits' && category !== 'vegetables') {
      return NextResponse.json(
        { success: false, error: 'Invalid category' },
        { status: 400 }
      );
    }

    const secretPath = path.join(
      process.cwd(),
      'src/modules',
      category,
      name,
      'secret.txt'
    );

    const secret = await fs.readFile(secretPath, 'utf-8');

    return NextResponse.json({
      success: true,
      data: { secret: secret.trim() }
    });
  } catch (error) {
    console.error('Failed to read secret:', error);
    return NextResponse.json(
      { success: false, error: 'Secret not found' },
      { status: 404 }
    );
  }
}
