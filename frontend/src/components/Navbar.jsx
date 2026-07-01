export default function Navbar({ currentPage, setCurrentPage }) {
  return (
    // <nav className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
    <nav className="h-17 bg-slate-950 px-6 flex items-center justify-between">
      <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent cursor-pointer" onClick={() => setCurrentPage('landing')}>
        Career Toolkit
      </div>
      {/* Navbar Actions */}
      <div className="flex items-center gap-4">
        {currentPage === 'landing' ? (
          <button onClick={() => setCurrentPage('cover-letter')} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition">
            Launch App
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-slate-400">Local Environment</span>
          </div>
        )}
      </div>
    </nav>
  );
}
