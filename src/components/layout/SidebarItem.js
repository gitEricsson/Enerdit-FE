import React from 'react';

const SidebarItem = ({ icon, label, isActive, onClick }) => {
  return (
    <div
      className={`flex items-center p-2 rounded-lg cursor-pointer ${
        isActive ? 'bg-[#CEFFC0] text-[#003518]' : 'hover:bg-[#004522]'
      }`}
      onClick={onClick}
    >
      <div className={`mr-3 ${isActive ? 'text-[#003518]' : 'text-[#90FFAE]'}`}>
        {icon}
      </div>
      <span className={`${isActive ? 'font-semibold' : 'font-normal'}`}>
        {label}
      </span>
    </div>
  );
};

export default SidebarItem;
