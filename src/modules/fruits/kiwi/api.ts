import { NextRequest, NextResponse } from "next/server";
import { itemModel } from "./model";
import { CreateItemSchema, UpdateItemSchema } from "./schema";
import mongoose from "mongoose";

// XSS prevention: Check for script tags in input
function containsXSS(value: string): boolean {
  return /<script[\s\S]*?>[\s\S]*?<\/script>/gi.test(value);
}

export async function GET() {
  try {
    const items = await itemModel.findAll();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // XSS prevention
    if (body.name && containsXSS(body.name)) {
      return NextResponse.json(
        { success: false, error: "Invalid input: XSS attempt detected" },
        { status: 400 }
      );
    }
    if (body.description && containsXSS(body.description)) {
      return NextResponse.json(
        { success: false, error: "Invalid input: XSS attempt detected" },
        { status: 400 }
      );
    }

    const validationResult = CreateItemSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: validationResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const item = await itemModel.create(validationResult.data);
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create item" },
      { status: 500 }
    );
  }
}

export async function GETById(id: string) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid ID format" },
        { status: 400 }
      );
    }

    const item = await itemModel.findById(id);
    if (!item) {
      return NextResponse.json(
        { success: false, error: "Item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch item" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, id: string) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid ID format" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // XSS prevention
    if (body.name && containsXSS(body.name)) {
      return NextResponse.json(
        { success: false, error: "Invalid input: XSS attempt detected" },
        { status: 400 }
      );
    }
    if (body.description && containsXSS(body.description)) {
      return NextResponse.json(
        { success: false, error: "Invalid input: XSS attempt detected" },
        { status: 400 }
      );
    }

    const validationResult = UpdateItemSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: validationResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const item = await itemModel.update(id, validationResult.data);
    if (!item) {
      return NextResponse.json(
        { success: false, error: "Item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update item" },
      { status: 500 }
    );
  }
}

export async function DELETE(id: string) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid ID format" },
        { status: 400 }
      );
    }

    const item = await itemModel.delete(id);
    if (!item) {
      return NextResponse.json(
        { success: false, error: "Item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete item" },
      { status: 500 }
    );
  }
}
