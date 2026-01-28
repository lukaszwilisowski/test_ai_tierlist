import mongoose, { Schema } from "mongoose";
import connectDB from "@/lib/database/connection";

// Comment required: List files containing 'mongoose': src/types/global.d.ts, src/lib/database/connection.ts
// Comment required: MongoDB connection configured at: src/lib/database/connection.ts

const itemSchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    inStock: { type: Boolean, default: true },
    quantity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const MODEL_NAME = "Mango";
const Item =
  mongoose.models[MODEL_NAME] || mongoose.model(MODEL_NAME, itemSchema);

export const itemModel = {
  async findAll() {
    await connectDB();
    return Item.find({}).sort({ createdAt: -1 });
  },
  async findById(id: string) {
    await connectDB();
    return Item.findById(id);
  },
  async create(data: any) {
    await connectDB();
    return Item.create(data);
  },
  async update(id: string, data: any) {
    await connectDB();
    return Item.findByIdAndUpdate(id, data, { new: true });
  },
  async delete(id: string) {
    await connectDB();
    return Item.findByIdAndDelete(id);
  },
};

// Bonus: Seed function fetching from public API
export async function seedFromApi() {
  await connectDB();

  // Fetch from public API
  const response = await fetch("https://api.sampleapis.com/futurama/characters");
  const characters = await response.json();

  // Transform first 5 characters into mango products
  const items = characters.slice(0, 5).map((char: any, index: number) => ({
    name: `${char.name.first} ${char.name.last} Mango`,
    description: `Premium mango inspired by ${char.occupation}`,
    price: Math.round((index + 1) * 2.99 * 100) / 100,
    inStock: true,
    quantity: Math.floor(Math.random() * 50) + 10,
  }));

  // Create items
  for (const item of items) {
    await itemModel.create(item);
  }

  return items;
}
