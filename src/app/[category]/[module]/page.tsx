'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ category: string; module: string }>;
}

export default function ModulePage({ params }: PageProps) {
  const [resolvedParams, setResolvedParams] = useState<{
    category: string;
    module: string;
  } | null>(null);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  if (!resolvedParams) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">Loading...</div>
      </div>
    );
  }

  return <ModulePageContent {...resolvedParams} />;
}

function ModulePageContent({
  category,
  module,
}: {
  category: string;
  module: string;
}) {
  const [ModuleComponents, setModuleComponents] = useState<any>(null);
  const [hooks, setHooks] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Dynamically load module
    Promise.all([
      import(`@/modules/${category}/${module}/components`),
      import(`@/modules/${category}/${module}/hooks`),
      import(`@/modules/${category}/${module}/config`),
    ])
      .then(([components, hooksModule, configModule]) => {
        setModuleComponents(components);
        setHooks(hooksModule);
        setConfig(configModule.default);
      })
      .catch((err) => {
        console.error('Failed to load module:', err);
        setError('Module not found');
      });
  }, [category, module]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-700 mb-4">
            Module Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The module "{module}" in category "{category}" does not exist yet.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!ModuleComponents || !hooks || !config) {
    return <div className="p-8 text-center">Loading module...</div>;
  }

  return (
    <ModulePageLoaded config={config} Components={ModuleComponents} hooks={hooks} />
  );
}

function ModulePageLoaded({ config, Components, hooks }: any) {
  const { data: items, isLoading, error } = hooks.useItems();
  const createMutation = hooks.useCreateItem();
  const deleteMutation = hooks.useDeleteItem();
  const updateMutation = hooks.useUpdateItem();
  const seedMutation = hooks.useSeedItems?.();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <span>{config.icon}</span>
            {config.displayName}
          </h1>
          <p className="text-gray-600">{config.description}</p>
        </div>
        <Link href="/" className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
          Back to Home
        </Link>
      </div>

      <div className="mb-8">
        <Components.AddItemForm
          onSubmit={(data: any) => createMutation.mutate(data)}
          isLoading={createMutation.isPending}
          onSeed={seedMutation ? () => seedMutation.mutate() : undefined}
          isSeedLoading={seedMutation?.isPending}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          Error loading items: {error.message}
        </div>
      )}

      {createMutation.isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          Error creating item: {createMutation.error.message}
        </div>
      )}

      {deleteMutation.isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          Error deleting item: {deleteMutation.error.message}
        </div>
      )}

      {seedMutation?.isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          Error seeding data: {seedMutation.error.message}
        </div>
      )}

      {seedMutation?.isSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          Successfully seeded data!
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">Loading items...</div>
      ) : (
        <Components.ItemList
          items={items || []}
          onDelete={(id: string) => deleteMutation.mutate(id)}
          onUpdate={(id: string, data: any) => updateMutation.mutate({ id, data })}
        />
      )}
    </div>
  );
}
