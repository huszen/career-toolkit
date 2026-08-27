import { Sparkles, AlertCircle } from 'lucide-react';

export default function RefineConfirmModal({ isOpen, onConfirm, onCancel, isRefining }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-card-bg border border-border rounded-xl p-6 max-w-md w-full shadow-xl text-text-main space-y-4">
        {/* Modal Header */}
        <div className="flex items-center gap-3 text-primary">
          <div className="p-2 bg-primary/10 border border-primary/20 rounded-lg">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-text-main">Refine Your Profile?</h3>
        </div>

        {/* Modal Body / Caution Notice */}
        <div className="space-y-3 text-xs text-text-muted leading-relaxed">
          <p>This action will run an AI refinement process to organize your raw CV text into structured, visual cards, timeline entries, and skill categories.</p>
          <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-snug">This request calls an AI model and will count toward your AI usage limits. Your original baseline CV data will remain safe and will not be deleted.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            disabled={isRefining}
            className="px-4 py-2 text-xs font-semibold text-text-muted hover:text-text-main bg-input-bg hover:bg-border/40 rounded-lg border border-border transition disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isRefining}
            className="px-4 py-2 text-xs font-semibold text-text-main bg-primary hover:bg-primary-hover rounded-lg shadow-sm transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {isRefining ? 'Structuring Data...' : 'Refine Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}
