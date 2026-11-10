
import {
  Routes,
  Route,
  Navigate,
  NavLink,
} from "react-router-dom";

import Home from "./pages/Home/Home";
import Favorites from "./pages/Favorites/Favorites";
import Recommendations from "./pages/Recommendations/Recommendations";

function App() {
  return (
    <div className="min-h-screen bg-[#0f0b09]">
      <nav className="flex flex-wrap items-center gap-6 border-b border-[#1f5656] bg-[#0e2520] px-6 py-4">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive
              ? "font-bold text-[#dd6122]"
              : "font-medium text-white hover:text-[#dd6122]"
          }
        >
          Inicio
        </NavLink>

        <NavLink
          to="/favoritos"
          className={({ isActive }) =>
            isActive
              ? "font-bold text-[#dd6122]"
              : "font-medium text-white hover:text-[#dd6122]"
          }
        >
          Mis favoritos
        </NavLink>

        <NavLink
          to="/recomendaciones"
          className={({ isActive }) =>
            isActive
              ? "font-bold text-[#dd6122]"
              : "font-medium text-white hover:text-[#dd6122]"
          }
        >
          Recomendaciones
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/favoritos"
          element={<Favorites />}
        />

        <Route
          path="/recomendaciones"
          element={<Recommendations />}
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </div>
  );
}

export default App;
