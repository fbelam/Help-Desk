import { useEffect } from 'react';
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: number;
  type: ToastType;
  title: string;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: number) => void;
}

const icons: Record<ToastType, string> = {
  success: 'check_circle',
  error: 'error',
  info: 'info',
  warning: 'warning',
};

const colors: Record<ToastType, string> = {
  success: 'text-[#4a7c59]',
  error: 'text-error',
  info: 'text-primary',
  warning: 'text-[#b45309]',
};

function ToastItem({ toast, onRemove }: { toast: ToastMessage; onRemove: (id: number) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <div className="flex items-start gap-3 bg-surface-container-lowest border border-outline-variant/60 rounded-xl px-4 py-3 shadow-[0_4px_24px_rgba(58,48,42,0.12)] min-w-[280px] max-w-sm animate-[slideIn_0.3s_ease-out]">
      <span className={`material-symbols-outlined text-[22px] mt-0.5 ${colors[toast.type]}`} style={{ fontVariationSettings: "'FILL' 1" }}>
        {icons[toast.type]}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-body font-bold text-on-surface text-sm">{toast.title}</p>
        <p className="font-body text-on-surface-variant text-xs mt-0.5">{toast.message}</p>
      </div>
      <button onClick={() => onRemove(toast.id)} className="text-on-surface-variant hover:text-on-surface transition-colors ml-1 flex-shrink-0">
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onRemove }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

// Hook helper
import { useState, useCallback } from 'react';

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastType, title: string, message: string) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, type, title, message }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}
