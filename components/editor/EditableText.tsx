"use client";

import { useState, useRef, useEffect, KeyboardEvent, useMemo } from "react";
import { useEditorStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { resolveElementStyle } from "@/lib/style-utils";

type Props = {
  value: string;
  sectionId: string;
  field: string;
  itemId?: string;
  placeholder?: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  multiline?: boolean;
  style?: React.CSSProperties;
  // If true, use resolveElementStyle to compute styles automatically
  useElementStyles?: boolean;
};

export default function EditableText({
  value,
  sectionId,
  field,
  itemId,
  placeholder = "Click to edit...",
  className = "",
  as: Component = "span",
  multiline = false,
  style,
  useElementStyles = false,
}: Props) {
  const { editingField, setEditingField, updateFieldValue, isPreviewMode, selectSection, openElementStylePanel, page } =
    useEditorStore();
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const isEditing =
    editingField?.sectionId === sectionId &&
    editingField?.field === field &&
    editingField?.itemId === itemId;

  // Get section and item for style resolution
  const section = useMemo(() => {
    return page.sections.find((s) => s.id === sectionId);
  }, [page.sections, sectionId]);

  const item = useMemo(() => {
    if (!itemId || !section) return undefined;
    return section.items?.find((i) => i.id === itemId);
  }, [section, itemId]);

  // Compute resolved styles if useElementStyles is enabled
  const resolvedStyle = useMemo(() => {
    if (!useElementStyles || !section) return style;
    const computed = resolveElementStyle(page, section, field, item);
    return { ...computed, ...style };
  }, [useElementStyles, page, section, field, item, style]);

  // Sync local value with prop when not editing
  useEffect(() => {
    if (!isEditing) {
      setLocalValue(value);
    }
  }, [value, isEditing]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = (e: React.MouseEvent) => {
    if (isPreviewMode) return;
    e.stopPropagation();
    selectSection(sectionId);
    setEditingField({ sectionId, field, itemId });
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (isPreviewMode) return;
    e.preventDefault();
    e.stopPropagation();
    selectSection(sectionId);
    openElementStylePanel({
      sectionId,
      field,
      itemId,
      position: { x: e.clientX, y: e.clientY },
    });
  };

  const handleBlur = () => {
    if (localValue !== value) {
      updateFieldValue(sectionId, field, localValue, itemId);
    }
    setEditingField(null);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      handleBlur();
    }
    if (e.key === "Escape") {
      setLocalValue(value);
      setEditingField(null);
    }
  };

  if (isPreviewMode) {
    return (
      <Component className={className} style={resolvedStyle}>
        {value || placeholder}
      </Component>
    );
  }

  return (
    <div className="relative group inline">
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="inline"
          >
            {multiline ? (
              <textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className={`${className} bg-transparent border-none outline-none ring-2 ring-[#D6FC51] ring-offset-2 ring-offset-black/50 rounded-sm resize-none w-full`}
                style={resolvedStyle}
                placeholder={placeholder}
                rows={3}
              />
            ) : (
              <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                type="text"
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className={`${className} bg-transparent border-none outline-none ring-2 ring-[#D6FC51] ring-offset-2 ring-offset-black/50 rounded-sm`}
                style={{ ...resolvedStyle, width: `${Math.max(localValue.length, 10)}ch` }}
                placeholder={placeholder}
              />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="inline"
          >
            <Component
              className={`${className} cursor-text hover:ring-2 hover:ring-[#D6FC51]/30 hover:ring-offset-2 hover:ring-offset-transparent rounded-sm transition-all duration-200 relative`}
              style={resolvedStyle}
              onClick={handleClick}
              onContextMenu={handleContextMenu}
            >
              {value || (
                <span className="opacity-40 italic">{placeholder}</span>
              )}
              {/* Edit indicator */}
              <span className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg
                  className="w-3 h-3 text-[#D6FC51]"
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
              </span>
            </Component>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
