"use client";

import { useEffect, useRef } from "react";
import { useEditorStore } from "@/lib/store";
import {
  Copy, Clipboard, CopyPlus, Trash2, ArrowUp, ArrowDown,
  Eye, EyeOff, Grid3X3,
} from "lucide-react";

type ContextMenuProps = {
  x: number;
  y: number;
  sectionId: string;
  elementId: string;
  isVisible: boolean;
  snapToGrid: boolean;
  onClose: () => void;
};

export default function ElementContextMenu({
  x, y, sectionId, elementId, isVisible, snapToGrid, onClose,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const {
    duplicateElement,
    removeElement,
    reorderElement,
    updateElement,
    copyElement,
    pasteElement,
    elementClipboard,
  } = useEditorStore();

  // Close on click outside or Escape
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const handleScroll = () => onClose();

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [onClose]);

  // Adjust position to stay within viewport
  const adjustedPosition = { x, y };
  if (typeof window !== 'undefined') {
    const menuWidth = 200;
    const menuHeight = 320;
    if (x + menuWidth > window.innerWidth) adjustedPosition.x = x - menuWidth;
    if (y + menuHeight > window.innerHeight) adjustedPosition.y = y - menuHeight;
  }

  const menuItems = [
    {
      label: 'Copy',
      icon: Copy,
      shortcut: '\u2318C',
      action: () => { copyElement(sectionId, elementId); onClose(); },
    },
    {
      label: 'Paste',
      icon: Clipboard,
      shortcut: '\u2318V',
      action: () => { pasteElement(sectionId); onClose(); },
      disabled: !elementClipboard,
    },
    {
      label: 'Duplicate',
      icon: CopyPlus,
      shortcut: '\u2318D',
      action: () => { duplicateElement(sectionId, elementId); onClose(); },
    },
    {
      label: 'Delete',
      icon: Trash2,
      shortcut: 'Del',
      action: () => { removeElement(sectionId, elementId); onClose(); },
      danger: true,
    },
    { separator: true },
    {
      label: 'Bring Forward',
      icon: ArrowUp,
      action: () => { reorderElement(sectionId, elementId, 'up'); onClose(); },
    },
    {
      label: 'Send Backward',
      icon: ArrowDown,
      action: () => { reorderElement(sectionId, elementId, 'down'); onClose(); },
    },
    { separator: true },
    {
      label: isVisible ? 'Hide Element' : 'Show Element',
      icon: isVisible ? EyeOff : Eye,
      action: () => { updateElement(sectionId, elementId, { visible: !isVisible }); onClose(); },
    },
    {
      label: snapToGrid ? 'Disable Snap' : 'Enable Snap',
      icon: Grid3X3,
      action: () => { updateElement(sectionId, elementId, { snapToGrid: !snapToGrid }); onClose(); },
    },
  ];

  return (
    <div
      ref={menuRef}
      className="fixed z-[9999] w-48 py-1 bg-[#1a1a1c] border border-white/10 rounded-lg shadow-2xl animate-in fade-in zoom-in-95 duration-100"
      style={{ left: adjustedPosition.x, top: adjustedPosition.y }}
    >
      {menuItems.map((item, i) => {
        if ('separator' in item) {
          return <div key={i} className="my-1 border-t border-white/5" />;
        }

        const Icon = item.icon;
        return (
          <button
            key={i}
            onClick={item.action}
            disabled={item.disabled}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-xs transition-colors ${
              item.disabled
                ? 'text-white/20 cursor-not-allowed'
                : item.danger
                  ? 'text-white/70 hover:bg-red-500/10 hover:text-red-400'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Icon className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="flex-1 text-left">{item.label}</span>
            {item.shortcut && (
              <span className="text-[10px] text-white/30">{item.shortcut}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
