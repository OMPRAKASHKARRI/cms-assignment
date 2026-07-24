export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-6 py-32 text-center">
      <p className="text-6xl mb-4">🌱</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
      <p className="text-gray-500 mb-6">This page doesn&apos;t exist, or hasn&apos;t been published yet.</p>
      <a href="/" className="text-brand-600 font-medium hover:underline">Back to home</a>
    </div>
  );
}
