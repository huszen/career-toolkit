import { useState } from 'react';
import { Upload, User, Mail, Phone, Globe, FileText, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

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
      <div className="p-6 bg-card-bg border border-border rounded-2xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-text-main">{cvData ? 'Your Saved CV Profile' : 'No CV Saved Yet'}</h3>
          </div>
          <p className="text-xs text-text-muted max-w-xl">
            {cvData ? 'Your parsed CV data is saved on your profile. Upload a new PDF to update your details anytime.' : 'Upload your CV PDF to save your profile details into your dashboard for automatic pipeline parsing.'}
          </p>
        </div>

        <label className="shrink-0 px-4 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-60 text-text-main text-xs font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer">
          <input type="file" accept=".pdf" onChange={handleFileChange} disabled={uploading} className="hidden" />
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Parsing & Saving...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              {cvData ? 'Replace / Update CV' : 'Upload CV to Dashboard'}
            </>
          )}
        </label>
      </div>

      {/* CV Data View */}
      {cvData ? (
        <div className="space-y-6">
          {/* Identity Card */}
          <div className="p-6 bg-card-bg border border-border rounded-2xl shadow-sm space-y-4">
            <h4 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Contact & Identity</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-input-bg/60 rounded-xl border border-border/50">
                <User className="w-4 h-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-text-muted">Full Name</p>
                  <p className="text-xs font-medium truncate">{identity.name || 'Not Found'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-input-bg/60 rounded-xl border border-border/50">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-text-muted">Email</p>
                  <p className="text-xs font-medium truncate">{identity.email || 'Not Found'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-input-bg/60 rounded-xl border border-border/50">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-text-muted">Phone</p>
                  <p className="text-xs font-medium truncate">{identity.phone || 'Not Found'}</p>
                </div>
              </div>

              {identity.linkedin && (
                <div className="flex items-center gap-3 p-3 bg-input-bg/60 rounded-xl border border-border/50">
                  <div className="w-4 h-4 flex items-center justify-center bg-primary text-white rounded-sm text-[9px] font-bold shrink-0">in</div>

                  <div className="min-w-0">
                    <p className="text-[10px] text-text-muted">LinkedIn</p>
                    <a href={identity.linkedin} target="_blank" rel="noreferrer" className="text-xs font-medium text-primary hover:underline truncate block">
                      {identity.linkedin}
                    </a>
                  </div>
                </div>
              )}

              {identity.website && (
                <div className="flex items-center gap-3 p-3 bg-input-bg/60 rounded-xl border border-border/50">
                  <Globe className="w-4 h-4 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-text-muted">Website</p>
                    <a href={identity.website} target="_blank" rel="noreferrer" className="text-xs font-medium text-primary hover:underline truncate block">
                      {identity.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.summary && (
              <div className="p-5 bg-card-bg border border-border rounded-2xl shadow-sm space-y-2 md:col-span-2">
                <h5 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Professional Summary</h5>
                <p className="text-xs text-text-main whitespace-pre-line leading-relaxed">{content.summary}</p>
              </div>
            )}

            {content.skills && (
              <div className="p-5 bg-card-bg border border-border rounded-2xl shadow-sm space-y-2">
                <h5 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Skills</h5>
                <p className="text-xs text-text-main whitespace-pre-line leading-relaxed">{content.skills}</p>
              </div>
            )}

            {content.experience && (
              <div className="p-5 bg-card-bg border border-border rounded-2xl shadow-sm space-y-2">
                <h5 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Work Experience</h5>
                <p className="text-xs text-text-main whitespace-pre-line leading-relaxed">{content.experience}</p>
              </div>
            )}

            {content.education && (
              <div className="p-5 bg-card-bg border border-border rounded-2xl shadow-sm space-y-2">
                <h5 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Education</h5>
                <p className="text-xs text-text-main whitespace-pre-line leading-relaxed">{content.education}</p>
              </div>
            )}

            {content.projects && (
              <div className="p-5 bg-card-bg border border-border rounded-2xl shadow-sm space-y-2">
                <h5 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Projects</h5>
                <p className="text-xs text-text-main whitespace-pre-line leading-relaxed">{content.projects}</p>
              </div>
            )}

            {content.certifications && (
              <div className="p-5 bg-card-bg border border-border rounded-2xl shadow-sm space-y-2">
                <h5 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Certifications</h5>
                <p className="text-xs text-text-main whitespace-pre-line leading-relaxed">{content.certifications}</p>
              </div>
            )}

            {content.training && (
              <div className="p-5 bg-card-bg border border-border rounded-2xl shadow-sm space-y-2">
                <h5 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Training & Courses</h5>
                <p className="text-xs text-text-main whitespace-pre-line leading-relaxed">{content.training}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-card-bg rounded-2xl border border-border p-6 space-y-2">
          <FileText className="w-8 h-8 text-text-muted mx-auto mb-2" />
          <p className="text-text-main font-medium">No saved CV profile found.</p>
          <p className="text-xs text-text-muted max-w-sm mx-auto">Upload your resume PDF using the button above to automatically populate your identity and skills!</p>
        </div>
      )}
    </div>
  );
}
