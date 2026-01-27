# Project Setup

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or pnpm

## Initial Setup

### 1. Create Next.js Project

```bash
npx create-next-app@latest ai-tierlist-shop --typescript --tailwind --eslint --app --src-dir
cd ai-tierlist-shop
```

### 2. Install Dependencies

```bash
# Database
npm install mongoose mongodb

# Validation
npm install zod

# State management
npm install @tanstack/react-query

# Drag and drop (for tierlist)
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# Testing
npm install -D vitest @testing-library/react
```

### 3. Environment Variables

Create `.env.local`:

```env
MONGODB_URI=mongodb://localhost:27017/ai-tierlist
# Or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ai-tierlist
```

### 4. Create Base Directory Structure

```bash
# Module directories
mkdir -p src/modules/fruits
mkdir -p src/modules/vegetables

# Secrets (gitignored)
mkdir -p .secrets/fruits
mkdir -p .secrets/vegetables

# Available names
mkdir -p available-names

# Specs
mkdir -p specs

# Testing
mkdir -p testing/results

# Shared libs
mkdir -p src/lib/database
```

### 5. Create .gitignore Additions

Add to `.gitignore`:

```
# Secrets - agent/model mappings
.secrets/

# Test results
testing/results/
```

### 6. Create Available Names Files

**available-names/fruits.txt**:
```
apple
banana
cherry
date
elderberry
fig
grape
honeydew
kiwi
lemon
mango
nectarine
orange
papaya
quince
raspberry
strawberry
tangerine
ugli
watermelon
```

**available-names/vegetables.txt**:
```
artichoke
beetroot
carrot
daikon
eggplant
fennel
garlic
horseradish
iceberg
jalapeno
kale
leek
mushroom
napa
onion
parsnip
quinoa
radish
spinach
turnip
```

## Base Files to Create

### Database Connection

**src/lib/database/connection.ts**:
```typescript
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
```

### Module Discovery

**src/lib/module-discovery.ts**:
```typescript
import fs from 'fs/promises';
import path from 'path';

export interface ModuleConfig {
  name: string;
  displayName: string;
  description: string;
  icon: string;
  category: 'fruits' | 'vegetables';
}

export async function discoverModules(
  category: 'fruits' | 'vegetables'
): Promise<ModuleConfig[]> {
  const modulesPath = path.join(process.cwd(), 'src/modules', category);

  try {
    const folders = await fs.readdir(modulesPath);
    const modules: ModuleConfig[] = [];

    for (const folder of folders) {
      const configPath = path.join(modulesPath, folder, 'config.ts');

      try {
        await fs.access(configPath);
        // Dynamic import would happen here at runtime
        // For now, we read the config file
        const config = await import(`@/modules/${category}/${folder}/config`);
        modules.push({
          name: folder,
          category,
          ...config.default,
        });
      } catch {
        // Skip folders without config
        console.warn(`Module ${folder} missing config.ts`);
      }
    }

    return modules;
  } catch {
    return [];
  }
}

export async function getModuleByName(
  category: 'fruits' | 'vegetables',
  name: string
) {
  const modules = await discoverModules(category);
  return modules.find((m) => m.name === name);
}
```

### Query Client Provider

**src/lib/query-provider.tsx**:
```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### Root Layout Update

**src/app/layout.tsx**:
```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/lib/query-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Tierlist Shop',
  description: 'Comparing AI coding agents and models',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
```

### Homepage with Auto-Discovery

**src/app/page.tsx**:
```typescript
import { discoverModules } from '@/lib/module-discovery';
import Link from 'next/link';

export default async function HomePage() {
  const fruits = await discoverModules('fruits');
  const vegetables = await discoverModules('vegetables');

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        AI Tierlist Shop
      </h1>

      {/* Fruits Section - Coding Agents */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          Fruits Shop
        </h2>
        {fruits.length === 0 ? (
          <p className="text-gray-500">No fruit modules yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fruits.map((module) => (
              <Link
                key={module.name}
                href={`/fruits/${module.name}`}
                className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
              >
                <div className="text-4xl mb-2">{module.icon}</div>
                <h3 className="text-xl font-medium">{module.displayName}</h3>
                <p className="text-gray-600">{module.description}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Vegetables Section - LLM Models */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          Vegetables Shop
        </h2>
        {vegetables.length === 0 ? (
          <p className="text-gray-500">No vegetable modules yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vegetables.map((module) => (
              <Link
                key={module.name}
                href={`/vegetables/${module.name}`}
                className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
              >
                <div className="text-4xl mb-2">{module.icon}</div>
                <h3 className="text-xl font-medium">{module.displayName}</h3>
                <p className="text-gray-600">{module.description}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Tierlist Link */}
      <div className="text-center">
        <Link
          href="/tierlist"
          className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          Open Tierlist Reveal
        </Link>
      </div>
    </main>
  );
}
```

## Verification Checklist

After setup, verify:

- [ ] `npm run dev` starts without errors
- [ ] Homepage loads at http://localhost:3000
- [ ] "No fruit modules yet" and "No vegetable modules yet" displayed
- [ ] MongoDB connection works (check console for errors)
- [ ] `.secrets/` directory is gitignored

## Next Steps

1. Read `02-MODULE-SYSTEM.md` to understand module structure
2. Read `03-CODING-AGENT-SPEC.md` for agent testing
3. Read `04-MODEL-SPEC.md` for model testing
4. Run smoke test with `05-SMOKE-TEST-SPEC.md`
