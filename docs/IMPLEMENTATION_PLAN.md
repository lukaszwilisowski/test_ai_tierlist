# Implementation Plan

## Project Overview

**Goal**: Create a quasi-scientific comparison of AI coding agents and LLM models for JS Meetup Krakow presentation.

**Two Comparisons**:
1. **Coding Agents** (Cursor, Copilot, Claude Code, Roo Code, Cline, Antigravity, Codex) using same model (Claude Sonnet 4.5)
2. **LLM Models** (Sonnet 4.5, Opus 4.5, Codex 5.2, Codex 5.1 Max, Gemini Flash, DeepSeek) using same agent (Roo Code)

**Blind Evaluation**: Fruits = agents, Vegetables = models. Reveal during presentation.

---

## Phase 1: Base Project Setup

### 1.1 Create Next.js Project
```bash
npx create-next-app@latest ai-tierlist-shop --typescript --tailwind --eslint --app --src-dir
cd ai-tierlist-shop
```

### 1.2 Install Dependencies
```bash
npm install mongoose mongodb zod @tanstack/react-query @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install -D vitest
```

### 1.3 Create Directory Structure
```bash
mkdir -p src/modules/fruits
mkdir -p src/modules/vegetables
mkdir -p src/lib/database
mkdir -p .secrets/fruits
mkdir -p .secrets/vegetables
mkdir -p testing/results
mkdir -p public/logos
```

### 1.4 Environment Setup
Create `.env.local`:
```
MONGODB_URI=mongodb://localhost:27017/ai-tierlist
```

### 1.5 Core Files to Create

| File | Purpose | Reference |
|------|---------|-----------|
| `src/lib/database/connection.ts` | MongoDB connection | `docs/01-PROJECT-SETUP.md` |
| `src/lib/module-discovery.ts` | Auto-discover modules | `docs/02-MODULE-SYSTEM.md` |
| `src/lib/query-provider.tsx` | TanStack Query setup | `docs/01-PROJECT-SETUP.md` |
| `src/app/layout.tsx` | Root layout with providers | `docs/01-PROJECT-SETUP.md` |
| `src/app/page.tsx` | Homepage with auto-discovery | `docs/01-PROJECT-SETUP.md` |

### 1.6 Dynamic Routes

| Route | File | Purpose |
|-------|------|---------|
| `/api/[category]/[module]` | `src/app/api/[category]/[module]/route.ts` | Collection CRUD |
| `/api/[category]/[module]/[id]` | `src/app/api/[category]/[module]/[id]/route.ts` | Single item CRUD |
| `/[category]/[module]` | `src/app/[category]/[module]/page.tsx` | Module detail page |

### 1.7 Verification
```bash
npm run dev
# Visit http://localhost:3000
# Should show "No fruit modules yet" and "No vegetable modules yet"
```

---

## Phase 2: Smoke Testing

### 2.1 Test Agent Setup
1. Open your first coding agent (e.g., Claude Code)
2. Give it `specs/SMOKE_TEST_AGENT.md`
3. Verify it creates 2 files in `src/modules/fruits/{fruit}/`
4. Check `npm run build` passes

### 2.2 Test Model Setup
1. Open Roo Code with first model (e.g., Sonnet 4.5)
2. Give it `specs/SMOKE_TEST_MODEL.md`
3. Verify it creates 2 files in `src/modules/vegetables/{vegetable}/`
4. Check `npm run build` passes

### 2.3 If Smoke Test Fails
- Check agent/model has access to codebase
- Verify file paths are correct
- Check for TypeScript errors
- Debug before proceeding to full spec

---

## Phase 3: Agent Testing (Fruits)

### 3.1 Agents to Test

| # | Agent | Model | Notes |
|---|-------|-------|-------|
| 1 | Cursor | Sonnet 4.5 | Select Claude model in settings |
| 2 | GitHub Copilot | Sonnet 4.5 | Available in 2026 |
| 3 | Claude Code | Sonnet 4.5 | Native |
| 4 | Roo Code | Sonnet 4.5 | Configure provider |
| 5 | Cline | Sonnet 4.5 | Configure provider |
| 6 | Antigravity | Sonnet 4.5 | Google's new IDE |
| 7 | Codex CLI | Sonnet 4.5 | Via config.toml hack |

### 3.2 Testing Process (Per Agent)

1. **Start fresh session** in agent
2. **Provide spec**: Copy contents of `specs/CODING_AGENT_SPEC.md`
3. **Let agent work** - don't look at which fruit it picks
4. **Note the fruit name** secretly in `.secrets/fruits/{fruit}.json`:
   ```json
   {"agent": "Claude Code", "logo": "/logos/claude-code.svg"}
   ```
5. **Verify build**: `npm run build`
6. **Quick manual test**: Click module on homepage, try CRUD
7. **Move to next agent**

### 3.3 Expected Duration
- ~15-30 min per agent
- Total: 2-4 hours for all 7 agents

---

## Phase 4: Model Testing (Vegetables)

### 4.1 Models to Test

| # | Model | Provider | Tool |
|---|-------|----------|------|
| 1 | Sonnet 4.5 | Anthropic | Roo Code |
| 2 | Opus 4.5 | Anthropic | Roo Code |
| 3 | Codex 5.2 | OpenAI | Roo Code |
| 4 | Codex 5.1 Max | OpenAI | Roo Code |
| 5 | Gemini Flash | Google | Roo Code |
| 6 | DeepSeek | DeepSeek | Roo Code |

### 4.2 Testing Process (Per Model)

1. **Configure Roo Code** with target model
2. **Start fresh session**
3. **Provide spec**: Copy contents of `specs/MODEL_SPEC.md`
4. **Let model work** - don't look at which vegetable it picks
5. **Note the vegetable** secretly in `.secrets/vegetables/{vegetable}.json`:
   ```json
   {"model": "Sonnet 4.5", "logo": "/logos/anthropic.svg"}
   ```
6. **Verify build**: `npm run build`
7. **Quick manual test**: Click module, try CRUD
8. **Move to next model**

### 4.3 Expected Duration
- ~15-30 min per model
- Total: 1.5-3 hours for all 6 models

---

## Phase 5: Automated Testing

### 5.1 Setup Test Runner
Create `testing/run-tests.ts` per `docs/06-AUTOMATED-TESTING.md`

### 5.2 Run Tests
```bash
# Ensure app is running
npm run dev

# In another terminal
npx ts-node testing/run-tests.ts
```

### 5.3 Review Results
- Check `testing/results/results.csv`
- Note any failing tests
- Identify patterns (which modules struggle with what)

---

## Phase 6: Tierlist App

### 6.1 Create Tierlist Page
File: `src/app/tierlist/page.tsx`
Reference: `docs/07-TIERLIST-APP.md`

### 6.2 Components to Build

| Component | Purpose |
|-----------|---------|
| `TierlistBoard` | Container with tiers and DnD context |
| `TierRow` | Single S/A/B/C/D/F row |
| `DraggableItem` | Draggable fruit/vegetable/agent/model |
| `ItemPool` | Unranked items area |

### 6.3 Features to Implement
- [ ] Side-by-side layout (Expectations vs Reality)
- [ ] Tab switching (Agents / Models)
- [ ] Drag and drop between tiers
- [ ] Double-click reveal animation
- [ ] Reset on page refresh

### 6.4 Assets Needed
Download/create logos for `public/logos/`:
- cursor.svg
- copilot.svg
- claude-code.svg
- roo-code.svg
- cline.svg
- antigravity.svg
- codex.svg
- anthropic.svg
- openai.svg
- google.svg
- deepseek.svg

---

## Phase 7: Manual Evaluation

### 7.1 UI Testing Checklist (Per Module)

| Test | Pass/Fail |
|------|-----------|
| Page loads without errors | |
| Items display in grid | |
| Can create new item | |
| Can delete item | |
| Validation shows errors | |
| Loading states visible | |
| Empty state handled | |
| Responsive on mobile | |

### 7.2 Code Review Checklist (Per Module)

| Aspect | Score (1-5) |
|--------|-------------|
| Code cleanliness | |
| TypeScript usage | |
| Error handling | |
| Naming conventions | |
| Comments quality | |

### 7.3 Record Observations
Keep notes for each module (without revealing identity):
- "Apple: Clean code, missed edge case X"
- "Banana: Good UI but messy model.ts"
- etc.

---

## Phase 8: Presentation Prep

### 8.1 Fill in Secrets
Ensure all `.secrets/fruits/*.json` and `.secrets/vegetables/*.json` are populated.

### 8.2 Test Tierlist Reveal
1. Open tierlist page
2. Drag items to tiers
3. Double-click to reveal
4. Verify animations work
5. Test reset button

### 8.3 Prepare Backup
- Screenshot tierlists (before/after reveal)
- Record demo video as backup
- Export results.csv to slides

### 8.4 Practice Run
- Time yourself: 10 min intro, 10 min agents, 10 min models
- Practice transitions between sections
- Prepare for common questions

---

## Timeline Estimate

| Phase | Duration | Cumulative |
|-------|----------|------------|
| 1. Base Setup | 1-2 hours | 2 hours |
| 2. Smoke Tests | 30 min | 2.5 hours |
| 3. Agent Testing | 2-4 hours | 6 hours |
| 4. Model Testing | 1.5-3 hours | 9 hours |
| 5. Automated Testing | 30 min | 9.5 hours |
| 6. Tierlist App | 2-3 hours | 12 hours |
| 7. Manual Evaluation | 1-2 hours | 14 hours |
| 8. Presentation Prep | 1 hour | 15 hours |

**Total**: ~15 hours spread over several days

---

## Quick Reference

### File Locations

| What | Where |
|------|-------|
| Documentation | `docs/` |
| Agent spec | `specs/CODING_AGENT_SPEC.md` |
| Model spec | `specs/MODEL_SPEC.md` |
| Fruit names | `available-names/fruits.txt` |
| Vegetable names | `available-names/vegetables.txt` |
| Secret mappings | `.secrets/` |
| Test results | `testing/results/results.csv` |

### Commands

```bash
# Start dev server
npm run dev

# Build check
npm run build

# Run automated tests (app must be running)
npx ts-node testing/run-tests.ts
```

### Scoring Summary

| Category | Auto Points | Manual Points | Total |
|----------|-------------|---------------|-------|
| Build | 10 | - | 10 |
| CRUD | 35 | - | 35 |
| Validation | 10 | - | 10 |
| UI/UX | - | 20 | 20 |
| Code Quality | - | 25 | 25 |
| **Total** | **55** | **45** | **100** |

---

## Notes for Tomorrow

1. Start with **Phase 1** - get base project running
2. Do **smoke tests** before full specs
3. Test agents **sequentially**, noting fruits secretly
4. Don't peek at code until all testing done
5. Tierlist reveal is the fun part - save it for last!

Good luck with the presentation!
