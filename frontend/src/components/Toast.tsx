import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

type Kind = 'success' | 'error' | 'info';
interface ToastItem { id: number; kind: Kind; text: string }
type Notify = (text: string, kind?: Kind) => void;

const ToastContext = createContext<Notify>(() => {});
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const notify = useCallback<Notify>((text, kind = 'info') => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, kind, text }]);
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className={`toast toast-${t.kind}`}>{t.text}</div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
