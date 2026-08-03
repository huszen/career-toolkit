export default function Sidebar({ currentPage, setCurrentPage }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'cover-letter', label: 'Cover Letter Generator' },
    { id: 'cv-scorer', label: 'ATS CV Scorer (Mock)' },
  ];

  return (
    <aside className="w-64 bg-app-bg border-r border-border p-4 flex flex-col gap-2">
      <div className="text-xs font-semibold text-text-muted uppercase tracking-wider px-3 mb-2">Features</div>

      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setCurrentPage(item.id)}
          className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition ${currentPage === item.id ? 'bg-primary/20 text-primary border border-primary/30' : 'text-text-muted hover:bg-card-bg hover:text-text-main'}`}
        >
          {item.label}
        </button>
      ))}
    </aside>
  );
}
