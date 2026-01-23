"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import { useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Underline,
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-400 underline cursor-pointer',
        },
      }),
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="bg-[#1a1a1a] rounded-lg border border-gray-700 overflow-hidden">
      <EditorContent
        editor={editor}
        className="rich-text-editor"
      />
      <style jsx global>{`
        .rich-text-editor .ProseMirror {
          color: #e5e5e5;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        .rich-text-editor .ProseMirror h1 {
          font-size: 2em;
          font-weight: bold;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }
        .rich-text-editor .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }
        .rich-text-editor .ProseMirror h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }
        .rich-text-editor .ProseMirror h4 {
          font-size: 1.1em;
          font-weight: bold;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }
        .rich-text-editor .ProseMirror p {
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }
        .rich-text-editor .ProseMirror ul,
        .rich-text-editor .ProseMirror ol {
          padding-left: 1.5em;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }
        .rich-text-editor .ProseMirror ul {
          list-style-type: disc;
        }
        .rich-text-editor .ProseMirror ol {
          list-style-type: decimal;
        }
        .rich-text-editor .ProseMirror li {
          margin-top: 0.25em;
          margin-bottom: 0.25em;
        }
        .rich-text-editor .ProseMirror blockquote {
          border-left: 3px solid #525252;
          padding-left: 1em;
          margin-left: 0;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
          color: #a3a3a3;
        }
        .rich-text-editor .ProseMirror code {
          background-color: #2a2a2a;
          border-radius: 0.25em;
          padding: 0.125em 0.25em;
          font-family: 'Courier New', Courier, monospace;
          font-size: 0.9em;
          color: #fbbf24;
        }
        .rich-text-editor .ProseMirror pre {
          background-color: #2a2a2a;
          border-radius: 0.5em;
          padding: 1em;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
          overflow-x: auto;
        }
        .rich-text-editor .ProseMirror pre code {
          background-color: transparent;
          padding: 0;
          color: #e5e5e5;
        }
        .rich-text-editor .ProseMirror mark {
          background-color: #fbbf24;
          color: #000;
          padding: 0.125em 0;
        }
        .rich-text-editor .ProseMirror a {
          color: #60a5fa;
          text-decoration: underline;
        }
        .rich-text-editor .ProseMirror strong {
          font-weight: bold;
        }
        .rich-text-editor .ProseMirror em {
          font-style: italic;
        }
        .rich-text-editor .ProseMirror u {
          text-decoration: underline;
        }
        .rich-text-editor .ProseMirror s {
          text-decoration: line-through;
        }
      `}</style>
    </div>
  );
}
