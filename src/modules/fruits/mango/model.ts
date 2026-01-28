// src/modules/fruits/mango/model.ts

// Files containing 'mongoose': src/types/global.d.ts, src/lib/database/connection.ts,
// package.json, pnpm-lock.yaml, docs/IMPLEMENTATION_PLAN.md, specs/MODEL_SPEC.md,
// specs/CODING_AGENT_SPEC.md, docs/03-CODING-AGENT-SPEC.md, docs/02-MODULE-SYSTEM.md,
// docs/01-PROJECT-SETUP.md, docs/00-ARCHITECTURE.md

// MongoDB connection: The connection is configured in src/lib/database/connection.ts
// It reads the MONGODB_URI environment variable from .env.local (or process.env)
// and implements connection caching using a global mongoose object to avoid
// multiple connections in serverless environments.

import mongoose, { Schema, Document } from 'mongoose';
import connectDB from '@/lib/database/connection';
import type { Item, CreateItem, UpdateItem } from './schema';

interface ItemDocument extends Document {
  name: string;
  description?: string;
  price: number;
  image?: string;
  inStock: boolean;
  quantity: number;
}

const itemSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: String },
    inStock: { type: Boolean, default: true },
    quantity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Use unique model name based on module
const MODEL_NAME = 'Mango';
const ItemModel = mongoose.models[MODEL_NAME] || mongoose.model(MODEL_NAME, itemSchema);

export const itemModel = {
  async findAll(): Promise<Item[]> {
    await connectDB();
    const items = await ItemModel.find({}).sort({ createdAt: -1 });
    return items.map((item) => ({
      _id: item._id.toString(),
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      inStock: item.inStock,
      quantity: item.quantity,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
  },

  async findById(id: string): Promise<Item | null> {
    await connectDB();
    const item = await ItemModel.findById(id);
    if (!item) return null;
    return {
      _id: item._id.toString(),
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      inStock: item.inStock,
      quantity: item.quantity,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  },

  async create(data: CreateItem): Promise<Item> {
    await connectDB();
    const item = await ItemModel.create(data);
    return {
      _id: item._id.toString(),
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      inStock: item.inStock,
      quantity: item.quantity,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  },

  async update(id: string, data: UpdateItem): Promise<Item | null> {
    await connectDB();
    const item = await ItemModel.findByIdAndUpdate(id, data, { new: true });
    if (!item) return null;
    return {
      _id: item._id.toString(),
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      inStock: item.inStock,
      quantity: item.quantity,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  },

  async delete(id: string): Promise<boolean> {
    await connectDB();
    const result = await ItemModel.findByIdAndDelete(id);
    return !!result;
  },
};

// T4: Seed function with external API integration
export async function seedFromApi(): Promise<Item[]> {
  try {
    // Fetch from external API
    const response = await fetch('https://api.sampleapis.com/futurama/characters');
    const data = await response.json();

    // Transform data to match our schema
    // Take first 10 characters and convert them to mango products
    const itemsToCreate = data.slice(0, 10).map((character: any, index: number) => ({
      name: `${character.name.first} ${character.name.last} Mango`,
      description: `A special mango variety inspired by ${character.name.first}`,
      price: Math.round((10 + index * 2.5) * 100) / 100, // Prices from $10 to $32.50
      image: character.images?.main || undefined,
      inStock: true,
      quantity: Math.floor(Math.random() * 50) + 10, // Random quantity 10-59
    }));

    // Create items in database
    const createdItems: Item[] = [];
    for (const itemData of itemsToCreate) {
      const item = await itemModel.create(itemData);
      createdItems.push(item);
    }

    // Return created items
    return createdItems;
  } catch (error) {
    console.error('Failed to seed from API:', error);
    throw new Error('Failed to seed mango items from API');
  }
}
