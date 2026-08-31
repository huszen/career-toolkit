import { Download, CheckCircle2 } from 'lucide-react';

export default function DownloadCard({ url }) {
  if (!url) return null;

  return (
    <div className="p-6 bg-card-bg border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-text-main shadow-lg">
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-emerald-400 text-base">Cover Letter Generated Successfully!</h3>
          <p className="text-xs text-text-muted mt-0.5">Your styled PDF has been compiled and is ready for application submission.</p>
        </div>
      </div>

      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        download
        className="w-full sm:w-auto py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer"
      >
        <Download className="w-4 h-4" />
        Download PDF
      </a>
    </div>
  );
}
