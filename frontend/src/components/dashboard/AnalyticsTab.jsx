import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar, Legend } from 'recharts';
import { TrendingUp, PieChart as PieIcon, Layers, Compass, Award, CalendarCheck } from 'lucide-react';

const STATUS_PALETTE = {
  Saved: '#6b7280',
  Applied: '#3b82f6',
  Interviewing: '#f59e0b',
  Offer: '#10b981',
  Rejected: '#ef4444',
};

const PLATFORM_PALETTE = {
  LinkedIn: '#0a66c2',
  JobStreet: '#a855f7',
  Other: '#64748b',
};

// Custom Tooltip for dark mode theme
function DarkTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card-bg/95 border border-border p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs space-y-1">
        {label && <p className="font-semibold text-text-main">{label}</p>}
        {payload.map((entry, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
            <span className="text-text-muted">{entry.name}:</span>
            <span className="font-bold text-text-main">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function AnalyticsTab({ jobs = [] }) {
  // Empty state guard
  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-20 bg-card-bg rounded-2xl border border-border p-8 space-y-3">
        <PieIcon className="w-10 h-10 text-text-muted/60 mx-auto" />
        <h3 className="text-base font-bold text-text-main">No Analytics Data Available</h3>
        <p className="text-xs text-text-muted max-w-sm mx-auto">Start saving and applying to jobs to view distribution funnels, AI match metrics, and application momentum.</p>
      </div>
    );
  }
  // Funnel status distribution
  const funnelData = useMemo(() => {
    const counts = {
      Saved: 0,
      Applied: 0,
      Interviewing: 0,
      Offer: 0,
      Rejected: 0,
    };
    jobs.forEach((j) => {
      if (!j) return;
      const status = j.status || 'Saved';
      if (counts[status] !== undefined) counts[status]++;
    });
    return Object.entries(counts)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));
  }, [jobs]);

  //   Weekly Momentum (Grouped into 4 weeks)
  const momentumData = useMemo(() => {
    const buckets = [
      { week: '4w ago', count: 0 },
      { week: '3w ago', count: 0 },
      { week: '2w ago', count: 0 },
      { week: 'This Week', count: 0 },
    ];
    const now = new Date();

    jobs.forEach((j) => {
      if (!j) return;
      const dateStr = j.created_at || j.applied_at;
      const date = dateStr ? new Date(dateStr) : now;
      const diffDays = Math.floor(Math.abs(now - date) / (1000 * 60 * 60 * 24));

      if (diffDays <= 7) buckets[3].count++;
      else if (diffDays <= 14) buckets[2].count++;
      else if (diffDays <= 21) buckets[1].count++;
      else if (diffDays <= 30) buckets[0].count++;
    });

    return buckets;
  }, [jobs]);

  //Match Score vs Status Breakdown
  const matchScoreData = useMemo(() => {
    const buckets = [
      { tier: '< 65%', Applied: 0, Interviewing: 0, Offer: 0 },
      { tier: '65% - 79%', Applied: 0, Interviewing: 0, Offer: 0 },
      { tier: '80% +', Applied: 0, Interviewing: 0, Offer: 0 },
    ];

    jobs.forEach((j) => {
      if (!j) return;
      const score = j.match_score ?? j.gap_analysis?.match_score ?? null;
      if (score === null || score === undefined || typeof score !== 'number') return;

      const status = j.status;
      if (!['Applied', 'Interviewing', 'Offer'].includes(status)) return;

      if (score < 65) buckets[0][status]++;
      else if (score < 80) buckets[1][status]++;
      else buckets[2][status]++;
    });

    return buckets;
  }, [jobs]);

  //   Platform Distribution
  const platformData = useMemo(() => {
    const counts = {};
    jobs.forEach((j) => {
      const p = j.platform || 'Other';
      counts[p] = (counts[p] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      fill: PLATFORM_PALETTE[name] || PLATFORM_PALETTE.Other,
    }));
  }, [jobs]);

  //   Aggregate Metrics
  const matchScores = useMemo(() => {
    return jobs.map((j) => (j ? (j.match_score ?? j.gap_analysis?.match_score) : null)).filter((s) => typeof s === 'number' && !isNaN(s));
  }, [jobs]);

  const avgMatch = useMemo(() => {
    return matchScores.length > 0 ? Math.round(matchScores.reduce((a, b) => a + b, 0) / matchScores.length) : null;
  }, [matchScores]);

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Top Quick-Glance Summary Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-card-bg border border-border rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[11px] font-semibold text-text-muted uppercase">Avg. AI Match</p>
            <p className="text-2xl font-black text-text-main mt-0.5">{avgMatch !== null ? `${avgMatch}%` : 'N/A'}</p>
          </div>
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-card-bg border border-border rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[11px] font-semibold text-text-muted uppercase">Total Applications</p>
            <p className="text-2xl font-black text-text-main mt-0.5">{jobs.length}</p>
          </div>
          <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
            <CalendarCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-card-bg border border-border rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[11px] font-semibold text-text-muted uppercase">Conversion Rate</p>
            <p className="text-2xl font-black text-text-main mt-0.5">{jobs.length > 0 ? `${Math.round((jobs.filter((j) => ['Interviewing', 'Offer'].includes(j.status)).length / jobs.length) * 100)}%` : '0%'}</p>
          </div>
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Grid: 4 Core Visualization Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Pipeline Funnel (Donut) */}
        <div className="p-5 bg-card-bg border border-border rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-primary" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-main">Application Pipeline Distribution</h4>
          </div>

          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={funnelData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} stroke="#111111" strokeWidth={2}>
                  {funnelData.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_PALETTE[entry.name] || STATUS_PALETTE.Saved} />
                  ))}
                </Pie>
                <Tooltip content={<DarkTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Centered Donut Value */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-text-main">{jobs.length}</span>
              <span className="text-[10px] text-text-muted uppercase tracking-wider">Jobs</span>
            </div>
          </div>

          {/* Custom Status Legend */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 border-t border-border/60">
            {funnelData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-text-muted">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STATUS_PALETTE[d.name] }} />
                <span>{d.name}:</span>
                <span className="font-bold text-text-main">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Application Momentum (Area Chart) */}
        <div className="p-5 bg-card-bg border border-border rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-main">Application Momentum (Last 30 Days)</h4>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={momentumData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="momentumGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                <XAxis dataKey="week" stroke="#9ca3af" fontSize={11} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip content={<DarkTooltip />} />
                <Area type="monotone" dataKey="count" name="Jobs Added" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#momentumGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-text-muted text-center pt-2 border-t border-border/60">Measures your job addition frequency over weekly intervals.</p>
        </div>

        {/* Card 3: AI Match Score vs. Outcome (Stacked Bar) */}
        <div className="p-5 bg-card-bg border border-border rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-main">AI Match Score vs. Funnel Progression</h4>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={matchScoreData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                <XAxis dataKey="tier" stroke="#9ca3af" fontSize={11} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip content={<DarkTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} formatter={(value) => <span className="text-text-muted">{value}</span>} />
                <Bar dataKey="Applied" stackId="a" fill={STATUS_PALETTE.Applied} radius={[0, 0, 0, 0]} />
                <Bar dataKey="Interviewing" stackId="a" fill={STATUS_PALETTE.Interviewing} />
                <Bar dataKey="Offer" stackId="a" fill={STATUS_PALETTE.Offer} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-text-muted text-center pt-2 border-t border-border/60">Correlates semantic CV match tiers with interview and offer rates.</p>
        </div>

        {/* Card 4: Platform Breakdown (Horizontal Bar) */}
        <div className="p-5 bg-card-bg border border-border rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-primary" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-main">Platform & Origin Breakdown</h4>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" horizontal={false} />
                <XAxis type="number" stroke="#9ca3af" fontSize={11} tickLine={false} allowDecimals={false} />
                <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={11} tickLine={false} />
                <Tooltip content={<DarkTooltip />} />
                <Bar dataKey="count" name="Jobs" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-text-muted text-center pt-2 border-t border-border/60">Identifies which sourcing platform yields the most tracked opportunities.</p>
        </div>
      </div>
    </div>
  );
}
