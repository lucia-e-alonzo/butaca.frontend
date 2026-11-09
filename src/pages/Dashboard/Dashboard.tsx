
import { useMemo, useState } from "react"
import {
  Activity,
  Clapperboard,
  Heart,
  Film,
  TrendingUp,
  Smile,
} from "lucide-react"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

import { PageHeader } from "@/components/common/PageHeader"
import { Button } from "@/components/ui/button"
import { EMOTIONS } from "@/lib/emotions"
import { getMockHistory } from "@/data/mockHistory"
import type { Emotion } from "@/types/history"

type Period = "7d" | "30d" | "year"

const PERIODS: { value: Period; label: string }[] = [
  { value: "7d", label: "7 días" },
  { value: "30d", label: "30 días" },
  { value: "year", label: "Este año" },
]

// Datos simulados de favoritos.
// Se reemplazarán cuando esté disponible el endpoint correspondiente.
const MOCK_FAVORITE_OFFSETS = [
  2, 4, 7, 11, 15, 18, 23, 29,
  34, 40, 46, 52, 60, 75, 90, 105,
  120, 145, 170, 195, 220, 245, 280, 320,
]

type TrendPoint = {
  label: string
} & Partial<Record<Emotion, number>>

interface RecommendationItem {
  id: string
  title: string
  emotion: Emotion
  date: string
  recordedAt: string
}

function buildTrendData(
  days: ReturnType<typeof getMockHistory>,
  period: Period
): TrendPoint[] {
  const buckets = new Map<string, TrendPoint>()

  days.forEach((day, index) => {
    const date = new Date(`${day.date}T12:00:00`)

    let label: string

    if (period === "year") {
      label = date.toLocaleDateString("es-GT", {
        month: "short",
      })
    } else if (period === "30d") {
      label = `Semana ${Math.floor(index / 7) + 1}`
    } else {
      label = date.toLocaleDateString("es-GT", {
        weekday: "short",
      })
    }

    if (!buckets.has(label)) {
      buckets.set(label, { label })
    }

    const bucket = buckets.get(label)!

    day.records.forEach((record) => {
      bucket[record.emotion] =
        (bucket[record.emotion] ?? 0) + 1
    })
  })

  return Array.from(buckets.values())
}

function formatDate(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString(
    "es-GT",
    {
      day: "numeric",
      month: "short",
    }
  )
}

export default function Dashboard() {
  const [period, setPeriod] = useState<Period>("30d")

  const currentDate = new Date()
  const currentYear = new Date().getFullYear()

    const allDays = useMemo(
    () => getMockHistory(currentYear),
    [currentYear]
    )

    const filteredDays = useMemo(() => {
    const currentDate = new Date()
    const end = new Date(currentDate)
    end.setHours(23, 59, 59, 999)

    const start = new Date(currentDate)
    start.setHours(0, 0, 0, 0)

    if (period === "7d") {
      start.setDate(start.getDate() - 6)
    } else if (period === "30d") {
      start.setDate(start.getDate() - 29)
    } else {
      start.setMonth(0, 1)
    }

    return allDays.filter((day) => {
      const date = new Date(`${day.date}T12:00:00`)
      return date >= start && date <= end
    })
  }, [allDays, period])

  const records = useMemo(
    () => filteredDays.flatMap((day) =>
      day.records.map((record) => ({
        ...record,
        date: day.date,
      }))
    ),
    [filteredDays]
  )

  const emotionCounts = useMemo(() => {
    const counts: Record<Emotion, number> = {
      happy: 0,
      sad: 0,
      angry: 0,
      fearful: 0,
      disgusted: 0,
      surprised: 0,
    }

    records.forEach((record) => {
      counts[record.emotion] += 1
    })

    return counts
  }, [records])

  const dominantEmotion = useMemo(() => {
    const entries = Object.entries(emotionCounts) as [
      Emotion,
      number,
    ][]

    return entries.reduce<Emotion | null>(
      (dominant, [emotion, count]) => {
        if (count === 0) return dominant
        if (!dominant || count > emotionCounts[dominant]) {
          return emotion
        }
        return dominant
      },
      null
    )
  }, [emotionCounts])

  const emotionData = useMemo(
    () =>
      (Object.keys(EMOTIONS) as Emotion[])
        .map((emotion) => ({
          name: EMOTIONS[emotion].label,
          value: emotionCounts[emotion],
          color: EMOTIONS[emotion].color,
        }))
        .filter((item) => item.value > 0),
    [emotionCounts]
  )

  const trendData = useMemo(
    () => buildTrendData(filteredDays, period),
    [filteredDays, period]
  )

  const recentRecommendations = useMemo(() => {
    return [...records]
      .filter((record) => record.recommendedMovie)
      .sort(
        (a, b) =>
          new Date(b.recordedAt).getTime() -
          new Date(a.recordedAt).getTime()
      )
      .slice(0, 5)
      .map((record) => ({
        id: record.id,
        title: record.recommendedMovie!,
        emotion: record.emotion,
        date: record.date,
        recordedAt: record.recordedAt,
      })) satisfies RecommendationItem[]
  }, [records])

  const favoriteCount = MOCK_FAVORITE_OFFSETS.filter(
    (offset) => offset < filteredDays.length
  ).length

  return (
    <main className="min-h-screen bg-background px-5 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-8">
        <PageHeader
          eyebrow="Tu experiencia en Butaca"
          title="Mi Butaca Recap"
          description="Un vistazo a tu recorrido emocional y cinematográfico."
        />

        {/* Selector del período */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Activity className="size-4 text-primary" />
            Resumen de tu actividad
          </div>

          <div className="flex flex-wrap gap-2">
            {PERIODS.map((item) => (
              <Button
                key={item.value}
                size="sm"
                variant={
                  period === item.value ? "default" : "outline"
                }
                onClick={() => setPeriod(item.value)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Dos mitades del recap */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* MUNDO EMOCIONAL */}
          <section className="min-w-0 space-y-5 rounded-xl border border-border bg-card p-5 sm:p-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Smile className="size-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">
                  Tu mundo emocional
                </h2>
              </div>

              <p className="text-sm text-muted-foreground">
                Conoce cómo se han distribuido tus emociones.
              </p>
            </div>

            {/* Estadísticas emocionales */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border bg-background/50 p-4">
                <p className="text-xs text-muted-foreground">
                  Registros emocionales
                </p>

                <p className="mt-2 text-3xl font-black tabular-nums text-foreground">
                  {records.length}
                </p>
              </div>

              <div className="rounded-lg border border-border bg-background/50 p-4">
                <p className="text-xs text-muted-foreground">
                  Emoción predominante
                </p>

                <p className="mt-2 text-xl font-bold text-foreground">
                  {dominantEmotion
                    ? EMOTIONS[dominantEmotion].label
                    : "Sin registros"}
                </p>

                {dominantEmotion && (
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className="size-2.5 rounded-full"
                      style={{
                        backgroundColor:
                          EMOTIONS[dominantEmotion].color,
                      }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {emotionCounts[dominantEmotion]} registros
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Distribución de emociones */}
            <div className="space-y-3 rounded-lg border border-border bg-background/50 p-4">
              <div>
                <h3 className="font-bold text-foreground">
                  Distribución de emociones
                </h3>
                <p className="text-xs text-muted-foreground">
                  Frecuencia de cada emoción en el período.
                </p>
              </div>

              {emotionData.length > 0 ? (
                <>
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={emotionData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={85}
                          paddingAngle={3}
                          stroke="none"
                        >
                          {emotionData.map((item) => (
                            <Cell
                              key={item.name}
                              fill={item.color}
                            />
                          ))}
                        </Pie>

                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0e2520",
                            border: "1px solid #1f5656",
                            borderRadius: "10px",
                            color: "#ffffff",
                          }}
                          formatter={(value) => [
                            `${value} registros`,
                            "Cantidad",
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {(Object.keys(EMOTIONS) as Emotion[]).map(
                      (emotion) => (
                        <div
                          key={emotion}
                          className="flex items-center gap-2"
                        >
                          <span
                            className="size-2.5 shrink-0 rounded-full"
                            style={{
                              backgroundColor:
                                EMOTIONS[emotion].color,
                            }}
                          />

                          <span className="text-xs text-muted-foreground">
                            {EMOTIONS[emotion].label}
                          </span>

                          <span className="ml-auto text-xs font-semibold tabular-nums text-foreground">
                            {emotionCounts[emotion]}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </>
              ) : (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  Todavía no hay registros para este período.
                </p>
              )}
            </div>

            {/* Evolución emocional */}
            <div className="space-y-3 rounded-lg border border-border bg-background/50 p-4">
              <div>
                <h3 className="font-bold text-foreground">
                  Evolución emocional
                </h3>
                <p className="text-xs text-muted-foreground">
                  Cómo han variado tus emociones durante el período.
                </p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={trendData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -20,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#6d523e"
                      opacity={0.3}
                    />

                    <XAxis
                      dataKey="label"
                      tick={{ fill: "#7c8075", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: "#7c8075", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0e2520",
                        border: "1px solid #1f5656",
                        borderRadius: "10px",
                        color: "#ffffff",
                      }}
                    />

                    {(Object.keys(EMOTIONS) as Emotion[]).map(
                      (emotion) => (
                        <Line
                          key={emotion}
                          type="monotone"
                          dataKey={emotion}
                          name={EMOTIONS[emotion].label}
                          stroke={EMOTIONS[emotion].color}
                          strokeWidth={2}
                          dot={false}
                          connectNulls
                        />
                      )
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* RECORRIDO CINEMATOGRÁFICO */}
          <section className="min-w-0 space-y-5 rounded-xl border border-border bg-card p-5 sm:p-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Clapperboard className="size-5 text-accent" />
                <h2 className="text-xl font-bold text-foreground">
                  Tu recorrido cinematográfico
                </h2>
              </div>

              <p className="text-sm text-muted-foreground">
                Las películas que Butaca te ha recomendado y las que has guardado.
              </p>
            </div>

            {/* Estadísticas cinematográficas */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border bg-background/50 p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Film className="size-4 text-accent" />
                  <p className="text-xs">Películas recomendadas</p>
                </div>

                <p className="mt-2 text-3xl font-black tabular-nums text-foreground">
                  {records.filter(
                    (record) => record.recommendedMovie
                  ).length}
                </p>
              </div>

              <div className="rounded-lg border border-border bg-background/50 p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Heart className="size-4 text-accent" />
                  <p className="text-xs">Películas favoritas</p>
                </div>

                <p className="mt-2 text-3xl font-black tabular-nums text-foreground">
                  {favoriteCount}
                </p>
              </div>
            </div>

            {/* Películas recomendadas recientemente */}
            <div className="space-y-4 rounded-lg border border-border bg-background/50 p-4">
              <div>
                <h3 className="font-bold text-foreground">
                  Recomendaciones recientes
                </h3>

                <p className="text-xs text-muted-foreground">
                  Algunas películas recomendadas a partir de tus emociones.
                </p>
              </div>

              {recentRecommendations.length > 0 ? (
                <div className="space-y-3">
                  {recentRecommendations.map((movie) => (
                    <div
                      key={movie.id}
                      className="flex items-center gap-3 rounded-lg border border-border/70 bg-card/60 p-3"
                    >
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-secondary text-accent">
                        <Film className="size-6" />
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {movie.title}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          Recomendada por{" "}
                          {EMOTIONS[movie.emotion].label.toLowerCase()}
                        </p>
                      </div>

                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatDate(movie.date)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  Todavía no hay recomendaciones para este período.
                </p>
              )}
            </div>

            {/* Nota de actividad */}
            <div className="rounded-lg border border-border bg-background/50 p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-4 text-primary" />
                <h3 className="font-bold text-foreground">
                  Tu actividad cinematográfica
                </h3>
              </div>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Has recibido{" "}
                <span className="font-semibold text-foreground">
                  {records.filter(
                    (record) => record.recommendedMovie
                  ).length}{" "}
                  recomendaciones
                </span>{" "}
                durante este período y has guardado{" "}
                <span className="font-semibold text-foreground">
                  {favoriteCount} favoritas
                </span>
                .
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
