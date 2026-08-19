import { Sparkles, Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import UserMenu from './navbar/UserMenu';

export default function Navbar({ currentPage, setCurrentPage, isSidebarOpen, setIsSidebarOpen, isMobileDrawerOpen, setIsMobileDrawerOpen }) {
  const showSidebarToggle = !['landing', 'login', 'signup'].includes(currentPage);

  return (
    <header className="h-16 bg-app-bg border-b border-border/80 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
      {/* Left: Sidebar Toggle + Brand Logo */}
      <div className="flex items-center gap-3 md:gap-4">
        {showSidebarToggle && (
          <>
            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              className="hidden lg:flex p-2 text-text-muted hover:text-text-main hover:bg-input-bg rounded-xl border border-transparent hover:border-border transition cursor-pointer"
            >
              {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            </button>

            {/* Mobile Drawer Toggle */}
            <button
              onClick={() => setIsMobileDrawerOpen((prev) => !prev)}
              title="Open Navigation"
              className="flex lg:hidden p-2 text-text-muted hover:text-text-main hover:bg-input-bg rounded-xl border border-transparent hover:border-border transition cursor-pointer"
            >
              <Menu className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Brand Logo */}
        <div onClick={() => setCurrentPage('landing')} className="flex items-center gap-2 cursor-pointer group">
          <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-text-main via-text-main to-text-muted bg-clip-text text-transparent">Career Toolkit</span>
        </div>
      </div>

      {/* Right: User Menu */}
      <UserMenu setCurrentPage={setCurrentPage} />
    </header>
  );
}
