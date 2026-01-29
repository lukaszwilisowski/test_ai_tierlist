import mongoose, { Schema } from "mongoose";
import connectDB from "@/lib/database/connection";
import type { CreateItem, UpdateItem } from "./schema";

// Files containing 'mongoose': src/lib/database/connection.ts, src/types/global.d.ts
// MongoDB connection configured at: src/lib/database/connection.ts
// ObjectId validation method (researched): mongoose.Types.ObjectId.isValid() — https://mongoosejs.com/docs/api/mongoose.html#mongoose_Mongoose-isValidObjectId
// TanStack Query pattern: useQuery({ queryKey: ["items"] }) + invalidateQueries({ queryKey: ["items"] })
// Zod schema pattern: CreateItemSchema = ItemSchema.omit(...); UpdateItemSchema = CreateItemSchema.partial()

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

const MODEL_NAME = "Orange";
const Item =
  mongoose.models[MODEL_NAME] || mongoose.model(MODEL_NAME, itemSchema);

export const itemModel = {
  async findAll() {
    await connectDB();
    return Item.find().sort({ createdAt: -1 }).lean();
  },
  async findById(id: string) {
    await connectDB();
    return Item.findById(id).lean();
  },
  async create(data: CreateItem) {
    await connectDB();
    return Item.create(data);
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
