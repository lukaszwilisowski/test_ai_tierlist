# Coding Agent Task

You are participating in a comparison of AI coding agents. Complete the following task.

## Step 1: Pick Your Module Name

1. Read `available-names/fruits.txt`
2. Check `src/modules/fruits/` for existing folders
3. Pick an UNUSED fruit name
4. Use this name for your module

## Step 2: Create Module Files

Create these files in `src/modules/fruits/{your-fruit}/`:

### config.ts
```typescript
const config = {
  displayName: '{YourFruit} Shop',
  description: 'Fresh {fruit} products',
  icon: '🍎', // Use appropriate emoji
};
export default config;
```

### schema.ts
```typescript
import { z } from 'zod';

export const ItemSchema = z.object({
  _id: z.string(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  image: z.string().url().optional(),
  inStock: z.boolean().default(true),
  quantity: z.number().int().min(0).default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateItemSchema = ItemSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateItemSchema = CreateItemSchema.partial();

export type Item = z.infer<typeof ItemSchema>;
export type CreateItem = z.infer<typeof CreateItemSchema>;
export type UpdateItem = z.infer<typeof UpdateItemSchema>;
```

### model.ts
```typescript
import mongoose, { Schema } from 'mongoose';
import connectDB from '@/lib/database/connection';

// Comment required: List files containing 'mongoose': [find them]
// Comment required: MongoDB connection configured at: [find it]

const itemSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String,
  inStock: { type: Boolean, default: true },
  quantity: { type: Number, default: 0 },
}, { timestamps: true });

const MODEL_NAME = '{YourFruit}'; // Capitalize
const Item = mongoose.models[MODEL_NAME] || mongoose.model(MODEL_NAME, itemSchema);

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
  // Fetch from https://api.sampleapis.com/futurama/characters or similar
  // Transform and create items
}
```

### api.ts
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { itemModel } from './model';
import { CreateItemSchema, UpdateItemSchema } from './schema';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const items = await itemModel.findAll();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = CreateItemSchema.parse(body);
    const item = await itemModel.create(validated);
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ success: false, error: 'Validation failed' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Failed to create' }, { status: 500 });
  }
}

export async function GETById(id: string) {
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
  }
  try {
    const item = await itemModel.findById(id);
    if (!item) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, id: string) {
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
  }
  try {
    const body = await request.json();
    const validated = UpdateItemSchema.parse(body);
    const item = await itemModel.update(id, validated);
    if (!item) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ success: false, error: 'Validation failed' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(id: string) {
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
  }
  try {
    const result = await itemModel.delete(id);
    if (!result) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 });
  }
}
```

### components.tsx
```typescript
'use client';
import { useState } from 'react';

export function ItemCard({ item, onDelete }: any) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      {item.image && <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded mb-4" />}
      <h3 className="text-xl font-semibold">{item.name}</h3>
      <p className="text-gray-600">{item.description}</p>
      <div className="flex justify-between items-center mt-4">
        <span className="text-2xl font-bold">${item.price}</span>
        <span className={item.inStock ? 'text-green-600' : 'text-red-600'}>
          {item.inStock ? `In Stock (${item.quantity})` : 'Out of Stock'}
        </span>
      </div>
      <button onClick={() => onDelete(item._id)} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
        Delete
      </button>
    </div>
  );
}

export function ItemList({ items, onDelete }: any) {
  if (!items?.length) return <p className="text-center py-8 text-gray-500">No items yet</p>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item: any) => <ItemCard key={item._id} item={item} onDelete={onDelete} />)}
    </div>
  );
}

export function AddItemForm({ onSubmit, isLoading }: any) {
  const [form, setForm] = useState({ name: '', description: '', price: 0, image: '', inStock: true, quantity: 0 });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ name: '', description: '', price: 0, image: '', inStock: true, quantity: 0 });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg space-y-4">
      <h3 className="text-lg font-semibold">Add New Item</h3>
      <input type="text" placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 border rounded" required />
      <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-3 py-2 border rounded" />
      <input type="number" placeholder="Price" value={form.price} onChange={e => setForm({...form, price: parseFloat(e.target.value)})} className="w-full px-3 py-2 border rounded" required min="0" step="0.01" />
      <input type="url" placeholder="Image URL" value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="w-full px-3 py-2 border rounded" />
      <input type="number" placeholder="Quantity" value={form.quantity} onChange={e => setForm({...form, quantity: parseInt(e.target.value)})} className="w-full px-3 py-2 border rounded" min="0" />
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={form.inStock} onChange={e => setForm({...form, inStock: e.target.checked})} /> In Stock
      </label>
      <button type="submit" disabled={isLoading} className="w-full px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300">
        {isLoading ? 'Adding...' : 'Add Item'}
      </button>
    </form>
  );
}
```

### hooks.ts
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE = '/api/fruits/{yourfruit}'; // lowercase

export function useItems() {
  return useQuery({
    queryKey: ['{yourfruit}', 'items'],
    queryFn: async () => {
      const res = await fetch(API_BASE);
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    },
  });
}

export function useCreateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['{yourfruit}', 'items'] }),
  });
}

export function useDeleteItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['{yourfruit}', 'items'] }),
  });
}
```

## Requirements

### Must Complete
- [ ] All 6 files created
- [ ] CRUD operations work
- [ ] Validation returns 400 for invalid data
- [ ] Invalid ObjectId returns 400 (not 500)
- [ ] UI shows loading states
- [ ] Empty state handled

### Tool Usage Tasks
- [ ] Find all files containing 'mongoose' - add comment in model.ts
- [ ] Find MongoDB connection config - add comment in model.ts
- [ ] Implement seedFromApi() function

### Verification
```bash
npm run build  # Must pass
```
