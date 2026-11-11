
import { useCallback, useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

import MovieGrid from "@/components/movies/MovieGrid";
import MovieDetails from "@/components/movies/MovieDetails";

import type { Movie } from "@/services/movieService";

import {
  FAVORITES_CHANGED_EVENT,
  getFavorites,
} from "@/services/favoritesService";

export default function Favorites() {
  const [favorites, setFavorites] = useState<Movie[]>(
    () => getFavorites()
  );

  const [selectedMovie, setSelectedMovie] =
    useState<Movie | null>(null);

  // Actualizar la lista de favoritos.
  const refreshFavorites = useCallback(() => {
    setFavorites(getFavorites());
  }, []);

  useEffect(() => {
    // Cambios realizados en esta misma pestaña.
    window.addEventListener(
      FAVORITES_CHANGED_EVENT,
      refreshFavorites
    );

    // Cambios realizados desde otra pestaña.
    window.addEventListener(
      "storage",
      refreshFavorites
    );

    // Actualizar al regresar a la página.
    window.addEventListener(
      "focus",
      refreshFavorites
    );

    return () => {
      window.removeEventListener(
        FAVORITES_CHANGED_EVENT,
        refreshFavorites
      );

      window.removeEventListener(
        "storage",
        refreshFavorites
      );

      window.removeEventListener(
        "focus",
        refreshFavorites
      );
    };
  }, [refreshFavorites]);

  return (
    <main className="space-y-8 p-6 md:p-10">
      {/* Encabezado */}
      <section className="rounded-3xl border border-[#1f5656] bg-gradient-to-r from-[#0e2520] to-[#0f0b09] p-8">
        <div className="flex items-center gap-3">
          <Heart
            size={32}
            className="text-[#dd6122]"
            fill="#dd6122"
          />

          <h1 className="text-3xl font-extrabold text-white">
            Mis favoritos
          </h1>
        </div>

        <p className="mt-4 text-[#c5c5c5]">
          Guarda las historias que más te gustan
          y encuéntralas aquí cuando quieras.
        </p>

        <p className="mt-3 text-sm text-[#dd6122]">
  {favorites.length}{" "}
  {favorites.length === 1
    ? "contenido guardado"
    : "contenidos guardados"}
</p>
</section>

      {/* Lista vacía */}
      {favorites.length === 0 ? (
        <section className="rounded-xl border border-[#1f5656] bg-[#0e2520] p-10 text-center">
          <Heart
            size={42}
            className="mx-auto mb-4 text-[#dd6122]"
          />

          <h2 className="text-xl font-bold text-white">
            Todavía no tienes favoritos
          </h2>

          <p className="mt-3 text-[#c5c5c5]">
            Explora nuestro catálogo y guarda
            las películas que más te interesen.
          </p>

          <Link
            to="/"
            className="mt-6 inline-block rounded-lg bg-[#dd6122] px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
          >
            Explorar películas
          </Link>
        </section>
      ) : (
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-white">
            Tu colección
          </h2>

          <MovieGrid
            movies={favorites}
            onMovieClick={setSelectedMovie}
          />
        </section>
      )}

      {/* Detalles de película */}
      {selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </main>
  );
}
