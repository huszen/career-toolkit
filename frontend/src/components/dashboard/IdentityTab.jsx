import { useState } from 'react';
import { Upload, User, Mail, Phone, Globe, FileText, Loader2, Sparkles, CheckCircle, GraduationCap, Award, Briefcase, FolderGit2, BookOpen, Layers } from 'lucide-react';
import RefineConfirmModal from './RefineConfirmModal';

export default function IdentityTab({ cvData, onUploadCv, uploading, onRefineCv, refining }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showRefineModal, setShowRefineModal] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onUploadCv(file);
    }
  };

  const handleConfirmRefine = async () => {
    setShowRefineModal(false);
    if (onRefineCv) {
      await onRefineCv();
    }
  };

  const identity = cvData?.identity || {};
  const content = cvData?.content || {};
  const structured = cvData?.structured_profile;
  const isRefined = Boolean(structured);

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      {/* Upload / Replace / Refine CV Banner */}
      <div className="p-8 bg-gradient-to-br from-card-bg via-card-bg to-input-bg border border-border rounded-2xl shadow-sm flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
        <div className="space-y-2.5">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold text-text-main tracking-tight">{cvData ? 'Active Profile Resume' : 'No Resume Profile Connected'}</h3>
            {cvData && (
              <span className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium border ${isRefined ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' : 'text-success bg-success/10 border-success/20'}`}>
                <CheckCircle className="w-3.5 h-3.5" /> {isRefined ? 'AI Refined Profile' : 'Ready for AI'}
              </span>
            )}
          </div>
          <p className="text-sm text-text-muted max-w-2xl leading-relaxed">
            {cvData
              ? isRefined
                ? 'Your profile is beautifully structured for high-precision matching. You can update your resume PDF or re-refine at any time.'
                : 'Your baseline CV text is loaded. Refine your profile to organize your experience, projects, and skills into clean UI cards.'
              : 'Upload your CV PDF once to automatically populate your baseline profile and enable single-click cover letters and analysis.'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full xl:w-auto">
          {/* Refine Profile Button */}
          {cvData && !isRefined && (
            <button
              onClick={() => setShowRefineModal(true)}
              disabled={refining || uploading}
              className="px-5 py-3 flex-1 xl:flex-none bg-input-bg hover:bg-border/60 text-primary border border-primary/30 text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60"
            >
              {refining ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Refining...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-primary" />
                  Refine Profile
                </>
              )}
            </button>
          )}

          {/* Upload Button */}
          <label className="px-5 py-3 flex-1 xl:flex-none bg-primary hover:bg-primary-hover disabled:opacity-60 text-text-main text-sm font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95">
            <input type="file" accept=".pdf" onChange={handleFileChange} disabled={uploading || refining} className="hidden" />
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Parsing...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                {cvData ? 'Update Resume PDF' : 'Upload Resume PDF'}
              </>
            )}
          </label>
        </div>
      </div>

      {cvData ? (
        <div className="space-y-8">
          {/* Identity Info Card */}
          <div className="p-8 bg-card-bg border border-border rounded-2xl shadow-sm space-y-6">
            <h4 className="text-sm font-bold text-text-muted uppercase tracking-widest">Identity & Contact Details</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="flex items-center gap-4 p-4 bg-input-bg/40 rounded-xl border border-border/50 transition-colors hover:bg-input-bg/70">
                <div className="p-2.5 bg-card-bg rounded-lg shadow-sm">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-text-muted font-medium mb-0.5">Full Name</p>
                  <p className="text-sm font-semibold text-text-main truncate">{identity.name || 'Not Found'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-input-bg/40 rounded-xl border border-border/50 transition-colors hover:bg-input-bg/70">
                <div className="p-2.5 bg-card-bg rounded-lg shadow-sm">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-text-muted font-medium mb-0.5">Email</p>
                  <p className="text-sm font-semibold text-text-main truncate">{identity.email || 'Not Found'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-input-bg/40 rounded-xl border border-border/50 transition-colors hover:bg-input-bg/70">
                <div className="p-2.5 bg-card-bg rounded-lg shadow-sm">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-text-muted font-medium mb-0.5">Phone</p>
                  <p className="text-sm font-semibold text-text-main truncate">{identity.phone || 'Not Found'}</p>
                </div>
              </div>

              {identity.linkedin && (
                <div className="flex items-center gap-4 p-4 bg-input-bg/40 rounded-xl border border-border/50 transition-colors hover:bg-input-bg/70">
                  <div className="p-2.5 bg-card-bg rounded-lg shadow-sm">
                    <div className="w-5 h-5 flex items-center justify-center bg-primary text-text-main rounded-md text-[10px] font-bold">in</div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-text-muted font-medium mb-0.5">LinkedIn</p>
                    <a href={identity.linkedin} target="_blank" rel="noreferrer" className="text-sm font-semibold text-primary hover:underline truncate block">
                      {identity.linkedin}
                    </a>
                  </div>
                </div>
              )}

              {identity.website && (
                <div className="flex items-center gap-4 p-4 bg-input-bg/40 rounded-xl border border-border/50 transition-colors hover:bg-input-bg/70">
                  <div className="p-2.5 bg-card-bg rounded-lg shadow-sm">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-text-muted font-medium mb-0.5">Website</p>
                    <a href={identity.website} target="_blank" rel="noreferrer" className="text-sm font-semibold text-primary hover:underline truncate block">
                      {identity.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* OPTION A: STRUCTURED AI VIEW (RENDERED WHEN REFINED)                        */}
          {/* ========================================================================= */}
          {isRefined ? (
            <div className="space-y-8 animate-in fade-in-50 duration-500">
              {/* Professional Summary */}
              {(structured.summary || content.summary) && (
                <div className="p-8 bg-card-bg border border-border rounded-2xl shadow-sm space-y-4">
                  <h5 className="text-sm font-bold text-text-muted uppercase tracking-widest">Professional Summary</h5>
                  <p className="text-base text-text-main leading-relaxed">{structured.summary || content.summary}</p>
                </div>
              )}

              {/* Skills by Category */}
              {structured.skill_categories?.length > 0 && (
                <div className="p-8 bg-card-bg border border-border rounded-2xl shadow-sm space-y-6">
                  <h5 className="text-sm font-bold text-text-muted uppercase tracking-widest">Categorized Skills</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {structured.skill_categories.map((cat, idx) => (
                      <div key={idx} className="p-5 bg-input-bg/30 border border-border/50 rounded-xl space-y-3">
                        <p className="text-sm font-bold text-primary">{cat.category_name}</p>
                        <div className="flex flex-wrap gap-2">
                          {cat.skills.map((skill, sIdx) => (
                            <span key={sIdx} className="px-3 py-1.5 bg-card-bg border border-border rounded-lg text-xs text-text-main font-medium shadow-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience Timeline */}
              {structured.experience?.length > 0 && (
                <div className="p-8 bg-card-bg border border-border rounded-2xl shadow-sm space-y-6">
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-primary" />
                    <h5 className="text-sm font-bold text-text-muted uppercase tracking-widest">Work Experience</h5>
                  </div>
                  <div className="space-y-6">
                    {structured.experience.map((exp, idx) => (
                      <div key={idx} className="p-6 bg-input-bg/30 border border-border/50 rounded-xl space-y-4 transition-colors hover:bg-input-bg/50">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-4">
                          <div>
                            <h6 className="text-base font-bold text-text-main">{exp.job_title || 'Role'}</h6>
                            <p className="text-sm text-primary font-medium mt-1">
                              {exp.company} {exp.location ? `· ${exp.location}` : ''}
                            </p>
                          </div>
                          <span className="text-xs font-medium text-text-muted bg-card-bg px-3 py-1.5 rounded-lg border border-border/50 shrink-0">
                            {exp.start_date || ''} {exp.end_date ? `— ${exp.end_date}` : ''}
                          </span>
                        </div>

                        {exp.description?.length > 0 && (
                          <ul className="space-y-2 text-sm text-text-muted list-disc list-outside ml-4">
                            {exp.description.map((desc, dIdx) => (
                              <li key={dIdx} className="leading-relaxed">
                                {desc}
                              </li>
                            ))}
                          </ul>
                        )}

                        {exp.technologies?.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {exp.technologies.map((tech, tIdx) => (
                              <span key={tIdx} className="px-2.5 py-1 bg-input-bg border border-border/80 rounded-md text-xs text-text-muted font-medium">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {structured.projects?.length > 0 && (
                <div className="p-8 bg-card-bg border border-border rounded-2xl shadow-sm space-y-6">
                  <div className="flex items-center gap-3">
                    <FolderGit2 className="w-5 h-5 text-primary" />
                    <h5 className="text-sm font-bold text-text-muted uppercase tracking-widest">Featured Projects</h5>
                  </div>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {structured.projects.map((proj, idx) => (
                      <div key={idx} className="p-6 bg-input-bg/30 border border-border/50 rounded-xl flex flex-col justify-between space-y-4 hover:bg-input-bg/50 transition-colors">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h6 className="text-base font-bold text-text-main">{proj.project_name}</h6>
                              {proj.role && <p className="text-sm text-primary font-medium mt-1">{proj.role}</p>}
                            </div>
                            {proj.url && (
                              <a href={proj.url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors shrink-0">
                                View Project ↗
                              </a>
                            )}
                          </div>

                          {proj.description?.length > 0 && (
                            <ul className="space-y-1.5 text-sm text-text-muted list-disc list-outside ml-4">
                              {proj.description.map((desc, dIdx) => (
                                <li key={dIdx} className="leading-relaxed">
                                  {desc}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        {proj.technologies?.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-4 border-t border-border/40">
                            {proj.technologies.map((tech, tIdx) => (
                              <span key={tIdx} className="px-2.5 py-1 bg-card-bg rounded-md text-xs text-text-muted border border-border shadow-sm font-medium">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education & Certifications Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Education */}
                {structured.education?.length > 0 && (
                  <div className="p-8 bg-card-bg border border-border rounded-2xl shadow-sm space-y-6">
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-5 h-5 text-primary" />
                      <h5 className="text-sm font-bold text-text-muted uppercase tracking-widest">Education</h5>
                    </div>
                    <div className="space-y-4">
                      {structured.education.map((edu, idx) => (
                        <div key={idx} className="p-5 bg-input-bg/30 border border-border/50 rounded-xl space-y-2">
                          <h6 className="text-base font-bold text-text-main">{edu.degree || 'Degree'}</h6>
                          <p className="text-sm font-medium text-primary">{edu.institution}</p>
                          <div className="flex items-center justify-between text-xs text-text-muted pt-2 border-t border-border/40">
                            <span>
                              {edu.start_date || ''} {edu.end_date ? `— ${edu.end_date}` : ''}
                            </span>
                            {edu.gpa && <span className="font-semibold text-text-main bg-card-bg px-2 py-1 rounded border border-border">GPA: {edu.gpa}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certifications & Training */}
                {(structured.certifications?.length > 0 || structured.training?.length > 0) && (
                  <div className="p-8 bg-card-bg border border-border rounded-2xl shadow-sm space-y-6">
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-primary" />
                      <h5 className="text-sm font-bold text-text-muted uppercase tracking-widest">Certifications & Training</h5>
                    </div>
                    <div className="space-y-4">
                      {structured.certifications?.map((cert, idx) => (
                        <div key={`cert-${idx}`} className="p-5 bg-input-bg/30 border border-border/50 rounded-xl space-y-1.5">
                          <h6 className="text-base font-bold text-text-main">{cert.name}</h6>
                          <p className="text-sm font-medium text-primary">
                            {cert.issuer} {cert.issue_date ? `· ${cert.issue_date}` : ''}
                          </p>
                        </div>
                      ))}
                      {structured.training?.map((trn, idx) => (
                        <div key={`trn-${idx}`} className="p-5 bg-input-bg/30 border border-border/50 rounded-xl space-y-1.5">
                          <h6 className="text-base font-bold text-text-main">{trn.name}</h6>
                          <p className="text-sm font-medium text-primary">
                            {trn.provider} {trn.completion_date ? `· ${trn.completion_date}` : ''}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Custom / Other Sections */}
              {structured.custom_sections?.length > 0 && (
                <div className="p-8 bg-card-bg border border-border rounded-2xl shadow-sm space-y-6">
                  <div className="flex items-center gap-3">
                    <Layers className="w-5 h-5 text-primary" />
                    <h5 className="text-sm font-bold text-text-muted uppercase tracking-widest">Additional Information</h5>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {structured.custom_sections.map((cSec, idx) => (
                      <div key={idx} className="p-6 bg-input-bg/30 border border-border/50 rounded-xl space-y-4">
                        <h6 className="text-base font-bold text-primary">{cSec.section_title}</h6>
                        <ul className="space-y-2 text-sm text-text-muted list-disc list-outside ml-4">
                          {cSec.items.map((item, iIdx) => (
                            <li key={iIdx} className="leading-relaxed">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ========================================================================= */
            /* OPTION B: UNREFINED RAW TEXT GRID (BASELINE VIEW)                         */
            /* ========================================================================= */
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
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-card-bg rounded-2xl border-2 border-dashed border-border/80 px-6 space-y-5">
          <div className="p-4 bg-input-bg rounded-full shadow-sm border border-border">
            <FileText className="w-8 h-8 text-text-muted" />
          </div>
          <div className="space-y-2 text-center">
            <h3 className="text-lg font-bold text-text-main">No CV profile saved</h3>
            <p className="text-sm text-text-muted max-w-md mx-auto leading-relaxed">Upload your resume PDF to automatically extract your skills, experience, and contact info into a clean, modern layout.</p>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <RefineConfirmModal isOpen={showRefineModal} onConfirm={handleConfirmRefine} onCancel={() => setShowRefineModal(false)} isRefining={refining} />
    </div>
  );
}
