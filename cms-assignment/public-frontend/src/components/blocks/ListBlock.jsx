function ListItems({ items, ordered }) {
  const Tag = ordered ? 'ol' : 'ul';
  return (
    <Tag className={`${ordered ? 'list-decimal' : 'list-disc'} pl-6 space-y-1 text-gray-700`}>
      {items.map((item, idx) => (
        <li key={idx}>
          {item.text}
          {item.children?.length > 0 && (
            <div className="mt-1">
              <ListItems items={item.children} ordered={ordered} />
            </div>
          )}
        </li>
      ))}
    </Tag>
  );
}

export default function ListBlock({ data }) {
  return <ListItems items={data.items || []} ordered={data.style === 'ordered'} />;
}
