export default function CtaBlock({ data }) {
  return (
    <section className="bg-brand-600 rounded-2xl px-8 py-12 text-center text-white">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">{data.heading}</h2>
      {data.buttonLabel && (
        <a href={data.buttonHref || '#'} className="inline-block bg-white text-brand-700 font-medium px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors">
          {data.buttonLabel}
        </a>
      )}
    </section>
  );
}
