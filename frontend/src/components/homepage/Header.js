import { Search } from "lucide-react";

function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
      <div className="flex items-center w-full md:w-1/2 bg-gray-50 rounded-lg px-3 py-2 border">
        <Search className="text-gray-400 mr-2" size={18} />
        <input
          type="text"
          placeholder="Search Bond / ISIN / Company Name"
          className="flex-1 bg-transparent outline-none text-sm"
        />
      </div>
      <button className="flex items-center gap-2 px-4 py-2 bg-[#0f2544] text-white text-sm rounded-lg hover:bg-[#173567] transition">
        Search
        <Search size={16} />
      </button>
      <div className="ml-4 w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
        <img src="https://i.pravatar.cc/40" alt="profile" />
      </div>
    </header>
  );
}

export default Header;
