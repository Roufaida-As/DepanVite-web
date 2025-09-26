import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Sidebar, { SidebarItem } from './components/SideBar'
import { Wrench, Users, Home, BarChart } from 'lucide-react'

function App() {
  return (
    <div className="flex h-screen w-screen">
      {/* ✅ Sidebar is just called as a component */}
      <Sidebar>
        <SidebarItem icon={<Wrench size={30} />} text="Dépanneurs" />
        <SidebarItem icon={<Users size={30} />} text="Assurés" />
        <SidebarItem icon={<Home size={30} />} text="Dépannages" />
        <SidebarItem icon={<BarChart size={39} />} text="Stats" />
      </Sidebar>

      {/* Example content area */}
     
    </div>
  )
}

export default App
