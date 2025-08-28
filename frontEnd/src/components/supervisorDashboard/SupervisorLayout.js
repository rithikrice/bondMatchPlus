import React from "react";
import { useNavigate } from "react-router-dom";
import SupervisorSidebar from "./SupervisorSidebar";
import SupervisorHeader from "./SupervisorHeader";

const SupervisorLayout = ({ children, currentPage }) => {
  const navigate = useNavigate();
  const handleNavigate = (page) => navigate(`/supervisor/${page}`);

  return (
    <div className="flex h-screen bg-gray-50">
      <SupervisorSidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />
      <div className="flex-1 flex flex-col">
        <SupervisorHeader />
        <main className="p-6 space-y-6">{children}</main>
      </div>
    </div>
  );
};

export default SupervisorLayout;
