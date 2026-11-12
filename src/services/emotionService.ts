import { supabase } from "./supabase";

const API_URL = import.meta.env.VITE_API_URL;

export type EmotionCode =
  | "HAPPY"
  | "SAD"
  | "ANGRY"
  | "FEAR"
  | "DISGUSTED"
  | "SURPRISED"
  | "CALM";

export interface AnalyzeResponse {
  suggestedExpression: EmotionCode | null;
  confidence: number | null;
  confirmationRequired: true;
  faces: number;
  reason: string | null;
}

export async function analyzeEmotion(image: Blob): Promise<AnalyzeResponse> {
  if (!API_URL) {
    throw new Error("No se configuró VITE_API_URL.");
  }

  const { data, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw new Error("No se pudo obtener la sesión.");

  const token = data.session?.access_token;
  if (!token) throw new Error("Debes iniciar sesión para analizar tu ánimo.");

  if (image.size > 2 * 1024 * 1024) {
    throw new Error("La imagen no puede superar los 2 MiB.");
  }

  const formData = new FormData();
  formData.append("image", image, "capture.jpg");
  formData.append("consent", "true");

  const url = `${API_URL.replace(/\/$/, "")}/api/v1/emotions/analyze`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
  } catch {
    throw new Error("No se pudo conectar con el servicio de análisis.");
  }

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error("La solicitud de análisis no es válida.");
    }
    if (response.status === 401) {
      throw new Error("Tu sesión ha expirado. Inicia sesión nuevamente.");
    }
    if (response.status === 415) {
      throw new Error("El formato de la imagen no es compatible. Usa JPG o PNG.");
    }
    if (response.status === 422) {
      const body = await response.json().catch(() => null);
      if (body && typeof body === "object" && "error" in body) {
        throw new Error(String(body.error));
      }
      throw new Error("No pudimos detectar un rostro. Intenta de nuevo.");
    }
    if (response.status === 429) {
      throw new Error(
        "Has alcanzado el límite de análisis. Espera un momento antes de volver a intentar."
      );
    }
    if (response.status === 502) {
      throw new Error("El servicio de análisis no está disponible.");
    }
    if (response.status === 503) {
      throw new Error("El servicio de análisis se está configurando.");
    }
    if (response.status === 504) {
      throw new Error("El análisis tardó demasiado. Intenta de nuevo.");
    }
    throw new Error(`Error del servidor: ${response.status}`);
  }

  return (await response.json()) as AnalyzeResponse;
}

/** Convierte un Blob a base64 sin el prefijo "data:image/jpeg;base64,". */
export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result !== "string") return reject(new Error("No se pudo leer la imagen."));
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(new Error("No se pudo leer la imagen."));
    reader.readAsDataURL(blob);
  });
}