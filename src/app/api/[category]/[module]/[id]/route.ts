import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string; module: string; id: string }> }
) {
  try {
    const { category, module, id } = await params;
    const api = await import(`@/modules/${category}/${module}/api`);
    return api.GETById(id);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Module not found' },
      { status: 404 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ category: string; module: string; id: string }> }
) {
  try {
    const { category, module, id } = await params;
    const api = await import(`@/modules/${category}/${module}/api`);
    return api.PUT(request, id);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Module not found' },
      { status: 404 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ category: string; module: string; id: string }> }
) {
  try {
    const { category, module, id } = await params;
    const api = await import(`@/modules/${category}/${module}/api`);
    return api.DELETE(id);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Module not found' },
      { status: 404 }
    );
  }
}
