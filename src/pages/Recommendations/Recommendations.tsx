
import { useEffect, useState } from "react";
import { Sparkles, AlertCircle, RefreshCw } from "lucide-react";

import MovieGrid from "@/components/movies/MovieGrid";
import MovieDetails from "@/components/movies/MovieDetails";

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
        if (active) {
          setLoading(false);
        }
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
    <main className="space-y-8">
      <section className="rounded-3xl border border-[#1f5656] bg-gradient-to-r from-[#0e2520] to-[#0f0b09] p-8">
        <div className="flex items-center gap-3">
          <Sparkles
            size={32}
            className="text-[#dd6122]"
          />

          <h1 className="text-3xl font-extrabold text-white">
            Recomendaciones para ti
          </h1>
        </div>

        <p className="mt-4 max-w-2xl text-[#c5c5c5]">
          Descubre historias que podrían interesarte.
          Próximamente podrás recibir recomendaciones
          basadas en tus emociones.
        </p>
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Descubre nuevas historias
          </h2>

          <p className="mt-2 text-[#7c8075]">
            Explora nuestra selección de películas.
          </p>
        </div>

        {loading && (
          <div
            role="status"
            className="rounded-xl border border-[#1f5656] bg-[#0e2520] p-10 text-center"
          >
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#1f5656] border-t-[#dd6122]" />

            <p className="text-white">
              Cargando recomendaciones...
            </p>
          </div>
        )}

        {!loading && error && (
          <div
            role="alert"
            className="rounded-xl border border-[#dd6122] bg-[#0e2520] p-8 text-center"
          >
            <AlertCircle
              size={36}
              className="mx-auto mb-3 text-[#dd6122]"
            />

            <p className="mb-4 text-white">
              {error}
            </p>

            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center gap-2 rounded-lg bg-[#dd6122] px-5 py-3 font-semibold text-white hover:opacity-90"
            >
              <RefreshCw size={18} />
              Intentar de nuevo
            </button>
          </div>
        )}

        {!loading && !error && movies.length === 0 && (
          <div className="rounded-xl border border-[#1f5656] bg-[#0e2520] p-10 text-center">
            <Sparkles
              size={36}
              className="mx-auto mb-4 text-[#dd6122]"
            />

            <h3 className="text-xl font-bold text-white">
              Todavía no hay recomendaciones
            </h3>

            <p className="mt-2 text-[#c5c5c5]">
              Vuelve más tarde para descubrir nuevas historias.
            </p>
          </div>
        )}

        {!loading && !error && movies.length > 0 && (
          <MovieGrid
            movies={movies}
            onMovieClick={setSelectedMovie}
          />
        )}
      </section>

      {selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </main>
  );
}
