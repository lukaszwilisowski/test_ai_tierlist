import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ category: string; module: string }> }
) {
  try {
    const { category, module } = await params;
    const api = await import(`@/modules/${category}/${module}/api`);

    // Check if SEED handler exists
    if (typeof api.SEED === 'function') {
      return api.SEED();
    }

    return NextResponse.json(
      { success: false, error: 'Seed endpoint not available for this module' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Seed endpoint error:', error);
    return NextResponse.json(
      { success: false, error: 'Module not found or seed failed' },
      { status: 404 }
    );
  }
}
