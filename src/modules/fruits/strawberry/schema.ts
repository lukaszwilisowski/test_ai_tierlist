import { z } from 'zod';

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

export const CreateItemSchema = ItemSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateItemSchema = CreateItemSchema.partial();

export type Item = z.infer<typeof ItemSchema>;
export type CreateItem = z.infer<typeof CreateItemSchema>;
export type UpdateItem = z.infer<typeof UpdateItemSchema>;
