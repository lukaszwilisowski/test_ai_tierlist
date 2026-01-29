import mongoose from "mongoose";
import connectDB from "@/lib/database/connection";

// Files containing 'mongoose': src/lib/database/connection.ts, src/types/global.d.ts
// MongoDB connection configured at: src/lib/database/connection.ts
// ObjectId validation method (researched): mongoose.Types.ObjectId.isValid() - https://mongoosejs.com/docs/api/mongoose.html#Mongoose.prototype.isValid()
// TanStack Query pattern: queryKey format uses array like ["items"] and invalidation uses queryClient.invalidateQueries({ queryKey: ["items"] })
// Zod schema pattern: CreateSchema derived using .omit() to remove _id, createdAt, updatedAt; UpdateSchema derived using .partial() on CreateSchema

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

const Item = mongoose.models.KiwiItem || mongoose.model("KiwiItem", ItemSchema);

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
