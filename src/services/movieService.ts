
export interface Movie {
  id: number | string;
  title: string;
  poster_path?: string | null;
  media_type?: string;
  overview?: string;
  release_date?: string;
  vote_average?: number;
}

// Películas de demostración.
// Se utilizarán hasta que el backend esté disponible.
const mockMovies: Movie[] = [
  {
    id: 157336,
    title: "Interstellar",
    poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    media_type: "movie",
    overview:
      "Un grupo de exploradores viaja por el espacio en busca de un nuevo hogar para la humanidad.",
    release_date: "2014-11-05",
    vote_average: 8.7,
  },
  {
    id: 693134,
    title: "Dune: Parte Dos",
    poster_path: "/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    media_type: "movie",
    overview:
      "Paul Atreides se une a los Fremen mientras enfrenta su destino en Arrakis.",
    release_date: "2024-02-27",
    vote_average: 8.1,
  },
  {
    id: 1022789,
    title: "Intensamente 2",
    poster_path: "/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
    media_type: "movie",
    overview:
      "Riley descubre nuevas emociones mientras atraviesa la adolescencia.",
    release_date: "2024-06-11",
    vote_average: 7.6,
  },
  {
    id: 438631,
    title: "Dune",
    poster_path: "/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    media_type: "movie",
    overview:
      "Un joven descubre su destino en un planeta desértico.",
    release_date: "2021-09-15",
    vote_average: 7.8,
  },
];

// Obtener películas para el catálogo de Inicio.
export async function getTrendingMovies(): Promise<Movie[]> {
  return [...mockMovies];
}

// Función preparada para consultar el backend.
// Se utilizará cuando nuestros compañeros
// confirmen los endpoints disponibles.
export async function getMovies(
  endpoint: string
): Promise<Movie[]> {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    throw new Error("No se configuró VITE_API_URL.");
  }

  const cleanUrl = apiUrl.replace(/\/$/, "");
  const cleanEndpoint = endpoint.replace(/^\//, "");

  const response = await fetch(
    `${cleanUrl}/${cleanEndpoint}`
  );

  if (!response.ok) {
    throw new Error(
      `Error al consultar películas: ${response.status}`
    );
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error(
      "El backend devolvió un formato inesperado."
    );
  }

  return data as Movie[];
}
