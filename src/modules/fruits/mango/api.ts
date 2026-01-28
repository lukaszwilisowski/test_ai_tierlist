// src/modules/fruits/mango/api.ts

import { NextRequest, NextResponse } from 'next/server';
import { itemModel, seedFromApi } from './model';
import { CreateItemSchema, UpdateItemSchema } from './schema';

export async function GET() {
  try {
    const items = await itemModel.findAll();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error('Failed to fetch mango items:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch mango items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = CreateItemSchema.parse(body);
    const item = await itemModel.create(validated);
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.message },
        { status: 400 }
      );
    }
    console.error('Failed to create mango item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create mango item' },
      { status: 500 }
    );
  }
}

export async function GETById(id: string) {
  try {
    const item = await itemModel.findById(id);
    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Mango item not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error('Failed to fetch mango item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch mango item' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, id: string) {
  try {
    const body = await request.json();
    const validated = UpdateItemSchema.parse(body);
    const item = await itemModel.update(id, validated);
    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Mango item not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.message },
        { status: 400 }
      );
    }
    console.error('Failed to update mango item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update mango item' },
      { status: 500 }
    );
  }
}

export async function DELETE(id: string) {
  try {
    const deleted = await itemModel.delete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Mango item not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, message: 'Mango item deleted' });
  } catch (error) {
    console.error('Failed to delete mango item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete mango item' },
      { status: 500 }
    );
  }
}

// Seed endpoint handler
export async function SEED() {
  try {
    const items = await seedFromApi();
    return NextResponse.json({
      success: true,
      data: items,
      message: `Successfully seeded ${items.length} mango items`,
    });
  } catch (error) {
    console.error('Failed to seed mango items:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed mango items from API' },
      { status: 500 }
    );
  }
}
