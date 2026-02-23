"use client";

import { useState, useMemo, useRef, useEffect } from "react";

// ---------------------------------------------------------------------------
// Icons (inline SVGs for zero-dependency visual richness)
// ---------------------------------------------------------------------------

function IconRocket({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

function IconLayers({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
    </svg>
  );
}

function IconSliders({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="4" y1="21" y2="14" /><line x1="4" x2="4" y1="10" y2="3" />
      <line x1="12" x2="12" y1="21" y2="12" /><line x1="12" x2="12" y1="8" y2="3" />
      <line x1="20" x2="20" y1="21" y2="16" /><line x1="20" x2="20" y1="12" y2="3" />
      <line x1="2" x2="6" y1="14" y2="14" /><line x1="10" x2="14" y1="8" y2="8" />
      <line x1="18" x2="22" y1="16" y2="16" />
    </svg>
  );
}

function IconMic({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}

function IconGlobe({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

function IconPalette({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /><circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /><circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  );
}

function IconKeyboard({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" /><path d="M6 8h.001" /><path d="M10 8h.001" />
      <path d="M14 8h.001" /><path d="M18 8h.001" /><path d="M8 12h.001" /><path d="M12 12h.001" />
      <path d="M16 12h.001" /><path d="M7 16h10" />
    </svg>
  );
}

function IconPlus({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="M12 5v14" />
    </svg>
  );
}

function IconChevronDown({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function IconMouse({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="7" /><path d="M12 6v4" />
    </svg>
  );
}

function IconEye({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconSpark({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}

function IconGrid({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  );
}

function IconArrowRight({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function IconCheck({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        type="text"
        placeholder="Search documentation..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-white/20 focus:bg-white/[0.07] focus:ring-1 focus:ring-white/10"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Collapsible section
// ---------------------------------------------------------------------------

function Collapsible({
  title,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(defaultOpen ? undefined : 0);

  useEffect(() => {
    if (open) {
      const el = contentRef.current;
      if (el) setHeight(el.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [open]);

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-colors hover:border-white/10">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-white/[0.02]"
      >
        {icon && <span className="text-white/40">{icon}</span>}
        <span className="flex-1 text-sm font-medium text-white/80">{title}</span>
        <span className={`text-white/30 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <IconChevronDown />
        </span>
      </button>
      <div
        style={{ height: height !== undefined ? height : "auto", overflow: "hidden" }}
        className="transition-[height] duration-300 ease-in-out"
      >
        <div ref={contentRef} className="px-5 pb-5">
          {children}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tabs component
// ---------------------------------------------------------------------------

function Tabs({
  tabs,
  children,
}: {
  tabs: { id: string; label: string; icon?: React.ReactNode }[];
  children: (activeTab: string) => React.ReactNode;
}) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");

  return (
    <div>
      <div className="mb-6 flex gap-1 rounded-xl bg-white/[0.03] p-1 border border-white/[0.06]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              active === tab.id
                ? "bg-white/10 text-white shadow-sm"
                : "text-white/40 hover:text-white/60 hover:bg-white/[0.03]"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      <div>{children(active)}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step indicator
// ---------------------------------------------------------------------------

function Step({
  number,
  title,
  description,
  visual,
}: {
  number: number;
  title: string;
  description: string;
  visual?: React.ReactNode;
}) {
  return (
    <div className="group relative flex gap-5">
      {/* Vertical line connector */}
      <div className="flex flex-col items-center">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-white/20 to-white/5 text-sm font-bold text-white ring-1 ring-white/10">
          {number}
        </div>
        <div className="mt-2 w-px flex-1 bg-gradient-to-b from-white/10 to-transparent" />
      </div>
      <div className="flex-1 pb-10">
        <h4 className="mb-1.5 text-[15px] font-semibold text-white/90">{title}</h4>
        <p className="mb-4 text-sm leading-relaxed text-white/50">{description}</p>
        {visual && <div>{visual}</div>}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Keyboard shortcut badge
// ---------------------------------------------------------------------------

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.06] px-2 py-1 text-[11px] font-medium text-white/60 shadow-sm">
      {children}
    </kbd>
  );
}

// ---------------------------------------------------------------------------
// Visual mockup: Editor layout schematic
// ---------------------------------------------------------------------------

function EditorMockup() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] bg-[#18181b] px-4 py-2.5">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
        </div>
        <div className="ml-2 flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-amber-500/30" />
          <span className="text-[11px] text-white/50">My Landing Page</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] text-white/30">↩</div>
            <div className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] text-white/30">↪</div>
          </div>
          <div className="rounded-md bg-white/10 px-3 py-1 text-[10px] font-medium text-white/50">Preview</div>
          <div className="rounded-md bg-amber-500/80 px-3 py-1 text-[10px] font-medium text-black">Publish</div>
        </div>
      </div>
      {/* Editor body — 3-panel layout */}
      <div className="flex h-72">
        {/* Left Sidebar — Section List */}
        <div className="w-44 border-r border-white/[0.06] bg-[#111113] flex flex-col">
          <div className="px-3 py-2 border-b border-white/[0.06]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-white/50">Sections</span>
              <div className="h-4 w-4 rounded bg-amber-500/20 flex items-center justify-center">
                <span className="text-[8px] text-amber-400">+</span>
              </div>
            </div>
          </div>
          <div className="flex-1 p-2 space-y-1 overflow-hidden">
            {/* Section items */}
            <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-2 py-1.5">
              <div className="h-3 w-3 rounded bg-white/10" />
              <span className="text-[9px] text-white/40">Header</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-blue-500/10 border border-blue-500/20 px-2 py-1.5">
              <div className="h-3 w-3 rounded bg-blue-500/30" />
              <span className="text-[9px] text-blue-300 font-medium">Hero</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-2 py-1.5">
              <div className="h-3 w-3 rounded bg-white/10" />
              <span className="text-[9px] text-white/40">Features</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-2 py-1.5">
              <div className="h-3 w-3 rounded bg-white/10" />
              <span className="text-[9px] text-white/40">Testimonials</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-2 py-1.5">
              <div className="h-3 w-3 rounded bg-white/10" />
              <span className="text-[9px] text-white/40">Pricing</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-2 py-1.5">
              <div className="h-3 w-3 rounded bg-white/10" />
              <span className="text-[9px] text-white/40">CTA</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-2 py-1.5">
              <div className="h-3 w-3 rounded bg-white/10" />
              <span className="text-[9px] text-white/40">Footer</span>
            </div>
          </div>
          {/* Elements tab at bottom */}
          <div className="px-3 py-2 border-t border-white/[0.06]">
            <span className="text-[9px] text-white/30">Elements (Drag &amp; Drop)</span>
            <div className="flex gap-1 mt-1.5">
              <div className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[7px] text-white/30">Text</div>
              <div className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[7px] text-white/30">Image</div>
              <div className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[7px] text-white/30">Button</div>
              <div className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[7px] text-white/30">Icon</div>
            </div>
          </div>
        </div>

        {/* Center — Canvas (Live Preview) */}
        <div className="flex-1 bg-[#18181b] p-4">
          <div className="flex h-full flex-col gap-2">
            {/* Mini header section */}
            <div className="flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2">
              <div className="h-2 w-16 rounded bg-white/20" />
              <div className="flex gap-2">
                <div className="h-2 w-8 rounded bg-white/10" />
                <div className="h-2 w-8 rounded bg-white/10" />
                <div className="h-2 w-8 rounded bg-white/10" />
              </div>
            </div>
            {/* Mini hero — selected (blue outline) */}
            <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-blue-500/40 bg-blue-500/[0.04] p-4 relative">
              <div className="absolute -top-0.5 left-3 bg-blue-500 rounded-b px-1.5 py-0.5">
                <span className="text-[7px] text-white font-medium">Hero</span>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-2 h-2.5 w-32 rounded bg-white/20" />
                <div className="mx-auto mb-3 h-2 w-24 rounded bg-white/10" />
                <div className="mx-auto h-5 w-16 rounded-md bg-amber-500/40" />
              </div>
            </div>
            {/* Mini features section */}
            <div className="flex gap-2">
              <div className="flex-1 rounded-lg bg-white/[0.04] p-2">
                <div className="mb-1 h-4 w-4 rounded bg-white/10" />
                <div className="h-1.5 w-full rounded bg-white/10" />
              </div>
              <div className="flex-1 rounded-lg bg-white/[0.04] p-2">
                <div className="mb-1 h-4 w-4 rounded bg-white/10" />
                <div className="h-1.5 w-full rounded bg-white/10" />
              </div>
              <div className="flex-1 rounded-lg bg-white/[0.04] p-2">
                <div className="mb-1 h-4 w-4 rounded bg-white/10" />
                <div className="h-1.5 w-full rounded bg-white/10" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar — Property Panel */}
        <div className="w-52 border-l border-white/[0.06] bg-[#111113] p-3">
          <div className="mb-3 flex gap-1">
            <div className="rounded bg-white/10 px-2 py-1 text-[9px] font-medium text-white/60">Settings</div>
            <div className="rounded px-2 py-1 text-[9px] text-white/30">Style</div>
          </div>
          <div className="mb-2 text-[9px] font-medium text-amber-400/60">Hero Section</div>
          <div className="space-y-2.5">
            <div>
              <div className="mb-1 text-[9px] text-white/30">Heading</div>
              <div className="rounded bg-white/[0.06] px-2 py-1.5 text-[10px] text-white/40">Launch faster</div>
            </div>
            <div>
              <div className="mb-1 text-[9px] text-white/30">Subheading</div>
              <div className="rounded bg-white/[0.06] px-2 py-1.5 text-[10px] text-white/40">Build pages in...</div>
            </div>
            <div>
              <div className="mb-1 text-[9px] text-white/30">Button Text</div>
              <div className="rounded bg-white/[0.06] px-2 py-1.5 text-[10px] text-white/40">Get Started</div>
            </div>
            <div>
              <div className="mb-1 text-[9px] text-white/30">Button Link</div>
              <div className="rounded bg-white/[0.06] px-2 py-1.5 text-[10px] text-white/40">https://...</div>
            </div>
            <div>
              <div className="mb-1 text-[9px] text-white/30">Layout</div>
              <div className="flex gap-1">
                <div className="rounded bg-amber-500/30 px-1.5 py-0.5 text-[8px] text-amber-300">Centered</div>
                <div className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[8px] text-white/30">Split</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Labels */}
      <div className="flex border-t border-white/[0.06] bg-white/[0.02]">
        <div className="w-44 border-r border-white/[0.06] px-4 py-2 text-center text-[10px] font-medium text-white/30">
          Section List
        </div>
        <div className="flex-1 px-4 py-2 text-center text-[10px] font-medium text-white/30">
          Canvas (Live Preview)
        </div>
        <div className="w-52 border-l border-white/[0.06] px-4 py-2 text-center text-[10px] font-medium text-white/30">
          Property Panel
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Visual mockup: Property panel detail
// ---------------------------------------------------------------------------

function PropertyPanelMockup() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden max-w-sm">
      <div className="border-b border-white/[0.06] bg-white/[0.03] px-4 py-2.5">
        <span className="text-[11px] font-medium text-white/50">Property Panel - Hero Section</span>
      </div>
      {/* Tabs */}
      <div className="flex border-b border-white/[0.06]">
        <button className="flex-1 border-b-2 border-blue-500 px-3 py-2 text-[11px] font-medium text-white/80">Settings</button>
        <button className="flex-1 px-3 py-2 text-[11px] text-white/30">Style</button>
        <button className="flex-1 px-3 py-2 text-[11px] text-white/30">Elements</button>
      </div>
      <div className="space-y-3 p-4">
        <div>
          <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-white/30">Heading</label>
          <div className="rounded-lg bg-white/[0.06] px-3 py-2 text-xs text-white/60">Welcome to LaunchPad</div>
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-white/30">Subheading</label>
          <div className="rounded-lg bg-white/[0.06] px-3 py-2 text-xs text-white/60">Build landing pages faster</div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-white/30">Button Text</label>
            <div className="rounded-lg bg-white/[0.06] px-3 py-2 text-xs text-white/60">Get Started</div>
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-white/30">Button Link</label>
            <div className="rounded-lg bg-white/[0.06] px-3 py-2 text-xs text-white/60">/signup</div>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-white/30">Visibility</label>
          <div className="flex flex-wrap gap-1.5">
            {["Badge", "Heading", "Subheading", "Button", "Image"].map((item) => (
              <div key={item} className="flex items-center gap-1.5 rounded-md bg-white/[0.06] px-2 py-1">
                <div className="h-2.5 w-2.5 rounded-sm bg-blue-500/60" />
                <span className="text-[10px] text-white/50">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Visual: Section type card
// ---------------------------------------------------------------------------

const SECTION_ICONS: Record<string, React.ReactNode> = {
  Hero: <IconRocket className="w-4 h-4" />,
  Header: <IconGrid className="w-4 h-4" />,
  Features: <IconSpark className="w-4 h-4" />,
  Pricing: <span className="text-sm">$</span>,
  Offer: <span className="text-sm">%</span>,
  Testimonials: <span className="text-sm">&quot;</span>,
  "CTA (Call to Action)": <IconMouse className="w-4 h-4" />,
  Stats: <span className="text-sm">#</span>,
  FAQ: <span className="text-sm">?</span>,
  Gallery: <IconGrid className="w-4 h-4" />,
  Video: <IconEye className="w-4 h-4" />,
  Process: <IconArrowRight className="w-4 h-4" />,
  Founders: <span className="text-sm">@</span>,
  Audience: <IconCheck className="w-4 h-4" />,
  Comparison: <span className="text-sm">&lt;&gt;</span>,
  "Logo Cloud": <IconGrid className="w-4 h-4" />,
  Credibility: <IconEye className="w-4 h-4" />,
  Footer: <IconLayers className="w-4 h-4" />,
  Blank: <IconPlus className="w-4 h-4" />,
};

const SECTION_COLORS: Record<string, string> = {
  Hero: "from-blue-500/20 to-blue-600/5 border-blue-500/20",
  Header: "from-slate-500/20 to-slate-600/5 border-slate-500/20",
  Features: "from-purple-500/20 to-purple-600/5 border-purple-500/20",
  Pricing: "from-green-500/20 to-green-600/5 border-green-500/20",
  Offer: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/20",
  Testimonials: "from-amber-500/20 to-amber-600/5 border-amber-500/20",
  "CTA (Call to Action)": "from-rose-500/20 to-rose-600/5 border-rose-500/20",
  Stats: "from-cyan-500/20 to-cyan-600/5 border-cyan-500/20",
  FAQ: "from-orange-500/20 to-orange-600/5 border-orange-500/20",
  Gallery: "from-pink-500/20 to-pink-600/5 border-pink-500/20",
  Video: "from-red-500/20 to-red-600/5 border-red-500/20",
  Process: "from-teal-500/20 to-teal-600/5 border-teal-500/20",
  Founders: "from-indigo-500/20 to-indigo-600/5 border-indigo-500/20",
  Audience: "from-lime-500/20 to-lime-600/5 border-lime-500/20",
  Comparison: "from-yellow-500/20 to-yellow-600/5 border-yellow-500/20",
  "Logo Cloud": "from-violet-500/20 to-violet-600/5 border-violet-500/20",
  Credibility: "from-sky-500/20 to-sky-600/5 border-sky-500/20",
  Footer: "from-gray-500/20 to-gray-600/5 border-gray-500/20",
  Blank: "from-white/10 to-white/[0.02] border-white/10",
};

function SectionTypeCard({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const colorClass = SECTION_COLORS[name] || "from-white/10 to-white/[0.02] border-white/10";
  const icon = SECTION_ICONS[name] || <IconLayers className="w-4 h-4" />;

  return (
    <div
      className={`group cursor-pointer rounded-xl border bg-gradient-to-br p-4 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-white/[0.02] ${colorClass}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white/60">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white/90">{name}</h4>
          <p className={`mt-1 text-xs leading-relaxed text-white/45 ${expanded ? "" : "line-clamp-2"}`}>
            {description}
          </p>
        </div>
        <span className={`text-white/20 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}>
          <IconChevronDown />
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Voice command visual card
// ---------------------------------------------------------------------------

function VoiceCommandCard({
  command,
  description,
  example,
}: {
  command: string;
  description: string;
  example?: string;
}) {
  return (
    <div className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-white/10 hover:bg-white/[0.04]">
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-500/20">
          <IconMic className="w-3 h-3 text-purple-400" />
        </div>
        <span className="text-sm font-medium text-white/80">&quot;{command}&quot;</span>
      </div>
      <p className="text-xs leading-relaxed text-white/45">{description}</p>
      {example && (
        <div className="mt-3 rounded-lg bg-white/[0.04] px-3 py-2 border border-white/[0.04]">
          <span className="text-[10px] uppercase tracking-wider text-white/25 font-medium">Example</span>
          <p className="mt-0.5 text-xs text-purple-300/70 italic">&quot;{example}&quot;</p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Template card
// ---------------------------------------------------------------------------

const TEMPLATE_THEMES: Record<string, { gradient: string; accent: string }> = {
  "Start from Scratch": { gradient: "from-zinc-800/80 to-zinc-900/80", accent: "bg-white/10" },
  "Skinny Studio": { gradient: "from-[#1a1a2e] to-[#0f0f1a]", accent: "bg-lime-500/30" },
  "SaaS Funnel": { gradient: "from-blue-950/80 to-slate-900/80", accent: "bg-orange-500/30" },
  "Agency Funnel": { gradient: "from-[#1a1510] to-[#0d0b08]", accent: "bg-amber-500/30" },
  "Course Funnel": { gradient: "from-emerald-950/60 to-slate-900/80", accent: "bg-emerald-500/30" },
  "E-Commerce Funnel": { gradient: "from-red-950/50 to-slate-900/80", accent: "bg-red-500/30" },
  "Dark Conversion Pro": { gradient: "from-purple-950/50 to-slate-950/80", accent: "bg-purple-500/30" },
  "SaaS Product": { gradient: "from-sky-950/60 to-slate-900/80", accent: "bg-sky-500/30" },
  "Webinar Registration": { gradient: "from-rose-950/50 to-slate-900/80", accent: "bg-rose-500/30" },
  "Lead Magnet / Ebook": { gradient: "from-teal-950/50 to-slate-900/80", accent: "bg-teal-500/30" },
  "Whop University": { gradient: "from-[#1a1025] to-[#0a0a14]", accent: "bg-violet-500/30" },
  "Sales Funnel": { gradient: "from-orange-950/40 to-slate-900/80", accent: "bg-orange-500/30" },
};

function TemplateCard({
  name,
  description,
  tags,
}: {
  name: string;
  description: string;
  tags: string[];
}) {
  const theme = TEMPLATE_THEMES[name] || { gradient: "from-zinc-800/80 to-zinc-900/80", accent: "bg-white/10" };

  return (
    <div className="group rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-all hover:border-white/10 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5">
      {/* Themed preview */}
      <div className={`h-24 bg-gradient-to-br ${theme.gradient} p-3 flex flex-col justify-between border-b border-white/[0.04] relative overflow-hidden`}>
        {/* Mini page skeleton */}
        <div className="flex justify-between items-start relative z-10">
          <div className={`h-1.5 w-12 rounded-full ${theme.accent}`} />
          <div className="flex gap-1">
            <div className="h-1 w-5 rounded-full bg-white/[0.08]" />
            <div className="h-1 w-5 rounded-full bg-white/[0.08]" />
          </div>
        </div>
        <div className="space-y-1.5 relative z-10">
          <div className={`h-2 w-20 rounded-full ${theme.accent}`} />
          <div className="h-1.5 w-14 rounded-full bg-white/[0.06]" />
          <div className={`h-3 w-12 rounded-md ${theme.accent} mt-1`} />
        </div>
        {/* Subtle glow */}
        <div className={`absolute -bottom-4 -right-4 h-16 w-16 rounded-full ${theme.accent} blur-2xl opacity-40`} />
      </div>
      <div className="p-4">
        <h4 className="mb-1 text-sm font-semibold text-white/90">{name}</h4>
        <p className="mb-3 text-xs leading-relaxed text-white/45">{description}</p>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/[0.06] px-2.5 py-0.5 text-[10px] font-medium text-white/35 border border-white/[0.04]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const SECTION_TYPES: { name: string; description: string }[] = [
  { name: "Hero", description: "The main banner at the top of your page. Includes headline, subheadline, call-to-action button, and optional image or background. Multiple layout variants available." },
  { name: "Header", description: "Navigation bar with your logo, links, and a CTA button. Choose from several styles including floating, simple, or search-enabled headers." },
  { name: "Features", description: "Showcase your product benefits in a grid layout. Choose from bento grid, illustrated cards, hover-reveal, or customer table variants." },
  { name: "Pricing", description: "Display your pricing tiers side by side. Each tier includes title, price, description, feature list, and CTA button." },
  { name: "Offer", description: "Focused pricing section for single-product pages with monthly/yearly toggle. Great for courses and memberships." },
  { name: "Testimonials", description: "Social proof from customers. Auto-scrolling marquee, Twitter-style cards, or screenshot layouts." },
  { name: "CTA (Call to Action)", description: "Drive conversions with centered, split, banner, or minimal layouts. Headline, subtext, and button." },
  { name: "Stats", description: "Display key numbers and metrics. Card, minimal, bar, or circle variants for your most impressive data." },
  { name: "FAQ", description: "Expandable accordion for frequently asked questions. Reduces support inquiries." },
  { name: "Gallery", description: "Showcase images in bento grid or focus rail layout. Great for portfolios and visual storytelling." },
  { name: "Video", description: "Embed videos with centered, grid, side-by-side, or fullscreen layouts. YouTube, Vimeo, and direct URLs." },
  { name: "Process", description: "Walk visitors through your workflow step by step. Timeline, cards, or horizontal layout." },
  { name: "Founders", description: "Introduce your team with photos, bios, roles, and LinkedIn links." },
  { name: "Audience", description: "Clarify who your product is and isn't for with two contrasting lists." },
  { name: "Comparison", description: "Side-by-side comparison showing your advantages vs. competitors." },
  { name: "Logo Cloud", description: "Auto-scrolling marquee of brand logos. Partnerships, integrations, or press mentions." },
  { name: "Credibility", description: "Full-width background image section with trust-building message and overlay gradient." },
  { name: "Footer", description: "Bottom section with logo, tagline, navigation links, and copyright." },
  { name: "Blank", description: "Empty canvas section. Add custom elements anywhere - buttons, images, text, and more." },
];

const VOICE_COMMANDS: { command: string; description: string; example?: string }[] = [
  { command: "Change the colors", description: "Update theme colors: primary, secondary, accent, background, and text.", example: "Make the primary color blue" },
  { command: "Change the fonts", description: "Switch heading and body fonts.", example: "Use Sora for headings and Inter for body" },
  { command: "Apply a theme", description: "Apply a preset theme. Available: Dark, Light, Midnight, Forest, Ocean, Sunset.", example: "Apply the ocean theme" },
  { command: "Edit section content", description: "Change any text, image, or color in a section.", example: "Change the hero heading to Welcome" },
  { command: "Change section layout", description: "Switch a section's visual variant.", example: "Make features use the bento layout" },
  { command: "Style text elements", description: "Adjust font size, weight, color, alignment for any text field." },
  { command: "Add a section", description: "Insert a new section at any position.", example: "Add a pricing section after features" },
  { command: "Remove a section", description: "Delete the selected section or specify which one." },
  { command: "Move a section", description: "Reorder sections in your page.", example: "Move the hero section down" },
  { command: "Duplicate a section", description: "Create a copy of any section." },
  { command: "Add an element", description: "Place custom elements: button, text, image, divider, badge, icon, video, form, social links, countdown, or HTML." },
  { command: "Update items", description: "Edit feature cards, testimonials, pricing tiers, stats, or FAQ items." },
  { command: "Toggle visibility", description: "Show or hide parts like heading, subheading, button, image, badge, or items." },
  { command: "Change background effect", description: "Add effects: elegant shapes, glow, shooting stars, aurora, spotlight, meteors, or sparkles." },
  { command: "Update page settings", description: "Change page title, description, animation intensity, content width, or smooth scroll." },
  { command: "Undo / Redo", description: "Reverse or reapply your last change." },
];

const TEMPLATES: { name: string; description: string; tags: string[] }[] = [
  { name: "Start from Scratch", description: "A blank canvas to build your page from the ground up.", tags: ["minimal", "custom"] },
  { name: "Skinny Studio", description: "Bold dark theme with lime accents. Great for creators, agencies, and tech products.", tags: ["dark", "bold", "modern"] },
  { name: "SaaS Funnel", description: "High-converting template with trust-building blue and action-driving orange. AIDA formula.", tags: ["saas", "software", "funnel"] },
  { name: "Agency Funnel", description: "Premium black and gold theme for service businesses. PAS formula.", tags: ["agency", "premium", "dark"] },
  { name: "Course Funnel", description: "Growth-focused green and navy theme for online courses. Before-After-Bridge formula.", tags: ["course", "education"] },
  { name: "E-Commerce Funnel", description: "Bold red and gold theme that drives urgency for physical product sales.", tags: ["ecommerce", "product"] },
  { name: "Dark Conversion Pro", description: "Advanced sales page with all component variants, stats, animations, and CTAs.", tags: ["sales", "dark", "advanced"] },
  { name: "SaaS Product", description: "Free trial + feature-focused layout. Ideal for B2B software.", tags: ["saas", "b2b", "trial"] },
  { name: "Webinar Registration", description: "Countdown + speaker credibility + registration form for event signups.", tags: ["webinar", "event"] },
  { name: "Lead Magnet / Ebook", description: "Value-first email capture with ebook preview. Build your email list.", tags: ["leadgen", "ebook"] },
  { name: "Whop University", description: "High-converting course funnel with dark theme, multiple CTAs, and social proof.", tags: ["course", "dark", "whop"] },
  { name: "Sales Funnel", description: "Proven 12-section structure for digital products, courses, and services.", tags: ["sales", "funnel", "copy-heavy"] },
];

const SHORTCUTS = [
  { keys: ["Cmd", "Z"], action: "Undo" },
  { keys: ["Cmd", "Shift", "Z"], action: "Redo" },
  { keys: ["Cmd", "S"], action: "Save" },
  { keys: ["Cmd", "D"], action: "Duplicate section" },
  { keys: ["Delete"], action: "Delete selected" },
  { keys: ["Cmd", "C"], action: "Copy section" },
  { keys: ["Cmd", "V"], action: "Paste section" },
  { keys: ["Esc"], action: "Deselect / Close panel" },
  { keys: ["Up / Down"], action: "Move section" },
];

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function DocsPage() {
  const [search, setSearch] = useState("");

  // IDs for navigation
  const allSections = [
    "getting-started",
    "editor-overview",
    "sections-guide",
    "property-panel",
    "voice-commands",
    "keyboard-shortcuts",
    "publishing",
    "templates",
  ];

  const sectionTitles: Record<string, string> = {
    "getting-started": "Getting Started",
    "editor-overview": "Editor Overview",
    "sections-guide": "Sections Guide",
    "property-panel": "Property Panel",
    "voice-commands": "Voice Commands",
    "keyboard-shortcuts": "Keyboard Shortcuts",
    publishing: "Publishing",
    templates: "Templates",
  };

  // Filter based on search
  const searchLower = search.toLowerCase().trim();
  const filteredSections = searchLower
    ? allSections.filter((id) => {
        const title = sectionTitles[id] || "";
        return title.toLowerCase().includes(searchLower) || id.includes(searchLower);
      })
    : allSections;

  return (
    <>
      {/* Hero header */}
      <div className="mb-10">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/30 to-orange-600/20 ring-1 ring-amber-500/20 shadow-lg shadow-amber-500/10">
            <svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
              <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            </svg>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/15 bg-amber-500/[0.06] px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-medium text-amber-400/70">Documentation</span>
          </div>
        </div>
        <h1 className="mb-3 text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          LaunchPad Docs
        </h1>
        <p className="text-base leading-relaxed text-white/50 max-w-lg">
          Everything you need to build and publish beautiful landing pages.
          Visual guides, interactive walkthroughs, and reference for every feature.
        </p>
      </div>

      {/* Search */}
      <div className="mb-10">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {/* Quick nav cards */}
      {!searchLower && (
        <div className="mb-14 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { id: "getting-started", icon: <IconRocket className="w-5 h-5" />, label: "Get Started", color: "from-blue-500/10 to-blue-600/5 hover:border-blue-500/20" },
            { id: "sections-guide", icon: <IconLayers className="w-5 h-5" />, label: "Sections", color: "from-purple-500/10 to-purple-600/5 hover:border-purple-500/20" },
            { id: "voice-commands", icon: <IconMic className="w-5 h-5" />, label: "Voice", color: "from-pink-500/10 to-pink-600/5 hover:border-pink-500/20" },
            { id: "templates", icon: <IconPalette className="w-5 h-5" />, label: "Templates", color: "from-amber-500/10 to-amber-600/5 hover:border-amber-500/20" },
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`group flex flex-col items-center gap-2 rounded-xl border border-white/[0.06] bg-gradient-to-br p-5 transition-all hover:scale-[1.02] ${item.color}`}
            >
              <span className="text-white/50 group-hover:text-white/80 transition-colors">{item.icon}</span>
              <span className="text-xs font-medium text-white/60 group-hover:text-white/80 transition-colors">{item.label}</span>
            </a>
          ))}
        </div>
      )}

      {filteredSections.length === 0 && (
        <div className="py-20 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/20">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <p className="text-white/40 text-sm">
            No results found for &quot;{search}&quot;
          </p>
        </div>
      )}

      <div className="space-y-20">
        {/* ============================================================ */}
        {/* GETTING STARTED */}
        {/* ============================================================ */}
        {filteredSections.includes("getting-started") && (
          <section id="getting-started" className="scroll-mt-24">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 ring-1 ring-blue-500/20">
                <IconRocket className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Getting Started</h2>
                <p className="text-sm text-white/40">Create your first landing page in minutes</p>
              </div>
            </div>

            <Step
              number={1}
              title="Create a New Project"
              description="From the dashboard, click the New Project button. Give your page a name and choose a starting point."
              visual={
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                      <IconPlus className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white/70">New Project</div>
                      <div className="text-xs text-white/35">Start from a template or a blank canvas</div>
                    </div>
                  </div>
                </div>
              }
            />

            <Step
              number={2}
              title="Choose a Template"
              description="Templates give you a head start with pre-designed sections, color schemes, and copy. You can customize every aspect after choosing one. Select Start from Scratch for total control."
              visual={
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {["Skinny Studio", "SaaS Funnel", "Course Funnel", "Blank Canvas"].map((name, i) => (
                    <div
                      key={name}
                      className={`shrink-0 rounded-lg border p-3 w-32 ${
                        i === 0
                          ? "border-blue-500/30 bg-blue-500/[0.06]"
                          : "border-white/[0.06] bg-white/[0.02]"
                      }`}
                    >
                      <div className="mb-2 h-12 rounded bg-white/[0.04]" />
                      <div className="text-[11px] font-medium text-white/60">{name}</div>
                    </div>
                  ))}
                </div>
              }
            />

            <Step
              number={3}
              title="Edit in the Visual Editor"
              description="The editor has three panels: the Section List on the left shows all your sections, the Canvas in the center shows a live preview, and the Property Panel on the right lets you edit the selected section's content and style."
              visual={
                <a href="#editor-overview" className="block rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-white/10 hover:bg-white/[0.04] group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-2">
                        <div className="h-8 w-20 rounded bg-white/[0.06] flex items-center justify-center text-[8px] text-white/20">Section List</div>
                        <div className="h-8 w-32 rounded bg-white/[0.06] flex items-center justify-center text-[8px] text-white/20">Canvas</div>
                        <div className="h-8 w-20 rounded bg-white/[0.06] flex items-center justify-center text-[8px] text-white/20">Property Panel</div>
                      </div>
                    </div>
                    <span className="text-xs text-white/30 group-hover:text-white/50 transition-colors flex items-center gap-1">
                      See full layout <IconArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </a>
              }
            />

            <Step
              number={4}
              title="Publish Your Page"
              description="When you're ready to go live, click the Publish button in the top-right corner. Your page will be live on a LaunchPad URL instantly. Changes auto-save as you edit."
              visual={
                <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2 rounded-lg bg-green-500/20 px-4 py-2 text-sm font-medium text-green-400">
                    <IconGlobe className="w-4 h-4" />
                    Published
                  </div>
                  <IconArrowRight className="w-4 h-4 text-white/20" />
                  <span className="text-sm text-white/40">onwhop.com/s/yourpage</span>
                </div>
              }
            />
          </section>
        )}

        {/* ============================================================ */}
        {/* EDITOR OVERVIEW */}
        {/* ============================================================ */}
        {filteredSections.includes("editor-overview") && (
          <section id="editor-overview" className="scroll-mt-24">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 ring-1 ring-cyan-500/20">
                <IconEye className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Editor Overview</h2>
                <p className="text-sm text-white/40">Understand the visual editor layout</p>
              </div>
            </div>

            <p className="mb-6 leading-relaxed text-white/50">
              The editor has a three-panel layout: the Section List on the left, the live preview Canvas in the center, and the Property Panel on the right. Click any section to select it and edit its properties.
            </p>

            <EditorMockup />

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                <div className="mb-3 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <h4 className="text-sm font-semibold text-white/80">Section List (Left)</h4>
                </div>
                <p className="text-xs leading-relaxed text-white/45">
                  Shows all sections in your page. Click to select, drag to reorder.
                  Add new sections with the + button. The Elements panel at the bottom
                  lets you drag custom elements (text, images, buttons, icons) onto sections.
                </p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                <div className="mb-3 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <h4 className="text-sm font-semibold text-white/80">Canvas (Center)</h4>
                </div>
                <p className="text-xs leading-relaxed text-white/45">
                  The live preview of your page. Click any section to select it.
                  The selected section is highlighted with a blue border.
                  Scroll the canvas to navigate through your page.
                </p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                <div className="mb-3 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500" />
                  <h4 className="text-sm font-semibold text-white/80">Property Panel (Right)</h4>
                </div>
                <p className="text-xs leading-relaxed text-white/45">
                  Edit content, styles, and elements for the selected section.
                  Two tabs: Settings for content fields (heading, text, buttons),
                  and Style for appearance (colors, fonts, spacing).
                </p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                <div className="mb-3 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <h4 className="text-sm font-semibold text-white/80">Toolbar (Top)</h4>
                </div>
                <p className="text-xs leading-relaxed text-white/45">
                  Contains your project name, undo/redo buttons, device preview toggle,
                  AI voice assistant, and the Publish button. Auto-save keeps your work safe.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ============================================================ */}
        {/* SECTIONS GUIDE */}
        {/* ============================================================ */}
        {filteredSections.includes("sections-guide") && (
          <section id="sections-guide" className="scroll-mt-24">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 ring-1 ring-purple-500/20">
                <IconLayers className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Sections Guide</h2>
                <p className="text-sm text-white/40">{SECTION_TYPES.length} section types to build any page</p>
              </div>
            </div>

            <p className="mb-6 leading-relaxed text-white/50">
              Sections are the building blocks of your page. Each section serves a specific purpose -- from introducing your product to collecting signups. Add, remove, reorder, or duplicate them at any time.
            </p>

            {/* Visual step for adding sections */}
            <div className="mb-8 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h4 className="mb-3 text-sm font-semibold text-white/70 flex items-center gap-2">
                <IconPlus className="w-4 h-4 text-purple-400" />
                Adding a Section
              </h4>
              <div className="flex items-center gap-3 text-xs text-white/45">
                <div className="rounded-lg bg-white/[0.06] px-3 py-2 border border-white/[0.04]">
                  Click <strong className="text-white/60">+ Add Section</strong>
                </div>
                <IconArrowRight className="w-3 h-3 text-white/20" />
                <div className="rounded-lg bg-white/[0.06] px-3 py-2 border border-white/[0.04]">
                  Choose type from grid
                </div>
                <IconArrowRight className="w-3 h-3 text-white/20" />
                <div className="rounded-lg bg-white/[0.06] px-3 py-2 border border-white/[0.04]">
                  Pick a layout variant
                </div>
                <IconArrowRight className="w-3 h-3 text-white/20" />
                <div className="rounded-lg bg-purple-500/20 px-3 py-2 text-purple-300 border border-purple-500/10">
                  Section added
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {SECTION_TYPES.map((section) => (
                <SectionTypeCard
                  key={section.name}
                  name={section.name}
                  description={section.description}
                />
              ))}
            </div>
          </section>
        )}

        {/* ============================================================ */}
        {/* PROPERTY PANEL */}
        {/* ============================================================ */}
        {filteredSections.includes("property-panel") && (
          <section id="property-panel" className="scroll-mt-24">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 ring-1 ring-emerald-500/20">
                <IconSliders className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Property Panel</h2>
                <p className="text-sm text-white/40">Edit content, style, and elements</p>
              </div>
            </div>

            <p className="mb-6 leading-relaxed text-white/50">
              Select any section from the Section List (left) or click it on the Canvas (center) to open its settings in the Property Panel (right). It has two main tabs for full control over your section.
            </p>

            {/* Visual mockup */}
            <div className="mb-8 flex justify-center">
              <PropertyPanelMockup />
            </div>

            <Tabs
              tabs={[
                { id: "settings", label: "Settings", icon: <IconSliders className="w-3.5 h-3.5" /> },
                { id: "style", label: "Style", icon: <IconPalette className="w-3.5 h-3.5" /> },
                { id: "elements", label: "Elements", icon: <IconPlus className="w-3.5 h-3.5" /> },
                { id: "ai", label: "AI Actions", icon: <IconSpark className="w-3.5 h-3.5" /> },
              ]}
            >
              {(activeTab) => (
                <div>
                  {activeTab === "settings" && (
                    <div className="space-y-4">
                      <p className="text-sm leading-relaxed text-white/50">
                        Edit the content of your selected section: headings, subheadings, body text, button text and links, images, and videos.
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {[
                          { title: "Text Content", desc: "Edit headings, subheadings, body text, button labels" },
                          { title: "Images & Media", desc: "Upload or link images and videos for the section" },
                          { title: "Visibility Toggles", desc: "Show or hide individual elements within the section" },
                          { title: "Items Management", desc: "Add, edit, reorder, remove cards and entries" },
                        ].map((item) => (
                          <div key={item.title} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                            <div className="mb-1 flex items-center gap-2">
                              <IconCheck className="w-3.5 h-3.5 text-emerald-400" />
                              <h4 className="text-sm font-medium text-white/70">{item.title}</h4>
                            </div>
                            <p className="text-xs text-white/40 pl-5.5">{item.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {activeTab === "style" && (
                    <div className="space-y-4">
                      <p className="text-sm leading-relaxed text-white/50">
                        Control the visual appearance of your section -- colors, layouts, effects, typography, and spacing.
                      </p>
                      <div className="grid gap-2">
                        {[
                          "Background and text colors",
                          "Section layout variant (e.g. centered vs. split)",
                          "Background effects (aurora, sparkles, meteors, etc.)",
                          "Heading style (solid, gradient, or outline)",
                          "Subheading animation, size, and weight",
                          "Spacing and padding",
                          "Button styling -- variant, size, colors, border radius, shadow",
                          "Typography overrides for individual text elements",
                        ].map((item) => (
                          <div key={item} className="flex items-center gap-3 rounded-lg bg-white/[0.02] px-4 py-2.5 border border-white/[0.04]">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/60" />
                            <span className="text-xs text-white/50">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {activeTab === "elements" && (
                    <div className="space-y-4">
                      <p className="text-sm leading-relaxed text-white/50">
                        Add standalone UI pieces on top of any section. Elements can be positioned freely and have their own styling options.
                      </p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {[
                          { name: "Button", desc: "CTA with customizable style, link, and size" },
                          { name: "Text", desc: "Headings, paragraphs, or captions" },
                          { name: "Image", desc: "Standalone images with radius and shadow" },
                          { name: "Video", desc: "YouTube or Vimeo embed" },
                          { name: "Badge", desc: "Small label or pill" },
                          { name: "Icon", desc: "From the built-in icon library" },
                          { name: "Divider", desc: "Solid, dashed, dotted, gradient, double" },
                          { name: "Social", desc: "Social media icon links" },
                          { name: "Countdown", desc: "Date-based countdown timer" },
                          { name: "Form", desc: "Email capture input field" },
                          { name: "HTML", desc: "Raw HTML block for advanced use" },
                        ].map((el) => (
                          <div key={el.name} className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 transition-colors hover:bg-white/[0.04]">
                            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/[0.08] text-[10px] font-bold text-white/40">
                              {el.name[0]}
                            </div>
                            <div>
                              <h5 className="text-xs font-semibold text-white/70">{el.name}</h5>
                              <p className="text-[11px] text-white/35">{el.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {activeTab === "ai" && (
                    <div className="space-y-4">
                      <p className="text-sm leading-relaxed text-white/50">
                        AI-powered shortcuts to speed up editing. Generate copy, suggest color schemes, or improve your content with a single click.
                      </p>
                      <div className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-purple-500/[0.06] to-blue-500/[0.04] p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20">
                            <IconSpark className="w-4 h-4 text-purple-400" />
                          </div>
                          <h4 className="text-sm font-semibold text-white/70">AI Quick Actions</h4>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {[
                            "Generate copy for headings and subheadings",
                            "Suggest matching color palettes",
                            "Rewrite and improve existing text",
                            "Auto-generate FAQ questions",
                          ].map((action) => (
                            <div key={action} className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2 border border-white/[0.03]">
                              <IconSpark className="w-3 h-3 text-purple-400/60 shrink-0" />
                              <span className="text-xs text-white/45">{action}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Tabs>
          </section>
        )}

        {/* ============================================================ */}
        {/* VOICE COMMANDS */}
        {/* ============================================================ */}
        {filteredSections.includes("voice-commands") && (
          <section id="voice-commands" className="scroll-mt-24">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-600/10 ring-1 ring-pink-500/20">
                <IconMic className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Voice Commands</h2>
                <p className="text-sm text-white/40">Edit your page by speaking naturally</p>
              </div>
            </div>

            <p className="mb-4 leading-relaxed text-white/50">
              Click the microphone button in the editor toolbar to start, then speak naturally. You can combine commands: &quot;Add a testimonials section after features, then change the heading to What People Say.&quot;
            </p>

            {/* How it works visual */}
            <div className="mb-8 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 overflow-x-auto">
              <div className="shrink-0 flex items-center gap-2 rounded-lg bg-pink-500/15 px-3 py-2 text-xs font-medium text-pink-300 border border-pink-500/10">
                <IconMic className="w-3.5 h-3.5" />
                Click mic
              </div>
              <IconArrowRight className="w-3 h-3 text-white/15 shrink-0" />
              <div className="shrink-0 rounded-lg bg-white/[0.06] px-3 py-2 text-xs text-white/40 border border-white/[0.04]">
                Speak command
              </div>
              <IconArrowRight className="w-3 h-3 text-white/15 shrink-0" />
              <div className="shrink-0 rounded-lg bg-white/[0.06] px-3 py-2 text-xs text-white/40 border border-white/[0.04]">
                AI processes
              </div>
              <IconArrowRight className="w-3 h-3 text-white/15 shrink-0" />
              <div className="shrink-0 rounded-lg bg-green-500/15 px-3 py-2 text-xs font-medium text-green-300 border border-green-500/10">
                <IconCheck className="w-3 h-3 inline mr-1" />
                Applied
              </div>
            </div>

            <Tabs
              tabs={[
                { id: "content", label: "Content" },
                { id: "layout", label: "Layout & Style" },
                { id: "sections", label: "Sections" },
                { id: "other", label: "Other" },
              ]}
            >
              {(activeTab) => {
                const groups: Record<string, typeof VOICE_COMMANDS> = {
                  content: VOICE_COMMANDS.filter((c) =>
                    ["Edit section content", "Style text elements", "Update items", "Toggle visibility"].includes(c.command)
                  ),
                  "layout": VOICE_COMMANDS.filter((c) =>
                    ["Change the colors", "Change the fonts", "Apply a theme", "Change section layout", "Change background effect"].includes(c.command)
                  ),
                  sections: VOICE_COMMANDS.filter((c) =>
                    ["Add a section", "Remove a section", "Move a section", "Duplicate a section", "Add an element"].includes(c.command)
                  ),
                  other: VOICE_COMMANDS.filter((c) =>
                    ["Update page settings", "Undo / Redo"].includes(c.command)
                  ),
                };
                const cmds = groups[activeTab] || [];
                return (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {cmds.map((cmd) => (
                      <VoiceCommandCard
                        key={cmd.command}
                        command={cmd.command}
                        description={cmd.description}
                        example={cmd.example}
                      />
                    ))}
                  </div>
                );
              }}
            </Tabs>
          </section>
        )}

        {/* ============================================================ */}
        {/* KEYBOARD SHORTCUTS */}
        {/* ============================================================ */}
        {filteredSections.includes("keyboard-shortcuts") && (
          <section id="keyboard-shortcuts" className="scroll-mt-24">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 ring-1 ring-orange-500/20">
                <IconKeyboard className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Keyboard Shortcuts</h2>
                <p className="text-sm text-white/40">Speed up your workflow</p>
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
              {SHORTCUTS.map((shortcut, i) => (
                <div
                  key={shortcut.action}
                  className={`flex items-center justify-between px-5 py-3.5 ${
                    i < SHORTCUTS.length - 1 ? "border-b border-white/[0.04]" : ""
                  } hover:bg-white/[0.02] transition-colors`}
                >
                  <span className="text-sm text-white/60">{shortcut.action}</span>
                  <div className="flex items-center gap-1.5">
                    {shortcut.keys.map((key, j) => (
                      <span key={j}>
                        <Kbd>{key}</Kbd>
                        {j < shortcut.keys.length - 1 && (
                          <span className="mx-0.5 text-[10px] text-white/20">+</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ============================================================ */}
        {/* PUBLISHING */}
        {/* ============================================================ */}
        {filteredSections.includes("publishing") && (
          <section id="publishing" className="scroll-mt-24">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/10 ring-1 ring-green-500/20">
                <IconGlobe className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Publishing</h2>
                <p className="text-sm text-white/40">Go live and manage your page</p>
              </div>
            </div>

            <Step
              number={1}
              title="Publish Your Page"
              description="Click the Publish button in the top-right corner of the editor. Your page will be live on a LaunchPad URL that you can share immediately."
              visual={
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-500 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-blue-500/20">
                    Publish
                  </div>
                  <IconArrowRight className="w-4 h-4 text-white/20" />
                  <code className="rounded-lg bg-white/[0.06] px-3 py-2 text-xs text-green-400 border border-white/[0.06]">
                    onwhop.com/s/yourpage
                  </code>
                </div>
              }
            />

            <Step
              number={2}
              title="Manage Visibility"
              description="Toggle your page between live and offline from the dashboard. Going offline hides the page without deleting it -- bring it back anytime with a single click."
              visual={
                <div className="flex gap-3">
                  <div className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/[0.06] px-4 py-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-xs font-medium text-green-400">Live</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-2">
                    <div className="h-2 w-2 rounded-full bg-white/20" />
                    <span className="text-xs text-white/35">Offline</span>
                  </div>
                </div>
              }
            />

            <Step
              number={3}
              title="Connect Custom Domain"
              description="Go to your project settings and enter your domain name. Follow the DNS instructions to point your domain to LaunchPad."
              visual={
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="mb-2 text-[10px] uppercase tracking-wider text-white/30 font-medium">Custom Domain</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 rounded-lg bg-white/[0.06] px-3 py-2 text-xs text-white/40 border border-white/[0.04]">
                      www.yourdomain.com
                    </div>
                    <div className="rounded-lg bg-white/10 px-3 py-2 text-xs font-medium text-white/50">
                      Connect
                    </div>
                  </div>
                </div>
              }
            />
          </section>
        )}

        {/* ============================================================ */}
        {/* TEMPLATES */}
        {/* ============================================================ */}
        {filteredSections.includes("templates") && (
          <section id="templates" className="scroll-mt-24">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 ring-1 ring-amber-500/20">
                <IconPalette className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Templates</h2>
                <p className="text-sm text-white/40">{TEMPLATES.length} professionally designed starting points</p>
              </div>
            </div>

            <p className="mb-6 leading-relaxed text-white/50">
              Every template is fully customizable. Change colors, fonts, copy, images, and section order to make it your own.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TEMPLATES.map((template) => (
                <TemplateCard
                  key={template.name}
                  name={template.name}
                  description={template.description}
                  tags={template.tags}
                />
              ))}
            </div>

            <Collapsible
              title="Customizing a Template"
              icon={<IconSliders className="w-4 h-4" />}
              defaultOpen={false}
            >
              <p className="text-sm leading-relaxed text-white/50">
                After choosing a template, everything is editable. Change the color scheme from the Style tab, swap images, rewrite copy, add or remove sections, and rearrange the order. The template is just a starting point.
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {[
                  "Change colors and fonts",
                  "Swap out all images",
                  "Rewrite copy and headings",
                  "Add or remove sections",
                  "Rearrange section order",
                  "Adjust layouts and spacing",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-white/45">
                    <IconCheck className="w-3 h-3 text-amber-400/60 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </Collapsible>
          </section>
        )}
      </div>
    </>
  );
}
