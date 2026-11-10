
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "@/pages/Login/Login";
import DesignSystem from "@/pages/DesignSystem";
import History from "@/pages/History";
import Dashboard from "@/pages/Dashboard/Dashboard";

import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";

function TemporaryPage({ title }: { title: string }) {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-extrabold text-white">
        {title}
      </h1>

      <p className="text-[#7c8075]">
        Esta sección de BUTACA está en desarrollo.
      </p>
    </section>
  );
}

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

      {/* Rutas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          {/* Página principal temporal */}
          <Route
            index
            element={<TemporaryPage title="Inicio" />}
          />

          {/* Recomendaciones */}
          <Route
            path="/recommendations"
            element={
              <TemporaryPage title="Recomendaciones" />
            }
          />

          {/* Favoritos */}
          <Route
            path="/favorites"
            element={<TemporaryPage title="Favoritos" />}
          />

          {/* Historial desarrollado por Lucía */}
          <Route
            path="/history"
            element={<History />}
          />

          {/* Compatibilidad con la ruta de Lucía */}
          <Route
            path="/historial"
            element={<Navigate to="/history" replace />}
          />

          {/* Dashboard desarrollado por Lucía */}
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />
        </Route>
      </Route>

      {/* Redirección para rutas inexistentes */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}
