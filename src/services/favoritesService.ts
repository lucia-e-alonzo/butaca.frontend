
import type { Movie } from "./movieService";

const FAVORITES_KEY = "butaca_favorites";
export const FAVORITES_CHANGED_EVENT = "butaca:favorites-changed";

// Obtener todos los favoritos guardados.
export function getFavorites(): Movie[] {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);

    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) return [];

    return parsed as Movie[];
  } catch {
    return [];
  }
}

// Comprobar si una película es favorita.
export function isFavorite(movieId: Movie["id"]): boolean {
  return getFavorites().some(
    (movie) => String(movie.id) === String(movieId)
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

// Agregar una película a favoritos.
export function addFavorite(movie: Movie): void {
  const favorites = getFavorites();

  if (isFavorite(movie.id)) return;

  saveFavorites([...favorites, movie]);
}

// Eliminar una película de favoritos.
export function removeFavorite(
  movieId: Movie["id"]
): void {
  const favorites = getFavorites();

  const updatedFavorites = favorites.filter(
    (movie) => String(movie.id) !== String(movieId)
  );

  saveFavorites(updatedFavorites);
}

// Agregar o eliminar una película.
export function toggleFavorite(movie: Movie): boolean {
  if (isFavorite(movie.id)) {
    removeFavorite(movie.id);
    return false;
  }

  addFavorite(movie);
  return true;
}
