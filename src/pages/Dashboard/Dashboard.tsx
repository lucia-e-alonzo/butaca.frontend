import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  Clapperboard,
  Film,
  Heart,
  RefreshCw,
  Smile,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
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
} from "recharts";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { EMOTIONS } from "@/lib/emotions";
import type { Emotion, HistoryDay } from "@/types/history";

import {
  FAVORITES_CHANGED_EVENT,
  getFavorites,
} from "@/services/favoritesService";
import { getRecommendations } from "@/services/recommendationsService";
import type { Movie } from "@/services/movieService";

type Period = "7d" | "30d" | "year";

const PERIODS: { value: Period; label: string }[] = [
  { value: "7d", label: "7 días" },
  { value: "30d", label: "30 días" },
  { value: "year", label: "Este año" },
];

const EMPTY_HISTORY: HistoryDay[] = [];

type TrendPoint = {
  label: string;
} & Partial<Record<Emotion, number>>;

function buildTrendData(days: HistoryDay[], period: Period): TrendPoint[] {
  const buckets = new Map<string, TrendPoint>();

  days.forEach((day, index) => {
    const date = new Date(`${day.date}T12:00:00`);

    let label: string;

    if (period === "year") {
      label = date.toLocaleDateString("es-GT", { month: "short" });
    } else if (period === "30d") {
      label = `Semana ${Math.floor(index / 7) + 1}`;
    } else {
      label = date.toLocaleDateString("es-GT", { weekday: "short" });
    }

    if (!buckets.has(label)) {
      buckets.set(label, { label });
    }

    const bucket = buckets.get(label)!;

    day.records.forEach((record) => {
      bucket[record.emotion] = (bucket[record.emotion] ?? 0) + 1;
    });
  });

  return Array.from(buckets.values());
}

function formatDate(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString("es-GT", {
    day: "numeric",
    month: "short",
  });
}

export default function Dashboard() {
  const [period, setPeriod] = useState<Period>("30d");

  // --- Historial emocional ---
  // TODO(backend): reemplazar EMPTY_HISTORY por getHistory(period) cuando el back
  // publique GET /api/v1/history?period=7d|30d|year. La estructura visual ya está lista.
  const [history, setHistory] = useState<HistoryDay[]>(EMPTY_HISTORY);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  // --- Recomendaciones (backend real) ---
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [recLoading, setRecLoading] = useState(true);
  const [recError, setRecError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // --- Favoritos (localStorage por ahora) ---
  // TODO(backend): migrar a GET /api/v1/favorites cuando el back lo publique.
  const [favoriteCount, setFavoriteCount] = useState(
    () => getFavorites().length
  );

  useEffect(() => {
    function updateFavorites() {
      setFavoriteCount(getFavorites().length);
    }
    window.addEventListener(FAVORITES_CHANGED_EVENT, updateFavorites);
    window.addEventListener("storage", updateFavorites);
    window.addEventListener("focus", updateFavorites);
    return () => {
      window.removeEventListener(FAVORITES_CHANGED_EVENT, updateFavorites);
      window.removeEventListener("storage", updateFavorites);
      window.removeEventListener("focus", updateFavorites);
    };
  }, []);

  useEffect(() => {
    let active = true;
    async function loadRecommendations() {
      setRecLoading(true);
      setRecError(null);
      try {
        const results = await getRecommendations({
          media_type: "all",
          language: "es-MX",
          limit: 5,
        });
        if (active) setRecommendations(results);
      } catch (error) {
        if (active) {
          setRecommendations([]);
          setRecError(
            error instanceof Error
              ? error.message
              : "No se pudieron cargar las recomendaciones."
          );
        }
      } finally {
        if (active) setRecLoading(false);
      }
    }
    void loadRecommendations();
    return () => {
      active = false;
    };
  }, [reloadKey]);

  // Carga del historial: hoy queda como no-op hasta que exista el endpoint.
  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      // TODO(backend): const data = await getHistory(period); setHistory(data);
      setHistory(EMPTY_HISTORY);
    } catch (e) {
      setHistory(EMPTY_HISTORY);
      setHistoryError(
        e instanceof Error ? e.message : "No se pudo cargar el historial."
      );
    } finally {
      setHistoryLoading(false);
    }
  }, [period]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  // --- Derivados del historial ---
  const records = useMemo(
    () =>
      history.flatMap((day) =>
        day.records.map((record) => ({ ...record, date: day.date }))
      ),
    [history]
  );

  const emotionCounts = useMemo(() => {
    const counts: Record<Emotion, number> = {
      happy: 0,
      sad: 0,
      angry: 0,
      fearful: 0,
      disgusted: 0,
      surprised: 0,
    };
    records.forEach((r) => {
      counts[r.emotion] += 1;
    });
    return counts;
  }, [records]);

  const dominantEmotion = useMemo(() => {
    const entries = Object.entries(emotionCounts) as [Emotion, number][];
    return entries.reduce<Emotion | null>((dom, [em, n]) => {
      if (n === 0) return dom;
      if (!dom || n > emotionCounts[dom]) return em;
      return dom;
    }, null);
  }, [emotionCounts]);

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
  );

  const trendData = useMemo(
    () => buildTrendData(history, period),
    [history, period]
  );

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
      }));
  }, [records]);

  const hasHistoryData = records.length > 0;

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
                variant={period === item.value ? "default" : "outline"}
                onClick={() => setPeriod(item.value)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>

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

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border bg-background/50 p-4">
                <p className="text-xs text-muted-foreground">
                  Registros emocionales
                </p>
                <p className="mt-2 text-3xl font-black tabular-nums text-foreground">
                  {historyLoading ? "—" : records.length}
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
                      style={{ backgroundColor: EMOTIONS[dominantEmotion].color }}
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
                            <Cell key={item.name} fill={item.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0e2520",
                            border: "1px solid #1f5656",
                            borderRadius: "10px",
                            color: "#ffffff",
                          }}
                          formatter={(value) => [`${value} registros`, "Cantidad"]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {(Object.keys(EMOTIONS) as Emotion[]).map((emotion) => (
                      <div key={emotion} className="flex items-center gap-2">
                        <span
                          className="size-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: EMOTIONS[emotion].color }}
                        />
                        <span className="text-xs text-muted-foreground">
                          {EMOTIONS[emotion].label}
                        </span>
                        <span className="ml-auto text-xs font-semibold tabular-nums text-foreground">
                          {emotionCounts[emotion]}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex h-56 w-full flex-col items-center justify-center rounded-lg border border-dashed border-border/60 px-6 text-center">
                  <Activity className="mb-3 size-8 text-primary/60" />
                  <p className="text-sm font-semibold text-foreground">
                    Aún no hay registros
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Cuando uses la cámara, tus emociones aparecerán acá.
                  </p>
                </div>
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

              {trendData.length > 0 ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={trendData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
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
                      {(Object.keys(EMOTIONS) as Emotion[]).map((emotion) => (
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
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex h-64 w-full flex-col items-center justify-center rounded-lg border border-dashed border-border/60 px-6 text-center">
                  <TrendingUp className="mb-3 size-8 text-primary/60" />
                  <p className="text-sm font-semibold text-foreground">
                    Sin evolución todavía
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    La evolución aparecerá cuando tengas registros en el período.
                  </p>
                </div>
              )}
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

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border bg-background/50 p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Film className="size-4 text-accent" />
                  <p className="text-xs">Recomendaciones disponibles</p>
                </div>
                <p className="mt-2 text-3xl font-black tabular-nums text-foreground">
                  {recLoading || recError ? "—" : recommendations.length}
                </p>
              </div>

              <div className="rounded-lg border border-border bg-background/50 p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Heart className="size-4 text-accent" />
                  <p className="text-xs">Favoritos guardados</p>
                </div>
                <p className="mt-2 text-3xl font-black tabular-nums text-foreground">
                  {favoriteCount}
                </p>
              </div>
            </div>

            {/* Recomendaciones reales del backend */}
            <div className="space-y-4 rounded-lg border border-border bg-background/50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-foreground">
                    Recomendaciones del backend
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Sugerencias personalizadas según tu actividad.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setReloadKey((v) => v + 1)}
                  disabled={recLoading}
                  className="rounded-lg border border-border p-2 text-foreground disabled:opacity-50"
                  aria-label="Actualizar recomendaciones"
                >
                  <RefreshCw className="size-4" />
                </button>
              </div>

              {recLoading ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Cargando recomendaciones...
                </p>
              ) : recError ? (
                <div className="space-y-2 py-6 text-center">
                  <p className="text-sm font-semibold text-foreground">
                    No se pudieron cargar las recomendaciones
                  </p>
                  <p className="text-sm text-muted-foreground">{recError}</p>
                </div>
              ) : recommendations.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Todavía no hay recomendaciones para mostrar.
                </p>
              ) : (
                <div className="space-y-3">
                  {recommendations.map((movie) => (
                    <div
                      key={`${movie.media_type}-${movie.id}`}
                      className="flex items-center gap-3 rounded-lg border border-border/70 bg-card/60 p-3"
                    >
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-secondary text-accent">
                        <Film className="size-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {movie.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {movie.media_type === "tv" ? "Serie" : "Película"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recomendaciones recientes (del historial, cuando exista) */}
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
                          Recomendada por {EMOTIONS[movie.emotion].label.toLowerCase()}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatDate(movie.date)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/60 px-6 py-10 text-center">
                  <Clapperboard className="mb-3 size-8 text-accent/60" />
                  <p className="text-sm font-semibold text-foreground">
                    Todavía no hay recomendaciones por emoción
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Aparecerán cuando registres tu ánimo con la cámara.
                  </p>
                </div>
              )}
            </div>

            {/* Actividad */}
            <div className="rounded-lg border border-border bg-background/50 p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-4 text-primary" />
                <h3 className="font-bold text-foreground">
                  Tu actividad cinematográfica
                </h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {hasHistoryData ? (
                  <>
                    Has recibido{" "}
                    <span className="font-semibold text-foreground">
                      {records.filter((r) => r.recommendedMovie).length} recomendaciones
                    </span>{" "}
                    durante este período y has guardado{" "}
                    <span className="font-semibold text-foreground">
                      {favoriteCount} favoritas
                    </span>
                    .
                  </>
                ) : (
                  <>
                    Aún no hay actividad registrada en este período. Tienes{" "}
                    <span className="font-semibold text-foreground">
                      {favoriteCount} favoritas
                    </span>{" "}
                    guardadas.
                  </>
                )}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  to="/favorites"
                  className="inline-block text-sm font-semibold text-accent hover:underline"
                >
                  Ver mis favoritos
                </Link>
                <Link
                  to="/history"
                  className="inline-block text-sm font-semibold text-accent hover:underline"
                >
                  Ir al historial
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}