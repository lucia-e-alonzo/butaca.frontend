
import { useEffect, useState } from "react";
import {
  Activity,
  Clapperboard,
  Heart,
  Film,
  Smile,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";

import { PageHeader } from "@/components/common/PageHeader";
import {
  FAVORITES_CHANGED_EVENT,
  getFavorites,
} from "@/services/favoritesService";
import { getRecommendations } from "@/services/recommendationsService";
import type { Movie } from "@/services/movieService";

export default function Dashboard() {
  const [favoriteCount, setFavoriteCount] = useState(
    () => getFavorites().length
  );

  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [recommendationError, setRecommendationError] = useState<string | null>(
    null
  );
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    function updateFavorites() {
      setFavoriteCount(getFavorites().length);
    }

    window.addEventListener(
      FAVORITES_CHANGED_EVENT,
      updateFavorites
    );
    window.addEventListener("storage", updateFavorites);
    window.addEventListener("focus", updateFavorites);

    return () => {
      window.removeEventListener(
        FAVORITES_CHANGED_EVENT,
        updateFavorites
      );
      window.removeEventListener("storage", updateFavorites);
      window.removeEventListener("focus", updateFavorites);
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadRecommendations() {
      setLoading(true);
      setRecommendationError(null);

      try {
        const results = await getRecommendations({
          media_type: "all",
          language: "es-MX",
          limit: 5,
        });

        if (active) {
          setRecommendations(results);
        }
      } catch (error) {
        if (active) {
          setRecommendations([]);
          setRecommendationError(
            error instanceof Error
              ? error.message
              : "No se pudieron cargar las recomendaciones."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadRecommendations();

    return () => {
      active = false;
    };
  }, [reloadKey]);

  return (
    <main className="min-h-screen bg-background px-5 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-8">
        <PageHeader
          eyebrow="Tu experiencia en Butaca"
          title="Mi Butaca Recap"
          description="Consulta tu actividad cinematográfica y tus recomendaciones."
        />

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Activity className="size-4 text-primary" />
          Información disponible de tu actividad
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* MUNDO EMOCIONAL */}
          <section className="space-y-5 rounded-xl border border-border bg-card p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Smile className="size-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">
                Tu mundo emocional
              </h2>
            </div>

            <p className="text-sm text-muted-foreground">
              Aquí podrás consultar las emociones registradas
              durante tu experiencia en BUTACA.
            </p>

            <div className="rounded-xl border border-border bg-background/50 p-8 text-center">
              <Activity className="mx-auto mb-4 size-10 text-primary" />

              <h3 className="font-semibold text-foreground">
                Historial emocional no disponible
              </h3>

              <p className="mt-3 text-sm text-muted-foreground">
                El servicio de historial todavía no está
                disponible para consultar tus registros reales.
              </p>

              <p className="mt-3 text-xs text-muted-foreground">
                Las estadísticas y gráficas emocionales se
                mostrarán cuando exista información real.
              </p>
            </div>

            <Link
              to="/history"
              className="inline-flex rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-background"
            >
              Ir al historial
            </Link>
          </section>

          {/* RECORRIDO CINEMATOGRÁFICO */}
          <section className="space-y-5 rounded-xl border border-border bg-card p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Clapperboard className="size-5 text-accent" />
              <h2 className="text-xl font-bold text-foreground">
                Tu recorrido cinematográfico
              </h2>
            </div>

            <p className="text-sm text-muted-foreground">
              Consulta tus favoritos guardados y las
              recomendaciones proporcionadas por BUTACA.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border bg-background/50 p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Film className="size-4 text-accent" />
                  <p className="text-xs">
                    Recomendaciones disponibles
                  </p>
                </div>

                <p className="mt-2 text-3xl font-black text-foreground">
                  {loading || recommendationError
                    ? "—"
                    : recommendations.length}
                </p>
              </div>

              <div className="rounded-lg border border-border bg-background/50 p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Heart className="size-4 text-accent" />
                  <p className="text-xs">
                    Favoritos locales
                  </p>
                </div>

                <p className="mt-2 text-3xl font-black text-foreground">
                  {favoriteCount}
                </p>
              </div>
            </div>

            <div className="space-y-4 rounded-lg border border-border bg-background/50 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-bold text-foreground">
                  Recomendaciones del backend
                </h3>

                <button
                  type="button"
                  onClick={() => setReloadKey((value) => value + 1)}
                  disabled={loading}
                  className="rounded-lg border border-border p-2 text-foreground disabled:opacity-50"
                  aria-label="Actualizar recomendaciones"
                >
                  <RefreshCw className="size-4" />
                </button>
              </div>

              {loading ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Cargando recomendaciones...
                </p>
              ) : recommendationError ? (
                <div className="space-y-2 py-6 text-center">
                  <p className="text-sm font-semibold text-foreground">
                    No se pudieron cargar las recomendaciones
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {recommendationError}
                  </p>
                </div>
              ) : recommendations.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  El servicio no devolvió recomendaciones.
                </p>
              ) : (
                <div className="space-y-3">
                  {recommendations.map((movie) => (
                    <div
                      key={`${movie.media_type}-${movie.id}`}
                      className="flex items-center gap-3 rounded-lg border border-border/70 bg-card/60 p-3"
                    >
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-secondary text-accent">
                        <Film className="size-6" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {movie.title}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {movie.media_type === "tv"
                            ? "Serie"
                            : "Película"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-lg border border-border bg-background/50 p-4">
              <h3 className="font-bold text-foreground">
                Tu colección
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Actualmente tienes {favoriteCount}{" "}
                {favoriteCount === 1
                  ? "contenido guardado"
                  : "contenidos guardados"}{" "}
                en este navegador.
              </p>

              <Link
                to="/favorites"
                className="mt-4 inline-block text-sm font-semibold text-accent hover:underline"
              >
                Ver mis favoritos
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
