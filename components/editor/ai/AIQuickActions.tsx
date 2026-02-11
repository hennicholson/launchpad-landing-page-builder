"use client";

import { useState } from "react";
import {
  Sparkles,
  Wand2,
  Type,
  Plus,
  RefreshCw,
  Zap,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/lib/store";
import type { SectionType, PageSection, SectionContent } from "@/lib/page-schema";

interface QuickAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  action: string;
  field?: string;
}

interface AIQuickActionsProps {
  sectionType: SectionType;
  sectionId: string;
  section?: PageSection; // Full section data for context
}

/**
 * Extract field value from section based on field name
 * All content fields are stored in section.content (not section root)
 */
function extractFieldValue(section: PageSection | undefined, field: string): string {
  if (!section || !section.content) return "";

  // All text fields are in section.content
  const value = section.content[field as keyof SectionContent];

  // Handle string values
  if (typeof value === "string") {
    return value;
  }

  // Handle array values (like brands, forItems, notForItems)
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return "";
}

/**
 * Get quick actions available for each section type
 */
function getQuickActionsForSection(sectionType: SectionType): QuickAction[] {
  const commonActions: QuickAction[] = [
    {
      id: "improve-heading",
      icon: <Sparkles className="w-4 h-4" />,
      label: "Improve headline",
      description: "Make it more compelling",
      action: "improve",
      field: "heading",
    },
    {
      id: "improve-subheading",
      icon: <Type className="w-4 h-4" />,
      label: "Improve subheading",
      description: "Better supporting text",
      action: "improve",
      field: "subheading",
    },
  ];

  const sectionSpecificActions: Record<string, QuickAction[]> = {
    hero: [
      ...commonActions,
      {
        id: "improve-cta",
        icon: <Zap className="w-4 h-4" />,
        label: "Improve CTA",
        description: "More action-oriented",
        action: "improve",
        field: "buttonText",
      },
      {
        id: "add-urgency",
        icon: <Wand2 className="w-4 h-4" />,
        label: "Add urgency",
        description: "Increase conversion",
        action: "add-urgency",
        field: "heading",
      },
    ],
    features: [
      ...commonActions,
      {
        id: "improve-features",
        icon: <RefreshCw className="w-4 h-4" />,
        label: "Improve features",
        description: "Better benefit copy",
        action: "improve-items",
      },
      {
        id: "add-feature",
        icon: <Plus className="w-4 h-4" />,
        label: "Add feature",
        description: "Generate new feature",
        action: "add-item",
      },
    ],
    testimonials: [
      ...commonActions,
      {
        id: "improve-quotes",
        icon: <RefreshCw className="w-4 h-4" />,
        label: "Enhance quotes",
        description: "More persuasive",
        action: "improve-items",
      },
      {
        id: "add-testimonial",
        icon: <Plus className="w-4 h-4" />,
        label: "Add testimonial",
        description: "Generate new quote",
        action: "add-item",
      },
    ],
    pricing: [
      ...commonActions,
      {
        id: "improve-pricing",
        icon: <RefreshCw className="w-4 h-4" />,
        label: "Improve pricing",
        description: "Better value props",
        action: "improve-items",
      },
    ],
    cta: [
      ...commonActions,
      {
        id: "improve-cta-button",
        icon: <Zap className="w-4 h-4" />,
        label: "Improve CTA",
        description: "Higher conversion",
        action: "improve",
        field: "buttonText",
      },
      {
        id: "add-urgency",
        icon: <Wand2 className="w-4 h-4" />,
        label: "Add urgency",
        description: "Create FOMO",
        action: "add-urgency",
      },
    ],
    faq: [
      ...commonActions,
      {
        id: "improve-faqs",
        icon: <RefreshCw className="w-4 h-4" />,
        label: "Improve answers",
        description: "Clearer responses",
        action: "improve-items",
      },
      {
        id: "add-faq",
        icon: <Plus className="w-4 h-4" />,
        label: "Add question",
        description: "Generate FAQ",
        action: "add-item",
      },
    ],
    stats: [
      ...commonActions,
      {
        id: "improve-stats",
        icon: <RefreshCw className="w-4 h-4" />,
        label: "Improve stats",
        description: "More impactful numbers",
        action: "improve-items",
      },
    ],
    process: [
      ...commonActions,
      {
        id: "improve-steps",
        icon: <RefreshCw className="w-4 h-4" />,
        label: "Improve steps",
        description: "Clearer process",
        action: "improve-items",
      },
    ],
  };

  return sectionSpecificActions[sectionType] || commonActions;
}

export function AIQuickActions({
  sectionType,
  sectionId,
  section,
}: AIQuickActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const actions = getQuickActionsForSection(sectionType);

  // Get store methods for handling suggestions
  const page = useEditorStore((state) => state.page);
  const setAIPendingSuggestion = useEditorStore((state) => state.setAIPendingSuggestion);
  const setAILoadingAction = useEditorStore((state) => state.setAILoadingAction);

  // Handle action
  const handleAction = async (action: string, field?: string) => {
    setIsLoading(true);
    setError(null);
    setLoadingAction(action + (field ? `-${field}` : ""));
    setAILoadingAction(action);

    try {
      // For field-specific actions, extract the current value
      let currentValue = "";
      if (field) {
        currentValue = extractFieldValue(section, field);
        if (!currentValue) {
          throw new Error(`No value found for field: ${field}`);
        }
      }

      // For inline actions (improve, rewrite, etc.), use /api/ai/inline
      if (field && ["improve", "rewrite", "shorten", "expand", "add-urgency", "professional", "casual"].includes(action)) {
        const response = await fetch("/api/ai/inline", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action,
            field,
            currentValue,
            sectionType,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "AI request failed");
        }

        console.log("AI inline result:", result);

        // Set pending suggestion for preview
        if (result.improved) {
          setAIPendingSuggestion({
            type: "text",
            field,
            sectionId,
            original: currentValue,
            proposed: result.improved,
          });
        }
      } else {
        // For section-level actions, use /api/ai/section
        const response = await fetch("/api/ai/section", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: action === "improve-section" ? "improve" : action === "add-item" ? "add-items" : action,
            page,
            sectionId,
            instruction: `${action} for this ${sectionType} section`,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "AI request failed");
        }

        console.log("AI section result:", result);

        // Set pending suggestion for preview
        if (result.section) {
          setAIPendingSuggestion({
            type: "section",
            sectionId,
            original: section,
            proposed: result.section,
          });
        }
      }
    } catch (err) {
      console.error("AI action failed:", err);
      setError(err instanceof Error ? err.message : "AI request failed");
    } finally {
      setIsLoading(false);
      setLoadingAction(null);
      setAILoadingAction(null);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs font-medium text-white/60 uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5" />
        <span>AI Quick Actions</span>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {actions.map((action) => {
          const isActionLoading = isLoading && loadingAction === action.id;

          return (
            <div key={action.id} className="relative group">
              <button
                onClick={() => handleAction(action.action, action.field)}
                disabled={isLoading}
                className={cn(
                  "w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-all",
                  "bg-white/5 hover:bg-white/10 border border-white/10",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  isActionLoading && "bg-purple-500/20 border-purple-500/30"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-md flex-shrink-0",
                    "bg-gradient-to-br from-purple-500/20 to-pink-500/20",
                    isActionLoading && "animate-pulse"
                  )}
                >
                  {isActionLoading ? (
                    <Loader2 className="w-3 h-3 text-purple-400 animate-spin" />
                  ) : (
                    <span className="text-purple-400">{action.icon}</span>
                  )}
                </div>
                <span className="text-xs font-medium text-white truncate">
                  {action.label}
                </span>
              </button>
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-[#1a1a1a] border border-white/20 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 pointer-events-none whitespace-nowrap">
                <div className="text-xs text-white font-medium">{action.label}</div>
                <div className="text-[10px] text-white/60">{action.description}</div>
                {/* Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1a1a1a]" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Full section actions */}
      <div className="pt-2 border-t border-white/10 mt-3">
        <button
          onClick={() => handleAction("improve-section")}
          disabled={isLoading}
          className={cn(
            "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg",
            "bg-gradient-to-r from-purple-500/20 to-pink-500/20",
            "hover:from-purple-500/30 hover:to-pink-500/30",
            "border border-purple-500/30 text-white font-medium",
            "transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {isLoading && loadingAction === "improve-section" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Wand2 className="w-4 h-4" />
          )}
          <span>Improve Entire Section</span>
        </button>
      </div>

      {/* Error display */}
      {error && (
        <div className="mt-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
          <div className="flex items-center gap-2 text-red-400 text-xs">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIQuickActions;
