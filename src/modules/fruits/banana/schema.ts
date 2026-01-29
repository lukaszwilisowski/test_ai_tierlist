import { z } from "zod";

// ItemSchema with all fields
export const ItemSchema = z.object({
  _id: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  inStock: z.boolean().default(true),
  quantity: z.number().int().min(0, "Quantity cannot be negative").default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// CreateItemSchema - omit _id, createdAt, updatedAt
export const CreateItemSchema = ItemSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

// UpdateItemSchema - all fields optional
export const UpdateItemSchema = CreateItemSchema.partial();

// TypeScript types
export type Item = z.infer<typeof ItemSchema>;
export type CreateItem = z.infer<typeof CreateItemSchema>;
export type UpdateItem = z.infer<typeof UpdateItemSchema>;
