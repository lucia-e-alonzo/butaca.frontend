import { supabase } from "./supabase";
import type { HistoryEntry, HistoryResponse } from "@/types/history";

const API_URL = import.meta.env.VITE_API_URL;

export type HistoryPeriod = "7d" | "30d";

async function getToken(): Promise<string> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error("No se pudo obtener la sesión.");
  const token = data.session?.access_token;
  if (!token) throw new Error("Debes iniciar sesión para consultar tu historial.");
  return token;
}

function baseUrl(): string {
  if (!API_URL) throw new Error("No se configuró VITE_API_URL.");
  return API_URL.replace(/\/$/, "");
}

/* ------------------------------------------------------------------ */
/* GET /api/v1/emotions/history?period=7d|30d                          */
/* ------------------------------------------------------------------ */

export async function getHistory(period: HistoryPeriod = "30d"): Promise<HistoryEntry[]> {
  const token = await getToken();
  const url = `${baseUrl()}/api/v1/emotions/history?period=${period}`;

  let response: Response;
  try {
    response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  } catch {
    throw new Error("No se pudo conectar con el servicio de historial.");
  }

  if (!response.ok) {
    if (response.status === 401) throw new Error("Tu sesión ha expirado.");
    if (response.status === 404) return [];
    throw new Error(`Error del servidor: ${response.status}`);
  }

  const data = (await response.json()) as HistoryResponse | HistoryEntry[];
  return Array.isArray(data) ? data : data.results ?? [];
}

/* ------------------------------------------------------------------ */
/* POST /api/v1/emotions/detections                                    */
/* ------------------------------------------------------------------ */

export async function saveDetection(
  imageBase64: string,
  timeZone: string
): Promise<HistoryEntry> {
  const token = await getToken();
  const url = `${baseUrl()}/api/v1/emotions/detections`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: imageBase64, time_zone: timeZone }),
    });
  } catch {
    throw new Error("No se pudo conectar con el servicio de detección.");
  }

  if (!response.ok) {
    if (response.status === 401) throw new Error("Tu sesión ha expirado.");
    if (response.status === 403) throw new Error("Necesitas dar permiso de cámara primero.");
    if (response.status === 415) throw new Error("La imagen no es válida (JPEG o PNG).");
    if (response.status === 422) {
      const body = await response.json().catch(() => null);
      if (body && typeof body === "object" && "error" in body) throw new Error(String(body.error));
      throw new Error("No se pudo determinar la emoción.");
    }
    throw new Error(`Error del servidor: ${response.status}`);
  }

  return (await response.json()) as HistoryEntry;
}

/* ------------------------------------------------------------------ */
/* PUT /api/v1/emotions/history/:id/recommendations/:media_type/:tmdb_id */
/* ------------------------------------------------------------------ */

export interface RecommendationPayload {
  title: string;
  poster_path: string | null;
  overview: string | null;
  release_date: string | null;
  vote_average: number | null;
  genre_ids: number[];
}

export async function saveRecommendationForDay(
  historyId: string,
  mediaType: "movie" | "tv",
  tmdbId: number,
  data: RecommendationPayload
): Promise<void> {
  const token = await getToken();
  const url = `${baseUrl()}/api/v1/emotions/history/${historyId}/recommendations/${mediaType}/${tmdbId}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch {
    throw new Error("No se pudo conectar con el servicio de historial.");
  }

  if (!response.ok) {
    if (response.status === 401) throw new Error("Tu sesión ha expirado.");
    throw new Error(`Error al guardar la recomendación: ${response.status}`);
  }
}

/* ------------------------------------------------------------------ */
/* Consentimiento persistente (camera_consents)                        */
/* ------------------------------------------------------------------ */

const CONSENT_POLICY_VERSION = "1.0";

export async function grantCameraConsent(): Promise<void> {
  const token = await getToken();
  const url = `${baseUrl()}/api/v1/emotions/consent`;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ policy_version: CONSENT_POLICY_VERSION }),
  });
  if (!response.ok) throw new Error(`Error al guardar consentimiento: ${response.status}`);
}

export async function getCameraConsent(): Promise<boolean> {
  const token = await getToken();
  const url = `${baseUrl()}/api/v1/emotions/consent`;
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) return false;
  const data = (await response.json()) as { granted?: boolean };
  return data.granted === true;
}

/** Revoca el consentimiento persistente (DELETE /consent). */
export async function revokeCameraConsent(): Promise<void> {
  const token = await getToken();
  const url = `${baseUrl()}/api/v1/emotions/consent`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`Error al revocar consentimiento: ${response.status}`);
}