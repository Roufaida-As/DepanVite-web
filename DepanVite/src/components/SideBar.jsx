import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react";
import { useContext, createContext, useState } from "react";
import logo from "../assets/logo1.png";
import { NavLink } from "react-router-dom";

const SidebarContext = createContext();

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <aside
      className={`bg-white border-r shadow-sm transition-all duration-300 flex flex-col ${
        expanded ? "w-64" : "w-16"
      }`}
    >
      {/* Logo + toggle button */}
      <div
        className={`p-4 pb-2 flex items-center transition-all duration-300 ${
          expanded ? "justify-between" : "justify-center"
        }`}
      >
        <img
          src={logo}
          className={`overflow-hidden transition-all ${
            expanded ? "w-40" : "w-0"
          }`}
          alt="logo"
        />
        <button
          onClick={() => setExpanded((curr) => !curr)}
          className="p-1.5 rounded-lg hover:bg-black hover:text-white transition-colors"
        >
          {expanded ? (
            <ChevronFirst className="text-[#FFC120]" />
          ) : (
            <ChevronLast className="text-[#FFC120]" />
          )}
        </button>
      </div>

      {/* Menu items */}
      <SidebarContext.Provider value={{ expanded }}>
        <ul className="flex-1 px-3 pt-10 space-y-3">{children}</ul>
      </SidebarContext.Provider>

      {/* Profile block at bottom */}
      <div
        className="border-t relative flex items-center p-3 hover:bg-[#FFC120] hover:text-black rounded-lg cursor-pointer transition-colors"
        onClick={() => setShowMenu((prev) => !prev)}
      >
        <img
          src="https://ui-avatars.com/api/?background=FFC120&color=000000&bold=true"
          alt="user avatar"
          className="w-10 h-10 rounded-md"
        />

        {/* Text + Icon (expandable) */}
        <div
          className={`flex justify-between items-center ml-3 transition-all duration-300 ${
            expanded ? "w-48 opacity-100" : "w-0 opacity-0"
          }`}
        >
          <div className="leading-4">
            <h4 className="font-semibold text-black">MR</h4>
            {/* Truncate long emails */}
            <span className="text-xs text-gray-800 block truncate w-40">
              mr_maamar@esi.dz
            </span>
          </div>
          <MoreVertical size={20} className="text-[#FFC120]" />
        </div>

        {/* Dropdown menu */}
        {showMenu && expanded && (
          <div className="absolute bottom-14 right-3 w-48 bg-white border shadow-md rounded-lg z-50">
            <ul>
              <li className="px-4 py-2 hover:bg-[#FFC120] hover:text-black cursor-pointer">
                Profile
              </li>
              <li className="px-4 py-2 hover:bg-[#FFC120] hover:text-black cursor-pointer">
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
}

export function SidebarItem({ icon, text, to, alert }) {
  const { expanded } = useContext(SidebarContext);

  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        relative flex items-center py-2 px-3
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          isActive
            ? "bg-gradient-to-tr from-[#FFD666] to-[#FFC120] text-black"
            : "hover:bg-[#FFC120] hover:text-black text-gray-600"
        }
      `}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all text-left ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>

      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-[#FFC120] ${
            expanded ? "" : "top-2"
          }`}
        />
      )}

      {/* Tooltip when collapsed */}
      {!expanded && (
        <div
          className="
            absolute left-full rounded-md px-2 py-1 ml-6
            bg-[#FFC120] text-black text-sm
            invisible opacity-20 -translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
          "
        >
          {text}
        </div>
      )}
    </NavLink>
  );
}