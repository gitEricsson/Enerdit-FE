import React from 'react';
import SidebarItem from './SidebarItem';
import { Home, BarChart2, User, MessageCircle, Info, X } from 'lucide-react';

const Sidebar = ({ activePage, setActivePage, isOpen, onClose }) => {
  return (
    <div
      className={`absolute top-0 left-0 w-[20rem] bg-[#021405] h-full md:relative md:h-auto p-4 text-white transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 z-50`}
    >
      <button
        onClick={onClose}
        className="md:hidden p-2 absolute top-4 right-4 hover:text-red-500"
      >
        <X size={24} />
      </button>
      <div className="flex items-center mt-8 mb-8">
        <img src="/Enerdit-Logo.svg" alt="ENERDIT Logo" />
      </div>
      <nav className="space-y-2">
        <SidebarItem
          icon={<Home size={24} />}
          label="Dashboard"
          isActive={activePage === 'dashboard'}
          onClick={() => setActivePage('dashboard')}
        />
        <SidebarItem
          icon={<BarChart2 size={24} />}
          label="Energy Audit"
          isActive={activePage === 'audit'}
          onClick={() => setActivePage('audit')}
        />
        <SidebarItem
          icon={<User size={24} />}
          label="Profile"
          isActive={activePage === 'profile'}
          onClick={() => setActivePage('profile')}
        />
        <SidebarItem
          icon={<MessageCircle size={24} />}
          label="Contact Us"
          isActive={activePage === 'contact'}
          onClick={() => setActivePage('contact')}
        />
        <SidebarItem
          icon={<Info size={24} />}
          label="About Us"
          isActive={activePage === 'about'}
          onClick={() => setActivePage('about')}
        />
      </nav>
    </div>
  );
};

export default Sidebar;
