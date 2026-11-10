
import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Activity,
} from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { EmotionHeatmap } from "@/components/history/EmotionHeatmap";
import { EmotionLegend } from "@/components/history/EmotionLegend";
import { DayDetail } from "@/components/history/DayDetail";

import type { HistoryDay } from "@/types/history";

// Genera únicamente las fechas del calendario.
// No crea emociones ni registros ficticios.
function createEmptyCalendar(year: number): HistoryDay[] {
  const days: HistoryDay[] = [];

  const current = new Date(year, 0, 1);
  const end = new Date(year + 1, 0, 1);

  while (current < end) {
    const date = [
      current.getFullYear(),
      String(current.getMonth() + 1).padStart(2, "0"),
      String(current.getDate()).padStart(2, "0"),
    ].join("-");

    days.push({
      date,
      records: [],
      firstEmotion: null,
    });

    current.setDate(current.getDate() + 1);
  }

  return days;
}

export default function History() {
  const [year, setYear] = useState(
    () => new Date().getFullYear()
  );

  const [selectedDate, setSelectedDate] =
    useState<string | null>(null);

  const days = useMemo(
    () => createEmptyCalendar(year),
    [year]
  );

  const selectedDay =
    days.find((day) => day.date === selectedDate) ?? null;

  const recordedDays = days.filter(
    (day) => day.records.length > 0
  ).length;

  const totalRecords = days.reduce(
    (total, day) => total + day.records.length,
    0
  );

  function changeYear(direction: number) {
    setYear((previous) => previous + direction);
    setSelectedDate(null);
  }

  return (
    <main className="min-h-screen bg-background px-5 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Encabezado */}
        <PageHeader
          eyebrow="Tu recorrido emocional"
          title="Mi historial"
          description="Explora tus emociones y descubre cómo ha sido tu recorrido durante el año."
        />

        {/* Estado de la integración */}
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-bold text-foreground">
            Historial emocional pendiente de conexión
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            El backend todavía no proporciona un servicio
            disponible para consultar tus registros emocionales.
            El calendario se muestra sin datos de prueba.
          </p>
        </section>

        {/* Estadísticas */}
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="size-4" />
              <span className="text-sm">
                Días registrados
              </span>
            </div>

            <p className="mt-3 text-3xl font-black text-foreground">
              {recordedDays}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Sin datos disponibles del servicio
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Activity className="size-4" />
              <span className="text-sm">
                Registros totales
              </span>
            </div>

            <p className="mt-3 text-3xl font-black text-foreground">
              {totalRecords}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Sin datos disponibles del servicio
            </p>
          </div>
        </section>

        {/* Calendario */}
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
                Los días se colorearán cuando existan
                registros emocionales reales.
              </p>
            </div>

            {/* Navegación entre años */}
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

          <EmotionHeatmap
            year={year}
            days={days}
            selectedDate={selectedDate}
            onSelectDay={setSelectedDate}
          />

          <div className="border-t border-border pt-4">
            <EmotionLegend />
          </div>
        </section>

        {/* Detalles del día */}
        <DayDetail day={selectedDay} />
      </div>
    </main>
  );
}
