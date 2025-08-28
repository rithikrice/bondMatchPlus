import React from "react";
import { Bell } from "lucide-react";

export default function SupervisorHeader() {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <input
        type="text"
        placeholder="Search bonds or issuers"
        className="w-full max-w-xl bg-gray-100 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-teal-500"
      />
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Bell className="w-5 h-5 text-slate-600" />
        </button>
        <img
          alt="profile"
          src="https://i.pravatar.cc/40?img=5"
          className="w-9 h-9 rounded-full"
        />
      </div>
    </header>
  );
}
