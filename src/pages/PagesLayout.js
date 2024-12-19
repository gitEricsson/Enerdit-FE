import React, { useState } from 'react';
import DashboardPage from './DashboardPage';
import Sidebar from './../components/layout/Sidebar';
import EnergyAuditPage from './EnergyAuditPage';
import ProfilePage from './ProfilePage';
import ContactPage from './ContactPage';
import AboutPage from './AboutPage';
import ErrorBoundary from './../components/shared/ErrorBoundary';
import { Menu } from 'lucide-react';

const PagesLayout = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'audit':
        return <EnergyAuditPage />;
      case 'profile':
        return <ProfilePage />;
      case 'contact':
        return <ContactPage />;
      case 'about':
        return <AboutPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="relative flex bg-[#e6f7e9] min-h-screen text-[#002713]">
        <button
          className="absolute top-4 left-4 md:hidden p-2"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu size={24} />
        </button>
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <div className={`flex-1 p-8 w-screen md:w-auto ${isSidebarOpen}`}>
          {renderActivePage()}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default PagesLayout;
