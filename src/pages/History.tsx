
import { useMemo, useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Activity,
} from "lucide-react"

import { PageHeader } from "@/components/common/PageHeader"
import { Button } from "@/components/ui/button"
import { EmotionHeatmap } from "@/components/history/EmotionHeatmap"
import { EmotionLegend } from "@/components/history/EmotionLegend"
import { DayDetail } from "@/components/history/DayDetail"
import { getMockHistory } from "@/data/mockHistory"

export default function History() {
  const [year, setYear] = useState(2026)
  const [selectedDate, setSelectedDate] = useState<string | null>(
    "2026-01-01"
  )

  const days = useMemo(() => getMockHistory(year), [year])

  const selectedDay =
    days.find((day) => day.date === selectedDate) ?? null

  const recordedDays = days.filter(
    (day) => day.records.length > 0
  ).length

  const totalRecords = days.reduce(
    (total, day) => total + day.records.length,
    0
  )

  function changeYear(direction: number) {
    const nextYear = year + direction
    const nextDays = getMockHistory(nextYear)

    setYear(nextYear)
    setSelectedDate(
      nextDays.find((day) => day.records.length > 0)?.date ?? null
    )
  }

  return (
    <main className="min-h-screen bg-background px-5 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Encabezado principal */}
        <PageHeader
          eyebrow="Tu recorrido emocional"
          title="Mi historial"
          description="Explora tus emociones y descubre cómo ha sido tu recorrido durante el año."
        />

        {/* Estadísticas anuales */}
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="size-4" />
              <span className="text-sm">Días registrados</span>
            </div>

            <p className="mt-3 text-3xl font-black text-foreground tabular-nums">
              {recordedDays}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Días con al menos una emoción registrada
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Activity className="size-4" />
              <span className="text-sm">Registros totales</span>
            </div>

            <p className="mt-3 text-3xl font-black text-foreground tabular-nums">
              {totalRecords}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Emociones registradas durante el año
            </p>
          </div>
        </section>

        {/* Historial anual y heatmap */}
        <section className="w-full space-y-5 rounded-xl border border-border bg-card p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold tracking-widest text-accent uppercase">
                Historial anual
              </p>

              <h2 className="text-lg font-bold text-foreground">
                Tu año en emociones
              </h2>

              <p className="text-sm text-muted-foreground">
                Cada cuadro representa un día. Su color indica la primera emoción registrada.
              </p>
            </div>

            {/* Selector de año */}
            <div className="flex shrink-0 items-center gap-3">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => changeYear(-1)}
                aria-label="Año anterior"
              >
                <ChevronLeft />
              </Button>

              <span className="min-w-16 text-center text-lg font-bold tabular-nums">
                {year}
              </span>

              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => changeYear(1)}
                aria-label="Año siguiente"
              >
                <ChevronRight />
              </Button>
            </div>
          </div>

          {/* Calendario de emociones */}
          <EmotionHeatmap
            year={year}
            days={days}
            selectedDate={selectedDate}
            onSelectDay={setSelectedDate}
          />

          {/* Leyenda de emociones */}
          <div className="border-t border-border pt-4">
            <EmotionLegend />
          </div>
        </section>

        {/* Detalle del día seleccionado */}
        <DayDetail day={selectedDay} />
      </div>
    </main>
  )
}
