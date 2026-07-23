import { useAuth } from '../context/AuthContext';

export default function Navbar({ currentPage, setCurrentPage }) {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout(); // Fixed typo: Added invocation ()
      setCurrentPage('landing');
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  };

  return (
    <nav className="h-17 bg-slate-950 px-6 flex items-center justify-between border-b border-slate-800">
      {/* Brand Logo */}
      <div 
        className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent cursor-pointer" 
        onClick={() => setCurrentPage('landing')}
      >
        Career Toolkit
      </div>

      {/* Navbar Actions */}
      <div className="flex items-center gap-4 text-sm">
        {/* Navigation Link: Allow Guests & Users to launch the tool anytime */}
        <button
          onClick={() => setCurrentPage('cover-letter')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            currentPage === 'cover-letter'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          Cover Letter Tool
        </button>

        <div className="h-4 w-px bg-slate-800" /> {/* Divider */}

        {currentUser ? (
          // LOGGED IN STATE
          <div className="flex items-center gap-4">
            <span className="text-slate-400 hidden md:inline text-xs">
              {currentUser.email}
            </span>
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition ${
                currentPage === 'dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-400 font-medium transition text-xs"
            >
              Log Out
            </button>
          </div>
        ) : (
          // LOGGED OUT / GUEST STATE
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setCurrentPage('login')}
              className="text-slate-300 hover:text-white px-3 py-1.5 font-medium transition"
            >
              Log In
            </button>
            <button
              onClick={() => setCurrentPage('signup')}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-lg font-medium transition"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}