// Recursive editor for one node of a nested list. Mirrors the recursive
// ListItemSchema on the backend (text + children[]), so arbitrarily deep
// nesting "just works" without special-casing depth.
export default function ListItemEditor({ item, onChange, onRemove, depth = 0 }) {
  const updateText = (text) => onChange({ ...item, text });

  const addChild = () => {
    onChange({ ...item, children: [...(item.children || []), { text: '', children: [] }] });
  };

  const updateChild = (idx, updated) => {
    const children = [...item.children];
    children[idx] = updated;
    onChange({ ...item, children });
  };

  const removeChild = (idx) => {
    onChange({ ...item, children: item.children.filter((_, i) => i !== idx) });
  };

  return (
    <div style={{ marginLeft: depth * 20 }} className="mt-2">
      <div className="flex items-center gap-2">
        <input
          value={item.text}
          onChange={(e) => updateText(e.target.value)}
          placeholder="List item text"
          className="flex-1 rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
        />
        <button type="button" onClick={addChild} className="text-xs text-brand-600 hover:underline whitespace-nowrap">
          + Sub-item
        </button>
        <button type="button" onClick={onRemove} className="text-xs text-red-600 hover:underline">
          Remove
        </button>
      </div>
      {(item.children || []).map((child, idx) => (
        <ListItemEditor
          key={idx}
          item={child}
          depth={depth + 1}
          onChange={(updated) => updateChild(idx, updated)}
          onRemove={() => removeChild(idx)}
        />
      ))}
    </div>
  );
}
