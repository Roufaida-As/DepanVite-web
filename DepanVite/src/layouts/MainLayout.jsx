// src/layouts/MainLayout.jsx
import React from 'react';
import Sidebar, { SidebarItem } from '../components/SideBar';
import { Wrench, Users, Home, BarChart } from 'lucide-react';

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen w-screen">
      <Sidebar>
        <SidebarItem icon={<Wrench size={30} />} text="Dépanneurs" />
        <SidebarItem icon={<Users size={30} />} text="Assurés" />
        <SidebarItem icon={<Home size={30} />} text="Dépannages" />
        <SidebarItem icon={<BarChart size={39} />} text="Stats" />
      </Sidebar>
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}
