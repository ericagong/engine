import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCurrentPhase, PHASES } from "@/shared/hooks/useCurrentPhase";

const Navigator = () => {
  const navigate = useNavigate();
  const phase = useCurrentPhase();

  const currentIndex = phase ? PHASES.indexOf(phase) : -1;

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex >= 0 && currentIndex < PHASES.length - 1;

  const goPrev = () => {
    if (canGoPrev) navigate(`/${PHASES[currentIndex - 1]}`);
  };

  const goNext = () => {
    if (canGoNext) navigate(`/${PHASES[currentIndex + 1]}`);
  };

  return (
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
  );
};

const Logo = () => {
  return (
    <span className="ml-3 text-sm font-medium">
      <span className="mr-2">⚙️</span>
      Engine
    </span>
  );
};

const AppLayout = () => {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <header className="flex h-11 items-center border-b bg-background px-3">
        <Navigator />
        <Logo />
      </header>
      <main className="flex flex-1 flex-col overflow-hidden bg-muted/40">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
