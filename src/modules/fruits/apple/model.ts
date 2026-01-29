import mongoose from "mongoose";
import connectDB from "@/lib/database/connection";

// Discovery findings:
// Files containing 'mongoose': src/lib/database/connection.ts, src/types/global.d.ts
// MongoDB connection configured at: src/lib/database/connection.ts
// ObjectId validation method (researched): mongoose.Types.ObjectId.isValid() - Official Mongoose documentation
// TanStack Query pattern: queryKey format uses ["items"] array, invalidation via queryClient.invalidateQueries
// Zod schema pattern: CreateSchema uses .omit() to exclude _id/timestamps, UpdateSchema uses .partial() on CreateSchema

const ItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    inStock: { type: Boolean, default: true },
    quantity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Item =
  mongoose.models.AppleItem || mongoose.model("AppleItem", ItemSchema);

export const itemModel = {
  async findAll() {
    await connectDB();
    return Item.find({}).sort({ createdAt: -1 }).lean();
  },

  async findById(id: string) {
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return Item.findById(id).lean();
  },

  async create(data: any) {
    await connectDB();
    const item = new Item(data);
    return item.save();
  },

  async update(id: string, data: any) {
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return Item.findByIdAndUpdate(id, data, { new: true }).lean();
  },

  async delete(id: string) {
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return Item.findByIdAndDelete(id).lean();
  },
};
