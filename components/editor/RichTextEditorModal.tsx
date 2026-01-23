"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEditorStore } from "@/lib/store";
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import RichTextToolbar from './RichTextToolbar';
import { EditorContent } from '@tiptap/react';

export default function RichTextEditorModal() {
  const {
    richTextEditor,
    closeRichTextEditor,
    updateRichTextContent,
  } = useEditorStore();

  const [currentContent, setCurrentContent] = useState('');

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
    content: richTextEditor.initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px] p-6',
      },
    },
    onUpdate: ({ editor }) => {
      setCurrentContent(editor.getHTML());
    },
  });

  // Update editor content when modal opens with new content
  useEffect(() => {
    if (editor && richTextEditor.isOpen) {
      editor.commands.setContent(richTextEditor.initialContent);
      setCurrentContent(richTextEditor.initialContent);
    }
  }, [richTextEditor.isOpen, richTextEditor.initialContent, editor]);

  const handleSave = () => {
    if (richTextEditor.sectionId && richTextEditor.field !== null && richTextEditor.paragraphIndex !== null) {
      updateRichTextContent(
        richTextEditor.sectionId,
        richTextEditor.field,
        richTextEditor.paragraphIndex,
        currentContent
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      closeRichTextEditor();
    }
  };

  if (!richTextEditor.isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={closeRichTextEditor}
        onKeyDown={handleKeyDown}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-4xl max-h-[90vh] bg-[#1a1a1a] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Rich Text Editor</h2>
                <p className="text-xs text-white/50">
                  Format your text with advanced styling
                </p>
              </div>
            </div>
            <button
              onClick={closeRichTextEditor}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <svg
                className="w-5 h-5 text-white/60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Toolbar */}
          <RichTextToolbar editor={editor} />

          {/* Editor Body */}
          <div className="flex-1 overflow-y-auto bg-[#1a1a1a]">
            <EditorContent
              editor={editor}
              className="rich-text-editor-modal"
            />
            <style jsx global>{`
              .rich-text-editor-modal .ProseMirror {
                color: #e5e5e5;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                line-height: 1.6;
              }
              .rich-text-editor-modal .ProseMirror h1 {
                font-size: 2em;
                font-weight: bold;
                margin-top: 0.5em;
                margin-bottom: 0.5em;
                line-height: 1.2;
              }
              .rich-text-editor-modal .ProseMirror h2 {
                font-size: 1.5em;
                font-weight: bold;
                margin-top: 0.5em;
                margin-bottom: 0.5em;
                line-height: 1.3;
              }
              .rich-text-editor-modal .ProseMirror h3 {
                font-size: 1.25em;
                font-weight: bold;
                margin-top: 0.5em;
                margin-bottom: 0.5em;
                line-height: 1.4;
              }
              .rich-text-editor-modal .ProseMirror h4 {
                font-size: 1.1em;
                font-weight: bold;
                margin-top: 0.5em;
                margin-bottom: 0.5em;
              }
              .rich-text-editor-modal .ProseMirror p {
                margin-top: 0.5em;
                margin-bottom: 0.5em;
              }
              .rich-text-editor-modal .ProseMirror ul,
              .rich-text-editor-modal .ProseMirror ol {
                padding-left: 1.5em;
                margin-top: 0.5em;
                margin-bottom: 0.5em;
              }
              .rich-text-editor-modal .ProseMirror ul {
                list-style-type: disc;
              }
              .rich-text-editor-modal .ProseMirror ol {
                list-style-type: decimal;
              }
              .rich-text-editor-modal .ProseMirror li {
                margin-top: 0.25em;
                margin-bottom: 0.25em;
              }
              .rich-text-editor-modal .ProseMirror blockquote {
                border-left: 3px solid #525252;
                padding-left: 1em;
                margin-left: 0;
                margin-top: 0.5em;
                margin-bottom: 0.5em;
                color: #a3a3a3;
              }
              .rich-text-editor-modal .ProseMirror code {
                background-color: #2a2a2a;
                border-radius: 0.25em;
                padding: 0.125em 0.25em;
                font-family: 'Courier New', Courier, monospace;
                font-size: 0.9em;
                color: #fbbf24;
              }
              .rich-text-editor-modal .ProseMirror pre {
                background-color: #2a2a2a;
                border-radius: 0.5em;
                padding: 1em;
                margin-top: 0.5em;
                margin-bottom: 0.5em;
                overflow-x: auto;
              }
              .rich-text-editor-modal .ProseMirror pre code {
                background-color: transparent;
                padding: 0;
                color: #e5e5e5;
              }
              .rich-text-editor-modal .ProseMirror mark {
                background-color: #fbbf24;
                color: #000;
                padding: 0.125em 0;
              }
              .rich-text-editor-modal .ProseMirror a {
                color: #60a5fa;
                text-decoration: underline;
              }
              .rich-text-editor-modal .ProseMirror strong {
                font-weight: bold;
              }
              .rich-text-editor-modal .ProseMirror em {
                font-style: italic;
              }
              .rich-text-editor-modal .ProseMirror u {
                text-decoration: underline;
              }
              .rich-text-editor-modal .ProseMirror s {
                text-decoration: line-through;
              }
            `}</style>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between flex-shrink-0">
            <p className="text-xs text-white/50">
              Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/70">⌘/Ctrl+S</kbd> to save or <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/70">Esc</kbd> to cancel
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={closeRichTextEditor}
                className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-all flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Save Changes
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
