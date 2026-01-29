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

const MODEL_NAME = "Jalapeno";
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
  async create(data: any) {
    await connectDB();
    const item = new Item(data);
    return item.save();
  },
  async update(id: string, data: any) {
    await connectDB();
    return Item.findByIdAndUpdate(id, data, { new: true }).lean();
  },
  async delete(id: string) {
    await connectDB();
    return Item.findByIdAndDelete(id).lean();
  },
};
