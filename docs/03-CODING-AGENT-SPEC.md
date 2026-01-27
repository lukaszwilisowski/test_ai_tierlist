# Coding Agent Specification

## Purpose

This specification tests **AI coding agents** (tools like Cursor, Claude Code, Copilot, etc.) using the **same underlying model** (Claude Sonnet 4.5). The focus is on **agent capabilities**: tool usage, file operations, code navigation, and implementation quality.

## Test Focus Areas

| Area | What We're Testing | Expected Agent Tools |
|------|-------------------|---------------------|
| File Discovery | Can agent find files by pattern? | Glob, Search |
| Code Search | Can agent find code across files? | Grep, Code Search |
| Multi-File Edit | Can agent modify multiple files? | Edit, Replace |
| Code Generation | Can agent create new files? | Write, Create |
| Context Understanding | Does agent understand project structure? | Read, Index |
| API Integration | Can agent work with external services? | Web, Fetch |

---

## Instructions for Agent

> **READ THIS SECTION CAREFULLY**

### Step 1: Select Your Module Name

1. Read the file `available-names/fruits.txt`
2. Pick ONE fruit name that has not been used yet
3. Check `src/modules/fruits/` - if a folder with that name exists, pick another
4. Remember your chosen name (e.g., "apple")

### Step 2: Create Module Structure

Create the following files in `src/modules/fruits/{your-fruit-name}/`:

```
src/modules/fruits/{name}/
├── config.ts
├── schema.ts
├── model.ts
├── api.ts
├── components.tsx
└── hooks.ts
```

### Step 3: Implement the Module

Refer to `docs/02-MODULE-SYSTEM.md` for detailed file templates. Your module must:

1. **config.ts** - Export module metadata
2. **schema.ts** - Define Zod schemas for Item
3. **model.ts** - Create Mongoose model with CRUD operations
4. **api.ts** - Implement API handlers (GET, POST, PUT, DELETE)
5. **components.tsx** - Create ItemCard, ItemList, AddItemForm components
6. **hooks.ts** - Implement TanStack Query hooks

---

## Task Requirements

### Required Features (MUST HAVE)

These features are mandatory for a passing implementation:

#### R1: Basic CRUD Operations
- [ ] **Create**: Add new items via POST /api/fruits/{name}
- [ ] **Read All**: List items via GET /api/fruits/{name}
- [ ] **Read One**: Get single item via GET /api/fruits/{name}/{id}
- [ ] **Update**: Modify item via PUT /api/fruits/{name}/{id}
- [ ] **Delete**: Remove item via DELETE /api/fruits/{name}/{id}

#### R2: Data Validation
- [ ] Name field is required (min 1 character)
- [ ] Price must be positive number
- [ ] Invalid data returns 400 status with error message
- [ ] Zod schemas validate all inputs

#### R3: UI Components
- [ ] ItemCard displays item details (name, price, stock status)
- [ ] ItemList renders all items in a grid
- [ ] AddItemForm allows creating new items
- [ ] Delete button removes items
- [ ] Loading states shown during API calls

#### R4: Error Handling
- [ ] 404 returned when item not found
- [ ] 500 returned on server errors
- [ ] Error messages displayed in UI
- [ ] Form validation errors shown to user

---

### Tool Usage Tasks (AGENT-SPECIFIC)

These tasks specifically test agent tool capabilities:

#### T1: File Pattern Search
**Task**: Find all files in the project that contain the word "mongoose" (case-insensitive).

**Expected behavior**: Agent uses glob/grep to search, reports file list.

**Deliverable**: Add a comment at the top of your `model.ts`:
```typescript
// Files containing 'mongoose': [list the files you found]
```

#### T2: Cross-File Refactoring
**Task**: The base project uses `createdAt` and `updatedAt` fields. Find all occurrences and ensure your implementation uses the same naming convention.

**Expected behavior**: Agent searches across files, maintains consistency.

#### T3: Configuration Discovery
**Task**: Find the MongoDB connection string configuration. Where is it defined? How is it used?

**Expected behavior**: Agent locates `.env.local` reference in code, traces usage.

**Deliverable**: Add a comment in your `model.ts`:
```typescript
// MongoDB connection: [describe where it's configured]
```

#### T4: External API Integration
**Task**: Your module should include a "seed" function that fetches sample data from this public API and creates initial items:

**API**: `https://api.sampleapis.com/futurama/characters` (or similar public API)

**Deliverable**: Add to your `model.ts`:
```typescript
export async function seedFromApi(): Promise<Item[]> {
  // Fetch from external API
  // Transform data to match your schema
  // Create items in database
  // Return created items
}
```

And add a "Seed Data" button in your components that calls this function.

#### T5: Multi-File Update
**Task**: After creating your module, ensure the module name appears consistently in:
- config.ts (displayName)
- model.ts (MODEL_NAME constant)
- hooks.ts (queryKey)
- API error messages

All should use your fruit name consistently.

---

### Bonus Features (NICE TO HAVE)

Extra credit for implementing these:

#### B1: Search/Filter
- [ ] Search items by name
- [ ] Filter by in-stock status
- [ ] Sort by price/name/date

#### B2: Pagination
- [ ] Limit items per page
- [ ] Next/Previous navigation
- [ ] Show total count

#### B3: Image Preview
- [ ] Preview image before adding
- [ ] Fallback for broken images
- [ ] Image loading states

#### B4: Bulk Operations
- [ ] Select multiple items
- [ ] Bulk delete
- [ ] Bulk update stock status

#### B5: Optimistic Updates
- [ ] UI updates immediately
- [ ] Rollback on error
- [ ] Smooth transitions

---

## Evaluation Criteria

### Automated Tests (50%)

| Test | Points | Criteria |
|------|--------|----------|
| Build passes | 10 | `npm run build` succeeds |
| GET all works | 10 | Returns 200 with array |
| POST creates | 10 | Returns 201, item in DB |
| GET by ID works | 5 | Returns 200 with item |
| PUT updates | 5 | Returns 200, changes persisted |
| DELETE removes | 5 | Returns 200, item gone |
| Validation works | 5 | Invalid data returns 400 |

### Manual Evaluation (50%)

| Aspect | Points | Criteria |
|--------|--------|----------|
| Code quality | 15 | Clean, readable, well-structured |
| UI appearance | 10 | Looks good, matches design system |
| Error handling | 10 | Graceful failures, helpful messages |
| Tool tasks complete | 10 | T1-T5 deliverables present |
| Bonus features | 5 | Any B1-B5 implemented |

---

## Common Mistakes to Avoid

1. **Don't hardcode module name** - Use variables/constants
2. **Don't skip validation** - Always use Zod schemas
3. **Don't ignore errors** - Handle all failure cases
4. **Don't forget types** - Export TypeScript types from schema
5. **Don't break discovery** - config.ts must export default object

---

## Verification Checklist

Before considering the task complete:

- [ ] All 6 required files exist in `src/modules/fruits/{name}/`
- [ ] `npm run build` passes without errors
- [ ] Module appears on homepage
- [ ] Clicking module card opens detail page
- [ ] Can create new item via form
- [ ] Items display in grid
- [ ] Can delete items
- [ ] Tool task comments are present (T1, T3)
- [ ] Seed function exists (T4)

---

## Time Expectation

A capable coding agent should complete the required features (R1-R4) and tool tasks (T1-T5) in a single session. Bonus features are optional and depend on agent capability.
