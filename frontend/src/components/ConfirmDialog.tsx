export function ConfirmDialog(props: {
  title: string;
  message: string;
  confirmText?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="overlay" role="dialog" aria-modal="true">
      <div className="dialog">
        <h3>{props.title}</h3>
        <p className="muted">{props.message}</p>
        <div className="dialog-actions">
          <button className="btn" onClick={props.onCancel} disabled={props.busy}>Batal</button>
          <button className="btn btn-danger" onClick={props.onConfirm} disabled={props.busy}>
            {props.busy ? 'Memproses...' : props.confirmText ?? 'Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
}
