
import type { Emotion, EmotionRecord, HistoryDay } from "@/types/history"
import { getFirstEmotion } from "@/lib/emotions"

const emotions: Emotion[] = [
  "happy",
  "sad",
  "angry",
  "fearful",
  "disgusted",
  "surprised",
]

const movies = [
  "Interestelar",
  "La vida es bella",
  "El viaje de Chihiro",
  "Intensamente",
  "El gran hotel Budapest",
  "En busca de la felicidad",
]

function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export function getMockHistory(year: number): HistoryDay[] {
  const start = new Date(year, 0, 1)
  const end = new Date(year + 1, 0, 1)

  const days: HistoryDay[] = []

  for (
    let current = new Date(start);
    current < end;
    current.setDate(current.getDate() + 1)
  ) {
    const dayIndex = Math.floor(
      (current.getTime() - start.getTime()) / 86400000
    )

    const shouldHaveRecords =
      dayIndex % 5 === 0 || dayIndex % 11 === 0

    const date = formatDate(current)
    const records: EmotionRecord[] = []

    if (shouldHaveRecords) {
      const firstIndex = (dayIndex * 7 + 2) % emotions.length

      records.push({
        id: `${date}-1`,
        emotion: emotions[firstIndex],
        recordedAt: `${date}T08:15:00-06:00`,
        recommendedMovie: movies[firstIndex],
      })

      if (dayIndex % 2 === 0) {
        records.push({
          id: `${date}-2`,
          emotion: emotions[(firstIndex + 2) % emotions.length],
          recordedAt: `${date}T12:30:00-06:00`,
          recommendedMovie:
            movies[(firstIndex + 2) % movies.length],
        })
      }

      if (dayIndex % 3 === 0) {
        records.push({
          id: `${date}-3`,
          emotion: emotions[(firstIndex + 4) % emotions.length],
          recordedAt: `${date}T18:45:00-06:00`,
          recommendedMovie:
            movies[(firstIndex + 4) % movies.length],
        })
      }
    }

    days.push({
      date,
      records,
      firstEmotion: getFirstEmotion(records),
    })
  }

  return days
}
