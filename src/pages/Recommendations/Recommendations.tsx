import { useEffect, useState } from "react";
import { Sparkles, AlertCircle, RefreshCw } from "lucide-react";

import MovieGrid from "@/components/movies/MovieGrid";
import MovieDetails from "@/components/movies/MovieDetails";
import { PageHeader } from "@/components/common/PageHeader";

import type { Movie } from "@/services/movieService";
import { getRecommendations } from "@/services/recommendationsService";

export default function Recommendations() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadRecommendations() {
      try {
        const results = await getRecommendations();
        if (!active) return;
        setMovies(results);
        setError(null);
      } catch (err) {
        if (!active) return;
        setMovies([]);
        setError(
          err instanceof Error
            ? err.message
            : "No pudimos cargar las recomendaciones."
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    loadRecommendations();
    return () => {
      active = false;
    };
  }, [reloadKey]);

  function handleRetry() {
    setLoading(true);
    setError(null);
    setReloadKey((current) => current + 1);
  }

  return (
    <main className="space-y-10 sm:space-y-12">
      <PageHeader
        eyebrow="Personalizado para ti"
        title="Recomendaciones"
        description="Descubre historias que podrían interesarte. Próximamente podrás recibir recomendaciones basadas en tus emociones."
        action={
          <span className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
            <Sparkles className="size-4 text-accent" />
            Según tu actividad
          </span>
        }
      />

      {/* Loading */}
      {loading && (
        <div
          role="status"
          className="surface-card flex flex-col items-center justify-center rounded-2xl p-12 text-center sm:p-16"
        >
          <div className="mb-4 size-10 animate-spin rounded-full border-4 border-border border-t-accent" />
          <p className="text-sm text-muted-foreground">
            Cargando recomendaciones...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div
          role="alert"
          className="surface-card flex flex-col items-center rounded-2xl border-accent/30 p-8 text-center sm:p-12"
        >
          <AlertCircle className="mb-3 size-8 text-accent sm:size-9" />
          <p className="mb-4 text-sm font-semibold text-foreground sm:text-base">
            {error}
          </p>
          <button
            type="button"
            onClick={handleRetry}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 sm:px-5 sm:py-3"
          >
            <RefreshCw size={16} />
            Intentar de nuevo
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && movies.length === 0 && (
        <div className="surface-card flex flex-col items-center rounded-2xl p-8 text-center sm:p-12">
          <Sparkles className="mb-3 size-8 text-accent sm:size-9" />
          <h3 className="text-lg font-bold text-foreground sm:text-xl">
            Todavía no hay recomendaciones
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Vuelve más tarde para descubrir nuevas historias.
          </p>
        </div>
      )}

      {/* Data */}
      {!loading && !error && movies.length > 0 && (
        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Descubre nuevas historias
            </h2>
            <p className="text-sm text-muted-foreground">
              Explora nuestra selección de películas.
            </p>
          </div>

          <MovieGrid movies={movies} onMovieClick={setSelectedMovie} />
        </section>
      )}

      {selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </main>
  );
}