
import type { Movie } from "@/services/movieService";

interface MovieDetailsProps {
  movie: Movie;
  onClose: () => void;
}

export default function MovieDetails({
  movie,
  onClose,
}: MovieDetailsProps) {
  const posterUrl = movie.poster_path
    ? movie.poster_path.startsWith("http")
      ? movie.poster_path
      : `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  const mediaType =
    movie.media_type === "tv"
      ? "Serie"
      : movie.media_type === "movie"
        ? "Película"
        : "Contenido";

  const rating =
    typeof movie.vote_average === "number"
      ? movie.vote_average.toFixed(1)
      : "Sin calificación";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="movie-details-title"
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[#1f5656] bg-[#0f0b09] p-6 text-white shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar detalles"
          className="absolute right-4 top-4 rounded-full bg-[#1f5656] px-3 py-2 text-white hover:bg-[#dd6122]"
        >
          ✕
        </button>

        <div className="grid gap-6 sm:grid-cols-[220px_1fr]">
          <div className="overflow-hidden rounded-xl bg-[#0e2520]">
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={`Póster de ${movie.title}`}
                className="w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[2/3] items-center justify-center p-4 text-center text-[#7c8075]">
                Póster no disponible
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-sm font-semibold text-[#dd6122]">
                {mediaType}
              </span>

              <h2
                id="movie-details-title"
                className="mt-2 text-3xl font-extrabold"
              >
                {movie.title}
              </h2>
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              <span className="rounded-lg bg-[#0e2520] px-3 py-2">
                ★ {rating}
              </span>

              {movie.release_date && (
                <span className="rounded-lg bg-[#0e2520] px-3 py-2">
                  {movie.release_date.slice(0, 4)}
                </span>
              )}
            </div>

            <div>
              <h3 className="mb-2 text-lg font-bold">
                Sinopsis
              </h3>

              <p className="leading-relaxed text-[#c5c5c5]">
                {movie.overview?.trim() ||
                  "No hay una sinopsis disponible para este contenido."}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-[#dd6122] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#b84e19]"
            >
              Volver al catálogo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
