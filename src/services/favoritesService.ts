
import type { Movie } from "./movieService";

const FAVORITES_KEY = "butaca_favorites";

export const FAVORITES_CHANGED_EVENT =
  "butaca:favorites-changed";

type MediaIdentity = Pick<Movie, "id" | "media_type">;

function sameMedia(
  first: MediaIdentity,
  second: MediaIdentity
): boolean {
  return (
    String(first.id) === String(second.id) &&
    first.media_type === second.media_type
  );
}

// Obtener los favoritos guardados.
export function getFavorites(): Movie[] {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);

    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is Movie =>
        typeof item === "object" &&
        item !== null &&
        typeof item.id === "number" &&
        (item.media_type === "movie" ||
          item.media_type === "tv") &&
        typeof item.title === "string"
    );
  } catch {
    return [];
  }
}

// Comprobar si una película o serie es favorita.
export function isFavorite(
  media: MediaIdentity
): boolean {
  return getFavorites().some((item) =>
    sameMedia(item, media)
  );
}

// Guardar y notificar los cambios.
function saveFavorites(movies: Movie[]): void {
  localStorage.setItem(
    FAVORITES_KEY,
    JSON.stringify(movies)
  );

  window.dispatchEvent(
    new Event(FAVORITES_CHANGED_EVENT)
  );
}

// Agregar una película o serie.
export function addFavorite(movie: Movie): void {
  const favorites = getFavorites();

  if (favorites.some((item) => sameMedia(item, movie))) {
    return;
  }

  saveFavorites([...favorites, movie]);
}

// Eliminar una película o serie.
export function removeFavorite(
  media: MediaIdentity
): void {
  const updatedFavorites = getFavorites().filter(
    (item) => !sameMedia(item, media)
  );

  saveFavorites(updatedFavorites);
}

// Alternar el estado de favorito.
export function toggleFavorite(movie: Movie): boolean {
  if (isFavorite(movie)) {
    removeFavorite(movie);
    return false;
  }

  addFavorite(movie);
  return true;
}
