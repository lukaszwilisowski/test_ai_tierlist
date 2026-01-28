import { NextRequest, NextResponse } from "next/server";
import { itemModel } from "./model";
import { CreateItemSchema, UpdateItemSchema } from "./schema";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const items = await itemModel.findAll();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch" },
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
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Validation failed" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create" },
      { status: 500 }
    );
  }
}

export async function GETById(id: string) {
  if (!ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, error: "Invalid ID" },
      { status: 400 }
    );
  }
  try {
    const item = await itemModel.findById(id);
    if (!item) {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, id: string) {
  if (!ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, error: "Invalid ID" },
      { status: 400 }
    );
  }
  try {
    const body = await request.json();
    const validated = UpdateItemSchema.parse(body);
    const item = await itemModel.update(id, validated);
    if (!item) {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Validation failed" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update" },
      { status: 500 }
    );
  }
}

export async function DELETE(id: string) {
  if (!ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, error: "Invalid ID" },
      { status: 400 }
    );
  }
  try {
    const result = await itemModel.delete(id);
    if (!result) {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete" },
      { status: 500 }
    );
  }
}
