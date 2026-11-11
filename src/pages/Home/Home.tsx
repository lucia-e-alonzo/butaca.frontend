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
        if (active) setLoading(false);
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
    setReloadKey((c) => c + 1);
  }

  const heroMovie = movies[0];

  return (
    <main className="space-y-12 sm:space-y-16">
        {/* Hero — full-bleed, sin caja, alineado con el catálogo */}
        <section className="relative -mx-4 overflow-hidden px-4 py-12 sm:-mx-6 sm:px-6 sm:py-16 lg:-mx-12 lg:px-12 lg:py-20">
            {/* Backdrop */}
            {heroMovie?.poster_path && (
                <div
                aria-hidden
                className="absolute inset-0 bg-cover bg-center opacity-15 sm:opacity-20"
                style={{
                    backgroundImage: `url(https://image.tmdb.org/t/p/original${heroMovie.poster_path})`,
                }}
                />
            )}

            {/* Gradiente encima */}
            <div
                aria-hidden
                className="absolute inset-0"
                style={{
                background:
                    "linear-gradient(120deg, hsl(var(--background)) 0%, hsl(var(--background)/0.92) 55%, hsl(var(--secondary)/0.35) 100%)",
                }}
            />

            {/* Contenido — alineado al padding del main */}
            <div className="relative z-10 flex flex-col gap-4 sm:gap-5">
                <p className="eyebrow flex items-center gap-2">
                <span className="h-px w-4 bg-accent/60" />
                Tu próxima historia
                </p>

                <h1 className="title-poster break-words text-5xl text-foreground sm:text-6xl lg:text-8xl">
                BUTACA
                </h1>

                <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base lg:text-lg">
                Historias que conectan con tus emociones. Explora películas,
                descubre nuevas historias y guarda tus favoritas en un solo lugar.
                </p>
            </div>
        </section>

      {/* Catálogo */}
      <section className="space-y-6">
        <div className="space-y-2">
          <p className="eyebrow">Catálogo</p>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Películas destacadas
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            Explora nuestra selección de películas en tendencia.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="surface-card flex flex-col items-center justify-center rounded-2xl p-12 text-center sm:p-16">
            <div className="mb-4 size-10 animate-spin rounded-full border-4 border-border border-t-accent" />
            <p className="text-sm text-muted-foreground">Cargando películas...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="surface-card flex flex-col items-center rounded-2xl border-accent/30 p-8 text-center sm:p-12">
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
            <Clapperboard className="mb-3 size-8 text-accent sm:size-9" />
            <h3 className="text-lg font-bold text-foreground sm:text-xl">
              No hay películas disponibles
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Vuelve más tarde para descubrir nuevas historias.
            </p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && movies.length > 0 && (
          <MovieGrid movies={movies} onMovieClick={setSelectedMovie} />
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