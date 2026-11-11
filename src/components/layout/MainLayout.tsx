
import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[#0f0b09] text-white">

      {/* Barra de navegación para móviles */}
      <div className="lg:hidden">
        <Navbar />
      </div>

      <div className="flex min-h-screen">

        {/* Menú lateral para computadoras */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Contenido principal */}
        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-7xl p-6 lg:p-10">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}
