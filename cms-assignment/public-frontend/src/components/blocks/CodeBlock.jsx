export default function CodeBlock({ data }) {
  return (
    <div className="rounded-lg overflow-hidden border border-gray-800">
      {data.language && (
        <div className="bg-gray-800 text-gray-400 text-xs px-4 py-1.5 font-mono">{data.language}</div>
      )}
      <pre className="bg-gray-900 text-gray-100 p-4 overflow-x-auto text-sm"><code>{data.code}</code></pre>
    </div>
  );
}
