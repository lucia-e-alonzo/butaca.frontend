import { Camera, X, LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useCamera } from "@/hooks/useCamera";
import { Button } from "@/components/ui/button";

interface Props {
  onCapture: (blob: Blob) => void;
  onClose: () => void;
  analyzing: boolean;
}

export function CameraView({ onCapture, onClose, analyzing }: Props) {
  const { videoRef, status, error, start, stop, capture } = useCamera();

  useEffect(() => {
    void start();
    return () => stop();
  }, [start, stop]);

  async function handleCapture() {
    const blob = await capture();
    if (blob) onCapture(blob);
  }

  return (
    <div className="surface-card mx-auto max-w-lg overflow-hidden rounded-2xl">
      <div className="relative aspect-video bg-background">
        <video ref={videoRef} muted playsInline className="h-full w-full object-cover" />
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar cámara"
          className="absolute right-3 top-3 rounded-full bg-background/80 p-2 text-foreground hover:bg-background"
        >
          <X size={18} />
        </button>
        {status === "requesting" && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <LoaderCircle className="size-8 animate-spin text-accent" />
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/90 p-6 text-center text-sm text-red-400">
            {error}
          </div>
        )}
      </div>
      <div className="flex justify-center p-4">
        <Button
          onClick={handleCapture}
          disabled={status !== "active" || analyzing}
          className="gap-2"
        >
          {analyzing ? <LoaderCircle className="animate-spin" /> : <Camera />}
          {analyzing ? "Analizando..." : "Capturar y analizar"}
        </Button>
      </div>
    </div>
  );
}