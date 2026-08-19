import { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import CoverLetter from './pages/CoverLetter';
import Dashboard from './pages/Dashboard';
import CVScorer from './pages/CVScorer';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { useAuth } from './context/AuthContext';

export default function App() {
  // Global state tracking which view is active
  const [currentPage, setCurrentPage] = useState('landing');
  const { currentUser } = useAuth();

  // Sidebar layour states
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Desktop collapse state
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false); // Mobile slide drawer

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <Landing onGetStarted={() => setCurrentPage('cover-letter')} />;
      case 'cover-letter':
        return <CoverLetter />;
      case 'dashboard':
        if (!currentUser) {
          return <Login onNavigate={setCurrentPage} />;
        }
        return <Dashboard />;
      case 'cv-scorer':
        return <CVScorer />;
      case 'login':
        return <Login onNavigate={setCurrentPage} />;
      case 'signup':
        return <SignUp onNavigate={setCurrentPage} />;
      default:
        return <Landing onGetStarted={() => setCurrentPage('cover-letter')} />;
    }
  };

  const showSidebar = !['landing', 'login', 'signup'].includes(currentPage);

  return (
    <div className="min-h-screen bg-app-bg text-text-main flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      {/* Top Navbar */}
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} isMobileDrawerOpen={isMobileDrawerOpen} setIsMobileDrawerOpen={setIsMobileDrawerOpen} />

      {/* Main Layout Body */}
      <div className="flex flex-1 relative">
        {/* Render Sidebar conditionally */}
        {showSidebar && <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} isCollapsed={!isSidebarOpen} isMobileOpen={isMobileDrawerOpen} onCloseMobile={() => setIsMobileDrawerOpen(false)} />}

        {/* Dynamic Page Viewer Container */}
        <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full transition-all duration-300">{renderPage()}</main>
      </div>
    </div>
  );
}
