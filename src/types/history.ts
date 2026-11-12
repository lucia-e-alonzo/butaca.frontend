export type Emotion =
  | "happy"
  | "sad"
  | "angry"
  | "fearful"
  | "disgusted"
  | "surprised";

/** Recomendación guardada por el back (dentro de un HistoryEntry). */
export interface SavedRecommendation {
  tmdb_id: number;
  media_type: "movie" | "tv";
  title: string;
  poster_path: string | null;
  overview: string | null;
  release_date: string | null;
  vote_average: number | null;
  genre_ids: number[];
  saved_at: string;
}

/** Un día del historial, tal como lo devuelve GET /api/v1/emotions/history. */
export interface HistoryEntry {
  id: string;
  date: string; // "YYYY-MM-DD"
  mood: string; // "HAPPY" | "SAD" | "ANGRY" | "FEAR" | "DISGUSTED" | "SURPRISED" | "CALM"
  name: string; // "Felicidad", "Tristeza", ...
  confidence: number;
  scores: { mood: string; confidence: number }[];
  detected_at: string;
  recommendations: SavedRecommendation[];
}

/** Respuesta de GET /api/v1/emotions/history. */
export interface HistoryResponse {
  results: HistoryEntry[];
}