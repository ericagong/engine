import { useShallow } from "zustand/react/shallow";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { SectionKey } from "@/entities/types";
import { useFlowStore } from "@/entities/store";
import { Button } from "@/shared/ui/button";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Plus } from "lucide-react";
import { ActionCard } from "./Action";

type SectionHeaderProps = {
  sectionKey: SectionKey;
  label: string;
};

function SectionHeader({ sectionKey, label }: SectionHeaderProps) {
  const actionCount = useFlowStore((s) => s.sectionsByKey[sectionKey].length);
  const createAction = useFlowStore((s) => s.createAction);

  return (
    <header className="flex items-center justify-between px-2 py-2">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold">{label}</h2>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {actionCount}
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={() => createAction(sectionKey)}
        aria-label="새로운 Action 추가"
      >
        <Plus className="h-4 w-4 text-muted-foreground" />
      </Button>
    </header>
  );
}

type SectionProps = {
  sectionKey: SectionKey;
  label: string;
};

export function Section({ sectionKey, label }: SectionProps) {
  const actionIds = useFlowStore(
    useShallow((s) => s.sectionsByKey[sectionKey]),
  );

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <SectionHeader sectionKey={sectionKey} label={label} />
      <ScrollArea className="min-h-0 flex-1 overflow-hidden p-2">
        <SortableContext
          items={actionIds}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex min-h-0 flex-col gap-2">
            {actionIds.map((actionId) => (
              <ActionCard
                key={actionId}
                actionId={actionId}
                sectionKey={sectionKey}
              />
            ))}
          </div>
        </SortableContext>
      </ScrollArea>
    </section>
  );
}
