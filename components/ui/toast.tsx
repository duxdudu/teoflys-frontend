"use client";

import React, { useEffect } from "react";
import { ToastItem, useToastContext } from "./toast-provider";

function ToastCard({ toast }: { toast: ToastItem }) {
  const { removeToast } = useToastContext();

  useEffect(() => {
    const t = setTimeout(() => removeToast(toast.id), 3000);
    return () => clearTimeout(t);
  }, [toast.id, removeToast]);

  const variant = toast.variant || "default";
  const base = "flex items-start gap-3 rounded-lg shadow-lg border p-3 backdrop-blur-sm";
  const cls = {
    default: `${base} bg-white text-gray-900 border-gray-200`,
    destructive: `${base} bg-red-50 text-red-900 border-red-200`,
    success: `${base} bg-green-50 text-green-900 border-green-200`,
    info: `${base} bg-gray-50 text-gray-900 border-gray-200`,
  }[variant];

  return (
    <div className={cls} role="status" aria-live="polite">
      <div className="flex-1 min-w-0">
        {toast.title && <div className="font-medium text-sm">{toast.title}</div>}
        {toast.description && (
          <div className="text-xs text-gray-600 mt-0.5 break-words">{toast.description}</div>
        )}
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        className="ml-3 text-xs text-gray-500 hover:text-gray-800"
        aria-label="Close"
      >
        ✕
      </button>
    </div>
  );
}

export function Toaster() {
  const { toasts } = useToastContext();
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 w-[calc(100%-2rem)] sm:w-80">
      {toasts.map((t) => (
        <ToastCard key={t.id} toast={t} />
      ))}
    </div>
  );
}


