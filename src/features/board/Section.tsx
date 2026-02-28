import type { ReactNode } from "react";
import { useShallow } from "zustand/react/shallow";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { SectionKey } from "@/entities/types";
import { useFlowStore } from "@/entities/store/store";
import { Button } from "@/shared/ui/button";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Plus } from "lucide-react";
import Action from "./Action";

type DroppableSectionData = {
  kind: "droppable-section";
  sectionKey: SectionKey;
};

const makeDroppableSectionId = (sectionKey: SectionKey) =>
  `section:${sectionKey}` as const;

type DroppableSectionProps = {
  sectionKey: SectionKey;
  children: ReactNode;
};

const DroppableSection = ({ sectionKey, children }: DroppableSectionProps) => {
  const { setNodeRef } = useDroppable({
    id: makeDroppableSectionId(sectionKey),
    data: {
      kind: "droppable-section",
      sectionKey,
    } satisfies DroppableSectionData,
  });

  return (
    <section ref={setNodeRef} className="flex min-h-0 flex-1 flex-col">
      {children}
    </section>
  );
};

type SectionHeaderProps = {
  label: string;
  count: number;
  onAddAction: () => void;
};

const SectionHeader = ({ label, count, onAddAction }: SectionHeaderProps) => {
  return (
    <header className="flex items-center justify-between px-2 py-2">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold">{label}</h2>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {count}
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={onAddAction}
        aria-label="새로운 Action 추가"
      >
        <Plus className="h-4 w-4 text-muted-foreground" />
      </Button>
    </header>
  );
};

type SectionProps = {
  sectionKey: SectionKey;
  label: string;
};

const Section = ({ sectionKey, label }: SectionProps) => {
  const actionIds = useFlowStore(
    useShallow((s) => s.sectionsByKey[sectionKey]),
  );
  const createAction = useFlowStore((s) => s.createAction);
  return (
    <DroppableSection sectionKey={sectionKey}>
      <SectionHeader
        label={label}
        count={actionIds.length}
        onAddAction={() => createAction(sectionKey)}
      />
      <ScrollArea className="min-h-0 flex-1 overflow-hidden p-2">
        <SortableContext
          items={actionIds}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2">
            {actionIds.map((actionId) => (
              <Action
                key={actionId}
                actionId={actionId}
                sectionKey={sectionKey}
              />
            ))}
          </div>
        </SortableContext>
      </ScrollArea>
    </DroppableSection>
  );
};

export default Section;
