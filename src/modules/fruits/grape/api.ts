import { NextRequest, NextResponse } from "next/server";
import { itemModel } from "./model";
import { CreateItemSchema, UpdateItemSchema } from "./schema";
import mongoose from "mongoose";

// XSS prevention helper
function containsScriptTags(str: string): boolean {
  return /<script[\s\S]*?>[\s\S]*?<\/script>/gi.test(str);
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
    if (body.name && containsScriptTags(body.name)) {
      return NextResponse.json(
        { success: false, error: "Invalid input: script tags not allowed" },
        { status: 400 }
      );
    }
    if (body.description && containsScriptTags(body.description)) {
      return NextResponse.json(
        { success: false, error: "Invalid input: script tags not allowed" },
        { status: 400 }
      );
    }
    
    const validated = CreateItemSchema.parse(body);
    const item = await itemModel.create(validated);
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create item" },
      { status: 500 }
    );
  }
}

export async function GETById(id: string) {
  if (!mongoose.isObjectIdOrHexString(id)) {
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
      { success: false, error: "Failed to fetch item" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, id: string) {
  if (!mongoose.isObjectIdOrHexString(id)) {
    return NextResponse.json(
      { success: false, error: "Invalid ID" },
      { status: 400 }
    );
  }
  
  try {
    const body = await request.json();
    
    // XSS prevention
    if (body.name && containsScriptTags(body.name)) {
      return NextResponse.json(
        { success: false, error: "Invalid input: script tags not allowed" },
        { status: 400 }
      );
    }
    if (body.description && containsScriptTags(body.description)) {
      return NextResponse.json(
        { success: false, error: "Invalid input: script tags not allowed" },
        { status: 400 }
      );
    }
    
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
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update item" },
      { status: 500 }
    );
  }
}

export async function DELETE(id: string) {
  if (!mongoose.isObjectIdOrHexString(id)) {
    return NextResponse.json(
      { success: false, error: "Invalid ID" },
      { status: 400 }
    );
  }
  
  try {
    const item = await itemModel.delete(id);
    if (!item) {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete item" },
      { status: 500 }
    );
  }
}
