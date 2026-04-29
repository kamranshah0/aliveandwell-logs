import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";

export default function Layout() {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    const saved = sessionStorage.getItem("sidebar-collapsed");
    return saved === "true";
  });

  useEffect(() => {
    sessionStorage.setItem("sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  return (
    <>
      <div className="flex ">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

        <main
          className={` transition-all duration-300 pt-[72px] w-full min-w-0 min-h-screen bg-custom-bg-1 
            ${collapsed ? "ps-[72px]" : "ps-[200px] "}`}
        >
          <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
          <Outlet /> {/* This renders nested routes like Dashboard */}
        </main>
      </div>

      <Toaster position="top-right" richColors />
    </>
  );
}
