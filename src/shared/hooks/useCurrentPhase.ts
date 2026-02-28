import { useLocation } from "react-router-dom";
import type { Phase } from "@/entities/types";

const PHASES: Phase[] = ["plan", "execute", "reflect"];

function isPhase(value: string): value is Phase {
  return (PHASES as string[]).includes(value);
}

export function useCurrentPhase(): Phase | null {
  const { pathname } = useLocation();
  const segment = pathname.split("/")[1] ?? "";
  return isPhase(segment) ? segment : null;
}

export { PHASES };
