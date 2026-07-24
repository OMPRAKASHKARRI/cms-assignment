import { useState } from 'react';
import BlockFields from './BlockFields';
import { BLOCK_TYPES, defaultDataFor } from './blockDefaults';

// Manages the ordered array of blocks for a page: add / remove / reorder
// (native HTML5 drag-and-drop, no extra dependency) / collapse-to-edit.
// The array + `order` field is the single source of truth; drag reordering
// just re-derives `order` from array position on drop.
export default function BlockList({ blocks, onChange }) {
  const [dragIndex, setDragIndex] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [collapsed, setCollapsed] = useState({});

  const sorted = [...blocks].sort((a, b) => a.order - b.order);

  const commit = (next) => {
    onChange(next.map((b, i) => ({ ...b, order: i })));
  };

  const addBlock = (type) => {
    commit([...sorted, { type, data: defaultDataFor(type), order: sorted.length }]);
    setOpenMenu(false);
  };

  const updateBlockData = (idx, data) => {
    const next = [...sorted];
    next[idx] = { ...next[idx], data };
    commit(next);
  };

  const removeBlock = (idx) => {
    commit(sorted.filter((_, i) => i !== idx));
  };

  const handleDrop = (idx) => {
    if (dragIndex === null || dragIndex === idx) return;
    const next = [...sorted];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(idx, 0, moved);
    commit(next);
    setDragIndex(null);
  };

  return (
    <div className="space-y-3">
      {sorted.map((block, idx) => {
        const meta = BLOCK_TYPES.find((b) => b.type === block.type);
        const isCollapsed = collapsed[idx];
        return (
          <div
            key={idx}
            draggable
            onDragStart={() => setDragIndex(idx)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(idx)}
            className="bg-white border border-gray-200 rounded-xl shadow-sm"
          >
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 cursor-grab bg-gray-50 rounded-t-xl">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <span className="text-gray-400" title="Drag to reorder">⠿</span>
                <span>{meta?.icon}</span>
                <span>{meta?.label || block.type}</span>
              </div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setCollapsed((c) => ({ ...c, [idx]: !c[idx] }))} className="text-xs text-gray-500 hover:text-gray-700">
                  {isCollapsed ? 'Expand' : 'Collapse'}
                </button>
                <button type="button" onClick={() => removeBlock(idx)} className="text-xs text-red-600 hover:underline">
                  Delete
                </button>
              </div>
            </div>
            {!isCollapsed && (
              <div className="p-4">
                <BlockFields type={block.type} data={block.data} onChange={(data) => updateBlockData(idx, data)} />
              </div>
            )}
          </div>
        );
      })}

      {sorted.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-8 border border-dashed border-gray-200 rounded-xl">
          No blocks yet — add one below to start building this page.
        </p>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenMenu((v) => !v)}
          className="w-full border-2 border-dashed border-gray-300 hover:border-brand-400 text-gray-500 hover:text-brand-600 rounded-xl py-3 text-sm font-medium transition-colors"
        >
          + Add block
        </button>
        {openMenu && (
          <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg grid grid-cols-2 gap-1 p-2">
            {BLOCK_TYPES.map((b) => (
              <button
                key={b.type}
                type="button"
                onClick={() => addBlock(b.type)}
                className="flex items-center gap-2 text-sm text-left px-3 py-2 rounded-lg hover:bg-gray-50"
              >
                <span>{b.icon}</span>{b.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
