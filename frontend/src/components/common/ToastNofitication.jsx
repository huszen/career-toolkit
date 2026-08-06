import { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

export default function ToastNotification({ show, message, onClose, duration = 2000 }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-card-bg border border-emerald-500/30 text-text-main shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300">
      <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        <CheckCircle2 className="w-4 h-4" />
      </div>
      <p className="text-xs font-medium text-emerald-400">{message}</p>
      <button
        onClick={onClose}
        className="p-1 text-text-muted hover:text-text-main transition-colors rounded-lg cursor-pointer ml-2"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
