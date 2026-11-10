
import { Clock3, CalendarDays, Film } from "lucide-react"
import { EMOTIONS } from "@/lib/emotions"
import type { HistoryDay } from "@/types/history"
import { EmptyState } from "@/components/common/EmptyState"
import { Badge } from "@/components/ui/badge"

interface DayDetailProps {
  day: HistoryDay | null
}

export function DayDetail({ day }: DayDetailProps) {
  if (!day) {
    return (
      <EmptyState
        title="Selecciona un día"
        description="Elige una fecha en el calendario para consultar tu historial emocional."
        icon={<CalendarDays className="size-7" />}
      />
    )
  }

  const formattedDate = new Date(
    `${day.date}T12:00:00`
  ).toLocaleDateString("es-GT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const records = [...day.records].sort(
    (a, b) =>
      new Date(a.recordedAt).getTime() -
      new Date(b.recordedAt).getTime()
  )

  return (
    <section className="space-y-5 rounded-xl border border-border bg-card p-5">
      <div className="space-y-1">
        <p className="text-xs font-semibold tracking-widest text-accent uppercase">
          Detalle del día
        </p>

        <h2 className="text-xl font-bold capitalize text-foreground">
          {formattedDate}
        </h2>

        <p className="text-sm text-muted-foreground">
          {records.length} {records.length === 1 ? "registro" : "registros"}
        </p>
      </div>

      {records.length === 0 ? (
        <EmptyState
          title="Sin registros"
          description="No hay emociones registradas para este día."
          icon={<CalendarDays className="size-7" />}
        />
      ) : (
        <div className="space-y-3">
          {records.map((record, index) => {
            const emotion = EMOTIONS[record.emotion]

            const time = new Date(
              record.recordedAt
            ).toLocaleTimeString("es-GT", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })

            return (
              <div
                key={record.id}
                className="flex items-start gap-3 rounded-lg border border-border/70 bg-background/50 p-3"
              >
                <span
                  className="mt-1 size-3 shrink-0 rounded-full"
                  style={{ backgroundColor: emotion.color }}
                />

                <div className="min-w-0 flex-1 space-y-2">
                  <div>
                    <p className="font-semibold text-foreground">
                      {emotion.label}
                    </p>

                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock3 className="size-3 shrink-0" />
                      {time}
                    </p>
                  </div>

                  {record.recommendedMovie && (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Film className="mt-0.5 size-4 shrink-0 text-accent" />
                      <p>
                        <span className="font-medium text-foreground">
                          Película recomendada:
                        </span>{" "}
                        {record.recommendedMovie}
                      </p>
                    </div>
                  )}

                  {index === 0 && (
                    <div>
                      <Badge variant="outline">
                        Primera del día
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
