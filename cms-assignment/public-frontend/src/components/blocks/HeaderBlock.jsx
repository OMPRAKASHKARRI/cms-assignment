export default function HeaderBlock({ data }) {
  const Tag = `h${data.level || 2}`;
  const sizes = { 1: 'text-4xl', 2: 'text-3xl', 3: 'text-2xl', 4: 'text-xl' };
  return <Tag className={`${sizes[data.level] || sizes[2]} font-bold tracking-tight text-gray-900`}>{data.text}</Tag>;
}
