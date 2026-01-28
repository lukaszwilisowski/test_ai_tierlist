import fs from "fs/promises";
import path from "path";

interface TestResult {
  module: string;
  category: "fruits" | "vegetables";
  hasSecretFile: boolean;
  pageRenders: boolean;
  getAll: boolean;
  getById: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
  validation: boolean;
  invalidId: boolean;
  negativePrice: boolean;
  xssPrevention: boolean;
  tsStrictness: boolean;
  totalScore: number;
  timestamp: string;
}

const BASE_URL = "http://localhost:3000";

async function testModule(
  category: "fruits" | "vegetables",
  moduleName: string
): Promise<TestResult> {
  const result: TestResult = {
    module: moduleName,
    category,
    hasSecretFile: false,
    pageRenders: false,
    getAll: false,
    getById: false,
    create: false,
    update: false,
    delete: false,
    validation: false,
    invalidId: false,
    negativePrice: false,
    xssPrevention: false,
    tsStrictness: false,
    totalScore: 0,
    timestamp: new Date().toISOString(),
  };

  const apiBase = `${BASE_URL}/api/${category}/${moduleName}`;
  const modulePath = path.join(process.cwd(), 'src/modules', category, moduleName);
  let createdId: string | null = null;

  try {
    // Test 0a: Check for secret.txt (0 points, informational)
    try {
      await fs.access(path.join(modulePath, 'secret.txt'));
      result.hasSecretFile = true;
    } catch {
      result.hasSecretFile = false;
    }

    // Test 0b: Check if page renders (5 points)
    const pageRes = await fetch(`${BASE_URL}/${category}/${moduleName}`);
    if (pageRes.ok && pageRes.headers.get('content-type')?.includes('html')) {
      result.pageRenders = true;
      result.totalScore += 5;
    }

    // Test 0c: TypeScript strictness - check for excessive 'any' usage (5 points)
    let anyCount = 0;
    const filesToCheck = ['model.ts', 'api.ts', 'hooks.ts', 'components.tsx'];
    for (const file of filesToCheck) {
      try {
        const content = await fs.readFile(path.join(modulePath, file), 'utf-8');
        anyCount += (content.match(/:\s*any\b/g) || []).length;
      } catch {
        // File might not exist
      }
    }
    if (anyCount <= 3) {
      result.tsStrictness = true;
      result.totalScore += 5;
    }

    // Test 1: GET all (15 points)
    const getAllRes = await fetch(apiBase);
    if (getAllRes.ok) {
      const data = await getAllRes.json();
      if (data.success && Array.isArray(data.data)) {
        result.getAll = true;
        result.totalScore += 15;
      }
    }

    // Test 2: POST create (15 points)
    const createRes = await fetch(apiBase, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Item",
        description: "Automated test item",
        price: 9.99,
        inStock: true,
        quantity: 10,
      }),
    });
    if (createRes.status === 201) {
      const data = await createRes.json();
      if (data.success && data.data?._id) {
        result.create = true;
        result.totalScore += 15;
        createdId = data.data._id;
      }
    }

    // Test 3: GET by ID (10 points)
    if (createdId) {
      const getByIdRes = await fetch(`${apiBase}/${createdId}`);
      if (getByIdRes.ok) {
        const data = await getByIdRes.json();
        if (data.success && data.data?._id === createdId) {
          result.getById = true;
          result.totalScore += 10;
        }
      }
    }

    // Test 4: PUT update (15 points)
    if (createdId) {
      const updateRes = await fetch(`${apiBase}/${createdId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: 19.99, quantity: 5 }),
      });
      if (updateRes.ok) {
        const data = await updateRes.json();
        if (
          data.success &&
          data.data?.price === 19.99 &&
          data.data?.quantity === 5 &&
          data.data?.name === "Test Item" // Unchanged field verification
        ) {
          result.update = true;
          result.totalScore += 15;
        }
      }
    }

    // Test 5: DELETE (10 points)
    if (createdId) {
      const deleteRes = await fetch(`${apiBase}/${createdId}`, {
        method: "DELETE",
      });
      if (deleteRes.ok) {
        const data = await deleteRes.json();
        if (data.success) {
          result.delete = true;
          result.totalScore += 10;
        }
      }
    }

    // Test 6: Validation - empty name (5 points)
    const validationRes = await fetch(apiBase, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "", price: 10 }),
    });
    if (validationRes.status === 400) {
      result.validation = true;
      result.totalScore += 5;
    }

    // Test 7: Validation - negative price (5 points)
    const negativePriceRes = await fetch(apiBase, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Test", price: -5 }),
    });
    if (negativePriceRes.status === 400) {
      result.negativePrice = true;
      result.totalScore += 5;
    }

    // Test 8: XSS prevention (5 points)
    const xssRes = await fetch(apiBase, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: '<script>alert("xss")</script>',
        price: 10
      }),
    });
    // Should either reject (400) or sanitize/escape (201 but content is safe)
    if (xssRes.status === 400 || (xssRes.status === 201)) {
      const data = await xssRes.json();
      // If created, check it doesn't contain raw script tag
      if (xssRes.status === 400 || !data.data?.name.includes('<script>')) {
        result.xssPrevention = true;
        result.totalScore += 5;
      }
    }

    // Test 9: Invalid ID handling (10 points)
    const invalidIdRes = await fetch(`${apiBase}/invalid-not-objectid`);
    if (invalidIdRes.status === 400) {
      result.invalidId = true;
      result.totalScore += 10;
    }
  } catch (error) {
    console.error(`Error testing ${category}/${moduleName}:`, error);
  }

  return result;
}

async function discoverModules(
  category: "fruits" | "vegetables"
): Promise<string[]> {
  const modulesPath = path.join(process.cwd(), "src/modules", category);
  try {
    const folders = await fs.readdir(modulesPath);
    return folders.filter(async (folder) => {
      const configPath = path.join(modulesPath, folder, "config.ts");
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
  console.log("Starting automated tests...\n");

  const results: TestResult[] = [];

  // Test fruits (coding agents)
  const fruits = await discoverModules("fruits");
  console.log(`Found ${fruits.length} fruit modules`);
  for (const fruit of fruits) {
    console.log(`Testing fruits/${fruit}...`);
    const result = await testModule("fruits", fruit);
    results.push(result);
    console.log(`  Score: ${result.totalScore}/100`);
  }

  // Test vegetables (models)
  const vegetables = await discoverModules("vegetables");
  console.log(`\nFound ${vegetables.length} vegetable modules`);
  for (const vegetable of vegetables) {
    console.log(`Testing vegetables/${vegetable}...`);
    const result = await testModule("vegetables", vegetable);
    results.push(result);
    console.log(`  Score: ${result.totalScore}/100`);
  }

  // Generate CSV
  const csvHeader =
    "module,category,hasSecretFile,pageRenders,getAll,getById,create,update,delete,validation,invalidId,negativePrice,xssPrevention,tsStrictness,totalScore,timestamp";
  const csvRows = results.map(
    (r) =>
      `${r.module},${r.category},${r.hasSecretFile},${r.pageRenders},${r.getAll},${r.getById},${r.create},${r.update},${r.delete},${r.validation},${r.invalidId},${r.negativePrice},${r.xssPrevention},${r.tsStrictness},${r.totalScore},${r.timestamp}`
  );

  const csvContent = [csvHeader, ...csvRows].join("\n");

  // Save results
  const resultsDir = path.join(process.cwd(), "testing/results");
  await fs.mkdir(resultsDir, { recursive: true });
  await fs.writeFile(path.join(resultsDir, "results.csv"), csvContent);

  console.log("\n--- SUMMARY ---");
  console.log(`Total modules tested: ${results.length}`);
  console.log(`Results saved to: testing/results/results.csv`);

  // Print summary table
  console.log("\n| Module | Category | Score |");
  console.log("|--------|----------|-------|");
  for (const r of results) {
    console.log(`| ${r.module} | ${r.category} | ${r.totalScore}/100 |`);
  }
}

// Run tests
runAllTests().catch(console.error);
