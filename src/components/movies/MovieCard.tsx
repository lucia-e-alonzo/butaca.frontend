
import type { Movie } from "@/services/movieService";
import FavoriteButton from "./FavoriteButton";

interface MovieCardProps {
  movie: Movie;
  onClick?: (movie: Movie) => void;
}

export default function MovieCard({
  movie,
  onClick,
}: MovieCardProps) {
  const posterUrl = movie.poster_path
    ? movie.poster_path.startsWith("http")
      ? movie.poster_path
      : `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  const rating =
    typeof movie.vote_average === "number"
      ? movie.vote_average.toFixed(1)
      : null;

  const mediaType =
    movie.media_type === "tv"
      ? "Serie"
      : movie.media_type === "movie"
        ? "Película"
        : "Contenido";

  return (
    <article className="group relative w-full">
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-[#0e2520]">
        <button
          type="button"
          onClick={() => onClick?.(movie)}
          disabled={!onClick}
          className="h-full w-full text-left disabled:cursor-default"
          aria-label={`Ver detalles de ${movie.title}`}
        >
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`Póster de ${movie.title}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-4 text-center text-sm text-[#7c8075]">
              Póster no disponible
            </div>
          )}
        </button>

        {rating && (
          <span className="pointer-events-none absolute left-2 top-2 rounded-lg bg-[#0f0b09]/90 px-2 py-1 text-xs font-bold text-white">
            ★ {rating}
          </span>
        )}

        <div className="absolute right-2 top-2 z-10">
          <FavoriteButton movie={movie} />
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <h3 className="line-clamp-2 text-base font-bold text-white">
          {movie.title}
        </h3>

        <p className="text-sm text-[#7c8075]">
          {mediaType}
          {movie.release_date
            ? ` · ${movie.release_date.slice(0, 4)}`
            : ""}
        </p>
      </div>
    </article>
  );
}
