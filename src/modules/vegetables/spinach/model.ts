import mongoose, { Schema } from "mongoose";
import connectDB from "@/lib/database/connection";

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

const MODEL_NAME = "Spinach";
const Item =
  mongoose.models[MODEL_NAME] || mongoose.model(MODEL_NAME, itemSchema);

export const itemModel = {
  async findAll() {
    await connectDB();
    return await Item.find({}).sort({ createdAt: -1 }).lean();
  },
  async findById(id: string) {
    await connectDB();
    return await Item.findById(id).lean();
  },
  async create(data: any) {
    await connectDB();
    const newItem = await Item.create(data);
    return newItem.toObject();
  },
  async update(id: string, data: any) {
    await connectDB();
    return await Item.findByIdAndUpdate(id, data, { new: true }).lean();
  },
  async delete(id: string) {
    await connectDB();
    return await Item.findByIdAndDelete(id).lean();
  },
};
