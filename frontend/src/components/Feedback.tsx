import type { ReactNode } from 'react';

export function Loading({ text = 'Memuat data...' }: { text?: string }) {
  return (
    <div className="state" role="status">
      <span className="spinner" aria-hidden="true" />
      <p>{text}</p>
    </div>
  );
}

export function EmptyState({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="state">
      <div className="state-icon" aria-hidden="true">∅</div>
      <h3>{title}</h3>
      {hint && <p>{hint}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="state state-error" role="alert">
      <div className="state-icon" aria-hidden="true">!</div>
      <h3>Gagal memuat data</h3>
      <p>{message}</p>
      {onRetry && <button className="btn" onClick={onRetry}>Coba lagi</button>}
    </div>
  );
}
