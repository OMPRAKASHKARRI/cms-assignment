// Content authored in the admin's rich-text field is a deliberately small
// allow-listed HTML subset (b/i/a/br — enforced by the admin UI copy, not
// by arbitrary user input), so rendering via dangerouslySetInnerHTML here
// is a controlled CMS-author-only surface, not user-generated content.
export default function RichTextBlock({ data }) {
  return <div className="prose prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: data.text || '' }} />;
}
