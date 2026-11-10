
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

import type { Movie } from "@/services/movieService";

import {
  FAVORITES_CHANGED_EVENT,
  isFavorite,
  toggleFavorite,
} from "@/services/favoritesService";

interface FavoriteButtonProps {
  movie: Movie;
  onToggle?: (isFavorite: boolean) => void;
}

export default function FavoriteButton({
  movie,
  onToggle,
}: FavoriteButtonProps) {
  const [favorite, setFavorite] = useState(
    () => isFavorite(movie.id)
  );

  // Mantener el corazón sincronizado con los favoritos.
  useEffect(() => {
    function updateFavorite() {
      setFavorite(isFavorite(movie.id));
    }

    updateFavorite();

    window.addEventListener(
      FAVORITES_CHANGED_EVENT,
      updateFavorite
    );

    window.addEventListener(
      "storage",
      updateFavorite
    );

    return () => {
      window.removeEventListener(
        FAVORITES_CHANGED_EVENT,
        updateFavorite
      );

      window.removeEventListener(
        "storage",
        updateFavorite
      );
    };
  }, [movie.id]);

  function handleToggle(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.preventDefault();
    event.stopPropagation();

    const updatedFavorite = toggleFavorite(movie);

    setFavorite(updatedFavorite);

    onToggle?.(updatedFavorite);
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={
        favorite
          ? `Quitar ${movie.title} de favoritos`
          : `Agregar ${movie.title} a favoritos`
      }
      aria-pressed={favorite}
      title={
        favorite
          ? "Quitar de favoritos"
          : "Agregar a favoritos"
      }
      className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 hover:scale-110 ${
        favorite
          ? "border-[#dd6122] bg-[#dd6122] text-white"
          : "border-[#1f5656] bg-[#0e2520] text-white hover:border-[#dd6122]"
      }`}
    >
      <Heart
        size={20}
        fill={favorite ? "currentColor" : "none"}
      />
    </button>
  );
}
