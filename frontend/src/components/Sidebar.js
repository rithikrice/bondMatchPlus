import { Home, BarChart2, Compass, FileText, Settings } from "lucide-react";

function Sidebar({ currentPage, onNavigate }) {
  return (
    <aside className="w-64 bg-[#0f2544] text-white flex flex-col p-6">
      <h1 className="text-xl font-bold mb-10">BondMatch+</h1>
      <nav className="flex-1 space-y-4">
        <NavItem
          icon={<Home size={18} />}
          label="Home"
          active={currentPage === "home"}
          onClick={() => onNavigate("home")}
        />
        <NavItem
          icon={<BarChart2 size={18} />}
          label="Portfolio"
          active={currentPage === "portfolio"}
          onClick={() => onNavigate("portfolio")}
        />
        <NavItem
          icon={<Compass size={18} />}
          label="Discover"
          active={currentPage === "discover"}
          onClick={() => onNavigate("discover")}
        />
        <NavItem
          icon={<FileText size={18} />}
          label="RFQs"
          active={currentPage === "rfqs"}
          onClick={() => onNavigate("rfqs")}
        />
      </nav>
      <NavItem
        icon={<Settings size={18} />}
        label="Settings"
        active={currentPage === "settings"}
        onClick={() => onNavigate("settings")}
      />
    </aside>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition ${
        active ? "bg-white/10" : "hover:bg-white/10"
      }`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}

export default Sidebar;
