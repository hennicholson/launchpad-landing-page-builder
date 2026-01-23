"use client";

import { Editor } from '@tiptap/react';
import { useState } from 'react';

interface RichTextToolbarProps {
  editor: Editor | null;
}

export default function RichTextToolbar({ editor }: RichTextToolbarProps) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#ffffff');

  if (!editor) {
    return null;
  }

  const setLink = () => {
    if (linkUrl === '') {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href: linkUrl }).run();
    }
    setShowLinkInput(false);
    setLinkUrl('');
  };

  const setColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
    setSelectedColor(color);
  };

  const ToolbarButton = ({
    onClick,
    isActive,
    icon,
    title
  }: {
    onClick: () => void;
    isActive?: boolean;
    icon: React.ReactNode;
    title: string;
  }) => (
    <button
      onClick={onClick}
      className={`p-2 rounded hover:bg-gray-700 transition-colors ${
        isActive ? 'bg-gray-700 text-blue-400' : 'text-gray-300'
      }`}
      title={title}
      type="button"
    >
      {icon}
    </button>
  );

  const colors = [
    '#ffffff', '#e5e5e5', '#a3a3a3', '#525252', '#262626',
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
    '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
    '#ec4899', '#f43f5e',
  ];

  return (
    <div className="sticky top-0 z-10 bg-[#2a2a2a] border-b border-gray-700 p-2 flex flex-wrap gap-1">
      {/* Text Formatting */}
      <div className="flex gap-1 pr-2 border-r border-gray-700">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          icon={<span className="font-bold">B</span>}
          title="Bold (Cmd+B)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          icon={<span className="italic">I</span>}
          title="Italic (Cmd+I)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          icon={<span className="underline">U</span>}
          title="Underline (Cmd+U)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          icon={<span className="line-through">S</span>}
          title="Strikethrough"
        />
      </div>

      {/* Headings */}
      <div className="flex gap-1 pr-2 border-r border-gray-700">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          icon={<span className="font-bold text-sm">H1</span>}
          title="Heading 1"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          icon={<span className="font-bold text-sm">H2</span>}
          title="Heading 2"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          icon={<span className="font-bold text-sm">H3</span>}
          title="Heading 3"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          isActive={editor.isActive('paragraph')}
          icon={<span className="text-sm">P</span>}
          title="Paragraph"
        />
      </div>

      {/* Lists */}
      <div className="flex gap-1 pr-2 border-r border-gray-700">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          icon={<span className="text-sm">•</span>}
          title="Bullet List"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          icon={<span className="text-sm">1.</span>}
          title="Numbered List"
        />
      </div>

      {/* Blocks */}
      <div className="flex gap-1 pr-2 border-r border-gray-700">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          icon={<span className="text-sm">"</span>}
          title="Blockquote"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          icon={<span className="text-sm font-mono">&lt;&gt;</span>}
          title="Code Block"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          icon={<span className="text-sm font-mono">`</span>}
          title="Inline Code"
        />
      </div>

      {/* Advanced */}
      <div className="flex gap-1 pr-2 border-r border-gray-700 relative">
        <ToolbarButton
          onClick={() => {
            if (editor.isActive('link')) {
              editor.chain().focus().unsetLink().run();
            } else {
              setShowLinkInput(!showLinkInput);
            }
          }}
          isActive={editor.isActive('link')}
          icon={<span className="text-sm">🔗</span>}
          title="Link"
        />
        {showLinkInput && (
          <div className="absolute top-full left-0 mt-1 bg-[#1a1a1a] border border-gray-700 rounded p-2 shadow-lg z-20">
            <input
              type="url"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setLink();
                }
              }}
              className="bg-[#2a2a2a] text-white border border-gray-600 rounded px-2 py-1 text-sm w-48"
              autoFocus
            />
            <div className="flex gap-1 mt-1">
              <button
                onClick={setLink}
                className="bg-blue-600 text-white text-xs px-2 py-1 rounded hover:bg-blue-700"
              >
                Set
              </button>
              <button
                onClick={() => {
                  setShowLinkInput(false);
                  setLinkUrl('');
                }}
                className="bg-gray-700 text-white text-xs px-2 py-1 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <ToolbarButton
          onClick={() => setShowColorPicker(!showColorPicker)}
          isActive={showColorPicker}
          icon={
            <div className="flex items-center gap-1">
              <span className="text-sm">A</span>
              <div
                className="w-3 h-3 rounded border border-gray-500"
                style={{ backgroundColor: selectedColor }}
              />
            </div>
          }
          title="Text Color"
        />
        {showColorPicker && (
          <div className="absolute top-full left-0 mt-1 bg-[#1a1a1a] border border-gray-700 rounded p-2 shadow-lg z-20">
            <div className="grid grid-cols-6 gap-1 w-48">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setColor(color);
                    setShowColorPicker(false);
                  }}
                  className="w-6 h-6 rounded border border-gray-600 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive('highlight')}
          icon={<span className="text-sm bg-yellow-400 text-black px-1">H</span>}
          title="Highlight"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          icon={<span className="text-sm">✕</span>}
          title="Clear Formatting"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          icon={<span className="text-sm">↶</span>}
          title="Undo (Cmd+Z)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          icon={<span className="text-sm">↷</span>}
          title="Redo (Cmd+Shift+Z)"
        />
      </div>
    </div>
  );
}
