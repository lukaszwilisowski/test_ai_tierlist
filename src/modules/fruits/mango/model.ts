import mongoose, { Schema } from "mongoose";
import connectDB from "@/lib/database/connection";

// Files containing 'mongoose':
// - src/lib/database/connection.ts
// - src/types/global.d.ts
// - specs/MODEL_SPEC.md
// - specs/CODING_AGENT_SPEC.md

// MongoDB connection configured at: src/lib/database/connection.ts:15-30

// ObjectId validation method (researched): mongoose.isObjectIdOrHexString()
// Source: https://mongoosejs.com/docs/api/mongoose.html#Mongoose.prototype.isValidObjectId()
// This is the strictest validation method for 2025 - only accepts ObjectId instances or 24-char hex strings

// TanStack Query pattern:
// - queryKey format: [moduleName, resourceType] e.g. ["mango", "items"]
// - invalidation approach: useQueryClient().invalidateQueries() in onSuccess callbacks

// Zod schema pattern:
// - ItemSchema: Full schema with all fields including _id, timestamps
// - CreateItemSchema: ItemSchema.omit({ _id, createdAt, updatedAt })
// - UpdateItemSchema: CreateItemSchema.partial()

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
    return Item.find({}).sort({ createdAt: -1 }).lean();
  },
  async findById(id: string) {
    await connectDB();
    return Item.findById(id).lean();
  },
  async create(data: CreateItem) {
    await connectDB();
    const item = new Item(data);
    return item.save();
  },
  async update(id: string, data: UpdateItem) {
    await connectDB();
    return Item.findByIdAndUpdate(id, data, { new: true }).lean();
  },
  async delete(id: string) {
    await connectDB();
    return Item.findByIdAndDelete(id).lean();
  },
};

type CreateItem = {
  name: string;
  description?: string;
  price: number;
  inStock?: boolean;
  quantity?: number;
};

type UpdateItem = Partial<CreateItem>;
