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
        <h2 className="text-2xl font-semibold mb-4">Fruits Shop</h2>
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
        <h2 className="text-2xl font-semibold mb-4">Vegetables Shop</h2>
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

