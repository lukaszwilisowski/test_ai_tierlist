import { NextRequest, NextResponse } from "next/server";
import { itemModel } from "./model";
import { CreateItemSchema, UpdateItemSchema } from "./schema";
import { ObjectId } from "mongodb";
import { z } from "zod";

export async function GET() {
  try {
    const data = await itemModel.findAll();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CreateItemSchema.parse(body);
    const newItem = await itemModel.create(validatedData);
    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: (error as any).errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message },
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
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
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
    const validatedData = UpdateItemSchema.parse(body);
    const updatedItem = await itemModel.update(id, validatedData);

    if (!updatedItem) {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedItem });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: (error as any).errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message },
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
    const deletedItem = await itemModel.delete(id);
    if (!deletedItem) {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
