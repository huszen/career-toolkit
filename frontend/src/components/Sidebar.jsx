import { LayoutDashboard, FileText, ScanLine, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SidebarItem from './sidebar/SidebarItem';

export default function Sidebar({ currentPage, setCurrentPage, isCollapsed, isMobileOpen, onCloseMobile }) {
  const { currentUser } = useAuth();

  // Navigation items
  const allMenuItems = [
    {
      id: 'dashboard',
      label: 'Application Dashboard',
      icon: LayoutDashboard,
      requiresAuth: true,
    },
    {
      id: 'cover-letter',
      label: 'Cover Letter & Gap AI',
      icon: FileText,
      requiresAuth: false,
    },
    {
      id: 'cv-scorer',
      label: 'ATS CV Scorer (Mock)',
      icon: ScanLine,
      requiresAuth: false,
    },
  ];

  // Filter items: Hide Dashboar if user not logged in
  const visibleItems = allMenuItems.filter((item) => !item.requiresAuth || Boolean(currentUser));

  const handleSelectPage = (pageId) => {
    setCurrentPage(pageId);
    if (onCloseMobile) onCloseMobile();
  };

  const navContent = (
    <div className="flex flex-col h-full justify-between p-3.5">
      <div className="space-y-4">
        {!isCollapsed && <div className="px-2 text-[10px] font-bold text-text-muted/70 uppercase tracking-widest">Main Features</div>}

        <nav className="space-y-1.5">
          {visibleItems.map((item) => (
            <SidebarItem key={item.id} item={item} isActive={currentPage === item.id} isCollapsed={isCollapsed} onClick={() => handleSelectPage(item.id)} />
          ))}
        </nav>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Sidebar (Sticky Rail) */}
      <aside className={`hidden lg:flex flex-col bg-app-bg border-r border-border/80 transition-all duration-300 shrink-0 sticky top-16 h-[calc(100vh-4rem)] ${isCollapsed ? 'w-18' : 'w-64'}`}>{navContent}</aside>

      {/* 2. Mobile Drawer (Overlay backdrop + slide-over panel) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          {/* Backdrop */}
          <div onClick={onCloseMobile} className="fixed inset-0 bg-black/75 backdrop-blur-xs animate-fade-in" />

          {/* Drawer Container */}
          <div className="relative w-64 max-w-[80vw] bg-card-bg border-r border-border h-full z-50 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Navigation</span>
              <button onClick={onCloseMobile} className="p-1.5 text-text-muted hover:text-text-main rounded-lg bg-input-bg border border-border cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">{navContent}</div>
          </div>
        </div>
      )}
    </>
  );
}
