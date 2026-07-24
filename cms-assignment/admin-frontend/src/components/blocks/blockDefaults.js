// Sensible empty payload per block type so "+ Add block" drops in something
// the editor form can render immediately instead of an empty object.
export const BLOCK_TYPES = [
  { type: 'hero', label: 'Hero', icon: '🏔️' },
  { type: 'header', label: 'Header', icon: '🔠' },
  { type: 'paragraph', label: 'Paragraph', icon: '📝' },
  { type: 'richtext', label: 'Rich Text', icon: '🖋️' },
  { type: 'list', label: 'List (nested)', icon: '📋' },
  { type: 'table', label: 'Table', icon: '📊' },
  { type: 'equation', label: 'Equation', icon: '∑' },
  { type: 'image', label: 'Image', icon: '🖼️' },
  { type: 'quote', label: 'Quote', icon: '❝' },
  { type: 'code', label: 'Code', icon: '💻' },
  { type: 'cta', label: 'Call to Action', icon: '📣' },
];

export function defaultDataFor(type) {
  switch (type) {
    case 'hero': return { eyebrow: '', heading: 'New hero heading', subheading: '', ctaLabel: '', ctaHref: '', imageUrl: '' };
    case 'header': return { text: 'New header', level: 2 };
    case 'paragraph': return { text: '' };
    case 'richtext': return { text: '' };
    case 'list': return { style: 'unordered', items: [{ text: '', children: [] }] };
    case 'table': return { headers: ['Column 1', 'Column 2'], rows: [['', '']] };
    case 'equation': return { equation: '', displayMode: true, caption: '' };
    case 'image': return { url: '', alt: '', caption: '' };
    case 'quote': return { text: '', author: '' };
    case 'code': return { language: 'javascript', code: '' };
    case 'cta': return { heading: '', buttonLabel: '', buttonHref: '' };
    default: return {};
  }
}
