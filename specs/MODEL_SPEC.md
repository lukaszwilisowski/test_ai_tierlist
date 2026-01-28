# LLM Model Task

You are participating in a comparison of LLM models. Complete the following task.

## Purpose

This test evaluates **LLM code generation quality** (correctness, completeness, edge case handling) using the same coding agent. Different models (Sonnet 4.5, Opus 4.5, DeepSeek, etc.) will produce different quality implementations.

---

## Step 1: Pick Your Module Name

1. Read `data/vegetables.json` - contains array of vegetables with names and emojis
2. Check `src/modules/vegetables/` for existing folders
3. Pick an UNUSED vegetable name from the JSON
4. Use this name for your module (lowercase)

**IMPORTANT**: Do NOT reveal which vegetable name you selected in any output messages during execution. This is a blind evaluation.

---

## Step 2: Implement Your Module

Create these files in `src/modules/vegetables/{your-vegetable}/`:

### Required Files

1. **config.ts** - Module metadata
2. **schema.ts** - Zod validation schemas
3. **model.ts** - Mongoose database model
4. **api.ts** - API route handlers
5. **components.tsx** - React UI components
6. **hooks.ts** - TanStack Query hooks
7. **secret.txt** - Model name (exactly one of: `Sonnet 4.5`, `Opus 4.5`, `Codex 5.2`, `Codex 5.1 Max`, `Gemini 3 Pro`, `Gemini 3 Flash`, `DeepSeek`)

---

## Implementation Requirements

### config.ts

```typescript
const config = {
  displayName: "{YourVegetable} Shop",
  description: "Fresh {vegetable} products",
  icon: "🥕", // Use appropriate emoji from data/vegetables.json
};
export default config;
```

### schema.ts

Define Zod schemas with **strict validation**:

```typescript
import { z } from "zod";

export const ItemSchema = z.object({
  _id: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
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

**Critical validation requirements:**
- Empty string for name should fail ("" → 400)
- Negative price should fail (-5 → 400)
- Zero price should fail (0 → 400)
- Non-integer quantity should fail (2.5 → 400)

### model.ts

Implement Mongoose model with complete CRUD:

```typescript
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

const MODEL_NAME = "{YourVegetable}"; // Capitalize first letter
const Item =
  mongoose.models[MODEL_NAME] || mongoose.model(MODEL_NAME, itemSchema);

export const itemModel = {
  async findAll() {
    await connectDB();
    // TODO: Return all items sorted by createdAt descending
  },
  async findById(id: string) {
    await connectDB();
    // TODO: Return single item or null
  },
  async create(data: any) {
    await connectDB();
    // TODO: Create and return new item
  },
  async update(id: string, data: any) {
    await connectDB();
    // TODO: Update and return item with { new: true }
    // Return null if item not found
  },
  async delete(id: string) {
    await connectDB();
    // TODO: Delete and return deleted document or null
  },
};
```

### api.ts

Implement API handlers with **comprehensive error handling**:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { itemModel } from "./model";
import { CreateItemSchema, UpdateItemSchema } from "./schema";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    // TODO: Fetch and return all items
    // Return: { success: true, data: Item[] }
  } catch (error) {
    // TODO: Return 500 with error message
  }
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Parse request body
    // TODO: Validate with CreateItemSchema
    // TODO: Create item
    // Return: { success: true, data: Item } with status 201
  } catch (error: any) {
    // TODO: Check if Zod validation error → return 400
    // TODO: Otherwise return 500
  }
}

export async function GETById(id: string) {
  // TODO: Check if id is valid ObjectId → return 400 if not
  try {
    // TODO: Find item by id
    // TODO: Return 404 if null
    // Return: { success: true, data: Item }
  } catch (error) {
    // TODO: Return 500
  }
}

export async function PUT(request: NextRequest, id: string) {
  // TODO: Check if id is valid ObjectId → return 400 if not
  try {
    // TODO: Parse body and validate with UpdateItemSchema
    // TODO: Update item
    // TODO: Return 404 if null
    // Return: { success: true, data: Item }
  } catch (error: any) {
    // TODO: Handle Zod errors → 400
    // TODO: Otherwise 500
  }
}

export async function DELETE(id: string) {
  // TODO: Check if id is valid ObjectId → return 400 if not
  try {
    // TODO: Delete item
    // TODO: Return 404 if null
    // Return: { success: true, message: "Deleted" }
  } catch (error) {
    // TODO: Return 500
  }
}
```

**Critical error handling:**
- `ObjectId.isValid(id)` must be checked BEFORE database calls
- Invalid ObjectId → 400 (NOT 500)
- Zod errors → 400 with validation message
- Not found → 404
- Database errors → 500

### components.tsx

Create UI components with polish:

```typescript
"use client";
import { useState } from "react";

export function ItemCard({ item, onDelete, onUpdate }: any) {
  // TODO: Display item in card layout
  // Required elements:
  // - Large emoji icon (text-6xl, centered)
  // - Item name (bold)
  // - Description (gray text)
  // - Price (large, bold, with $ prefix)
  // - Stock status with quantity (green if in stock, red if not)
  // - Delete button (red)
  // - Edit button (triggers inline edit or modal)
}

export function ItemList({ items, onDelete, onUpdate }: any) {
  // TODO: Grid layout
  // - Handle empty state: show "No items yet" message
  // - Responsive: 1 column mobile, 2-3 columns desktop
  // - Map over items and render ItemCard
}

export function AddItemForm({ onSubmit, isLoading }: any) {
  // TODO: Form with all fields
  // Required inputs:
  // - name (text, required)
  // - description (textarea, optional)
  // - price (number, min 0, step 0.01, required)
  // - quantity (number, min 0, integer)
  // - inStock (checkbox)
  //
  // Behavior:
  // - Disable submit button when isLoading
  // - Show "Adding..." text when loading
  // - Clear form after successful submit
  // - Use controlled inputs with useState
}
```

**UI Requirements:**
- Tailwind CSS for styling
- Loading states on buttons
- Disabled states during mutations
- Empty state messages
- Responsive design

### hooks.ts

TanStack Query hooks with proper cache management:

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE = "/api/vegetables/{yourvegetable}"; // lowercase

export function useItems() {
  return useQuery({
    queryKey: ["{yourvegetable}", "items"],
    queryFn: async () => {
      // TODO: Fetch from API_BASE
      // TODO: Parse JSON
      // TODO: Throw error if !json.success
      // Return json.data
    },
  });
}

export function useCreateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      // TODO: POST to API_BASE
      // TODO: Parse response
      // TODO: Throw on error
      // Return created item
    },
    onSuccess: () => {
      // TODO: Invalidate items query
    },
  });
}

export function useUpdateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      // TODO: PUT to API_BASE/{id}
      // TODO: Parse response
      // TODO: Throw on error
      // Return updated item
    },
    onSuccess: () => {
      // TODO: Invalidate items query
    },
  });
}

export function useDeleteItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      // TODO: DELETE to API_BASE/{id}
      // TODO: Parse response
      // TODO: Throw on error
    },
    onSuccess: () => {
      // TODO: Invalidate items query
    },
  });
}
```

---

## Edge Cases (Critical for Model Evaluation)

### E1: Invalid ObjectId Format (**5 points**)
```typescript
// Input: GET /api/vegetables/carrot/not-an-objectid
// Expected: 400 { success: false, error: "Invalid ID" }
// Common mistake: 500 error or MongoDB crash
```

### E2: Validation Errors (**5 points**)
```typescript
// Input: POST { name: "", price: 10 }
// Expected: 400 with validation message
// Input: POST { name: "Test", price: -5 }
// Expected: 400 with validation message
// Input: POST { name: "Test", price: 0 }
// Expected: 400 (price must be POSITIVE, not just non-negative)
```

### E3: Empty Collection (**3 points**)
```typescript
// Input: GET /api/vegetables/carrot (when empty)
// Expected: 200 { success: true, data: [] }
// NOT: Error or undefined
```

### E4: Item Not Found (**5 points**)
```typescript
// Input: GET /api/vegetables/carrot/{valid-but-nonexistent-id}
// Expected: 404 { success: false, error: "Not found" }
// Input: DELETE {valid-but-nonexistent-id}
// Expected: 404
```

### E5: Concurrent Updates (**3 points**)
```typescript
// Two requests updating same item simultaneously
// Expected: Use { new: true } in findByIdAndUpdate
// Expected: Return 404 if item was deleted between read and update
```

### E6: Large/Special Input (**2 points**)
```typescript
// Input: Very long description (10000+ chars)
// Expected: Handle gracefully (accept or validate max length)
// Input: Special characters in name (emoji, unicode)
// Expected: Store and display correctly
```

### E7: Missing Optional Fields (**2 points**)
```typescript
// Input: POST { name: "Test", price: 10 } (no description, quantity)
// Expected: Use defaults from schema (quantity: 0, inStock: true)
```

### E8: XSS Prevention (**3 points**)
```typescript
// Input: POST { name: '<script>alert("xss")</script>', price: 10 }
// Expected: Either reject (400) OR sanitize/escape the input
// Expected: Raw script tags should not be stored or rendered
```

---

## Scoring Rubric

| Category | Points | What's Tested |
|----------|--------|---------------|
| **Core CRUD (40 pts)** | | |
| Create works | 10 | POST creates item, returns 201 |
| Read all works | 10 | GET returns array |
| Read one works | 5 | GET /{id} returns item |
| Update works | 10 | PUT updates item |
| Delete works | 5 | DELETE removes item |
| **Edge Cases (30 pts)** | | |
| Invalid ObjectId | 5 | Returns 400, not 500 |
| Validation errors | 5 | Empty name, negative price → 400 |
| Empty collection | 3 | Returns [], not error |
| Not found | 5 | GET/DELETE nonexistent → 404 |
| Concurrent updates | 3 | Uses {new: true}, handles races |
| Large/special input | 2 | Handles long strings, unicode |
| Missing optionals | 2 | Uses schema defaults |
| XSS prevention | 3 | Rejects or sanitizes script tags |
| Optional fields | 2 | Defaults work correctly |
| **UI/UX (20 pts)** | | |
| Components render | 5 | No crashes, displays items |
| Loading states | 5 | Shows loading during mutations |
| Error display | 5 | Shows API errors to user |
| Responsive design | 5 | Works on mobile and desktop |
| **Code Quality (10 pts)** | | |
| Type safety | 3 | Minimal `any`, proper types |
| Code organization | 3 | Clean, readable structure |
| Error messages | 2 | Specific, helpful messages |
| Comments | 2 | Complex logic explained |
| **Total** | **100** | |

---

## Verification Checklist

Before completion:

- [ ] All 7 files exist (6 module files + secret.txt)
- [ ] `npm run build` passes without errors
- [ ] POST with valid data returns 201
- [ ] POST with empty name returns 400
- [ ] POST with negative price returns 400
- [ ] POST with zero price returns 400
- [ ] GET with invalid ObjectId returns 400 (NOT 500)
- [ ] GET with nonexistent valid ID returns 404
- [ ] DELETE with nonexistent ID returns 404
- [ ] PUT updates work
- [ ] UI renders items
- [ ] UI shows loading states
- [ ] Empty state shows message
- [ ] Form clears after submit

---

## Common Mistakes to Avoid

1. ❌ Not validating ObjectId format (causes 500 instead of 400)
2. ❌ Allowing zero price (should be POSITIVE, not just non-negative)
3. ❌ Missing useUpdateItem hook
4. ❌ Components don't accept onUpdate prop
5. ❌ Not handling item not found (undefined instead of 404)
6. ❌ Not using `{ new: true }` in findByIdAndUpdate
7. ❌ Returning error instead of [] for empty collection
8. ❌ Not clearing form after successful submit
9. ❌ Not showing loading states
10. ❌ Not sanitizing/validating XSS attempts (script tags in input)
11. ❌ Using excessive `any` types (use proper TypeScript types)

---

## Success Criteria

A high-quality implementation will:
- ✅ Handle ALL edge cases correctly
- ✅ Return appropriate HTTP status codes
- ✅ Validate input thoroughly
- ✅ Show polish in UI (loading states, error messages)
- ✅ Use TypeScript types properly
- ✅ Build without errors
- ✅ Follow best practices for Next.js, React Query, Mongoose