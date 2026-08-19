import { LogOut, User, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function UserMenu({ setCurrentPage }) {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      setCurrentPage('landing');
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center gap-2.5">
        <button onClick={() => setCurrentPage('login')} className="flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text-main px-3 py-2 rounded-xl hover:bg-input-bg transition cursor-pointer">
          <LogIn className="w-3.5 h-3.5" />
          Log In
        </button>

        <button
          onClick={() => setCurrentPage('signup')}
          className="flex items-center gap-1.5 text-xs font-semibold bg-primary hover:bg-primary-hover text-text-main px-3.5 py-2 rounded-xl transition shadow-sm cursor-pointer active:scale-95"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Sign Up
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* Profile Identifier Pill */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-input-bg/70 border border-border/80 rounded-xl">
        <div className="w-6 h-6 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
          <User className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs font-medium text-text-main max-w-[150px] md:max-w-[200px] truncate">{currentUser.email}</span>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        title="Log out of session"
        className="flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium text-text-muted hover:text-danger hover:bg-danger/10 border border-transparent hover:border-danger/20 rounded-xl transition cursor-pointer"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Log Out</span>
      </button>
    </div>
  );
}
