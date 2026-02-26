import type { ReactNode } from "react";

type BoardLayoutProps = {
  main: ReactNode;
  secondary: ReactNode;
};

export function BoardLayout({ main, secondary }: BoardLayoutProps) {
  return (
    <div className="flex flex-1 min-h-0 gap-4">
      <div className="flex-2 flex flex-col gap-4 min-w-0">{main}</div>
      <div className="flex-1 flex flex-col gap-4 min-w-0">{secondary}</div>
    </div>
  );
}
