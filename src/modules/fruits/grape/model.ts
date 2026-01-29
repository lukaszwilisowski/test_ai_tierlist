import mongoose, { Schema } from "mongoose";
import connectDB from "@/lib/database/connection";

// Discovery findings:
// Files containing 'mongoose': src/lib/database/connection.ts, src/types/global.d.ts
// MongoDB connection configured at: src/lib/database/connection.ts
// ObjectId validation method (researched): mongoose.isObjectIdOrHexString() - https://stackoverflow.com/questions/14940660/whats-mongoose-error-cast-to-objectid-failed-for-value-xxx-at-path-id
// TanStack Query pattern: queryKey format is ["{fruit}", "items"], invalidation uses queryClient.invalidateQueries
// Zod schema pattern: CreateItemSchema = ItemSchema.omit({ _id, createdAt, updatedAt }), UpdateItemSchema = CreateItemSchema.partial()

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

const MODEL_NAME = "Grape";
const Item =
  mongoose.models[MODEL_NAME] || mongoose.model(MODEL_NAME, itemSchema);

export const itemModel = {
  async findAll() {
    await connectDB();
    return await Item.find({}).sort({ createdAt: -1 });
  },
  async findById(id: string) {
    await connectDB();
    return await Item.findById(id);
  },
  async create(data: any) {
    await connectDB();
    const item = new Item(data);
    return await item.save();
  },
  async update(id: string, data: any) {
    await connectDB();
    return await Item.findByIdAndUpdate(id, data, { new: true });
  },
  async delete(id: string) {
    await connectDB();
    return await Item.findByIdAndDelete(id);
  },
};
