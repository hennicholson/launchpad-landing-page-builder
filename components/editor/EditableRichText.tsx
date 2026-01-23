"use client";

import { useMemo } from "react";
import { useEditorStoreOrPublished } from "@/lib/store";
import DOMPurify from 'dompurify';

type Props = {
  value: string;
  sectionId: string;
  field: string;
  paragraphIndex?: number;
  className?: string;
  style?: React.CSSProperties;
  isRichText?: boolean;
};

export default function EditableRichText({
  value,
  sectionId,
  field,
  paragraphIndex,
  className = "",
  style,
  isRichText = true,
}: Props) {
  const {
    isPreviewMode,
    selectSection,
    openRichTextEditor,
  } = useEditorStoreOrPublished();

  // Sanitize HTML content
  const sanitizedHTML = useMemo(() => {
    if (!value) return '';
    return DOMPurify.sanitize(value, {
      ALLOWED_TAGS: [
        'p', 'strong', 'em', 'u', 's', 'a',
        'h1', 'h2', 'h3', 'h4',
        'ul', 'ol', 'li',
        'blockquote', 'code', 'pre', 'mark', 'span'
      ],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style'],
      ALLOWED_STYLES: {
        '*': {
          'color': [/^#[0-9a-fA-F]{3,6}$/],
          'background-color': [/^#[0-9a-fA-F]{3,6}$/],
        }
      }
    });
  }, [value]);

  const handleClick = (e: React.MouseEvent) => {
    if (isPreviewMode) return;
    e.stopPropagation();
    selectSection(sectionId);

    if (paragraphIndex !== undefined && isRichText) {
      openRichTextEditor(sectionId, field, paragraphIndex, value);
    }
  };

  if (isPreviewMode) {
    return (
      <div
        className={className}
        style={style}
        dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
      />
    );
  }

  return (
    <div className="relative group">
      <div
        className={`${className} cursor-pointer hover:ring-2 hover:ring-purple-400/30 hover:ring-offset-2 hover:ring-offset-transparent rounded-sm transition-all duration-200 relative`}
        style={style}
        onClick={handleClick}
        dangerouslySetInnerHTML={{ __html: sanitizedHTML || '<p class="opacity-40 italic">Click to edit...</p>' }}
      />

      {/* Edit indicator */}
      <span className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-purple-500 text-white text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
          <svg
            className="w-2.5 h-2.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          <span>Edit</span>
        </div>
      </span>

      {/* Rich text editor styles for rendered content */}
      <style jsx global>{`
        .rich-text-rendered h1 {
          font-size: 2em;
          font-weight: bold;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }
        .rich-text-rendered h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }
        .rich-text-rendered h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }
        .rich-text-rendered h4 {
          font-size: 1.1em;
          font-weight: bold;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }
        .rich-text-rendered p {
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }
        .rich-text-rendered ul,
        .rich-text-rendered ol {
          padding-left: 1.5em;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }
        .rich-text-rendered ul {
          list-style-type: disc;
        }
        .rich-text-rendered ol {
          list-style-type: decimal;
        }
        .rich-text-rendered li {
          margin-top: 0.25em;
          margin-bottom: 0.25em;
        }
        .rich-text-rendered blockquote {
          border-left: 3px solid currentColor;
          padding-left: 1em;
          margin-left: 0;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
          opacity: 0.8;
        }
        .rich-text-rendered code {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 0.25em;
          padding: 0.125em 0.25em;
          font-family: 'Courier New', Courier, monospace;
          font-size: 0.9em;
        }
        .rich-text-rendered pre {
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: 0.5em;
          padding: 1em;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
          overflow-x: auto;
        }
        .rich-text-rendered pre code {
          background-color: transparent;
          padding: 0;
        }
        .rich-text-rendered mark {
          background-color: #fbbf24;
          color: #000;
          padding: 0.125em 0;
        }
        .rich-text-rendered a {
          text-decoration: underline;
          opacity: 0.9;
        }
        .rich-text-rendered strong {
          font-weight: bold;
        }
        .rich-text-rendered em {
          font-style: italic;
        }
        .rich-text-rendered u {
          text-decoration: underline;
        }
        .rich-text-rendered s {
          text-decoration: line-through;
        }
      `}</style>
    </div>
  );
}
