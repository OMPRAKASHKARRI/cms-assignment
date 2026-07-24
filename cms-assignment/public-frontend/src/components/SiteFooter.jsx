export default function SiteFooter({ footer }) {
  return (
    <footer className="mt-24 border-t border-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <p>{footer?.text}</p>
        <div className="flex gap-6">
          {(footer?.links || []).map((l) => (
            <a key={l.href} href={l.href} className="hover:text-brand-600">{l.label}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}
