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

export default function FavoriteButton({ movie, onToggle }: FavoriteButtonProps) {
  const [favorite, setFavorite] = useState(() => isFavorite(movie));

  useEffect(() => {
    function updateFavorite() {
      setFavorite(isFavorite(movie));
    }

    updateFavorite();

    window.addEventListener(FAVORITES_CHANGED_EVENT, updateFavorite);
    window.addEventListener("storage", updateFavorite);

    return () => {
      window.removeEventListener(FAVORITES_CHANGED_EVENT, updateFavorite);
      window.removeEventListener("storage", updateFavorite);
    };
  }, [movie.id, movie.media_type]);

  function handleToggle(event: React.MouseEvent<HTMLButtonElement>) {
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
      title={favorite ? "Quitar de favoritos" : "Agregar a favoritos"}
      className={`flex size-9 items-center justify-center rounded-full border backdrop-blur-sm transition-all duration-200 hover:scale-110 sm:size-10 ${
        favorite
          ? "border-accent/60 bg-accent text-accent-foreground shadow-[0_0_0_1px_hsl(var(--accent)/0.4),0_8px_24px_-8px_hsl(var(--accent)/0.6)]"
          : "border-border/60 bg-background/70 text-foreground/80 hover:border-accent/60 hover:text-accent"
      }`}
    >
      <Heart
        size={18}
        className="sm:size-5"
        fill={favorite ? "currentColor" : "none"}
      />
    </button>
  );
}