import type { ReactNode } from "react";
import { ActionDndContext } from "@/features/dnd/ActionDndContext";
import { ActionCard } from "./ActionCard";
import { BoardHeader } from "./BoardHeader";

type BoardLayoutProps = {
  main: ReactNode;
  secondary: ReactNode;
};

export function BoardLayout({ main, secondary }: BoardLayoutProps) {
  return (
    <>
      <BoardHeader />
      <div className="flex flex-1 flex-col overflow-hidden p-4">
        <ActionDndContext
          renderOverlay={(actionId) => (
            <div className="pointer-events-none w-[340px] rotate-2 opacity-90 shadow-xl">
              <ActionCard actionId={actionId} />
            </div>
          )}
        >
          <div className="flex min-h-0 flex-1 gap-4">
            <div className="flex min-w-0 flex-2 flex-col gap-4">{main}</div>
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              {secondary}
            </div>
          </div>
        </ActionDndContext>
      </div>
    </>
  );
}
