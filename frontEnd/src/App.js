import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import React, { useState } from "react";

import Sidebar from "./components/Sidebar";
import Header from "./components/homepage/Header";
import PortfolioSnapshot from "./components/homepage/PortfolioSnapshot";
import FeaturedBonds from "./components/homepage/FeaturedBonds";
import QuickActions from "./components/homepage/QuickActions";
import BondDiscovery from "./components/discoverPage/BondDiscovery";
import PortfolioDashboard from "./components/portfolioPage/PortfolioPage";
import LoginPage from "./components/auth/Login";
import SignupStepper from "./components/auth/SignUpPage";

function AppLayout({ children, currentPage }) {
  const navigate = useNavigate();

  // handle navigation (routes + active highlight)
  const handleNavigate = (page) => {
    navigate(`/${page}`);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 space-y-6">{children}</main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupStepper />} />

        <Route
          path="/home"
          element={
            <AppLayout currentPage="home">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PortfolioSnapshot />
                <FeaturedBonds />
              </div>
              <QuickActions />
            </AppLayout>
          }
        />

        <Route
          path="/discover"
          element={
            <AppLayout currentPage="discover">
              <BondDiscovery />
            </AppLayout>
          }
        />

        <Route
          path="/portfolio"
          element={
            <AppLayout currentPage="portfolio">
              <PortfolioDashboard />
            </AppLayout>
          }
        />

        <Route
          path="/rfqs"
          element={
            <AppLayout currentPage="rfqs">
              <div>RFQs Page (placeholder)</div>
            </AppLayout>
          }
        />

        <Route
          path="/settings"
          element={
            <AppLayout currentPage="settings">
              <div>Settings Page (placeholder)</div>
            </AppLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
