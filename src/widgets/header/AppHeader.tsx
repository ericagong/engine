import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Phase } from "@/entities/board/model/types";

const phases: Phase[] = ["plan", "execute", "reflect"];

export function AppHeader() {
  const navigate = useNavigate();

  const { pathname } = useLocation();

  const currentIndex = phases.indexOf(pathname.replace("/", "") as Phase);

  const canGoPrev = currentIndex > 0;

  const canGoNext = currentIndex < phases.length - 1;

  const goPrev = () => {
    if (canGoPrev) navigate(`/${phases[currentIndex - 1]}`);
  };

  const goNext = () => {
    if (canGoNext) navigate(`/${phases[currentIndex + 1]}`);
  };

  return (
    <header className="flex h-11 items-center border-b bg-background px-3">
      <div className="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={goPrev}
          disabled={!canGoPrev}
        >
          <ChevronLeft className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={goNext}
          disabled={!canGoNext}
        >
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
      <span className="ml-3 text-sm font-medium">
        <span className="mr-2">⚙️</span>
        Engine
      </span>
    </header>
  );
}
