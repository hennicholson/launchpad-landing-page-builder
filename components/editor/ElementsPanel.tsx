"use client";

import { useState } from "react";
import { useEditorStore } from "@/lib/store";
import type { ElementType } from "@/lib/page-schema";
import {
  MousePointer2,
  Type,
  Image,
  Minus,
  Star,
  Video,
  Share2,
  Tag,
  Timer,
  Mail,
  Code,
  GripVertical,
} from "lucide-react";

type ElementOption = {
  type: ElementType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
};

const ELEMENT_OPTIONS: ElementOption[] = [
  { type: "button", label: "Button", icon: MousePointer2, description: "CTA button with link" },
  { type: "text", label: "Text", icon: Type, description: "Text block or heading" },
  { type: "image", label: "Image", icon: Image, description: "Standalone image" },
  { type: "divider", label: "Divider", icon: Minus, description: "Visual separator" },
  { type: "badge", label: "Badge", icon: Tag, description: "Label or pill" },
  { type: "icon", label: "Icon", icon: Star, description: "Icon from library" },
  { type: "video", label: "Video", icon: Video, description: "YouTube/Vimeo embed" },
  { type: "social", label: "Social", icon: Share2, description: "Social media links" },
  { type: "countdown", label: "Countdown", icon: Timer, description: "Timer to date" },
  { type: "form", label: "Form", icon: Mail, description: "Email capture" },
  { type: "html", label: "Custom HTML", icon: Code, description: "Raw HTML block" },
];

export default function ElementsPanel() {
  const { selectedSectionId, addElement } = useEditorStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [draggingType, setDraggingType] = useState<ElementType | null>(null);

  const handleAddElement = (type: ElementType) => {
    if (!selectedSectionId) return;

    // Add element at center of section
    addElement(selectedSectionId, type, {
      x: 50,
      y: 50,
    });
  };

  const handleDragStart = (e: React.DragEvent, type: ElementType) => {
    e.dataTransfer.setData("elementType", type);
    e.dataTransfer.effectAllowed = "copy";
    setDraggingType(type);

    // Create a custom drag image
    const dragImage = document.createElement("div");
    dragImage.className = "px-3 py-2 bg-[#D6FC51] text-black text-xs font-medium rounded-lg shadow-lg";
    dragImage.textContent = ELEMENT_OPTIONS.find(o => o.type === type)?.label || type;
    dragImage.style.position = "absolute";
    dragImage.style.top = "-1000px";
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 40, 20);

    // Remove after drag starts
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  const handleDragEnd = () => {
    setDraggingType(null);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider">
          Add Elements
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-white/40 hover:text-white/60"
        >
          {isExpanded ? "Show less" : "Show all"}
        </button>
      </div>

      <p className="text-[10px] text-white/30">
        Drag onto canvas or click to add to selected section
      </p>

      <div className={`grid grid-cols-2 gap-2 ${isExpanded ? "" : "max-h-[200px] overflow-hidden"}`}>
        {ELEMENT_OPTIONS.slice(0, isExpanded ? undefined : 6).map((option) => (
          <div
            key={option.type}
            draggable
            onDragStart={(e) => handleDragStart(e, option.type)}
            onDragEnd={handleDragEnd}
            onClick={() => selectedSectionId && handleAddElement(option.type)}
            className={`
              group flex flex-col items-center gap-2 p-3 rounded-lg cursor-grab active:cursor-grabbing
              bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#D6FC51]/30
              transition-all select-none
              ${draggingType === option.type ? "opacity-50 scale-95" : ""}
              ${!selectedSectionId ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <div className="relative">
              <option.icon className="w-5 h-5 text-white/40 group-hover:text-[#D6FC51] transition-colors" />
              <GripVertical className="absolute -left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-white/70 group-hover:text-white transition-colors">
                {option.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {!isExpanded && ELEMENT_OPTIONS.length > 6 && (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full py-2 text-xs text-white/40 hover:text-white/60 text-center"
        >
          +{ELEMENT_OPTIONS.length - 6} more elements
        </button>
      )}
    </div>
  );
}
