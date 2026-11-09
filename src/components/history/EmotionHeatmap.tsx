
import { EMOTIONS } from "@/lib/emotions"
import type { HistoryDay } from "@/types/history"

interface EmotionHeatmapProps {
  year: number
  days: HistoryDay[]
  selectedDate: string | null
  onSelectDay: (date: string) => void
}

const weekdays = [
  "Dom",
  "Lun",
  "Mar",
  "Mié",
  "Jue",
  "Vie",
  "Sáb",
]

const months = [
  "Ene", "Feb", "Mar", "Abr",
  "May", "Jun", "Jul", "Ago",
  "Sep", "Oct", "Nov", "Dic",
]

export function EmotionHeatmap({
  year,
  days,
  selectedDate,
  onSelectDay,
}: EmotionHeatmapProps) {
  // Domingo = 0, lunes = 1, ..., sábado = 6.
  const firstDay = new Date(year, 0, 1)
  const leadingDays = firstDay.getDay()

  const totalWeeks = Math.ceil((leadingDays + days.length) / 7)
  const dayMap = new Map(days.map((day) => [day.date, day]))

  const monthPositions = months.map((month, index) => {
    const date = new Date(year, index, 1)
    const dayOffset = Math.floor(
      (date.getTime() - firstDay.getTime()) / 86400000
    )
    const week = Math.floor((leadingDays + dayOffset) / 7)

    return { month, week }
  })

  return (
    <div className="w-full overflow-x-auto pb-3">
      <div
        className="grid min-w-[760px] w-full gap-x-1 gap-y-1"
        style={{
          gridTemplateColumns: `2rem repeat(${totalWeeks}, minmax(0, 1fr))`,
          gridTemplateRows: "1.25rem repeat(7, auto)",
        }}
      >
        {/* Meses: eje horizontal */}
        {monthPositions.map(({ month, week }) => (
          <span
            key={month}
            className="whitespace-nowrap text-[10px] text-muted-foreground"
            style={{
              gridColumn: week + 2,
              gridRow: 1,
            }}
          >
            {month}
          </span>
        ))}

        {/* Días: eje vertical */}
        {weekdays.map((weekday, index) => (
          <span
            key={weekday}
            className="self-center text-[9px] text-muted-foreground"
            style={{
              gridColumn: 1,
              gridRow: index + 2,
            }}
          >
            {index % 2 === 0 ? weekday : ""}
          </span>
        ))}

        {/* Cada columna es una semana completa */}
        {days.map((day, index) => {
          const position = leadingDays + index
          const week = Math.floor(position / 7)
          const weekday = position % 7

          const dayInfo = dayMap.get(day.date)
          const emotion = dayInfo?.firstEmotion
          const emotionInfo = emotion ? EMOTIONS[emotion] : null
          const selected = selectedDate === day.date

          return (
            <button
              key={day.date}
              type="button"
              title={
                emotionInfo
                  ? `${day.date} · ${emotionInfo.label}`
                  : `${day.date} · Sin registros`
              }
              aria-label={
                emotionInfo
                  ? `${day.date}: ${emotionInfo.label}`
                  : `${day.date}: Sin registros`
              }
              aria-pressed={selected}
              onClick={() => onSelectDay(day.date)}
              className={`aspect-square w-full rounded-[3px] border transition-all hover:scale-125 ${
                selected
                  ? "z-10 ring-2 ring-accent ring-offset-2 ring-offset-background"
                  : "border-transparent"
              } ${
                emotion
                  ? ""
                  : "border-border/50 bg-muted/70 hover:bg-muted"
              }`}
              style={{
                gridColumn: week + 2,
                gridRow: weekday + 2,
                ...(emotionInfo
                  ? { backgroundColor: emotionInfo.color }
                  : {}),
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
