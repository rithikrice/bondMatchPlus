import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import React, { useState } from "react";

import Sidebar from "./components/userDashboard/Sidebar";

import PortfolioSnapshot from "./components/userDashboard/homepage/PortfolioSnapshot";
import FeaturedBonds from "./components/userDashboard/homepage/FeaturedBonds";
import QuickActions from "./components/userDashboard/homepage/QuickActions";
import BondDiscovery from "./components/userDashboard/discoverPage/BondDiscovery";
import PortfolioDashboard from "./components/userDashboard/portfolioPage/PortfolioPage";
import LoginPage from "./components/userDashboard/auth/Login";
import SignupStepper from "./components/userDashboard/auth/SignUpPage";
import AuctionList from "./components/userDashboard/auctionPage/AuctionList";
import AuctionDetails from "./components/userDashboard/auctionPage/AuctionDetails";
import Header from "./components/userDashboard/Header";
import AuctionLive from "./components/userDashboard/auctionPage/AuctionLive";
import RFQPage from "./components/userDashboard/rfq/RFQ";
import SupervisorHome from "./components/supervisorDashboard/homePage/SupervisorHome";
import SupervisorLayout from "./components/supervisorDashboard/SupervisorLayout";
import SupervisorBondsPage from "./components/supervisorDashboard/bondsPage/BondsListPage";
import BondDetailPage from "./components/supervisorDashboard/bondsPage/BondDetailsPage";
import SupervisorAuctionList from "./components/supervisorDashboard/auctionPage/SupervisorAuctionListPage";
import SupervisorAuctionDetailPage from "./components/supervisorDashboard/auctionPage/SupervisorAuctionDetailPage";
import AIChat from "./components/supervisorDashboard/AIChat";

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
          path="/auctions"
          element={
            <AppLayout currentPage="auctions">
              <AuctionList />
            </AppLayout>
          }
        />
        <Route
          path="/auction-live"
          element={
            <AppLayout currentPage="auction-live">
              <AuctionLive />
            </AppLayout>
          }
        />
        <Route
          path="/rfq"
          element={
            <AppLayout currentPage="rfq">
              <RFQPage />
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
        <Route
          path="/auctions/:id"
          element={
            <AppLayout currentPage="auctions">
              <AuctionDetails />
            </AppLayout>
          }
        />
        <Route
          path="/chat"
          element={
            <AppLayout currentPage="chat">
              <AIChat mode="user" />
            </AppLayout>
          }
        />
        <Route
          path="/supervisor/home"
          element={
            <SupervisorLayout currentPage="supervisor-home">
              <SupervisorHome />
            </SupervisorLayout>
          }
        />
        <Route
          path="/supervisor/bonds"
          element={
            <SupervisorLayout currentPage="supervisor-bonds">
              <SupervisorBondsPage />
            </SupervisorLayout>
          }
        />
        <Route
          path="/supervisor/bonds/:isin"
          element={
            <SupervisorLayout currentPage="supervisor-bonds">
              <BondDetailPage />
            </SupervisorLayout>
          }
        />

        <Route
          path="/supervisor/auctions"
          element={
            <SupervisorLayout currentPage="supervisor-auctions">
              <SupervisorAuctionList />
            </SupervisorLayout>
          }
        />

        <Route
          path="/supervisor/auctions/:id"
          element={
            <SupervisorLayout currentPage="supervisor-auctions">
              <SupervisorAuctionDetailPage />
            </SupervisorLayout>
          }
        />

        <Route
          path="/supervisor/chat"
          element={
            <SupervisorLayout currentPage="chat">
              <AIChat mode="supervisor" />
            </SupervisorLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
