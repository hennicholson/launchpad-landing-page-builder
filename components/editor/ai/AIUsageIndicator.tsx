"use client";

import { useState, useEffect } from "react";
import { Sparkles, ChevronDown, TrendingUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIUsageIndicatorProps {
  copyUsed: number;
  copyLimit: number;
  componentUsed: number;
  componentLimit: number;
  onUpgrade?: () => void;
}

export function AIUsageIndicator({
  copyUsed,
  copyLimit,
  componentUsed,
  componentLimit,
  onUpgrade,
}: AIUsageIndicatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate percentages
  const copyPercent = copyLimit === -1 ? 0 : Math.min((copyUsed / copyLimit) * 100, 100);
  const componentPercent =
    componentLimit === -1 ? 0 : Math.min((componentUsed / componentLimit) * 100, 100);

  // Overall usage
  const totalUsed = copyUsed + componentUsed;
  const totalLimit = copyLimit === -1 || componentLimit === -1 ? -1 : copyLimit + componentLimit;
  const totalPercent = totalLimit === -1 ? 0 : Math.min((totalUsed / totalLimit) * 100, 100);

  // Warning thresholds
  const isLow = totalPercent >= 80;
  const isDepleted = totalLimit !== -1 && totalUsed >= totalLimit;

  return (
    <div className="relative">
      {/* Main indicator button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all",
          "hover:bg-white/10",
          isDepleted && "bg-red-500/20 text-red-400",
          isLow && !isDepleted && "bg-yellow-500/20 text-yellow-400",
          !isLow && !isDepleted && "text-white/70"
        )}
      >
        <Sparkles className="w-4 h-4" />
        <span className="text-sm font-medium">
          {totalLimit === -1
            ? `${totalUsed} AI uses`
            : `${totalUsed}/${totalLimit} AI`}
        </span>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 transition-transform",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      {/* Expanded dropdown */}
      {isExpanded && (
        <div className="absolute top-full right-0 mt-2 w-72 p-4 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">AI Usage</h3>
              <p className="text-xs text-white/50">This billing period</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Copy generations */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-white/70">Text Improvements</span>
                <span className="text-white/50">
                  {copyLimit === -1 ? `${copyUsed} used` : `${copyUsed}/${copyLimit}`}
                </span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    copyPercent >= 80
                      ? "bg-gradient-to-r from-yellow-500 to-red-500"
                      : "bg-gradient-to-r from-purple-500 to-pink-500"
                  )}
                  style={{ width: copyLimit === -1 ? "5%" : `${copyPercent}%` }}
                />
              </div>
            </div>

            {/* Component generations */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-white/70">Section & Page Generation</span>
                <span className="text-white/50">
                  {componentLimit === -1
                    ? `${componentUsed} used`
                    : `${componentUsed}/${componentLimit}`}
                </span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    componentPercent >= 80
                      ? "bg-gradient-to-r from-yellow-500 to-red-500"
                      : "bg-gradient-to-r from-blue-500 to-cyan-500"
                  )}
                  style={{
                    width: componentLimit === -1 ? "5%" : `${componentPercent}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Upgrade prompt */}
          {totalLimit !== -1 && (
            <div className="mt-4 pt-4 border-t border-white/10">
              {isDepleted ? (
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-red-400">
                    You've reached your AI limit for this period.
                  </p>
                  {onUpgrade && (
                    <button
                      onClick={onUpgrade}
                      className="flex items-center justify-center gap-2 w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm font-medium rounded-lg transition-all"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Upgrade for More</span>
                    </button>
                  )}
                </div>
              ) : isLow ? (
                <p className="text-xs text-yellow-400">
                  Running low on AI generations. Consider upgrading.
                </p>
              ) : (
                <p className="text-xs text-white/40">
                  Resets at the end of your billing period.
                </p>
              )}
            </div>
          )}

          {totalLimit === -1 && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs">Unlimited AI generations</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AIUsageIndicator;
