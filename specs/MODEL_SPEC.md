# LLM Model Task

You are participating in a comparison of LLM models. Complete the following task.

## Step 1: Pick Your Module Name

1. Read `available-names/vegetables.txt`
2. Check `src/modules/vegetables/` for existing folders
3. Pick an UNUSED vegetable name
4. Use this name for your module

## Step 2: Create Module Files

Create these 6 files in `src/modules/vegetables/{your-vegetable}/`:

1. `config.ts` - Module metadata
2. `schema.ts` - Zod validation schemas
3. `model.ts` - Mongoose model with CRUD
4. `api.ts` - API route handlers
5. `components.tsx` - React UI components
6. `hooks.ts` - TanStack Query hooks

## Detailed Requirements

### config.ts
```typescript
const config = {
  displayName: '{YourVegetable} Shop',
  description: 'Fresh {vegetable} products',
  icon: '🥕', // Use appropriate emoji
};
export default config;
```

### schema.ts

Define Zod schemas with proper validation:
- `name`: required, min 1 char
- `description`: optional string
- `price`: required, positive number
- `image`: optional URL
- `inStock`: boolean, default true
- `quantity`: integer, min 0, default 0
- `createdAt`, `updatedAt`: dates

Export types: `Item`, `CreateItem`, `UpdateItem`

### model.ts

Mongoose model with methods:
- `findAll()`: return all items sorted by createdAt desc
- `findById(id)`: return single item or null
- `create(data)`: create and return new item
- `update(id, data)`: update and return item or null
- `delete(id)`: delete and return boolean

Use unique model name based on vegetable name (capitalized).

### api.ts

Implement these handlers:
- `GET()`: return all items
- `POST(request)`: create item with validation
- `GETById(id)`: return single item
- `PUT(request, id)`: update item
- `DELETE(id)`: delete item

Error handling requirements:
- Return 400 for invalid ObjectId format
- Return 400 for Zod validation errors
- Return 404 when item not found
- Return 500 for server errors
- Always return `{ success: boolean, data?, error? }`

### components.tsx

Create these components:
- `ItemCard`: displays single item with delete button
- `ItemList`: grid of ItemCards, handles empty state
- `AddItemForm`: form to create new items

UI requirements:
- Show loading states
- Show error messages
- Responsive grid layout
- Tailwind CSS styling

### hooks.ts

TanStack Query hooks:
- `useItems()`: fetch all items
- `useCreateItem()`: mutation to create
- `useDeleteItem()`: mutation to delete

Proper cache invalidation on mutations.

## Edge Cases to Handle

1. **Empty name**: Return 400, not create
2. **Negative price**: Return 400, not create
3. **Invalid ObjectId**: Return 400, not 500
4. **Item not found**: Return 404
5. **Empty collection**: Return `[]`, not error
6. **Missing optional fields**: Use defaults

## Code Quality

- No `any` types where avoidable
- Consistent naming conventions
- Clean, readable code
- Proper TypeScript types
- Error messages are helpful

## Verification Checklist

Before completing:
- [ ] All 6 files exist
- [ ] `npm run build` passes
- [ ] GET /api/vegetables/{name} returns 200
- [ ] POST with valid data returns 201
- [ ] POST with empty name returns 400
- [ ] POST with negative price returns 400
- [ ] GET with invalid ID returns 400
- [ ] GET with non-existent ID returns 404
- [ ] DELETE works
- [ ] UI renders without errors
- [ ] Empty state shows message
- [ ] Form creates items

## Scoring

| Feature | Points |
|---------|--------|
| Build passes | 10 |
| GET all works | 10 |
| POST creates | 10 |
| GET by ID works | 5 |
| PUT updates | 5 |
| DELETE removes | 5 |
| Validation (400) | 5 |
| Invalid ID (400) | 5 |
| UI quality | 10 |
| Code quality | 10 |
| **Total** | **75** |
