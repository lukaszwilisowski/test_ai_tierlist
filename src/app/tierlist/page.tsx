import Link from 'next/link';

export default function TierlistPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Tierlist Reveal</h1>
        <p className="text-gray-600 mb-8">
          Coming soon! The tierlist feature will be available after all modules
          are tested.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
