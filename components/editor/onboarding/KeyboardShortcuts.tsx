"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X, Keyboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const isMac = typeof navigator !== "undefined" && navigator.platform?.includes("Mac");
const mod = isMac ? "⌘" : "Ctrl";

const shortcuts = [
  {
    category: "Editing",
    items: [
      { keys: [`${mod}`, "Z"], label: "Undo" },
      { keys: [`${mod}`, "⇧", "Z"], label: "Redo" },
      { keys: [`${mod}`, "S"], label: "Save" },
      { keys: ["Escape"], label: "Deselect / Close" },
      { keys: ["Delete"], label: "Remove element" },
    ],
  },
  {
    category: "AI",
    items: [
      { keys: [`${mod}`, "K"], label: "AI Command Palette" },
    ],
  },
  {
    category: "View",
    items: [
      { keys: [`${mod}`, "⇧", "F"], label: "Full Screen" },
      { keys: [`${mod}`, "/"], label: "Keyboard Shortcuts" },
    ],
  },
];

function KeyBadge({ children }: { children: string }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded bg-white/10 border border-white/15 text-[11px] font-mono text-white/80">
      {children}
    </kbd>
  );
}

interface KeyboardShortcutsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function KeyboardShortcuts({ open, onOpenChange }: KeyboardShortcutsProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/60 z-[100]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className="fixed top-1/2 left-1/2 z-[101] w-[380px] max-h-[85vh] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-zinc-900/95 border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.15 }}
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Keyboard className="w-4 h-4 text-white/50" />
                    <Dialog.Title className="text-sm font-medium text-white">
                      Keyboard Shortcuts
                    </Dialog.Title>
                  </div>
                  <Dialog.Close className="p-1 rounded hover:bg-white/10 transition-colors">
                    <X className="w-4 h-4 text-white/40" />
                  </Dialog.Close>
                </div>

                <div className="px-5 py-4 space-y-5 overflow-y-auto max-h-[60vh]">
                  {shortcuts.map((group) => (
                    <div key={group.category}>
                      <h3 className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-2.5">
                        {group.category}
                      </h3>
                      <div className="space-y-2">
                        {group.items.map((shortcut) => (
                          <div
                            key={shortcut.label}
                            className="flex items-center justify-between"
                          >
                            <span className="text-xs text-white/60">{shortcut.label}</span>
                            <div className="flex items-center gap-1">
                              {shortcut.keys.map((key, i) => (
                                <KeyBadge key={i}>{key}</KeyBadge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-5 py-3 border-t border-white/5">
                  <p className="text-[10px] text-white/25 text-center">
                    Press {mod}+/ to toggle this menu
                  </p>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
