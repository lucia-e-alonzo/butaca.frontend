import { Outlet } from "react-router";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const STORAGE_KEY = "butaca:sidebar-collapsed";

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
  }, [collapsed]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Atmósfera cinematográfica */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, hsl(var(--primary)/0.18), transparent 65%)," +
            "radial-gradient(ellipse 60% 40% at 85% 110%, hsl(var(--accent)/0.10), transparent 70%)," +
            "radial-gradient(ellipse 70% 50% at 0% 100%, hsl(var(--secondary)/0.35), transparent 70%)",
        }}
      />

      {/* Navbar: en mobile muestra header + bottom nav; en desktop header completo */}
      <Navbar />

      <div className="flex min-h-screen">
        {/* Sidebar solo desktop */}
        <div className="hidden lg:block">
          <Sidebar
            collapsed={collapsed}
            onToggle={() => setCollapsed((c) => !c)}
          />
        </div>

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-7xl px-4 pb-24 pt-6 sm:px-6 sm:py-10 lg:px-12 lg:py-14 lg:pb-14">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}