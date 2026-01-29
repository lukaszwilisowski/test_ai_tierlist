import { z } from "zod";

export const ItemSchema = z.object({
  _id: z.string(),
  name: z
    .string()
    .min(1, "Name is required")
    .refine((value) => value.trim().length > 0, "Name is required")
    .refine(
      (value) => !/<script[\s\S]*?>[\s\S]*?<\/script>/i.test(value),
      "Invalid name"
    ),
  description: z
    .string()
    .optional()
    .refine(
      (value) => value === undefined || !/<script[\s\S]*?>[\s\S]*?<\/script>/i.test(value),
      "Invalid description"
    ),
  price: z
    .number()
    .positive("Price must be positive")
    .refine((value) => value > 0, "Price must be positive"),
  inStock: z.boolean().default(true),
  quantity: z
    .number()
    .int("Quantity must be an integer")
    .min(0, "Quantity must be at least 0")
    .default(0),
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
