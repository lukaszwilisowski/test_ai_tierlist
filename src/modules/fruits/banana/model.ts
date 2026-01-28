import mongoose, { Schema } from "mongoose";
import connectDB from "@/lib/database/connection";

// Comment required: List files containing 'mongoose': src/modules/fruits/mango/model.ts, src/lib/database/connection.ts, src/types/global.d.ts, package.json
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

const MODEL_NAME = "Banana";
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
  try {
    await connectDB();
    const response = await fetch(
      "https://api.sampleapis.com/futurama/characters"
    );
    const characters = await response.json();

    // Transform Futurama characters into banana items
    const items = characters.slice(0, 5).map((char: any) => ({
      name: `${char.name.first} ${char.name.last} Banana`,
      description: `Banana themed after ${char.occupation}`,
      price: Math.random() * 10 + 1,
      inStock: Math.random() > 0.3,
      quantity: Math.floor(Math.random() * 50),
    }));

    // Create items in database
    for (const item of items) {
      await itemModel.create(item);
    }

    return items;
  } catch (error) {
    console.error("Failed to seed from API:", error);
    throw error;
  }
}
