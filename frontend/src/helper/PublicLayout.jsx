import React from "react";
import { Outlet } from "react-router";
import Navigation from "../components/Navigation";

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans">
      {/* Global Navigation */}
      <Navigation />

      {/* Page Content */}
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
