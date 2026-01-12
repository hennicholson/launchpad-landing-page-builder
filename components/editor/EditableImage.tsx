"use client";

import { useState, useRef } from "react";
import { useEditorStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  value: string;
  sectionId: string;
  field: string;
  itemId?: string;
  placeholder?: string;
  className?: string;
  alt?: string;
  style?: React.CSSProperties;
};

export default function EditableImage({
  value,
  sectionId,
  field,
  itemId,
  placeholder = "Add image URL",
  className = "",
  alt = "Image",
  style,
}: Props) {
  const { editingField, setEditingField, updateFieldValue, isPreviewMode, selectSection } =
    useEditorStore();
  const [localValue, setLocalValue] = useState(value);
  const [isHovering, setIsHovering] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isEditing =
    editingField?.sectionId === sectionId &&
    editingField?.field === field &&
    editingField?.itemId === itemId;

  const handleClick = (e: React.MouseEvent) => {
    if (isPreviewMode) return;
    e.stopPropagation();
    selectSection(sectionId);
    setEditingField({ sectionId, field, itemId });
    setLocalValue(value);
  };

  const handleSave = () => {
    if (localValue !== value) {
      updateFieldValue(sectionId, field, localValue, itemId);
    }
    setEditingField(null);
  };

  const handleCancel = () => {
    setLocalValue(value);
    setEditingField(null);
  };

  if (isPreviewMode) {
    return value ? (
      <img src={value} alt={alt} className={className} style={style} />
    ) : (
      <div
        className={`${className} bg-white/5 flex items-center justify-center`}
        style={style}
      >
        <svg
          className="w-8 h-8 text-white/20"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Image or placeholder */}
      {value ? (
        <img
          src={value}
          alt={alt}
          className={`${className} cursor-pointer`}
          style={style}
          onClick={handleClick}
        />
      ) : (
        <div
          className={`${className} bg-white/5 flex items-center justify-center cursor-pointer`}
          style={style}
          onClick={handleClick}
        >
          <div className="text-center p-4">
            <svg
              className="w-8 h-8 text-white/30 mx-auto mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            <span className="text-xs text-white/40">Click to add image</span>
          </div>
        </div>
      )}

      {/* Hover overlay */}
      <AnimatePresence>
        {isHovering && !isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg pointer-events-none"
          >
            <div className="flex items-center gap-2 text-[#D6FC51]">
              <svg
                className="w-5 h-5"
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
              <span className="text-sm font-medium">Change image</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 rounded-lg p-4"
          >
            <div className="w-full max-w-sm space-y-3">
              <label className="block text-xs font-medium text-white/60 uppercase tracking-wider">
                Image URL
              </label>
              <input
                ref={inputRef}
                type="text"
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                  if (e.key === "Escape") handleCancel();
                }}
                className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#D6FC51] focus:border-transparent"
                placeholder={placeholder}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex-1 px-3 py-2 bg-[#D6FC51] text-black text-sm font-medium rounded-lg hover:bg-[#D6FC51]/90 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 px-3 py-2 bg-white/10 text-white text-sm font-medium rounded-lg hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
