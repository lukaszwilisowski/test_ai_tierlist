import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { itemModel } from './model';
import { CreateItemSchema, UpdateItemSchema } from './schema';

const containsScriptTag = (value?: string) =>
  typeof value === 'string' && /<\s*script\b/i.test(value);

const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

export async function GET() {
  try {
    const items = await itemModel.findAll();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error('Failed to fetch items:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as unknown;
    const parsed = CreateItemSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid data' },
        { status: 400 }
      );
    }

    const { name, description } = parsed.data;
    if (containsScriptTag(name) || containsScriptTag(description)) {
      return NextResponse.json(
        { success: false, error: 'Invalid input' },
        { status: 400 }
      );
    }

    const created = await itemModel.create(parsed.data);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Failed to create item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create item' },
      { status: 500 }
    );
  }
}

export async function GETById(id: string) {
  if (!isValidObjectId(id)) {
    return NextResponse.json(
      { success: false, error: 'Invalid ID' },
      { status: 400 }
    );
  }

  try {
    const item = await itemModel.findById(id);
    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error('Failed to fetch item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch item' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, id: string) {
  if (!isValidObjectId(id)) {
    return NextResponse.json(
      { success: false, error: 'Invalid ID' },
      { status: 400 }
    );
  }

  try {
    const body = (await request.json()) as unknown;
    const parsed = UpdateItemSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid data' },
        { status: 400 }
      );
    }

    const { name, description } = parsed.data;
    if (containsScriptTag(name) || containsScriptTag(description)) {
      return NextResponse.json(
        { success: false, error: 'Invalid input' },
        { status: 400 }
      );
    }

    const updated = await itemModel.update(id, parsed.data);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Failed to update item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update item' },
      { status: 500 }
    );
  }
}

export async function DELETE(id: string) {
  if (!isValidObjectId(id)) {
    return NextResponse.json(
      { success: false, error: 'Invalid ID' },
      { status: 400 }
    );
  }

  try {
    const deleted = await itemModel.delete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (error) {
    console.error('Failed to delete item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete item' },
      { status: 500 }
    );
  }
}
