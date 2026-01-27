# Smoke Test - Coding Agent

Minimal test to verify setup works. Complete in under 2 minutes.

## Task

1. Read `available-names/fruits.txt`
2. Pick an unused fruit (check `src/modules/fruits/`)
3. Create `src/modules/fruits/{fruit}/config.ts`:

```typescript
const config = {
  displayName: '{Fruit} Shop',
  description: 'Test module',
  icon: '🍎',
};
export default config;
```

4. Create `src/modules/fruits/{fruit}/index.ts`:

```typescript
export const moduleName = '{fruit}';
export const isWorking = true;
```

## Success

- [ ] Both files created in correct location
- [ ] No TypeScript errors
- [ ] Module name matches folder name
