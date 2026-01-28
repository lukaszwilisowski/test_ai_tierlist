import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string; module: string }> }
) {
  try {
    const { category, module } = await params;
    const api = await import(`@/modules/${category}/${module}/api`);
    return api.GET();
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Module not found' },
      { status: 404 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ category: string; module: string }> }
) {
  try {
    const { category, module } = await params;
    const api = await import(`@/modules/${category}/${module}/api`);
    return api.POST(request);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Module not found' },
      { status: 404 }
    );
  }
}
