# Module System

## Overview

Each module is a self-contained product shop implementation. Modules are automatically discovered by scanning the `src/modules/fruits/` and `src/modules/vegetables/` directories.

## Module Structure

Every module must have this exact structure:

```
src/modules/{category}/{name}/
├── config.ts        # Module metadata (REQUIRED)
├── schema.ts        # Zod validation schemas (REQUIRED)
├── model.ts         # Mongoose model (REQUIRED)
├── api.ts           # API handler functions (REQUIRED)
├── components.tsx   # React components (REQUIRED)
└── hooks.ts         # TanStack Query hooks (REQUIRED)
```

## Required Files

### 1. config.ts

Defines module metadata for discovery and display.

```typescript
// src/modules/fruits/apple/config.ts

const config = {
  displayName: 'Apple Shop',
  description: 'Fresh and delicious apples',
  icon: '🍎',
  color: 'red', // Used for theming
};

export default config;
```

### 2. schema.ts

Zod schemas for validation and TypeScript types.

```typescript
// src/modules/fruits/apple/schema.ts

import { z } from 'zod';

// Base item schema
export const ItemSchema = z.object({
  _id: z.string(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  inStock: z.boolean().default(true),
  quantity: z.number().int().min(0).default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Schema for creating new items (omit auto-generated fields)
export const CreateItemSchema = ItemSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

// Schema for updating items (all fields optional)
export const UpdateItemSchema = CreateItemSchema.partial();

// TypeScript types
export type Item = z.infer<typeof ItemSchema>;
export type CreateItem = z.infer<typeof CreateItemSchema>;
export type UpdateItem = z.infer<typeof UpdateItemSchema>;
```

### 3. model.ts

Mongoose model for database operations.

```typescript
// src/modules/fruits/apple/model.ts

import mongoose, { Schema, Document } from 'mongoose';
import connectDB from '@/lib/database/connection';
import type { Item, CreateItem, UpdateItem } from './schema';

interface ItemDocument extends Document {
  name: string;
  description?: string;
  price: number;
  inStock: boolean;
  quantity: number;
}

const itemSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    inStock: { type: Boolean, default: true },
    quantity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Use unique model name based on module
const MODEL_NAME = 'Apple'; // Capitalized module name
const Item = mongoose.models[MODEL_NAME] || mongoose.model(MODEL_NAME, itemSchema);

export const itemModel = {
  async findAll(): Promise<Item[]> {
    await connectDB();
    const items = await Item.find({}).sort({ createdAt: -1 });
    return items.map((item) => ({
      _id: item._id.toString(),
      name: item.name,
      description: item.description,
      price: item.price,
      inStock: item.inStock,
      quantity: item.quantity,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
  },

  async findById(id: string): Promise<Item | null> {
    await connectDB();
    const item = await Item.findById(id);
    if (!item) return null;
    return {
      _id: item._id.toString(),
      name: item.name,
      description: item.description,
      price: item.price,
      inStock: item.inStock,
      quantity: item.quantity,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  },

  async create(data: CreateItem): Promise<Item> {
    await connectDB();
    const item = await Item.create(data);
    return {
      _id: item._id.toString(),
      name: item.name,
      description: item.description,
      price: item.price,
      inStock: item.inStock,
      quantity: item.quantity,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  },

  async update(id: string, data: UpdateItem): Promise<Item | null> {
    await connectDB();
    const item = await Item.findByIdAndUpdate(id, data, { new: true });
    if (!item) return null;
    return {
      _id: item._id.toString(),
      name: item.name,
      description: item.description,
      price: item.price,
      inStock: item.inStock,
      quantity: item.quantity,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  },

  async delete(id: string): Promise<boolean> {
    await connectDB();
    const result = await Item.findByIdAndDelete(id);
    return !!result;
  },
};
```

### 4. api.ts

API handler functions used by the dynamic routes.

```typescript
// src/modules/fruits/apple/api.ts

import { NextRequest, NextResponse } from 'next/server';
import { itemModel } from './model';
import { CreateItemSchema, UpdateItemSchema } from './schema';

export async function GET() {
  try {
    const items = await itemModel.findAll();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error('Failed to fetch items:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = CreateItemSchema.parse(body);
    const item = await itemModel.create(validated);
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.message },
        { status: 400 }
      );
    }
    console.error('Failed to create item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create item' },
      { status: 500 }
    );
  }
}

export async function GETById(id: string) {
  try {
    const item = await itemModel.findById(id);
    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error('Failed to fetch item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch item' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, id: string) {
  try {
    const body = await request.json();
    const validated = UpdateItemSchema.parse(body);
    const item = await itemModel.update(id, validated);
    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.message },
        { status: 400 }
      );
    }
    console.error('Failed to update item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update item' },
      { status: 500 }
    );
  }
}

export async function DELETE(id: string) {
  try {
    const deleted = await itemModel.delete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, message: 'Item deleted' });
  } catch (error) {
    console.error('Failed to delete item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete item' },
      { status: 500 }
    );
  }
}
```

### 5. components.tsx

React components for the module UI.

```typescript
// src/modules/fruits/apple/components.tsx

'use client';

import { useState } from 'react';
import type { Item, CreateItem } from './schema';

interface ItemCardProps {
  item: Item;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: Partial<Item>) => void;
}

export function ItemCard({ item, onDelete, onUpdate }: ItemCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="text-6xl text-center mb-4">🍎</div>
      <h3 className="text-xl font-semibold">{item.name}</h3>
      {item.description && (
        <p className="text-gray-600 mt-2">{item.description}</p>
      )}
      <div className="flex justify-between items-center mt-4">
        <span className="text-2xl font-bold">${item.price}</span>
        <span
          className={`px-2 py-1 rounded text-sm ${
            item.inStock
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {item.inStock ? `In Stock (${item.quantity})` : 'Out of Stock'}
        </span>
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onDelete(item._id)}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

interface ItemListProps {
  items: Item[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: Partial<Item>) => void;
}

export function ItemList({ items, onDelete, onUpdate }: ItemListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No items yet. Add your first item!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <ItemCard
          key={item._id}
          item={item}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}

interface AddItemFormProps {
  onSubmit: (data: CreateItem) => void;
  isLoading: boolean;
}

export function AddItemForm({ onSubmit, isLoading }: AddItemFormProps) {
  const [formData, setFormData] = useState<CreateItem>({
    name: '',
    description: '',
    price: undefined as any,
    inStock: true,
    quantity: undefined as any,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: '',
      description: '',
      price: undefined as any,
      inStock: true,
      quantity: undefined as any,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Add New Item</h3>
      <div className="grid gap-4">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="px-3 py-2 border rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="px-3 py-2 border rounded"
        />
        <input
          type="number"
          placeholder="Price"
          value={formData.price || ''}
          onChange={(e) =>
            setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
          }
          className="px-3 py-2 border rounded"
          required
          min="0"
          step="0.01"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={formData.quantity || ''}
          onChange={(e) =>
            setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })
          }
          className="px-3 py-2 border rounded"
          min="0"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.inStock}
            onChange={(e) =>
              setFormData({ ...formData, inStock: e.target.checked })
            }
          />
          In Stock
        </label>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isLoading ? 'Adding...' : 'Add Item'}
        </button>
      </div>
    </form>
  );
}
```

### 6. hooks.ts

TanStack Query hooks for data fetching.

```typescript
// src/modules/fruits/apple/hooks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Item, CreateItem, UpdateItem } from './schema';

const API_BASE = '/api/fruits/apple'; // Adjust based on module location

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export function useItems() {
  return useQuery({
    queryKey: ['apple', 'items'],
    queryFn: async (): Promise<Item[]> => {
      const res = await fetch(API_BASE);
      const json: ApiResponse<Item[]> = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data!;
    },
  });
}

export function useItem(id: string) {
  return useQuery({
    queryKey: ['apple', 'items', id],
    queryFn: async (): Promise<Item> => {
      const res = await fetch(`${API_BASE}/${id}`);
      const json: ApiResponse<Item> = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data!;
    },
    enabled: !!id,
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateItem): Promise<Item> => {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json: ApiResponse<Item> = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apple', 'items'] });
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateItem;
    }): Promise<Item> => {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json: ApiResponse<Item> = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data!;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['apple', 'items'] });
      queryClient.invalidateQueries({
        queryKey: ['apple', 'items', variables.id],
      });
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
      });
      const json: ApiResponse<void> = await res.json();
      if (!json.success) throw new Error(json.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apple', 'items'] });
    },
  });
}
```

## Dynamic API Routes

The application uses catch-all routes to handle module APIs.

**src/app/api/[category]/[module]/route.ts**:
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string; module: string } }
) {
  try {
    const { category, module } = params;
    const api = await import(`@/modules/${category}/${module}/api`);
    return api.GET();
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Module not found' },
      { status: 404 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { category: string; module: string } }
) {
  try {
    const { category, module } = params;
    const api = await import(`@/modules/${category}/${module}/api`);
    return api.POST(request);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Module not found' },
      { status: 404 }
    );
  }
}
```

**src/app/api/[category]/[module]/[id]/route.ts**:
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string; module: string; id: string } }
) {
  try {
    const { category, module, id } = params;
    const api = await import(`@/modules/${category}/${module}/api`);
    return api.GETById(id);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Module not found' },
      { status: 404 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { category: string; module: string; id: string } }
) {
  try {
    const { category, module, id } = params;
    const api = await import(`@/modules/${category}/${module}/api`);
    return api.PUT(request, id);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Module not found' },
      { status: 404 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { category: string; module: string; id: string } }
) {
  try {
    const { category, module, id } = params;
    const api = await import(`@/modules/${category}/${module}/api`);
    return api.DELETE(id);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Module not found' },
      { status: 404 }
    );
  }
}
```

## Dynamic Pages

**src/app/[category]/[module]/page.tsx**:
```typescript
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface PageProps {
  params: { category: string; module: string };
}

export default function ModulePage({ params }: PageProps) {
  const { category, module } = params;
  const [ModuleComponents, setModuleComponents] = useState<any>(null);
  const [hooks, setHooks] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    // Dynamically load module
    Promise.all([
      import(`@/modules/${category}/${module}/components`),
      import(`@/modules/${category}/${module}/hooks`),
      import(`@/modules/${category}/${module}/config`),
    ]).then(([components, hooksModule, configModule]) => {
      setModuleComponents(components);
      setHooks(hooksModule);
      setConfig(configModule.default);
    });
  }, [category, module]);

  if (!ModuleComponents || !hooks || !config) {
    return <div className="p-8 text-center">Loading module...</div>;
  }

  return <ModulePageContent config={config} Components={ModuleComponents} hooks={hooks} />;
}

function ModulePageContent({ config, Components, hooks }: any) {
  const { data: items, isLoading } = hooks.useItems();
  const createMutation = hooks.useCreateItem();
  const deleteMutation = hooks.useDeleteItem();
  const updateMutation = hooks.useUpdateItem();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <span>{config.icon}</span>
            {config.displayName}
          </h1>
          <p className="text-gray-600">{config.description}</p>
        </div>
        <Link href="/" className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
          Back to Home
        </Link>
      </div>

      <div className="mb-8">
        <Components.AddItemForm
          onSubmit={(data: any) => createMutation.mutate(data)}
          isLoading={createMutation.isPending}
        />
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading items...</div>
      ) : (
        <Components.ItemList
          items={items || []}
          onDelete={(id: string) => deleteMutation.mutate(id)}
          onUpdate={(id: string, data: any) => updateMutation.mutate({ id, data })}
        />
      )}
    </div>
  );
}
```

## Summary

The module system provides:

1. **Auto-discovery** - No central registration needed
2. **Isolation** - Each module is completely independent
3. **Consistency** - All modules follow the same structure
4. **Type safety** - Zod schemas provide validation and types
5. **Easy testing** - Standardized API endpoints
