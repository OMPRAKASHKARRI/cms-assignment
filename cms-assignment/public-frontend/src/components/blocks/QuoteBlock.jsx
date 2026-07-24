export default function QuoteBlock({ data }) {
  return (
    <blockquote className="border-l-4 border-brand-500 pl-6 py-1 italic text-gray-700">
      <p className="text-lg">&ldquo;{data.text}&rdquo;</p>
      {data.author && <cite className="block mt-2 text-sm text-gray-500 not-italic">— {data.author}</cite>}
    </blockquote>
  );
}
