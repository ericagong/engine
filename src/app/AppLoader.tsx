import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { useFlowStore } from "@/entities/store/store";
import { hydrateStore } from "@/entities/persistence/hydrate";
import { subscribeToPersist } from "@/entities/persistence/sync";
import { router } from "./routes";

export function AppLoader() {
  const hydrated = useFlowStore((s) => s._hydrated);

  useEffect(() => {
    hydrateStore();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    return subscribeToPersist();
  }, [hydrated]);

  if (!hydrated) return null;

  return <RouterProvider router={router} />;
}
