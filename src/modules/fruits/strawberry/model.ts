import mongoose, { Schema } from 'mongoose';
import connectDB from '@/lib/database/connection';
import type { CreateItem, UpdateItem } from './schema';

// Files containing 'mongoose': src/lib/database/connection.ts, src/types/global.d.ts, src/modules/fruits/strawberry/model.ts
// MongoDB connection configured at: src/lib/database/connection.ts
// ObjectId validation method (researched): mongoose.Types.ObjectId.isValid() https://mongoosejs.com/docs/api/types.html#types-objectid-isvalid
// TanStack Query pattern: queryKey uses ["{module}", "items"] with invalidation via queryClient.invalidateQueries
// Zod schema pattern: CreateItemSchema = ItemSchema.omit({ _id, createdAt, updatedAt }); UpdateItemSchema = CreateItemSchema.partial()

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

const MODEL_NAME = 'Strawberry';
const Item = mongoose.models[MODEL_NAME] || mongoose.model(MODEL_NAME, itemSchema);

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
    const created = await Item.create(data);
    return created.toObject();
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
