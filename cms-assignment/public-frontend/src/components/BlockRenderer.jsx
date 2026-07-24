import HeroBlock from './blocks/HeroBlock';
import HeaderBlock from './blocks/HeaderBlock';
import ParagraphBlock from './blocks/ParagraphBlock';
import RichTextBlock from './blocks/RichTextBlock';
import ListBlock from './blocks/ListBlock';
import TableBlock from './blocks/TableBlock';
import EquationBlock from './blocks/EquationBlock';
import ImageBlock from './blocks/ImageBlock';
import QuoteBlock from './blocks/QuoteBlock';
import CodeBlock from './blocks/CodeBlock';
import CtaBlock from './blocks/CtaBlock';

// One component per block `type`, matched by a registry rather than a big
// switch statement — adding a new block type later is "add a component +
// one registry line", not "find the giant switch and edit it in place".
const REGISTRY = {
  hero: HeroBlock,
  header: HeaderBlock,
  paragraph: ParagraphBlock,
  richtext: RichTextBlock,
  list: ListBlock,
  table: TableBlock,
  equation: EquationBlock,
  image: ImageBlock,
  quote: QuoteBlock,
  code: CodeBlock,
  cta: CtaBlock,
};

export default function BlockRenderer({ blocks = [] }) {
  const sorted = [...blocks].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-10">
      {sorted.map((block) => {
        const Component = REGISTRY[block.type];
        const isFullBleed = block.type === 'hero';
        if (!Component) {
          return (
            <div key={block._id} className="p-3 bg-yellow-50 text-yellow-800 text-xs rounded border">
              Unknown content block type: {block.type}
            </div>
          );
        }
        return (
          <div key={block._id} className={isFullBleed ? '' : 'max-w-3xl mx-auto px-6'}>
            <Component data={block.data} />
          </div>
        );
      })}
    </div>
  );
}
