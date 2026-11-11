
import MovieCard from "./MovieCard";
import type { Movie } from "@/services/movieService";

interface MovieGridProps {
  movies: Movie[];
  onMovieClick?: (movie: Movie) => void;
}

export default function MovieGrid({
  movies,
  onMovieClick,
}: MovieGridProps) {
  if (movies.length === 0) {
    return (
      <div className="rounded-2xl border border-[#1f5656] bg-[#0e2520] p-8 text-center">
        <h3 className="text-xl font-bold text-white">
          No hay películas disponibles
        </h3>

        <p className="mt-2 text-sm text-[#7c8075]">
          Todavía no encontramos películas para mostrar.
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        grid grid-cols-2 gap-4
        sm:grid-cols-3
        md:grid-cols-4
        lg:grid-cols-5
        xl:grid-cols-6
      "
    >
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onClick={onMovieClick}
        />
      ))}
    </div>
  );
}
