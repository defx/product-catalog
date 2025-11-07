import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Document } from '@contentful/rich-text-types';

interface RichTextProps {
  content: Document;
}

/**
 * Component to render Contentful rich text content
 * Uses the official @contentful/rich-text-react-renderer
 */
export function RichText({ content }: RichTextProps) {
  return <div>{documentToReactComponents(content)}</div>;
}
