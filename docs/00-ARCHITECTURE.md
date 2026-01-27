# Architecture Overview

## Experiment Goals

This project is a quasi-scientific experiment comparing:

1. **Coding Agents** (using same model: Claude Sonnet 4.5)
   - Cursor, Copilot, Claude Code, Roo Code, Cline, Antigravity, Codex
   - Tests: tool usage, file operations, multi-file editing, API integration

2. **LLM Models** (using same tool: Roo Code)
   - Sonnet 4.5, Opus 4.5, Codex 5.2, Codex 5.1 Max, Gemini Flash, DeepSeek
   - Tests: functional completeness, code quality, edge case handling

## Project Structure

```
ai-tierlist-experiment/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Homepage with category cards
│   │   ├── api/
│   │   │   └── [module]/               # Dynamic API routes
│   │   │       ├── route.ts
│   │   │       └── [id]/route.ts
│   │   ├── [module]/                   # Dynamic module pages
│   │   │   └── page.tsx
│   │   └── tierlist/                   # Tierlist reveal app
│   │       └── page.tsx
│   ├── modules/                        # AUTO-DISCOVERED modules
│   │   ├── fruits/                     # Coding agent implementations
│   │   │   ├── apple/                  # Agent 1's work
│   │   │   │   ├── index.ts            # Module exports
│   │   │   │   ├── schema.ts           # Zod schema
│   │   │   │   ├── model.ts            # Mongoose model
│   │   │   │   ├── components.tsx      # React components
│   │   │   │   └── config.ts           # Module metadata
│   │   │   ├── banana/                 # Agent 2's work
│   │   │   └── ...
│   │   └── vegetables/                 # LLM implementations
│   │       ├── carrot/                 # Model 1's work
│   │       ├── potato/                 # Model 2's work
│   │       └── ...
│   ├── lib/
│   │   ├── database/
│   │   │   └── connection.ts           # MongoDB connection
│   │   ├── module-discovery.ts         # Auto-discovery logic
│   │   └── api-helpers.ts              # Shared API utilities
│   └── components/
│       ├── module-card.tsx             # Generic module card
│       └── tierlist/                   # Tierlist components
├── .secrets/                           # GITIGNORED - answer files
│   ├── fruits/
│   │   ├── apple.json                  # {"agent": "Claude Code"}
│   │   └── banana.json                 # {"agent": "Cursor"}
│   └── vegetables/
│       ├── carrot.json                 # {"model": "Sonnet 4.5"}
│       └── potato.json                 # {"model": "DeepSeek"}
├── specs/
│   ├── CODING_AGENT_SPEC.md            # Instructions for agent test
│   ├── MODEL_SPEC.md                   # Instructions for model test
│   └── SMOKE_TEST_SPEC.md              # Quick validation test
├── testing/
│   ├── run-tests.ts                    # Automated test runner
│   └── results/                        # Test output directory
├── available-names/
│   ├── fruits.txt                      # List of available fruit names
│   └── vegetables.txt                  # List of available vegetable names
└── docs/                               # This documentation
```

## Key Design Decisions

### 1. Auto-Discovery Mechanism

Modules are discovered at build/runtime by scanning `src/modules/fruits/` and `src/modules/vegetables/`. No central registry file that multiple agents would edit.

```typescript
// src/lib/module-discovery.ts
export async function discoverModules(category: 'fruits' | 'vegetables') {
  const modulePath = path.join(process.cwd(), 'src/modules', category);
  const folders = await fs.readdir(modulePath);

  return Promise.all(folders.map(async (folder) => {
    const config = await import(`@/modules/${category}/${folder}/config`);
    return { name: folder, ...config.default };
  }));
}
```

### 2. Blind Evaluation

- Agent creates module in folder named after fruit/vegetable
- Answer file stored separately in `.secrets/` (not in module)
- During evaluation, I see "Apple Shop" not "Claude Code Shop"
- Reveal happens only in tierlist app

### 3. No Shared Files

Each module is completely self-contained:
- Own schema
- Own model
- Own components
- Own config

The only shared code is:
- Database connection (read-only usage)
- Discovery mechanism (read-only)
- Base layout/styles

### 4. Category Separation

| Category | Codename Type | Test Focus | Spec File |
|----------|---------------|------------|-----------|
| Coding Agents | Fruits | Tool usage, file ops | CODING_AGENT_SPEC.md |
| LLM Models | Vegetables | Functionality, quality | MODEL_SPEC.md |

## Data Flow

```
1. PREPARATION
   ┌─────────────────────────────────────────────────┐
   │ fruits.txt contains: apple, banana, cherry...   │
   │ vegetables.txt contains: carrot, potato...      │
   └─────────────────────────────────────────────────┘
                          │
                          ▼
2. AGENT/MODEL EXECUTION
   ┌─────────────────────────────────────────────────┐
   │ Agent reads spec, picks fruit name              │
   │ Creates module folder: src/modules/fruits/apple │
   │ Implements all required functionality           │
   └─────────────────────────────────────────────────┘
                          │
                          ▼
3. MANUAL TRACKING (by me)
   ┌─────────────────────────────────────────────────┐
   │ I note which agent created which fruit          │
   │ Store in .secrets/fruits/apple.json             │
   │ This is NOT done by the agent                   │
   └─────────────────────────────────────────────────┘
                          │
                          ▼
4. TESTING
   ┌─────────────────────────────────────────────────┐
   │ Automated: API tests → results.csv              │
   │ Manual: UI testing, code review                 │
   └─────────────────────────────────────────────────┘
                          │
                          ▼
5. PRESENTATION
   ┌─────────────────────────────────────────────────┐
   │ Tierlist 1: Drag fruits to tiers (my ratings)  │
   │ Tierlist 2: Expectations (what I thought)      │
   │ Double-click fruit → reveals actual agent      │
   └─────────────────────────────────────────────────┘
```

## Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Database**: MongoDB with Mongoose
- **Validation**: Zod schemas
- **State Management**: TanStack Query
- **Styling**: Tailwind CSS
- **Testing**: Custom test runner + Vitest for API tests
- **Tierlist**: React DnD or dnd-kit for drag-and-drop

## Success Criteria

The architecture succeeds if:

1. ✅ Multiple agents can work on same codebase without conflicts
2. ✅ I cannot identify which agent created which module during evaluation
3. ✅ Automated tests produce objective metrics
4. ✅ Manual testing reveals subjective quality differences
5. ✅ Tierlist reveal creates engaging presentation moment
