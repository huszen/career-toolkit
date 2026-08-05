import { FileText, Link2, ChevronDown, RotateCcw } from "lucide-react";

export default function CollapsedFormSummary({
    cvFileName,
    currentJobUrl,
    onEdit,
    onReset,
}) {
    return (
    <div className="rounded-2xl border border-border bg-card-bg/80 backdrop-blur p-5 text-text-main shadow-sm flex items-center justify-between gap-4 transition-all duration-300">
      <div className="flex items-center gap-4 overflow-hidden">
        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 shrink-0">
          <FileText className="w-5 h-5 text-primary" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary">
              Target Configured
            </span>
            <span className="text-xs text-text-muted truncate max-w-[200px]">
              {cvFileName}
            </span>
          </div>

          <p className="text-sm font-medium text-text-main truncate mt-1 flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5 text-text-muted shrink-0" />
            <span className="truncate">{currentJobUrl}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onEdit}
          className="px-3.5 py-2 text-xs font-medium rounded-xl border border-border bg-input-bg hover:border-primary/50 text-text-muted hover:text-text-main transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span>Edit Inputs</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onReset}
          className="p-2 text-xs font-medium rounded-xl border border-border bg-input-bg hover:border-red-500/40 text-text-muted hover:text-red-400 transition-all cursor-pointer"
          title="Start New Generation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}