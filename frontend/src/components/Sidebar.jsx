export default function Sidebar({ currentPage, setCurrentPage }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard (Mock)' },
    { id: 'cover-letter', label: 'Cover Letter Generator' },
    { id: 'cv-scorer', label: 'ATS CV Scorer (Mock)' },
  ];

  return (
    // <aside className="w-64 bg-slate-950 border-r border-slate-800 p-4 flex flex-col gap-2 h-[calc(100vh-73px)] sticky top-[73px]">
    <aside className="w-64 bg-slate-950 border-r border-slate-800 p-4 flex flex-col gap-2">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">Features</div>
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setCurrentPage(item.id)}
          className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition ${currentPage === item.id ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
        >
          {item.label}
        </button>
      ))}
    </aside>
  );
}
