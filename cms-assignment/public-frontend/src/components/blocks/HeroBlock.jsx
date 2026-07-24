export default function HeroBlock({ data }) {
  return (
    <section className="relative bg-gray-900 text-white">
      {data.imageUrl && (
        <div className="absolute inset-0">
          <img src={data.imageUrl} alt="" className="w-full h-full object-cover opacity-40" />
        </div>
      )}
      <div className="relative max-w-5xl mx-auto px-6 py-24 text-center">
        {data.eyebrow && <p className="text-brand-400 font-medium mb-3 tracking-wide uppercase text-sm">{data.eyebrow}</p>}
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">{data.heading}</h1>
        {data.subheading && <p className="text-lg text-gray-200 max-w-2xl mx-auto mb-8">{data.subheading}</p>}
        {data.ctaLabel && (
          <a href={data.ctaHref || '#'} className="inline-block bg-brand-600 hover:bg-brand-500 text-white font-medium px-6 py-3 rounded-lg transition-colors">
            {data.ctaLabel}
          </a>
        )}
      </div>
    </section>
  );
}
