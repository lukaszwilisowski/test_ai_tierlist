# LLM Model Specification

## Purpose

This specification tests **LLM models** (Sonnet 4.5, Opus 4.5, DeepSeek, Gemini, etc.) using the **same coding agent** (Roo Code). The focus is on **code generation quality**: correctness, completeness, edge case handling, and code style.

## Test Focus Areas

| Area | What We're Testing |
|------|-------------------|
| Functional Completeness | Does the code do everything required? |
| Code Correctness | Does the code work without bugs? |
| Edge Case Handling | Are boundary conditions covered? |
| Code Quality | Is the code clean and maintainable? |
| Type Safety | Are TypeScript types properly used? |
| Error Handling | Are failures handled gracefully? |

---

## Instructions for Model

> **READ THIS SECTION CAREFULLY**

### Step 1: Select Your Module Name

1. Read the file `available-names/vegetables.txt`
2. Pick ONE vegetable name that has not been used yet
3. Check `src/modules/vegetables/` - if a folder with that name exists, pick another
4. Remember your chosen name (e.g., "carrot")

### Step 2: Create Module Structure

Create the following files in `src/modules/vegetables/{your-vegetable-name}/`:

```
src/modules/vegetables/{name}/
├── config.ts
├── schema.ts
├── model.ts
├── api.ts
├── components.tsx
└── hooks.ts
```

### Step 3: Implement the Module

Refer to `docs/02-MODULE-SYSTEM.md` for detailed file templates. Your module must implement a **vegetable shop** with full CRUD functionality.

---

## Functional Requirements

### Level 1: Core CRUD (40 points)

These are the baseline requirements:

#### F1: Create Items (10 points)
```typescript
// POST /api/vegetables/{name}
// Body: { name, description?, price, image?, inStock?, quantity? }
// Returns: { success: true, data: Item }
```
- Accept item data in request body
- Validate with Zod schema
- Save to MongoDB
- Return created item with 201 status

#### F2: Read All Items (10 points)
```typescript
// GET /api/vegetables/{name}
// Returns: { success: true, data: Item[] }
```
- Fetch all items from collection
- Return as array
- Sort by createdAt descending

#### F3: Read Single Item (5 points)
```typescript
// GET /api/vegetables/{name}/{id}
// Returns: { success: true, data: Item }
```
- Find item by MongoDB ObjectId
- Return 404 if not found
- Return item with 200 status

#### F4: Update Item (10 points)
```typescript
// PUT /api/vegetables/{name}/{id}
// Body: Partial<Item>
// Returns: { success: true, data: Item }
```
- Accept partial update data
- Validate with Zod partial schema
- Update only provided fields
- Return updated item

#### F5: Delete Item (5 points)
```typescript
// DELETE /api/vegetables/{name}/{id}
// Returns: { success: true, message: 'Deleted' }
```
- Find and remove item
- Return 404 if not found
- Return success message

---

### Level 2: Edge Cases (30 points)

These test model's ability to handle non-happy paths:

#### E1: Invalid ObjectId (5 points)
```typescript
// GET /api/vegetables/{name}/invalid-id
// Should return 400, not crash
```
- Check if ID is valid ObjectId format
- Return 400 with "Invalid ID format" message
- Don't let MongoDB throw unhandled error

#### E2: Validation Errors (5 points)
```typescript
// POST /api/vegetables/{name}
// Body: { name: "", price: -5 }
// Should return 400 with details
```
- Name must not be empty
- Price must be positive
- Return detailed validation errors
- Include field-level error messages

#### E3: Duplicate Handling (5 points)
```typescript
// Handle creating items with same name
// Decide: Allow duplicates or return error?
```
- Either: Allow duplicates (valid choice)
- Or: Return 409 Conflict with message
- Document your choice in code comments

#### E4: Empty States (5 points)
```typescript
// GET when collection is empty
// DELETE when collection is empty
```
- Return empty array `[]`, not error
- UI shows "No items yet" message
- Graceful handling, not undefined errors

#### E5: Concurrent Updates (5 points)
```typescript
// PUT while item is being deleted
// Handle race conditions
```
- Use `findOneAndUpdate` with `returnDocument: 'after'`
- Return 404 if item was deleted
- Don't return stale data

#### E6: Large Data (5 points)
```typescript
// POST with very long description
// POST with many items quickly
```
- Handle long strings (truncate or limit)
- Handle rapid requests without crashing
- Consider rate limiting or pagination hints

---

### Level 3: UI/UX Quality (20 points)

#### U1: Loading States (5 points)
- Show spinner during API calls
- Disable buttons while submitting
- Prevent double-submission

#### U2: Error Display (5 points)
- Show API errors to user
- Clear errors on retry
- Specific error messages (not just "Error")

#### U3: Responsive Design (5 points)
- Works on mobile viewport
- Grid adjusts to screen size
- Forms usable on small screens

#### U4: Visual Polish (5 points)
- Consistent spacing
- Good color contrast
- Hover states on interactive elements

---

### Level 4: Code Quality (10 points)

#### Q1: Type Safety (3 points)
- No `any` types (except where necessary)
- Proper interface definitions
- Type exports from schema

#### Q2: Code Organization (3 points)
- Logical file structure
- Functions do one thing
- Clear naming conventions

#### Q3: Error Messages (2 points)
- Specific, actionable errors
- No stack traces to user
- Helpful debug info in logs

#### Q4: Comments & Documentation (2 points)
- Complex logic explained
- Public functions documented
- No obvious/redundant comments

---

## Bonus Challenges (Extra Credit)

### B1: Optimistic Updates (+5 points)
```typescript
// UI updates immediately, rolls back on error
const mutation = useMutation({
  onMutate: async (newItem) => {
    // Cancel queries, snapshot, optimistically update
  },
  onError: (err, newItem, context) => {
    // Rollback to snapshot
  },
  onSettled: () => {
    // Refetch to be sure
  },
});
```

### B2: Search with Debounce (+5 points)
```typescript
// Search as you type, but debounced
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 300);

useQuery({
  queryKey: ['items', debouncedSearch],
  queryFn: () => fetchItems({ search: debouncedSearch }),
});
```

### B3: Infinite Scroll (+5 points)
```typescript
// Load more items as user scrolls
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ['items'],
  queryFn: ({ pageParam = 0 }) => fetchItems({ offset: pageParam }),
  getNextPageParam: (lastPage) => lastPage.nextOffset,
});
```

### B4: Undo Delete (+5 points)
```typescript
// "Undo" button appears after delete
// Actually soft-delete with TTL
// Undo restores the item
```

### B5: Real-time Updates (+5 points)
```typescript
// Show new items from other users
// Polling or WebSocket approach
// Merge without losing scroll position
```

---

## Evaluation Matrix

| Category | Points | Auto-Testable |
|----------|--------|---------------|
| Core CRUD (F1-F5) | 40 | Yes |
| Edge Cases (E1-E6) | 30 | Partial |
| UI/UX (U1-U4) | 20 | No |
| Code Quality (Q1-Q4) | 10 | No |
| **Total** | **100** | |
| Bonus (B1-B5) | +25 | No |

---

## Automated Test Cases

These will be run by the test runner:

```typescript
describe('Vegetable Module: {name}', () => {
  // F1: Create
  it('POST creates item with valid data', async () => {
    const res = await fetch('/api/vegetables/{name}', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test', price: 10 }),
    });
    expect(res.status).toBe(201);
    const { data } = await res.json();
    expect(data.name).toBe('Test');
  });

  // F2: Read All
  it('GET returns array', async () => {
    const res = await fetch('/api/vegetables/{name}');
    expect(res.status).toBe(200);
    const { data } = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });

  // E1: Invalid ID
  it('GET with invalid ID returns 400', async () => {
    const res = await fetch('/api/vegetables/{name}/not-valid-id');
    expect(res.status).toBe(400);
  });

  // E2: Validation
  it('POST with empty name returns 400', async () => {
    const res = await fetch('/api/vegetables/{name}', {
      method: 'POST',
      body: JSON.stringify({ name: '', price: 10 }),
    });
    expect(res.status).toBe(400);
  });

  // E2: Negative price
  it('POST with negative price returns 400', async () => {
    const res = await fetch('/api/vegetables/{name}', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test', price: -5 }),
    });
    expect(res.status).toBe(400);
  });
});
```

---

## Verification Checklist

Before considering complete:

- [ ] All 6 files exist in `src/modules/vegetables/{name}/`
- [ ] `npm run build` passes
- [ ] Module appears on homepage
- [ ] Can create item with valid data
- [ ] Can't create item with invalid data (shows error)
- [ ] Items display in responsive grid
- [ ] Can delete items
- [ ] Invalid ID handled gracefully
- [ ] Empty state shows helpful message
- [ ] Loading states visible

---

## Model Comparison Notes

When evaluating models, compare:

1. **Did it implement all requirements?** (Completeness)
2. **Does the code work correctly?** (Correctness)
3. **How does it handle edge cases?** (Robustness)
4. **Is the code clean and readable?** (Quality)
5. **Did it add any extra features?** (Initiative)

Document observations for each model to compare in tierlist.
