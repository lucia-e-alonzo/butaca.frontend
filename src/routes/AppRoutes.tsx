
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "@/pages/Login/Login";
import Home from "@/pages/Home/Home";
import Favorites from "@/pages/Favorites/Favorites";
import Recommendations from "@/pages/Recommendations/Recommendations";

import History from "@/pages/History";
import Dashboard from "@/pages/Dashboard/Dashboard";
import DesignSystem from "@/pages/DesignSystem";

import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";

// Evitar mostrar el login cuando ya existe una sesión.
function LoginRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f0b09] text-white">
        Verificando sesión...
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Login />;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Vista del sistema de diseño */}
      <Route
        path="/ui-preview"
        element={<DesignSystem />}
      />

      {/* Inicio de sesión */}
      <Route
        path="/login"
        element={<LoginRoute />}
      />

      {/* Páginas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>

          {/* Catálogo de películas */}
          <Route
            index
            element={<Home />}
          />

          {/* Favoritos */}
          <Route
            path="/favorites"
            element={<Favorites />}
          />

          {/* Compatibilidad con la ruta en español */}
          <Route
            path="/favoritos"
            element={<Navigate to="/favorites" replace />}
          />

          {/* Recomendaciones */}
          <Route
            path="/recommendations"
            element={<Recommendations />}
          />

          {/* Compatibilidad con la ruta en español */}
          <Route
            path="/recomendaciones"
            element={
              <Navigate to="/recommendations" replace />
            }
          />

          {/* Dashboard de Lucía */}
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* Historial de Lucía */}
          <Route
            path="/history"
            element={<History />}
          />

          <Route
            path="/historial"
            element={<Navigate to="/history" replace />}
          />

        </Route>
      </Route>

      {/* Rutas inexistentes */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}
