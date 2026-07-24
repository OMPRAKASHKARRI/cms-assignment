import ListItemEditor from './ListItemEditor';

const inputCls = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none';
const labelCls = 'block text-xs font-medium text-gray-500 mb-1';

// One form per block type. Each receives (data, onChange) and is fully
// controlled — the parent BlockList owns the actual blocks array, these
// components just render the right inputs for their `type`.
export default function BlockFields({ type, data, onChange }) {
  const set = (patch) => onChange({ ...data, ...patch });

  switch (type) {
    case 'hero':
      return (
        <div className="space-y-3">
          <div><label className={labelCls}>Eyebrow</label><input className={inputCls} value={data.eyebrow || ''} onChange={(e) => set({ eyebrow: e.target.value })} /></div>
          <div><label className={labelCls}>Heading</label><input className={inputCls} value={data.heading || ''} onChange={(e) => set({ heading: e.target.value })} /></div>
          <div><label className={labelCls}>Subheading</label><textarea className={inputCls} rows={2} value={data.subheading || ''} onChange={(e) => set({ subheading: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>CTA Label</label><input className={inputCls} value={data.ctaLabel || ''} onChange={(e) => set({ ctaLabel: e.target.value })} /></div>
            <div><label className={labelCls}>CTA Href</label><input className={inputCls} value={data.ctaHref || ''} onChange={(e) => set({ ctaHref: e.target.value })} /></div>
          </div>
          <div><label className={labelCls}>Image URL</label><input className={inputCls} value={data.imageUrl || ''} onChange={(e) => set({ imageUrl: e.target.value })} /></div>
        </div>
      );

    case 'header':
      return (
        <div className="grid grid-cols-4 gap-3">
          <div className="col-span-3"><label className={labelCls}>Text</label><input className={inputCls} value={data.text || ''} onChange={(e) => set({ text: e.target.value })} /></div>
          <div><label className={labelCls}>Level</label>
            <select className={inputCls} value={data.level || 2} onChange={(e) => set({ level: Number(e.target.value) })}>
              {[1, 2, 3, 4].map((l) => <option key={l} value={l}>H{l}</option>)}
            </select>
          </div>
        </div>
      );

    case 'paragraph':
    case 'richtext':
      return (
        <div>
          <label className={labelCls}>{type === 'richtext' ? 'Rich text (basic HTML allowed: <b> <i> <a> <br>)' : 'Text'}</label>
          <textarea className={inputCls} rows={5} value={data.text || ''} onChange={(e) => set({ text: e.target.value })} />
        </div>
      );

    case 'quote':
      return (
        <div className="space-y-3">
          <div><label className={labelCls}>Quote</label><textarea className={inputCls} rows={2} value={data.text || ''} onChange={(e) => set({ text: e.target.value })} /></div>
          <div><label className={labelCls}>Author</label><input className={inputCls} value={data.author || ''} onChange={(e) => set({ author: e.target.value })} /></div>
        </div>
      );

    case 'code':
      return (
        <div className="space-y-3">
          <div><label className={labelCls}>Language</label><input className={inputCls} value={data.language || ''} onChange={(e) => set({ language: e.target.value })} /></div>
          <div><label className={labelCls}>Code</label><textarea className={`${inputCls} font-mono`} rows={5} value={data.code || ''} onChange={(e) => set({ code: e.target.value })} /></div>
        </div>
      );

    case 'image':
      return (
        <div className="space-y-3">
          <div><label className={labelCls}>Image URL</label><input className={inputCls} value={data.url || ''} onChange={(e) => set({ url: e.target.value })} /></div>
          <div><label className={labelCls}>Alt text</label><input className={inputCls} value={data.alt || ''} onChange={(e) => set({ alt: e.target.value })} /></div>
          <div><label className={labelCls}>Caption</label><input className={inputCls} value={data.caption || ''} onChange={(e) => set({ caption: e.target.value })} /></div>
        </div>
      );

    case 'cta':
      return (
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2"><label className={labelCls}>Heading</label><input className={inputCls} value={data.heading || ''} onChange={(e) => set({ heading: e.target.value })} /></div>
          <div><label className={labelCls}>Button Label</label><input className={inputCls} value={data.buttonLabel || ''} onChange={(e) => set({ buttonLabel: e.target.value })} /></div>
          <div><label className={labelCls}>Button Href</label><input className={inputCls} value={data.buttonHref || ''} onChange={(e) => set({ buttonHref: e.target.value })} /></div>
        </div>
      );

    case 'equation':
      return (
        <div className="space-y-3">
          <div>
            <label className={labelCls}>LaTeX equation</label>
            <input className={`${inputCls} font-mono`} value={data.equation || ''} onChange={(e) => set({ equation: e.target.value })} placeholder="e.g. E = mc^2" />
          </div>
          <div><label className={labelCls}>Caption (optional)</label><input className={inputCls} value={data.caption || ''} onChange={(e) => set({ caption: e.target.value })} /></div>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={!!data.displayMode} onChange={(e) => set({ displayMode: e.target.checked })} />
            Display as centered block equation (unchecked = inline)
          </label>
        </div>
      );

    case 'list': {
      const items = data.items || [];
      const updateItem = (idx, updated) => {
        const next = [...items];
        next[idx] = updated;
        set({ items: next });
      };
      const removeItem = (idx) => set({ items: items.filter((_, i) => i !== idx) });
      const addItem = () => set({ items: [...items, { text: '', children: [] }] });

      return (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={labelCls}>Style</label>
            <select className="rounded border border-gray-300 text-xs px-2 py-1" value={data.style || 'unordered'} onChange={(e) => set({ style: e.target.value })}>
              <option value="unordered">Bulleted</option>
              <option value="ordered">Numbered</option>
            </select>
          </div>
          {items.map((item, idx) => (
            <ListItemEditor key={idx} item={item} onChange={(u) => updateItem(idx, u)} onRemove={() => removeItem(idx)} />
          ))}
          <button type="button" onClick={addItem} className="mt-2 text-xs font-medium text-brand-600 hover:underline">+ Add item</button>
        </div>
      );
    }

    case 'table': {
      const headers = data.headers || [];
      const rows = data.rows || [];
      const updateHeader = (idx, val) => {
        const next = [...headers]; next[idx] = val; set({ headers: next });
      };
      const updateCell = (r, c, val) => {
        const next = rows.map((row) => [...row]);
        next[r][c] = val;
        set({ rows: next });
      };
      const addColumn = () => set({ headers: [...headers, `Column ${headers.length + 1}`], rows: rows.map((r) => [...r, '']) });
      const addRow = () => set({ rows: [...rows, headers.map(() => '')] });
      const removeRow = (r) => set({ rows: rows.filter((_, i) => i !== r) });

      return (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="p-1">
                    <input className="w-full text-xs font-semibold px-2 py-1 border border-gray-200 rounded" value={h} onChange={(e) => updateHeader(i, e.target.value)} />
                  </th>
                ))}
                <th className="p-1"><button type="button" onClick={addColumn} className="text-xs text-brand-600">+ Col</button></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td key={c} className="p-1">
                      <input className="w-full text-xs px-2 py-1 border border-gray-200 rounded" value={cell} onChange={(e) => updateCell(r, c, e.target.value)} />
                    </td>
                  ))}
                  <td className="p-1"><button type="button" onClick={() => removeRow(r)} className="text-xs text-red-600">✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" onClick={addRow} className="mt-2 text-xs font-medium text-brand-600 hover:underline">+ Add row</button>
        </div>
      );
    }

    default:
      return <p className="text-sm text-red-500">Unknown block type: {type}</p>;
  }
}
