'use client';

export default function ErrorBoundary({ error, reset }) {
  return (
    <div className="max-w-xl mx-auto px-6 py-32 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
      <p className="text-gray-500 mb-6">We couldn&apos;t load this page. Please try again.</p>
      <button onClick={reset} className="bg-brand-600 hover:bg-brand-700 text-white font-medium px-5 py-2.5 rounded-lg">
        Retry
      </button>
    </div>
  );
}
