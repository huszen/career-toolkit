import { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import CoverLetter from './pages/CoverLetter';
import Dashboard from './pages/Dashboard';
import CVScorer from './pages/CVScorer';

export default function App() {
  // Global state tracking which view is active
  const [currentPage, setCurrentPage] = useState('landing');

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <Landing OnGetStarted={() => setCurrentPage('cover-letter')} />;
      case 'cover-letter':
        return <CoverLetter />;
      case 'dashboard':
        return <Dashboard />;
      case 'cv-scorer':
        return <CVScorer />;
      default:
        return <Landing OnGetStarted={() => setCurrentPage('cover-letter')} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-800 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar stays everywhere, passing the navigation function */}
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Main Content Layout */}
      <div className="flex flex-1">
        {/* Render Sidebar conditionally: Only if not on landing page */}
        {currentPage !== 'landing' && <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />}

        {/* Dynamic Page Viewer Container */}
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">{renderPage()}</main>
      </div>
    </div>
  );
}
