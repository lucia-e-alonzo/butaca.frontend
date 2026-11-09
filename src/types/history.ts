export type Emotion =
  | "happy"
  | "sad"
  | "angry"
  | "fearful"
  | "disgusted"
  | "surprised"


export interface EmotionRecord {
  id: string
  emotion: Emotion
  recordedAt: string
  recommendedMovie: string | null
}


export interface HistoryDay {
  date: string
  records: EmotionRecord[]
  firstEmotion: Emotion | null
}
