// src/components/dashboard/DeleteConfirmModal.jsx
export default function DeleteConfirmModal({ isOpen, jobTitle, onConfirm, onCancel, isDeleting }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-card-bg border border-border rounded-xl p-6 max-w-md w-full shadow-xl text-text-main space-y-4">
        {/* Warning Header */}
        <div className="flex items-center gap-3 text-rose-400">
          <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 className="text-lg font-bold">Delete Application?</h3>
        </div>

        {/* Description */}
        <p className="text-sm text-text-muted leading-relaxed">
          Are you sure you want to remove <strong className="text-text-main font-semibold">"{jobTitle}"</strong> from your tracking dashboard? This action cannot be undone.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold text-text-muted hover:text-text-main bg-input-bg hover:bg-border/40 rounded-lg border border-border transition disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold text-white bg-danger hover:bg-red-600 rounded-lg shadow-sm transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {isDeleting ? 'Deleting...' : 'Delete Application'}
          </button>
        </div>
      </div>
    </div>
  );
}