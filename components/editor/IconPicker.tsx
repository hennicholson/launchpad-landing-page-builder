"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ICON_CATEGORIES, ICON_REGISTRY, getIconComponent } from "@/lib/icons";
import { ChevronDown } from "lucide-react";

type Props = {
  value: string;
  onChange: (iconName: string) => void;
};

const CATEGORY_LABELS: Record<string, string> = {
  actions: "Actions",
  communication: "Communication",
  business: "Business",
  technology: "Technology",
  security: "Security",
  users: "Users",
  navigation: "Navigation",
  status: "Status",
  objects: "Objects",
  editing: "Editing",
  media: "Media",
};

export function IconPicker({ value, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get selected icon component
  const SelectedIcon = value ? getIconComponent(value) : null;

  // Filter icons by search
  const filteredCategories = search
    ? {
        results: Object.keys(ICON_REGISTRY).filter((name) =>
          name.toLowerCase().includes(search.toLowerCase())
        ),
      }
    : ICON_CATEGORIES;

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-white/70 text-sm"
      >
        <div className="flex items-center gap-2">
          {SelectedIcon ? (
            <>
              <SelectedIcon className="w-4 h-4" />
              <span>{value}</span>
            </>
          ) : (
            <span className="text-white/40">Select icon...</span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Search */}
            <div className="p-3 border-b border-white/10">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search icons..."
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/90 text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30"
                autoFocus
              />
            </div>

            {/* Categories / Results */}
            <div className="max-h-64 overflow-y-auto p-2">
              {search ? (
                // Search results
                <div>
                  <div className="px-2 py-1 text-xs text-white/40 uppercase tracking-wide">
                    Results ({(filteredCategories as { results: string[] }).results.length})
                  </div>
                  <div className="grid grid-cols-6 gap-1 p-1">
                    {(filteredCategories as { results: string[] }).results.map((iconName) => {
                      const IconComp = getIconComponent(iconName);
                      if (!IconComp) return null;
                      return (
                        <button
                          key={iconName}
                          type="button"
                          onClick={() => {
                            onChange(iconName);
                            setIsOpen(false);
                            setSearch("");
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            value === iconName
                              ? "bg-white/20 text-white"
                              : "hover:bg-white/10 text-white/60 hover:text-white"
                          }`}
                          title={iconName}
                        >
                          <IconComp className="w-5 h-5 mx-auto" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                // Category-based browsing
                Object.entries(ICON_CATEGORIES).map(([category, icons]) => (
                  <div key={category} className="mb-2">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveCategory(activeCategory === category ? null : category)
                      }
                      className="w-full flex items-center justify-between px-2 py-1.5 text-xs text-white/50 uppercase tracking-wide hover:text-white/70 transition-colors"
                    >
                      <span>{CATEGORY_LABELS[category] || category}</span>
                      <ChevronDown
                        className={`w-3 h-3 transition-transform ${
                          activeCategory === category ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {(activeCategory === category || activeCategory === null) && (
                        <motion.div
                          initial={activeCategory !== null ? { height: 0, opacity: 0 } : false}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-6 gap-1 p-1">
                            {icons.map((iconName) => {
                              const IconComp = getIconComponent(iconName);
                              if (!IconComp) return null;
                              return (
                                <button
                                  key={iconName}
                                  type="button"
                                  onClick={() => {
                                    onChange(iconName);
                                    setIsOpen(false);
                                  }}
                                  className={`p-2 rounded-lg transition-colors ${
                                    value === iconName
                                      ? "bg-white/20 text-white"
                                      : "hover:bg-white/10 text-white/60 hover:text-white"
                                  }`}
                                  title={iconName}
                                >
                                  <IconComp className="w-5 h-5 mx-auto" />
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              )}
            </div>

            {/* Clear button */}
            {value && (
              <div className="p-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    onChange("");
                    setIsOpen(false);
                  }}
                  className="w-full px-3 py-1.5 text-xs text-white/50 hover:text-white/70 hover:bg-white/5 rounded-lg transition-colors"
                >
                  Clear icon
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
