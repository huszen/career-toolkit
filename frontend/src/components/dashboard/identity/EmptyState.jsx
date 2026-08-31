import { memo } from 'react';
import { FileText } from 'lucide-react';

const EmptyState = memo(function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-card-bg rounded-2xl border-2 border-dashed border-border/80 px-6 space-y-5">
      <div className="p-4 bg-input-bg rounded-full shadow-sm border border-border">
        <FileText className="w-8 h-8 text-text-muted" />
      </div>
      <div className="space-y-2 text-center">
        <h3 className="text-lg font-bold text-text-main">No CV profile saved</h3>
        <p className="text-sm text-text-muted max-w-md mx-auto leading-relaxed">Upload your resume PDF to automatically extract your skills, experience, and contact info into a clean, modern layout.</p>
      </div>
    </div>
  );
});

export default EmptyState;
