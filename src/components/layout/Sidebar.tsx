
import {
  Clapperboard,
  Home,
  Heart,
  Sparkles,
  LayoutDashboard,
  LogOut,
  History,
  LoaderCircle,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const menuItems = [
  { name: "Inicio", path: "/", icon: Home },
  {
    name: "Recomendaciones",
    path: "/recommendations",
    icon: Sparkles,
  },
  {
    name: "Favoritos",
    path: "/favorites",
    icon: Heart,
  },
  {
    name: "Historial",
    path: "/history",
    icon: History,
  },
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
];

export default function Sidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    setLoggingOut(true);
    setError("");

    try {
      await signOut();
      navigate("/login", { replace: true });
    } catch {
      setError("No se pudo cerrar sesión.");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-[#1f5656] bg-[#0e2520] p-6 text-white">

      {/* Logo */}
      <div className="mb-10 flex items-center gap-3">
        <Clapperboard
          size={32}
          className="text-[#dd6122]"
        />

        <h1 className="text-2xl font-extrabold">
          BUTACA
        </h1>
      </div>

      {/* Menú */}
      <nav
        aria-label="Menú lateral"
        className="flex flex-1 flex-col gap-3"
      >
        {menuItems.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 font-semibold transition ${
                isActive
                  ? "bg-[#1f5656] text-white"
                  : "text-[#7c8075] hover:bg-[#1f5656]/40 hover:text-white"
              }`
            }
          >
            <Icon size={20} />
            {name}
          </NavLink>
        ))}
      </nav>

      {/* Información del usuario */}
      <div className="mt-8 border-t border-[#1f5656] pt-6">
        <p className="mb-2 text-sm text-[#7c8075]">
          Sesión iniciada como
        </p>

        <p className="mb-5 truncate text-sm font-semibold">
          {user?.email ?? "Usuario"}
        </p>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#781d0d] px-4 py-3 font-semibold transition hover:bg-[#5c140a] disabled:opacity-50"
        >
          {loggingOut ? (
            <LoaderCircle
              size={20}
              className="animate-spin"
            />
          ) : (
            <LogOut size={20} />
          )}

          Cerrar sesión
        </button>

        {error && (
          <p role="alert" className="mt-3 text-sm text-red-400">
            {error}
          </p>
        )}
      </div>
    </aside>
  );
}
