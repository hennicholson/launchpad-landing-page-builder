"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEditorStore } from "@/lib/store";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

export type Toast = {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
};

const TOAST_ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const TOAST_COLORS = {
  success: "border-emerald-500 bg-emerald-500/10 text-emerald-400",
  error: "border-red-500 bg-red-500/10 text-red-400",
  info: "border-blue-500 bg-blue-500/10 text-blue-400",
  warning: "border-amber-500 bg-amber-500/10 text-amber-400",
};

function ToastItem({ toast }: { toast: Toast }) {
  const removeToast = useEditorStore((s) => s.removeToast);
  const Icon = TOAST_ICONS[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, toast.duration || 3000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, removeToast]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      className={`flex items-center gap-2.5 px-4 py-3 rounded-lg border-l-2 backdrop-blur-xl shadow-2xl cursor-pointer ${TOAST_COLORS[toast.type]}`}
      onClick={() => removeToast(toast.id)}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="text-sm font-medium">{toast.message}</span>
      <button
        onClick={(e) => { e.stopPropagation(); removeToast(toast.id); }}
        className="ml-2 p-0.5 rounded hover:bg-white/10 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </motion.div>
  );
}

export function ToastContainer() {
  const toasts = useEditorStore((s) => s.toasts);

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
