
import { useState } from "react";
import { Clapperboard, LoaderCircle } from "lucide-react";
import { supabase } from "@/services/supabase";

type Provider = "google" | "github";

export default function Login() {
  const [loading, setLoading] = useState<Provider | null>(null);
  const [error, setError] = useState("");

  const handleLogin = async (provider: Provider) => {
    setLoading(provider);
    setError("");

    try {
      const { error: authError } =
        await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: `${window.location.origin}/`,
          },
        });

      if (authError) throw authError;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo iniciar sesión."
      );
    } finally {
      setLoading(null);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0f0b09] px-4 text-white">
      <div className="w-full max-w-md rounded-3xl border border-[#1f5656] bg-[#0e2520] p-8 shadow-2xl">

        <div className="mb-8 text-center">
          <Clapperboard
            size={48}
            className="mx-auto mb-4 text-[#dd6122]"
          />

          <h1 className="text-4xl font-extrabold">
            BUTACA
          </h1>

          <p className="mt-3 text-[#b5b8af]">
            Tu próxima película comienza con una emoción.
          </p>
        </div>

        <h2 className="mb-6 text-center text-xl font-bold">
          Iniciar sesión
        </h2>

        <div className="space-y-4">
          <button
            type="button"
            disabled={loading !== null}
            onClick={() => handleLogin("google")}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 font-semibold text-[#0f0b09] transition hover:bg-gray-200 disabled:opacity-50"
          >
            {loading === "google" ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <span className="font-bold">G</span>
            )}
            Continuar con Google
          </button>

          <button
            type="button"
            disabled={loading !== null}
            onClick={() => handleLogin("github")}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#1f5656] px-4 py-3 font-semibold text-white transition hover:bg-[#287070] disabled:opacity-50"
          >
            {loading === "github" ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <span className="text-xl font-bold">GH</span>
            )}
            Continuar con GitHub
          </button>
        </div>

        {error && (
          <p role="alert" className="mt-5 text-center text-sm text-red-400">
            {error}
          </p>
        )}

        <p className="mt-8 text-center text-xs text-[#7c8075]">
          Descubre películas que conectan con tus emociones.
        </p>
      </div>
    </main>
  );
}
