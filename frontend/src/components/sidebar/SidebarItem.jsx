export default function SidebarItem({ item, isActive, isCollapsed, onClick }) {
  const Icon = item.icon;

  return (
    <button
      onClick={onClick}
      title={isCollapsed ? item.label : undefined}
      className={`group relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
        isActive ? 'bg-primary/10 text-primary border border-primary/30 shadow-sm' : 'text-text-muted hover:text-text-main hover:bg-input-bg/70 border border-transparent'
      } ${isCollapsed ? 'justify-center px-0 py-3' : ''}`}
    >
      <Icon className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-primary' : 'text-text-muted group-hover:text-text-main'}`} />

      {!isCollapsed && <span className="truncate">{item.label}</span>}

      {/* Floating Tooltip in collapsed mode */}
      {isCollapsed && (
        <div className="absolute left-full ml-3.5 px-2.5 py-1 bg-card-bg border border-border text-text-main text-[11px] font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-50">
          {item.label}
        </div>
      )}
    </button>
  );
}
