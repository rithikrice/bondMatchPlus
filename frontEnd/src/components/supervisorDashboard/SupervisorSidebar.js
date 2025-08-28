import React from "react";
import { Home, Layers, Gavel, Bell, User } from "lucide-react";

const NavItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition
      ${
        active ? "bg-white/10 text-white" : "text-slate-200 hover:bg-white/10"
      }`}
  >
    <Icon className="w-5 h-5" />
    {label}
  </button>
);

export default function SupervisorSidebar({ currentPage, onNavigate }) {
  return (
    <aside className="w-64 bg-[#0B2B4C] text-white p-4 flex flex-col">
      <div className="px-2 py-3 text-xl font-semibold tracking-tight">
        BondMatch+
      </div>
      <nav className="mt-4 space-y-1">
        <NavItem
          icon={Home}
          label="Home"
          active={currentPage === "home"}
          onClick={() => onNavigate("home")}
        />
        <NavItem
          icon={Layers}
          label="Bonds"
          active={currentPage === "bonds"}
          onClick={() => onNavigate("bonds")}
        />
        <NavItem
          icon={Gavel}
          label="Auctions"
          active={currentPage === "auctions"}
          onClick={() => onNavigate("auctions")}
        />
        <NavItem
          icon={Bell}
          label="Alerts"
          active={currentPage === "alerts"}
          onClick={() => onNavigate("alerts")}
        />
        <NavItem
          icon={User}
          label="Profile"
          active={currentPage === "profile"}
          onClick={() => onNavigate("profile")}
        />
      </nav>
      <div className="mt-auto text-xs text-white/70 px-2">Settings</div>
    </aside>
  );
}
