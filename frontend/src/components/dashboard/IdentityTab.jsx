import { useState } from 'react';
import { Upload, User, Mail, Phone, Globe, FileText, Loader2, Sparkles, CheckCircle, GraduationCap, Award, Briefcase, FolderGit2 } from 'lucide-react';

export default function IdentityTab({ cvData, onUploadCv, uploading }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onUploadCv(file);
    }
  };

  const identity = cvData?.identity || {};
  const content = cvData?.content || {};

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Upload / Replace CV Banner */}
      <div className="p-6 bg-gradient-to-r from-card-bg via-card-bg to-input-bg border border-border rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="text-base font-bold text-text-main">{cvData ? 'Active Profile Resume' : 'No Resume Profile Connected'}</h3>
            {cvData && (
              <span className="flex items-center gap-1 text-[10px] text-success bg-success/10 border border-success/20 px-2 py-0.5 rounded-full font-medium">
                <CheckCircle className="w-3 h-3" /> Ready for AI
              </span>
            )}
          </div>
          <p className="text-xs text-text-muted max-w-xl leading-relaxed">
            {cvData
              ? 'This baseline profile feeds directly into your Cover Letter generator and Gap Analysis pipelines. Upload a new PDF at any time to sync updates.'
              : 'Upload your CV PDF once to automatically populate your baseline profile and enable single-click cover letters and analysis.'}
          </p>
        </div>

        <label className="shrink-0 px-4 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-60 text-text-main text-xs font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95">
          <input type="file" accept=".pdf" onChange={handleFileChange} disabled={uploading} className="hidden" />
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Parsing & Extracting...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              {cvData ? 'Update Resume PDF' : 'Upload Resume PDF'}
            </>
          )}
        </label>
      </div>

      {/* Structured CV View */}
      {cvData ? (
        <div className="space-y-6">
          {/* Identity Info Card */}
          <div className="p-6 bg-card-bg border border-border rounded-2xl shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">Identity & Contact Details</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              <div className="flex items-center gap-3 p-3 bg-input-bg/70 rounded-xl border border-border/60">
                <User className="w-4 h-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-text-muted">Full Name</p>
                  <p className="text-xs font-semibold text-text-main truncate">{identity.name || 'Not Found'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-input-bg/70 rounded-xl border border-border/60">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-text-muted">Email</p>
                  <p className="text-xs font-semibold text-text-main truncate">{identity.email || 'Not Found'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-input-bg/70 rounded-xl border border-border/60">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-text-muted">Phone</p>
                  <p className="text-xs font-semibold text-text-main truncate">{identity.phone || 'Not Found'}</p>
                </div>
              </div>

              {identity.linkedin && (
                <div className="flex items-center gap-3 p-3 bg-input-bg/70 rounded-xl border border-border/60">
                  <div className="w-4 h-4 flex items-center justify-center bg-primary text-text-main rounded text-[9px] font-bold shrink-0">in</div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-text-muted">LinkedIn</p>
                    <a href={identity.linkedin} target="_blank" rel="noreferrer" className="text-xs font-semibold text-primary hover:underline truncate block">
                      {identity.linkedin}
                    </a>
                  </div>
                </div>
              )}

              {identity.website && (
                <div className="flex items-center gap-3 p-3 bg-input-bg/70 rounded-xl border border-border/60">
                  <Globe className="w-4 h-4 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-text-muted">Website</p>
                    <a href={identity.website} target="_blank" rel="noreferrer" className="text-xs font-semibold text-primary hover:underline truncate block">
                      {identity.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Parsed CV Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {content.summary && (
              <div className="p-5 bg-card-bg border border-border rounded-2xl shadow-sm space-y-2 md:col-span-2">
                <h5 className="text-xs font-bold text-text-muted uppercase tracking-wider">Professional Summary</h5>
                <p className="text-xs text-text-main whitespace-pre-line leading-relaxed">{content.summary}</p>
              </div>
            )}

            {content.skills && (
              <div className="p-5 bg-card-bg border border-border rounded-2xl shadow-sm space-y-2">
                <h5 className="text-xs font-bold text-text-muted uppercase tracking-wider">Core Skills & Technologies</h5>
                <p className="text-xs text-text-main whitespace-pre-line leading-relaxed">{content.skills}</p>
              </div>
            )}

            {content.experience && (
              <div className="p-5 bg-card-bg border border-border rounded-2xl shadow-sm space-y-2">
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-primary" />
                  <h5 className="text-xs font-bold text-text-muted uppercase tracking-wider">Work Experience</h5>
                </div>
                <p className="text-xs text-text-main whitespace-pre-line leading-relaxed">{content.experience}</p>
              </div>
            )}

            {content.education && (
              <div className="p-5 bg-card-bg border border-border rounded-2xl shadow-sm space-y-2">
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-primary" />
                  <h5 className="text-xs font-bold text-text-muted uppercase tracking-wider">Education</h5>
                </div>
                <p className="text-xs text-text-main whitespace-pre-line leading-relaxed">{content.education}</p>
              </div>
            )}

            {content.projects && (
              <div className="p-5 bg-card-bg border border-border rounded-2xl shadow-sm space-y-2">
                <div className="flex items-center gap-1.5">
                  <FolderGit2 className="w-3.5 h-3.5 text-primary" />
                  <h5 className="text-xs font-bold text-text-muted uppercase tracking-wider">Projects</h5>
                </div>
                <p className="text-xs text-text-main whitespace-pre-line leading-relaxed">{content.projects}</p>
              </div>
            )}

            {content.certifications && (
              <div className="p-5 bg-card-bg border border-border rounded-2xl shadow-sm space-y-2">
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-primary" />
                  <h5 className="text-xs font-bold text-text-muted uppercase tracking-wider">Certifications</h5>
                </div>
                <p className="text-xs text-text-main whitespace-pre-line leading-relaxed">{content.certifications}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-14 bg-card-bg rounded-2xl border border-dashed border-border p-6 space-y-3">
          <div className="p-3 bg-input-bg rounded-2xl w-fit mx-auto border border-border">
            <FileText className="w-6 h-6 text-text-muted" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-text-main">No CV profile saved</p>
            <p className="text-xs text-text-muted max-w-sm mx-auto">Upload your resume PDF to automatically extract your skills, experience, and contact info.</p>
          </div>
        </div>
      )}
    </div>
  );
}
