# Coding Agent Spec vs Model Spec Comparison

## Overview

This project tests AI code generation in two dimensions:
1. **Coding Agent Spec** (`specs/CODING_AGENT_SPEC.md`) - Tests different coding agents using the same model
2. **Model Spec** (`specs/MODEL_SPEC.md`) - Tests different LLM models using the same coding agent

---

## Key Differences

### 1. What They Test

| Aspect | Coding Agent Spec | Model Spec |
|--------|-------------------|------------|
| **Primary Focus** | Tool usage & exploration capabilities | Implementation quality & correctness |
| **Module Category** | Fruits (`src/modules/fruits/`) | Vegetables (`src/modules/vegetables/`) |
| **Agents Tested** | 7 different coding agents (Cursor, Claude Code, etc.) | Same agent with 7 different models (Sonnet 4.5, Opus 4.5, etc.) |
| **Data Source** | `data/fruits.json` | `data/vegetables.json` |
| **Secret File** | Agent name (e.g., "Cursor") | Model name (e.g., "Sonnet 4.5") |

---

### 2. Discovery vs Implementation

#### Coding Agent Spec (Discovery-First)

**Step 1: REQUIRED DISCOVERY**
```markdown
BEFORE writing any code, use tools to:
1. Find existing modules - examine structure
2. Identify patterns - naming conventions
3. Find dependencies - mongoose, TanStack Query, Zod
4. Research best practices - web search for ObjectId validation

Document findings with comments in code
```

**Emphasis on:**
- File search (Glob/Find)
- Code search (Grep/Search)
- Web research (WebFetch/curl)
- Reading existing implementations
- Pattern recognition

**Tool Usage Evaluation:**
1. Search files
2. Search code
3. Read files
4. Navigate codebase
5. **Web research** ⭐
6. Multi-file editing

---

#### Model Spec (Implementation-First)

**No Discovery Phase**
- Jumps straight to implementation
- Provides complete code templates
- Shows expected file structure upfront

**Emphasis on:**
- Correctness of implementation
- Edge case handling
- Code quality
- Validation logic

**Edge Cases Detailed:**
- E1: Invalid ObjectId (5 pts)
- E2: Validation Errors (5 pts)
- E3: Empty Collection (3 pts)
- E4: Item Not Found (5 pts)
- E5: Concurrent Updates (3 pts)
- E6: Large/Special Input (2 pts)
- E7: Missing Optional Fields (2 pts)
- E8: XSS Prevention (3 pts)

---

### 3. Documentation Requirements

#### Coding Agent Spec
**Required discovery comments in model.ts:**
```typescript
// Files containing 'mongoose': [list them]
// MongoDB connection configured at: [file path]
// ObjectId validation method (researched): [method + URL]
// TanStack Query pattern: [queryKey format and invalidation]
// Zod schema pattern: [how CreateSchema/UpdateSchema derived]
```

**Why:** Tests if agents actually explored the codebase

#### Model Spec
**No special comments required**
- Focus is on correct implementation
- Comments evaluated for code clarity only

---

### 4. Template Detail Level

#### Coding Agent Spec
**Minimal templates** - Shows structure, not implementation:
```typescript
export const itemModel = {
  async findAll() {
    // TODO: Return all items sorted by createdAt descending
  },
  // ...
};
```

**Why:** Agents should discover patterns from existing code

#### Model Spec
**Detailed templates** - Shows complete implementation:
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

const MODEL_NAME = "{YourVegetable}";
const Item = mongoose.models[MODEL_NAME] || mongoose.model(MODEL_NAME, itemSchema);
```

**Why:** Tests if models can follow detailed instructions correctly

---

### 5. Scoring Rubric

Both specs score out of **100 points**, but with different emphasis:

#### Coding Agent Spec (Automated Testing)
| Category | Points | Focus |
|----------|--------|-------|
| Page renders | 5 | Basic functionality |
| TypeScript strictness | 5 | Code quality |
| GET all | 15 | Core CRUD |
| POST create | 15 | Core CRUD |
| GET by ID | 10 | Core CRUD |
| PUT update | 15 | **Critical: often missed** |
| DELETE | 10 | Core CRUD |
| Validation (empty) | 5 | Input validation |
| Validation (negative) | 5 | Input validation |
| XSS prevention | 5 | Security |
| Invalid ObjectId | 10 | Error handling |
| **Total** | **100** | |

**Plus Manual Evaluation:**
- Tool usage quality
- Discovery comments completeness
- Web research documentation
- UI design (subjective)

---

#### Model Spec (Comprehensive Testing)
| Category | Points | Focus |
|----------|--------|-------|
| **Core CRUD** | **40** | Correctness |
| Create | 10 | |
| Read all | 10 | |
| Read one | 5 | |
| Update | 10 | |
| Delete | 5 | |
| **Edge Cases** | **30** | Robustness |
| Invalid ObjectId | 5 | |
| Validation errors | 5 | |
| Empty collection | 3 | |
| Not found | 5 | |
| Concurrent updates | 3 | |
| Large/special input | 2 | |
| Missing optionals | 2 | |
| XSS prevention | 3 | |
| Optional fields | 2 | |
| **UI/UX** | **20** | Polish |
| Components render | 5 | |
| Loading states | 5 | |
| Error display | 5 | |
| Responsive design | 5 | |
| **Code Quality** | **10** | Maintainability |
| Type safety | 3 | |
| Code organization | 3 | |
| Error messages | 2 | |
| Comments | 2 | |
| **Total** | **100** | |

---

### 6. Common Mistakes

#### Both Specs Share:
- ❌ Invalid ObjectId crashes (should return 400)
- ❌ Missing useUpdateItem hook
- ❌ Components don't accept onUpdate prop
- ❌ Not handling XSS attempts
- ❌ Using excessive `any` types

#### Coding Agent Spec Specific:
- ❌ Not exploring existing code first ⭐
- ❌ Copy-pasting from other modules ⭐
- ❌ No discovery comments ⭐
- ❌ Not researching ObjectId validation online ⭐
- ❌ Inconsistent naming with existing modules ⭐

#### Model Spec Specific:
- ❌ Allowing zero price (must be POSITIVE)
- ❌ Not using `{ new: true }` in findByIdAndUpdate
- ❌ Returning error instead of [] for empty collection
- ❌ Not clearing form after submit

---

## Testing Methodology

### Automated Tests
Both specs use the same test file: `testing/run-tests.ts`

**Tests run:**
1. Secret file check (informational)
2. Page render check (5 pts)
3. TypeScript strictness (5 pts)
4. GET all items (15 pts)
5. POST create item (15 pts)
6. GET single item (10 pts)
7. PUT update item (15 pts)
8. DELETE item (10 pts)
9. Validation: empty name (5 pts)
10. Validation: negative price (5 pts)
11. XSS prevention (5 pts)
12. Invalid ObjectId handling (10 pts)

**Total:** 100 points automated

### Manual Evaluation

#### Coding Agent Spec
- Tool usage quality
- Discovery documentation
- Web research findings
- Codebase exploration approach

#### Model Spec
- Edge case handling (concurrent updates, large inputs)
- Code organization and readability
- Error message quality
- Comment clarity

---

## Timing Tracking

Use `testing/timing-data.json` to record:
- Start time (when agent begins)
- End time (when implementation complete)
- Duration in minutes and seconds
- Any notes about the process

**Format:**
```json
{
  "module": "apple",
  "agent": "Cursor",
  "startTime": "14:30:00",
  "endTime": "14:47:30",
  "durationMinutes": 17,
  "durationSeconds": 30,
  "notes": ""
}
```

---

## Success Criteria

### Coding Agent Spec
A successful agent will:
- ✅ Use tools effectively (search, grep, web fetch)
- ✅ Discover and follow existing patterns
- ✅ Document findings with comments
- ✅ Research best practices online
- ✅ Implement all CRUD including UPDATE
- ✅ Handle edge cases properly
- ✅ Build without errors

### Model Spec
A high-quality model will:
- ✅ Handle ALL edge cases correctly
- ✅ Return appropriate HTTP status codes
- ✅ Validate input thoroughly
- ✅ Show polish in UI (loading, errors)
- ✅ Use TypeScript properly
- ✅ Follow Next.js/React Query/Mongoose best practices
- ✅ Build without errors

---

## Presentation Flow

1. **Introduction**
   - Explain the two-dimensional comparison
   - Show data sources (fruits.json, vegetables.json)
   - Show coding agents and models being tested

2. **Part 1: Coding Agents (Fruits)**
   - Reveal which agent completed which fruit
   - Show automated test scores (/100)
   - Discuss tool usage observations
   - Show tier list ranking

3. **Part 2: LLM Models (Vegetables)**
   - Reveal which model completed which vegetable
   - Show automated test scores (/100)
   - Discuss quality/correctness observations
   - Show tier list ranking

4. **Part 3: Cross-Analysis**
   - Best overall: agent + model combination
   - Interesting patterns discovered
   - Tool capability differences
   - Model quality differences

---

## Files Overview

```
test_ai_tierlist/
├── specs/
│   ├── CODING_AGENT_SPEC.md     # Agent comparison
│   └── MODEL_SPEC.md             # Model comparison
├── data/
│   ├── fruits.json               # 10 fruits for agents
│   ├── vegetables.json           # 10 vegetables for models
│   ├── coding-agents.json        # 7 agents with colors
│   └── llm-models.json           # 7 models with colors
├── testing/
│   ├── run-tests.ts              # Automated test suite
│   ├── timing-data.json          # Manual timing records
│   └── results/
│       └── results.csv           # Test output
└── src/modules/
    ├── fruits/                   # Agent implementations
    │   ├── apple/
    │   ├── banana/
    │   └── ...
    └── vegetables/               # Model implementations
        ├── carrot/
        ├── broccoli/
        └── ...
```

---

## Quick Reference

### Coding Agent Spec
- **Focus:** Tool usage & exploration
- **Tests:** 7 coding agents
- **Module:** Fruits
- **Discovery:** Required BEFORE coding
- **Web research:** Required
- **Comments:** Discovery findings documented

### Model Spec
- **Focus:** Implementation quality
- **Tests:** 7 LLM models
- **Module:** Vegetables
- **Discovery:** Not emphasized
- **Web research:** Not required
- **Comments:** Code clarity only
