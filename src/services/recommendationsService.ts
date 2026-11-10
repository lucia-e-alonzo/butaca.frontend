
import type { Movie } from "./movieService";

// Datos temporales hasta que esté disponible el backend.
const mockRecommendations: Movie[] = [
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
];

// Obtener recomendaciones.
// Por ahora utiliza datos de demostración.
export async function getRecommendations(): Promise<Movie[]> {
  return [...mockRecommendations];
}
