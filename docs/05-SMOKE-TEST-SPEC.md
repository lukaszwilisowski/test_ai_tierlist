# Smoke Test Specification

## Purpose

A minimal test to verify the agent/model setup works before running the full specification. This should take less than 2 minutes to complete.

---

## For Coding Agents (Fruit Test)

### Instructions

1. Read `available-names/fruits.txt`
2. Pick a fruit name not yet used (check `src/modules/fruits/`)
3. Create a minimal module at `src/modules/fruits/{fruit}/`

### Minimal Files Required

Create exactly 2 files:

**src/modules/fruits/{fruit}/config.ts**:
```typescript
const config = {
  displayName: '{Fruit} Shop',
  description: 'A simple {fruit} shop',
  icon: '🍎', // Use appropriate emoji
};

export default config;
```

**src/modules/fruits/{fruit}/index.ts**:
```typescript
export const moduleName = '{fruit}';
export const isWorking = true;
```

### Success Criteria

- [ ] Files created in correct location
- [ ] config.ts exports default object
- [ ] Module name is consistent
- [ ] No TypeScript errors

---

## For LLM Models (Vegetable Test)

### Instructions

1. Read `available-names/vegetables.txt`
2. Pick a vegetable name not yet used (check `src/modules/vegetables/`)
3. Create a minimal module at `src/modules/vegetables/{vegetable}/`

### Minimal Files Required

Create exactly 2 files:

**src/modules/vegetables/{vegetable}/config.ts**:
```typescript
const config = {
  displayName: '{Vegetable} Shop',
  description: 'A simple {vegetable} shop',
  icon: '🥕', // Use appropriate emoji
};

export default config;
```

**src/modules/vegetables/{vegetable}/index.ts**:
```typescript
export const moduleName = '{vegetable}';
export const isWorking = true;
```

### Success Criteria

- [ ] Files created in correct location
- [ ] config.ts exports default object
- [ ] Module name is consistent
- [ ] No TypeScript errors

---

## Verification Commands

After the agent/model completes:

```bash
# Check files exist
ls -la src/modules/fruits/{fruit}/
ls -la src/modules/vegetables/{vegetable}/

# Check TypeScript
npx tsc --noEmit

# Quick import test
node -e "import('./src/modules/fruits/{fruit}/config.js').then(m => console.log(m.default))"
```

---

## What This Tests

| Aspect | Tested By |
|--------|-----------|
| Can read files | Reading available-names/*.txt |
| Can check directory | Checking existing modules |
| Can create files | Creating config.ts, index.ts |
| Can follow instructions | Correct file location |
| Basic TypeScript | Valid exports |

---

## If Smoke Test Fails

Common issues:

1. **Wrong directory** - Module created in wrong location
2. **Missing export** - config.ts doesn't export default
3. **Invalid TypeScript** - Syntax errors
4. **Name collision** - Picked already-used name

If smoke test fails, do not proceed to full spec. Debug the agent/model setup first.

---

## Timing

- Expected duration: < 2 minutes
- If takes longer: Something is wrong with setup
- If fails: Check agent configuration, model access
