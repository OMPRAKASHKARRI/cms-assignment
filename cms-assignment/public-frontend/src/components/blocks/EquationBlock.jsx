import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function EquationBlock({ data }) {
  const { equation, displayMode, caption } = data;
  if (!equation) return null;
  return (
    <figure className="my-2 p-4 bg-gray-50 rounded-lg overflow-x-auto">
      {displayMode ? (
        <div className="flex justify-center"><BlockMath math={equation} /></div>
      ) : (
        <InlineMath math={equation} />
      )}
      {caption && <figcaption className="mt-2 text-sm text-gray-500 text-center">{caption}</figcaption>}
    </figure>
  );
}
