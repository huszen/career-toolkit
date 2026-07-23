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

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <Landing OnGetStarted={() => setCurrentPage('cover-letter')} />;
      case 'cover-letter':
        return <CoverLetter />;
      case 'dashboard':
        // If user is not logged in, show login page instead of dashboard
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
        return <Landing OnGetStarted={() => setCurrentPage('cover-letter')} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-800 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Main Content Layout */}
      <div className="flex flex-1">
        {/* Render Sidebar conditionally: Only if not on landing/login/signup */}
        {!['landing', 'login', 'signup'].includes(currentPage) && <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />}

        {/* Dynamic Page Viewer Container */}
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">{renderPage()}</main>
      </div>
    </div>
  );
}
