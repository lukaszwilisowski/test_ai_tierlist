# Smoke Test - LLM Model

Minimal test to verify setup works. Complete in under 2 minutes.

## Task

1. Read `available-names/vegetables.txt`
2. Pick an unused vegetable (check `src/modules/vegetables/`)
3. Create `src/modules/vegetables/{vegetable}/config.ts`:

```typescript
const config = {
  displayName: '{Vegetable} Shop',
  description: 'Test module',
  icon: '🥕',
};
export default config;
```

4. Create `src/modules/vegetables/{vegetable}/index.ts`:

```typescript
export const moduleName = '{vegetable}';
export const isWorking = true;
```

## Success

- [ ] Both files created in correct location
- [ ] No TypeScript errors
- [ ] Module name matches folder name
