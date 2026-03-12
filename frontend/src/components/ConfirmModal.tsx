type Props = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: Props) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/95"
      onClick={onCancel}
    >
      <div
        className="bg-zinc-900 p-6 rounded-xl w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-3">{title}</h2>

        <p className="text-zinc-400 text-sm mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-sm bg-zinc-700 rounded hover:bg-zinc-600"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className="px-3 py-1.5 text-sm bg-red-500 rounded hover:bg-red-600"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;