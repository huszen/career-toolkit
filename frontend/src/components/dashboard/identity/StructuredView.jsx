import { memo } from 'react';
import { Briefcase, GraduationCap, FolderGit2, Award, Layers } from 'lucide-react';

const StructuredView = memo(function StructuredView({ structured, content }) {
  if (!structured) return null;

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      {/* Professional Summary */}
      {(structured.summary || content?.summary) && (
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
  );
});

export default StructuredView;
