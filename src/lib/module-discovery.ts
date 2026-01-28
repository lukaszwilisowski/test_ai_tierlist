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
        // Use dynamic import with webpack magic comments for proper resolution
        const config = await import(
          /* webpackMode: "lazy" */
          /* @vite-ignore */
          `../modules/${category}/${folder}/config`
        );
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
