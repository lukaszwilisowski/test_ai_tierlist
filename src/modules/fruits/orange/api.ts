import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { itemModel } from "./model";
import { CreateItemSchema, UpdateItemSchema } from "./schema";

function hasXssPayload(value: string) {
  return (
    /<\s*script\b/i.test(value) ||
    /<\s*\/\s*script\s*>/i.test(value) ||
    /javascript:/i.test(value) ||
    /on\w+\s*=/i.test(value)
  );
}

function containsXss(input: { name?: unknown; description?: unknown }) {
  const fields = [input.name, input.description];
  return fields.some((field) =>
    typeof field === "string" ? hasXssPayload(field) : false
  );
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function GET() {
  try {
    const items = await itemModel.findAll();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return jsonError("Failed to fetch items", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body || typeof body !== "object") {
      return jsonError("Invalid request body", 400);
    }

    if (containsXss(body)) {
      return jsonError("Invalid input detected", 400);
    }

    const parsed = CreateItemSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(
        parsed.error.issues[0]?.message || "Validation error",
        400
      );
    }

    const item = await itemModel.create(parsed.data);
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    return jsonError("Failed to create item", 500);
  }
}

export async function GETById(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return jsonError("Invalid item id", 400);
  }

  try {
    const item = await itemModel.findById(id);
    if (!item) {
      return jsonError("Item not found", 404);
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return jsonError("Failed to fetch item", 500);
  }
}

export async function PUT(request: NextRequest, id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return jsonError("Invalid item id", 400);
  }

  try {
    const body = await request.json();

    if (!body || typeof body !== "object") {
      return jsonError("Invalid request body", 400);
    }

    if (containsXss(body)) {
      return jsonError("Invalid input detected", 400);
    }

    const parsed = UpdateItemSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(
        parsed.error.issues[0]?.message || "Validation error",
        400
      );
    }

    const item = await itemModel.update(id, parsed.data);
    if (!item) {
      return jsonError("Item not found", 404);
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return jsonError("Failed to update item", 500);
  }
}

export async function DELETE(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return jsonError("Invalid item id", 400);
  }

  try {
    const item = await itemModel.delete(id);
    if (!item) {
      return jsonError("Item not found", 404);
    }

    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error) {
    return jsonError("Failed to delete item", 500);
  }
}
