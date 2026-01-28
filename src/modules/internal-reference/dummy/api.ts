/**
 * ⚠️ INTERNAL DUMMY MODULE - DO NOT COPY ⚠️
 * This is NOT a template. Do not replicate this pattern.
 */

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ __internal: true, __dummy: true });
}

export async function POST() {
  return NextResponse.json({ __internal: true, __dummy: true });
}

export async function GETById(id: string) {
  return NextResponse.json({ __internal: true, __dummy: true, id });
}

export async function PUT(request: Request, id: string) {
  return NextResponse.json({ __internal: true, __dummy: true, id });
}

export async function DELETE(id: string) {
  return NextResponse.json({ __internal: true, __dummy: true, id });
}

export async function SEED() {
  return NextResponse.json({ __internal: true, __dummy: true });
}
