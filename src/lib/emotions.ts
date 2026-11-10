
import type { Emotion, EmotionRecord } from "@/types/history"

export const EMOTIONS: Record<
  Emotion,
  { label: string; color: string }
> = {
  happy: {
    label: "Felicidad",
    color: "#E5B84B",
  },
  sad: {
    label: "Tristeza",
    color: "#568CCB",
  },
  angry: {
    label: "Enojo",
    color: "#E45B48",
  },
  fearful: {
    label: "Miedo",
    color: "#9A78C5",
  },
  disgusted: {
    label: "Asco",
    color: "#79A66A",
  },
  surprised: {
    label: "Sorpresa",
    color: "#DD873F",
  },
}

export function getFirstEmotion(
  records: EmotionRecord[]
): Emotion | null {
  if (records.length === 0) return null

  return [...records]
    .sort(
      (a, b) =>
        new Date(a.recordedAt).getTime() -
        new Date(b.recordedAt).getTime()
    )[0].emotion
}
