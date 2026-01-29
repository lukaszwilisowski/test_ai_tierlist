import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { itemModel } from "./model";
import { CreateItemSchema, UpdateItemSchema } from "./schema";

// XSS detection helper
function containsXSS(value: string): boolean {
  const xssPattern = /<script|javascript:|onerror=|onload=/i;
  return xssPattern.test(value);
}

function sanitizeInput(data: any): boolean {
  if (typeof data.name === "string" && containsXSS(data.name)) {
    return false;
  }
  if (typeof data.description === "string" && containsXSS(data.description)) {
    return false;
  }
  return true;
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

    // Check for XSS attempts
    if (!sanitizeInput(body)) {
      return NextResponse.json(
        { success: false, error: "Invalid input: potential XSS detected" },
        { status: 400 }
      );
    }

    // Validate with schema
    const validation = CreateItemSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const item = await itemModel.create(validation.data);
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
    // Validate ObjectId format
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
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid ID format" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Check for XSS attempts
    if (!sanitizeInput(body)) {
      return NextResponse.json(
        { success: false, error: "Invalid input: potential XSS detected" },
        { status: 400 }
      );
    }

    // Validate with schema
    const validation = UpdateItemSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const item = await itemModel.update(id, validation.data);
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
    // Validate ObjectId format
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
