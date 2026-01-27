# Automated Testing

## Purpose

Generate objective metrics for each module implementation. Results are saved to `testing/results/results.csv` for comparison.

---

## Test Runner Setup

### Install Dependencies

```bash
npm install -D vitest @testing-library/react jsdom
```

### Vitest Config

**vitest.config.ts**:
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

---

## Test Runner Script

**testing/run-tests.ts**:
```typescript
import fs from 'fs/promises';
import path from 'path';

interface TestResult {
  module: string;
  category: 'fruits' | 'vegetables';
  buildPasses: boolean;
  getAll: boolean;
  getById: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
  validation: boolean;
  invalidId: boolean;
  totalScore: number;
  timestamp: string;
}

const BASE_URL = 'http://localhost:3000';

async function testModule(
  category: 'fruits' | 'vegetables',
  moduleName: string
): Promise<TestResult> {
  const result: TestResult = {
    module: moduleName,
    category,
    buildPasses: false,
    getAll: false,
    getById: false,
    create: false,
    update: false,
    delete: false,
    validation: false,
    invalidId: false,
    totalScore: 0,
    timestamp: new Date().toISOString(),
  };

  const apiBase = `${BASE_URL}/api/${category}/${moduleName}`;
  let createdId: string | null = null;

  try {
    // Test 1: GET all (10 points)
    const getAllRes = await fetch(apiBase);
    if (getAllRes.ok) {
      const data = await getAllRes.json();
      if (data.success && Array.isArray(data.data)) {
        result.getAll = true;
        result.totalScore += 10;
      }
    }

    // Test 2: POST create (10 points)
    const createRes = await fetch(apiBase, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Item',
        description: 'Automated test item',
        price: 9.99,
        inStock: true,
        quantity: 10,
      }),
    });
    if (createRes.status === 201) {
      const data = await createRes.json();
      if (data.success && data.data?._id) {
        result.create = true;
        result.totalScore += 10;
        createdId = data.data._id;
      }
    }

    // Test 3: GET by ID (5 points)
    if (createdId) {
      const getByIdRes = await fetch(`${apiBase}/${createdId}`);
      if (getByIdRes.ok) {
        const data = await getByIdRes.json();
        if (data.success && data.data?._id === createdId) {
          result.getById = true;
          result.totalScore += 5;
        }
      }
    }

    // Test 4: PUT update (5 points)
    if (createdId) {
      const updateRes = await fetch(`${apiBase}/${createdId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: 19.99 }),
      });
      if (updateRes.ok) {
        const data = await updateRes.json();
        if (data.success && data.data?.price === 19.99) {
          result.update = true;
          result.totalScore += 5;
        }
      }
    }

    // Test 5: DELETE (5 points)
    if (createdId) {
      const deleteRes = await fetch(`${apiBase}/${createdId}`, {
        method: 'DELETE',
      });
      if (deleteRes.ok) {
        const data = await deleteRes.json();
        if (data.success) {
          result.delete = true;
          result.totalScore += 5;
        }
      }
    }

    // Test 6: Validation - empty name (5 points)
    const validationRes = await fetch(apiBase, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '', price: 10 }),
    });
    if (validationRes.status === 400) {
      result.validation = true;
      result.totalScore += 5;
    }

    // Test 7: Invalid ID handling (5 points)
    const invalidIdRes = await fetch(`${apiBase}/invalid-not-objectid`);
    if (invalidIdRes.status === 400) {
      result.invalidId = true;
      result.totalScore += 5;
    }

    // Build passes assumed if API works
    if (result.getAll || result.create) {
      result.buildPasses = true;
      result.totalScore += 10;
    }
  } catch (error) {
    console.error(`Error testing ${category}/${moduleName}:`, error);
  }

  return result;
}

async function discoverModules(
  category: 'fruits' | 'vegetables'
): Promise<string[]> {
  const modulesPath = path.join(process.cwd(), 'src/modules', category);
  try {
    const folders = await fs.readdir(modulesPath);
    return folders.filter(async (folder) => {
      const configPath = path.join(modulesPath, folder, 'config.ts');
      try {
        await fs.access(configPath);
        return true;
      } catch {
        return false;
      }
    });
  } catch {
    return [];
  }
}

async function runAllTests() {
  console.log('Starting automated tests...\n');

  const results: TestResult[] = [];

  // Test fruits (coding agents)
  const fruits = await discoverModules('fruits');
  console.log(`Found ${fruits.length} fruit modules`);
  for (const fruit of fruits) {
    console.log(`Testing fruits/${fruit}...`);
    const result = await testModule('fruits', fruit);
    results.push(result);
    console.log(`  Score: ${result.totalScore}/55`);
  }

  // Test vegetables (models)
  const vegetables = await discoverModules('vegetables');
  console.log(`\nFound ${vegetables.length} vegetable modules`);
  for (const vegetable of vegetables) {
    console.log(`Testing vegetables/${vegetable}...`);
    const result = await testModule('vegetables', vegetable);
    results.push(result);
    console.log(`  Score: ${result.totalScore}/55`);
  }

  // Generate CSV
  const csvHeader =
    'module,category,buildPasses,getAll,getById,create,update,delete,validation,invalidId,totalScore,timestamp';
  const csvRows = results.map(
    (r) =>
      `${r.module},${r.category},${r.buildPasses},${r.getAll},${r.getById},${r.create},${r.update},${r.delete},${r.validation},${r.invalidId},${r.totalScore},${r.timestamp}`
  );

  const csvContent = [csvHeader, ...csvRows].join('\n');

  // Save results
  const resultsDir = path.join(process.cwd(), 'testing/results');
  await fs.mkdir(resultsDir, { recursive: true });
  await fs.writeFile(path.join(resultsDir, 'results.csv'), csvContent);

  console.log('\n--- SUMMARY ---');
  console.log(`Total modules tested: ${results.length}`);
  console.log(`Results saved to: testing/results/results.csv`);

  // Print summary table
  console.log('\n| Module | Category | Score |');
  console.log('|--------|----------|-------|');
  for (const r of results) {
    console.log(`| ${r.module} | ${r.category} | ${r.totalScore}/55 |`);
  }
}

// Run tests
runAllTests().catch(console.error);
```

---

## Running Tests

### Prerequisites

1. App must be running: `npm run dev`
2. MongoDB must be accessible
3. At least one module must exist

### Execute Tests

```bash
# Using ts-node
npx ts-node testing/run-tests.ts

# Or add to package.json scripts
npm run test:modules
```

### Package.json Addition

```json
{
  "scripts": {
    "test:modules": "ts-node testing/run-tests.ts"
  }
}
```

---

## Results Format

**testing/results/results.csv**:
```csv
module,category,buildPasses,getAll,getById,create,update,delete,validation,invalidId,totalScore,timestamp
apple,fruits,true,true,true,true,true,true,true,false,50,2025-01-27T10:00:00.000Z
banana,fruits,true,true,true,true,false,true,true,true,50,2025-01-27T10:01:00.000Z
carrot,vegetables,true,true,true,true,true,true,true,true,55,2025-01-27T10:02:00.000Z
```

---

## Scoring Breakdown

| Test | Points | What It Validates |
|------|--------|-------------------|
| Build Passes | 10 | App runs without errors |
| GET All | 10 | Can list items |
| Create | 10 | Can add new items |
| GET by ID | 5 | Can retrieve single item |
| Update | 5 | Can modify items |
| Delete | 5 | Can remove items |
| Validation | 5 | Rejects invalid input |
| Invalid ID | 5 | Handles bad IDs gracefully |
| **Total** | **55** | |

---

## Interpreting Results

### Score Ranges

| Score | Interpretation |
|-------|----------------|
| 50-55 | Excellent - All core features working |
| 40-49 | Good - Minor issues |
| 30-39 | Fair - Some features broken |
| 20-29 | Poor - Major issues |
| <20 | Failing - Fundamentally broken |

### Common Failure Patterns

1. **Build fails** (0 points) - Module has syntax/import errors
2. **GET works, POST fails** - Validation or DB issue
3. **Invalid ID returns 500** - Missing ObjectId validation
4. **Validation returns 200** - Schema not properly applied

---

## Manual Testing Supplement

The automated tests cover **objective metrics**. For subjective evaluation:

### UI Testing Checklist

- [ ] Page loads without errors
- [ ] Items display correctly
- [ ] Form works (create item)
- [ ] Delete button works
- [ ] Loading states visible
- [ ] Error messages helpful
- [ ] Responsive on mobile

### Code Review Checklist

- [ ] Clean, readable code
- [ ] Proper TypeScript types
- [ ] No console.log spam
- [ ] Consistent naming
- [ ] Error handling complete

---

## Test Database Cleanup

After running tests, clean up test data:

```bash
# MongoDB shell
use ai-tierlist
db.Apple.deleteMany({ name: 'Test Item' })
db.Carrot.deleteMany({ name: 'Test Item' })
# ... repeat for each module
```

Or add cleanup to test runner:

```typescript
// At end of testModule()
if (createdId) {
  await fetch(`${apiBase}/${createdId}`, { method: 'DELETE' });
}
```
