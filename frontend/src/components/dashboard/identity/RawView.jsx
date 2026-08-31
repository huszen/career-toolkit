import { memo } from 'react';
import { Briefcase, GraduationCap, FolderGit2, Award } from 'lucide-react';

const RawView = memo(function RawView({ content }) {
  if (!content) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {content.summary && (
        <div className="p-8 bg-card-bg border border-border rounded-2xl shadow-sm space-y-4 md:col-span-2">
          <h5 className="text-sm font-bold text-text-muted uppercase tracking-widest">Professional Summary</h5>
          <p className="text-base text-text-main whitespace-pre-line leading-relaxed">{content.summary}</p>
        </div>
      )}

      {content.skills && (
        <div className="p-8 bg-card-bg border border-border rounded-2xl shadow-sm space-y-4">
          <h5 className="text-sm font-bold text-text-muted uppercase tracking-widest">Core Skills & Technologies</h5>
          <p className="text-sm text-text-main whitespace-pre-line leading-relaxed">{content.skills}</p>
        </div>
      )}

      {content.experience && (
        <div className="p-8 bg-card-bg border border-border rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <Briefcase className="w-5 h-5 text-primary" />
            <h5 className="text-sm font-bold text-text-muted uppercase tracking-widest">Work Experience</h5>
          </div>
          <p className="text-sm text-text-main whitespace-pre-line leading-relaxed">{content.experience}</p>
        </div>
      )}

      {content.education && (
        <div className="p-8 bg-card-bg border border-border rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <GraduationCap className="w-5 h-5 text-primary" />
            <h5 className="text-sm font-bold text-text-muted uppercase tracking-widest">Education</h5>
          </div>
          <p className="text-sm text-text-main whitespace-pre-line leading-relaxed">{content.education}</p>
        </div>
      )}

      {content.projects && (
        <div className="p-8 bg-card-bg border border-border rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <FolderGit2 className="w-5 h-5 text-primary" />
            <h5 className="text-sm font-bold text-text-muted uppercase tracking-widest">Projects</h5>
          </div>
          <p className="text-sm text-text-main whitespace-pre-line leading-relaxed">{content.projects}</p>
        </div>
      )}

      {content.certifications && (
        <div className="p-8 bg-card-bg border border-border rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-primary" />
            <h5 className="text-sm font-bold text-text-muted uppercase tracking-widest">Certifications</h5>
          </div>
          <p className="text-sm text-text-main whitespace-pre-line leading-relaxed">{content.certifications}</p>
        </div>
      )}
    </div>
  );
});

export default RawView;
