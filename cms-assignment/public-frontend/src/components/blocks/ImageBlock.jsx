export default function ImageBlock({ data }) {
  if (!data.url) return null;
  return (
    <figure>
      <img src={data.url} alt={data.alt || ''} className="w-full rounded-xl" loading="lazy" />
      {data.caption && <figcaption className="mt-2 text-sm text-gray-500 text-center">{data.caption}</figcaption>}
    </figure>
  );
}
