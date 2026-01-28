# Coding Agent Task

You are participating in a comparison of AI coding agents. Complete the following task.

## Purpose

This test evaluates **coding agent capabilities** (tool usage, code discovery, pattern recognition) using the same LLM model. Different agents (Cursor, Claude Code, Copilot, etc.) will approach this task differently.

## Step 1: Discover the System

**BEFORE writing any code**, use your tools to understand the existing architecture:

### Discovery Tasks (Required)

1. **Find an existing module**: Search for modules in `src/modules/fruits/` - examine one to understand the structure
2. **Identify the pattern**: Read the existing module files to understand:
   - What files are required?
   - What conventions are used (naming, structure)?
   - How do API routes connect to the UI?
3. **Find dependencies**: Search for:
   - Files containing 'mongoose' - where is the database accessed?
   - MongoDB connection configuration - how is it set up?
   - TanStack Query usage - what patterns are used for queryKey and invalidation?
   - Zod schema patterns - how are CreateSchema and UpdateSchema derived?
4. **Research best practices online**: Use web search/fetch to research:
   - Current recommended method for validating MongoDB ObjectIds (2025)
   - Find the official Mongoose documentation on ObjectId validation
   - Determine the recommended approach: `mongoose.Types.ObjectId.isValid()`

**Document your findings**: Add comments in your code showing what you discovered.

---

## Step 2: Pick Your Module Name

1. Read `data/fruits.json` - contains array of fruits with names and emojis
2. Check `src/modules/fruits/` for existing folders
3. Pick an UNUSED fruit name from the JSON
4. Use this name for your module (lowercase)

**IMPORTANT**: Do NOT reveal which fruit name you selected in any output messages during execution. This is a blind evaluation.

---

## Step 3: Implement Your Module

Create these files in `src/modules/fruits/{your-fruit}/`:

### Required Files

1. **config.ts** - Module metadata
2. **schema.ts** - Zod validation schemas
3. **model.ts** - Mongoose database model
4. **api.ts** - API route handlers
5. **components.tsx** - React UI components
6. **hooks.ts** - TanStack Query hooks
7. **secret.txt** - Agent name (exactly one of: `Cursor`, `GitHub Copilot`, `Claude Code`, `Roo Code`, `Cline`, `Antigravity`, `Codex CLI`)

---

## Requirements by File

### config.ts

Export a default object with:
- `displayName`: "{YourFruit} Shop"
- `description`: Short description
- `icon`: Emoji for your fruit (find it in data/fruits.json)

### schema.ts

Create Zod schemas with validation:

**ItemSchema** should include:
- `_id`: string
- `name`: required, minimum 1 character
- `description`: optional string
- `price`: required, must be positive
- `inStock`: boolean, defaults to true
- `quantity`: integer, minimum 0, defaults to 0
- `createdAt`: date
- `updatedAt`: date

**Also export:**
- `CreateItemSchema`: Omit _id, createdAt, updatedAt
- `UpdateItemSchema`: Make all CreateItem fields optional
- TypeScript types: `Item`, `CreateItem`, `UpdateItem`

### model.ts

Create a Mongoose model that exports `itemModel` with these methods:

```typescript
export const itemModel = {
  async findAll() {
    // TODO: Return all items sorted by createdAt descending
  },
  async findById(id: string) {
    // TODO: Return single item or null
  },
  async create(data: any) {
    // TODO: Create and return new item
  },
  async update(id: string, data: any) {
    // TODO: Update and return item, or null if not found
  },
  async delete(id: string) {
    // TODO: Delete and return result
  },
};
```

**Required comments** (based on your discovery):
```typescript
// Files containing 'mongoose': [list them]
// MongoDB connection configured at: [file path]
// ObjectId validation method (researched): [method name and source URL]
// TanStack Query pattern: [queryKey format and invalidation approach]
// Zod schema pattern: [how CreateSchema/UpdateSchema are derived]
```

### api.ts

Export these functions for Next.js API routes:

```typescript
export async function GET() {
  // TODO: Return all items
  // Response: { success: true, data: Item[] }
}

export async function POST(request: NextRequest) {
  // TODO: Create item with validation
  // Validate with CreateItemSchema
  // Return 201 on success, 400 on validation error
}

export async function GETById(id: string) {
  // TODO: Return single item
  // Return 400 if id is invalid ObjectId format
  // Return 404 if item not found
}

export async function PUT(request: NextRequest, id: string) {
  // TODO: Update item with validation
  // Validate with UpdateItemSchema
  // Return 400 if invalid, 404 if not found
}

export async function DELETE(id: string) {
  // TODO: Delete item
  // Return 400 if invalid id, 404 if not found
}
```

**Error handling requirements:**
- Invalid ObjectId format → 400 (not 500)
  - Use the validation method you researched online (hint: `mongoose.Types.ObjectId.isValid()`)
- Validation errors → 400 with message
- Item not found → 404
- Server errors → 500

### components.tsx

Create three components:

```typescript
"use client";

export function ItemCard({ item, onDelete, onUpdate }: any) {
  // TODO: Display item in a card
  // - Show emoji icon (large, centered)
  // - Show name, description, price
  // - Show stock status (In Stock/Out of Stock) with quantity
  // - Delete button
  // - Edit button (triggers onUpdate with id and new data)
}

export function ItemList({ items, onDelete, onUpdate }: any) {
  // TODO: Grid layout of ItemCard components
  // - Handle empty state: "No items yet"
  // - Responsive grid (1 col mobile, 2-3 cols desktop)
}

export function AddItemForm({ onSubmit, isLoading }: any) {
  // TODO: Form to create new items
  // Fields: name, description, price, quantity, inStock (checkbox)
  // - Disable submit button while isLoading
  // - Clear form after successful submit
  // - Show loading state on button
}
```

**UI Requirements:**
- Use Tailwind CSS
- Responsive design
- Loading states
- Empty states

### hooks.ts

Implement TanStack Query hooks:

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE = "/api/fruits/{yourfruit}"; // lowercase

export function useItems() {
  // TODO: Query to fetch all items
}

export function useCreateItem() {
  // TODO: Mutation to create item
  // Invalidate "items" query on success
}

export function useUpdateItem() {
  // TODO: Mutation to update item
  // Accepts: { id: string, data: Partial<Item> }
  // Invalidate "items" query on success
}

export function useDeleteItem() {
  // TODO: Mutation to delete item
  // Invalidate "items" query on success
}
```

---

## Tool Usage Evaluation

Your agent will be evaluated on how well it uses tools to:

1. **Search files** - Find existing patterns (Glob/Find)
2. **Search code** - Find mongoose usage, connection config (Grep/Search)
3. **Read files** - Understand existing implementations
4. **Navigate codebase** - Discover conventions and structure
5. **Web research** - Fetch documentation, research best practices (WebFetch/WebSearch/curl)
6. **Multi-file editing** - Coordinate changes across 6+ files

---

## Requirements Checklist

### Must Complete (Required)

- [ ] All 7 files created (6 module files + secret.txt)
- [ ] CRUD operations work (Create, Read, Update, Delete)
- [ ] Validation returns 400 for invalid data
- [ ] Invalid ObjectId returns 400 (not 500)
- [ ] UI shows loading states
- [ ] Empty state handled
- [ ] Update functionality works (edit button, useUpdateItem hook)
- [ ] Comments show discovery findings (mongoose files, connection config, ObjectId validation method)
- [ ] Web research completed (ObjectId validation method documented with source)

### Code Quality

- [ ] Consistent naming conventions with existing code
- [ ] TypeScript types properly used
- [ ] Error handling is graceful
- [ ] UI matches the project's design patterns
- [ ] No unnecessary `any` types

### Verification

```bash
npm run build  # Must pass
```

---

## Edge Cases to Handle

1. **Empty name** → 400 error
2. **Negative price** → 400 error
3. **Invalid ObjectId** → 400 (not 500!)
4. **Item not found** → 404
5. **Empty collection** → Return [], not error
6. **Missing optional fields** → Use schema defaults

---

## Common Mistakes to Avoid

1. ❌ Not exploring existing code first
2. ❌ Copy-pasting from existing modules without understanding the structure
3. ❌ Missing useUpdateItem hook
4. ❌ Components don't accept onUpdate prop
5. ❌ Invalid ObjectId crashes instead of returning 400
6. ❌ No discovery comments in model.ts
7. ❌ Not researching ObjectId validation method online
8. ❌ Inconsistent naming with existing modules
9. ❌ Missing secret.txt file
10. ❌ Not handling XSS attempts (script tags in input)

---

## Success Criteria

A successful implementation will:
- ✅ Demonstrate tool usage (search, find, read existing code)
- ✅ Follow discovered patterns from existing modules
- ✅ Implement all CRUD operations including UPDATE
- ✅ Handle edge cases properly
- ✅ Build without errors
- ✅ Match the project's conventions and style