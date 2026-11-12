import { useCallback, useState } from "react";
import {
  analyzeEmotion,
  blobToBase64,
  type AnalyzeResponse,
} from "@/services/emotionService";
import {
  saveDetection,
  grantCameraConsent,
  getCameraConsent,
} from "@/services/historyService";

export type DetectionStep =
  | "idle"
  | "analyzing"
  | "confirming"
  | "saving"
  | "done"
  | "error";

export function useEmotionDetection() {
  const [step, setStep] = useState<DetectionStep>("idle");
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [pendingBlob, setPendingBlob] = useState<Blob | null>(null);

  const ensureConsent = useCallback(async () => {
    const granted = await getCameraConsent();
    if (!granted) {
      await grantCameraConsent();
    }
  }, []);

  const analyze = useCallback(async (blob: Blob) => {
    setStep("analyzing");
    setError(null);
    try {
      const result = await analyzeEmotion(blob);
      setAnalysis(result);
      setPendingBlob(blob);
      setStep("confirming");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo analizar la imagen.");
      setStep("error");
    }
  }, []);

  const saveWithEmotion = useCallback(
    async (emotion: string, timeZone: string) => {
      if (!pendingBlob) {
        setError("No hay imagen pendiente.");
        setStep("error");
        return null;
      }
      setStep("saving");
      try {
        await ensureConsent();
        const base64 = await blobToBase64(pendingBlob);
        const record = await saveDetection(base64, timeZone);
        setSavedId(record.id);
        setStep("done");
        return record.id;
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "No se pudo guardar la detección."
        );
        setStep("error");
        return null;
      }
    },
    [pendingBlob, ensureConsent]
  );

  const reset = useCallback(() => {
    setStep("idle");
    setError(null);
    setAnalysis(null);
    setSavedId(null);
    setPendingBlob(null);
  }, []);

  return {
    step,
    error,
    analysis,
    savedId,
    analyze,
    saveWithEmotion,
    reset,
  };
}