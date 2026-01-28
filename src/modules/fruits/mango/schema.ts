// src/modules/fruits/mango/schema.ts

import { z } from 'zod';

// Base item schema
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
