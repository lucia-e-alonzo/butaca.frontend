
import { useEffect, useState } from "react";
import { Clapperboard, AlertCircle, RefreshCw } from "lucide-react";

import MovieGrid from "@/components/movies/MovieGrid";
import MovieDetails from "@/components/movies/MovieDetails";

import type { Movie } from "@/services/movieService";
import { getTrendingMovies } from "@/services/movieService";

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadMovies() {
      try {
        const results = await getTrendingMovies();

        if (!active) return;

        setMovies(results.results);
        setError(null);
      } catch {
        if (!active) return;

        setError("No pudimos cargar las películas.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadMovies();

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
    <main className="space-y-10 p-6 md:p-10">
      {/* Encabezado principal */}
      <section className="rounded-3xl border border-[#1f5656] bg-gradient-to-r from-[#0e2520] to-[#0f0b09] p-8 md:p-12">
        <div className="mb-5 flex items-center gap-3">
          <Clapperboard
            size={34}
            className="text-[#dd6122]"
          />

          <span className="text-sm font-semibold uppercase tracking-widest text-[#dd6122]">
            Bienvenido a BUTACA
          </span>
        </div>

        <h1 className="max-w-3xl text-3xl font-extrabold text-white md:text-5xl">
          Historias que conectan con tus emociones.
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#c5c5c5]">
          Explora películas, descubre nuevas historias y
          guarda tus favoritas en un solo lugar.
        </p>
      </section>

      {/* Catálogo */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Películas destacadas
          </h2>

          <p className="mt-2 text-[#7c8075]">
            Explora nuestra selección de películas.
          </p>
        </div>

        {/* Estado de carga */}
        {loading && (
          <div
            role="status"
            className="rounded-xl border border-[#1f5656] bg-[#0e2520] p-10 text-center"
          >
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#1f5656] border-t-[#dd6122]" />

            <p className="text-white">
              Cargando películas...
            </p>
          </div>
        )}

        {/* Estado de error */}
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

        {/* Sin resultados */}
        {!loading && !error && movies.length === 0 && (
          <div className="rounded-xl border border-[#1f5656] bg-[#0e2520] p-10 text-center">
            <Clapperboard
              size={36}
              className="mx-auto mb-4 text-[#dd6122]"
            />

            <h3 className="text-xl font-bold text-white">
              No hay películas disponibles
            </h3>

            <p className="mt-2 text-[#c5c5c5]">
              Vuelve más tarde para descubrir nuevas historias.
            </p>
          </div>
        )}

        {/* Películas disponibles */}
        {!loading && !error && movies.length > 0 && (
          <MovieGrid
            movies={movies}
            onMovieClick={setSelectedMovie}
          />
        )}
      </section>

      {/* Ventana de detalles */}
      {selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </main>
  );
}
