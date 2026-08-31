import { memo } from 'react';
import { User, Mail, Phone, Globe } from 'lucide-react';

const ContactInfo = memo(function ContactInfo({ identity }) {
  if (!identity) return null;

  return (
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
  );
});

export default ContactInfo;
