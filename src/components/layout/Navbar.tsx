
import { useState } from "react";
import {
  Clapperboard,
  Home,
  Heart,
  Sparkles,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  LoaderCircle,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";

const navigation = [
  { name: "Inicio", path: "/", icon: Home },
  { name: "Recomendaciones", path: "/recommendations", icon: Sparkles },
  { name: "Favoritos", path: "/favorites", icon: Heart },
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
];

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    setLoggingOut(true);
    setError("");

    try {
      await signOut();
      setMenuOpen(false);
      navigate("/login", { replace: true });
    } catch {
      setError("No se pudo cerrar sesión.");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#1f5656] bg-[#0e2520] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <Clapperboard size={30} className="text-[#dd6122]" />
          <span className="text-2xl font-extrabold tracking-wide">
            BUTACA
          </span>
        </NavLink>

        {/* Navegación de escritorio */}
        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-6 md:flex"
        >
          {navigation.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-2 text-sm font-semibold transition ${
                  isActive
                    ? "text-[#dd6122]"
                    : "text-[#b5b8af] hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {name}
            </NavLink>
          ))}
        </nav>

        {/* Usuario y cierre de sesión */}
        <div className="hidden items-center gap-4 md:flex">
          <span className="max-w-40 truncate text-sm text-[#b5b8af]">
            {user?.user_metadata?.full_name ??
              user?.email ??
              "Usuario"}
          </span>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-2 rounded-xl bg-[#1f5656] px-4 py-2 text-sm font-semibold transition hover:bg-[#287070] disabled:opacity-50"
          >
            {loggingOut ? (
              <LoaderCircle size={18} className="animate-spin" />
            ) : (
              <LogOut size={18} />
            )}
            Salir
          </button>
        </div>

        {/* Botón móvil */}
        <button
          type="button"
          className="rounded-lg p-2 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <nav
          aria-label="Navegación móvil"
          className="border-t border-[#1f5656] px-6 py-4 md:hidden"
        >
          <div className="flex flex-col gap-4">
            {navigation.map(({ name, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                end={path === "/"}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 font-semibold ${
                    isActive
                      ? "text-[#dd6122]"
                      : "text-[#b5b8af]"
                  }`
                }
              >
                <Icon size={20} />
                {name}
              </NavLink>
            ))}

            <div className="border-t border-[#1f5656] pt-4">
              <p className="mb-3 truncate text-sm text-[#b5b8af]">
                {user?.email ?? "Usuario"}
              </p>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center gap-2 text-[#dd6122] disabled:opacity-50"
              >
                <LogOut size={20} />
                Cerrar sesión
              </button>
            </div>
          </div>
        </nav>
      )}

      {error && (
        <p role="alert" className="px-6 pb-3 text-sm text-red-400">
          {error}
        </p>
      )}
    </header>
  );
}
