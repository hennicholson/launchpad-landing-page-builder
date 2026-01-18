"use client";

import type { ElementType } from "@/lib/page-schema";
import { ELEMENT_PRESETS, type ElementPreset } from "@/lib/element-presets";
import { Star, ArrowRight } from "lucide-react";

type Props = {
  elementType: ElementType;
  currentPresetId?: string;
  onSelectPreset: (presetId: string) => void;
};

export default function ElementPresetBrowser({ elementType, currentPresetId, onSelectPreset }: Props) {
  const presets = ELEMENT_PRESETS[elementType] || [];

  if (presets.length === 0) return null;

  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium text-white/50 uppercase tracking-wide">
        Style Presets
      </label>
      <div className="grid grid-cols-3 gap-2">
        {presets.map((preset) => (
          <PresetThumbnail
            key={preset.id}
            preset={preset}
            elementType={elementType}
            isSelected={currentPresetId === preset.id}
            onClick={() => onSelectPreset(preset.id)}
          />
        ))}
      </div>
    </div>
  );
}

function PresetThumbnail({ preset, elementType, isSelected, onClick }: {
  preset: ElementPreset;
  elementType: ElementType;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        relative p-2 rounded-lg border transition-all text-center
        ${isSelected
          ? 'border-[#D6FC51] bg-[#D6FC51]/10'
          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
        }
      `}
    >
      {/* Mini preview of the element style */}
      <div className="flex items-center justify-center h-8 mb-1.5">
        <PreviewForType type={elementType} preset={preset} />
      </div>
      <p className="text-[10px] text-white/60 truncate">{preset.name}</p>
      {isSelected && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#D6FC51] rounded-full flex items-center justify-center">
          <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  );
}

// Mini preview component for each element type
function PreviewForType({ type, preset }: { type: ElementType; preset: ElementPreset }) {
  switch (type) {
    case 'button':
      return (
        <div className={`px-2.5 py-1 text-[9px] font-medium rounded ${preset.previewClasses} flex items-center gap-1`}>
          {preset.id === 'icon' ? (
            <>
              Btn
              <ArrowRight className="w-2 h-2" />
            </>
          ) : (
            'Button'
          )}
        </div>
      );
    case 'badge':
      return (
        <span className={`px-2 py-0.5 text-[8px] font-medium rounded-full ${preset.previewClasses}`}>
          Badge
        </span>
      );
    case 'divider':
      if (preset.id === 'gradient') {
        return <div className="w-10 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />;
      }
      return (
        <div
          className={`w-10 ${preset.previewClasses}`}
          style={{
            borderTopStyle: preset.id as 'solid' | 'dashed' | 'dotted' | 'double',
            borderTopWidth: preset.id === 'double' ? '3px' : '1px',
          }}
        />
      );
    case 'icon':
      return (
        <div className={`${preset.previewClasses} flex items-center justify-center`}>
          <Star
            className="w-4 h-4 text-[#D6FC51]"
            style={preset.id === 'glow' ? { filter: 'drop-shadow(0 0 4px #D6FC51)' } : {}}
          />
        </div>
      );
    case 'text':
      return (
        <span className={`${preset.previewClasses} text-[10px]`}>
          {preset.name === 'Heading' ? 'Aa' : preset.name === 'Caption' ? 'abc' : 'Text'}
        </span>
      );
    case 'social':
      return (
        <div className={`w-5 h-5 ${preset.previewClasses} flex items-center justify-center`}>
          <svg className="w-3 h-3 text-white/60" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </div>
      );
    default:
      return <div className="w-6 h-6 bg-white/10 rounded" />;
  }
}
