import type { ReactNode } from "react";
import type { ActionId } from "./Action";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import type { Phase, SectionKey } from "@/entities/types";
import { useCurrentPhase } from "@/entities/useCurrentPhase";
import { useFlowStore } from "@/entities/store";

const PHASE_INFO: Record<Phase, { label: string; guideMessage: string }> = {
  plan: {
    label: "Plan",
    guideMessage: "다음 90분 간 집중할 목표를 세워보세요.",
  },
  execute: {
    label: "Execute",
    guideMessage:
      "90분 동안 3개의 action을 step별로 실행하세요.\n작업 중 필요한 기록은 Backlog에 작성하세요.",
  },
  reflect: {
    label: "Reflect",
    guideMessage:
      "90분간 집중한 결과를 회고하세요.\nBacklog에 작성한 기록을 Keep/Try/Queue로 분류해주세요.",
  },
};

function BoardHeader() {
  const phase = useCurrentPhase();

  if (!phase) return null;

  const info = PHASE_INFO[phase];

  return (
    <div className="h-24 px-6 pt-6 pb-2">
      <h1 className="text-2xl font-bold">{info.label}</h1>
      <p className="mt-1 text-sm text-muted-foreground whitespace-pre-line">
        {info.guideMessage}
      </p>
    </div>
  );
}

type BoardDnDContextProps = {
  children: ReactNode;
};

const DRAG_ACTIVATION_DISTANCE = 8;

function reorderWithinSection(
  draggedId: ActionId,
  droppedId: ActionId,
  sectionKey: SectionKey,
) {
  const { sectionsByKey, moveAction } = useFlowStore.getState();
  const droppedIndex = sectionsByKey[sectionKey].indexOf(droppedId);
  moveAction(draggedId, droppedIndex);
}

function moveBetweenSections(
  draggedId: ActionId,
  droppedId: ActionId,
  droppedSection: SectionKey,
) {
  const { sectionsByKey, moveActionToSection } = useFlowStore.getState();
  const droppedIndex = sectionsByKey[droppedSection].indexOf(droppedId);
  moveActionToSection(draggedId, droppedSection, droppedIndex);
}

function BoardDnDContext({ children }: BoardDnDContextProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: DRAG_ACTIVATION_DISTANCE },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active: dragged, over: dropped } = event;
    if (!dropped || dragged.id === dropped.id) return;

    const draggedSection: SectionKey | undefined =
      dragged.data.current?.sectionKey;
    const droppedSection: SectionKey | undefined =
      dropped.data.current?.sectionKey;
    if (!draggedSection || !droppedSection) return;

    if (draggedSection === droppedSection) {
      reorderWithinSection(
        dragged.id as ActionId,
        dropped.id as ActionId,
        draggedSection,
      );
    } else {
      moveBetweenSections(
        dragged.id as ActionId,
        dropped.id as ActionId,
        droppedSection,
      );
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      {children}
    </DndContext>
  );
}

type BoardProps = {
  main: ReactNode;
  secondary: ReactNode;
};

export function Board({ main, secondary }: BoardProps) {
  return (
    <>
      <BoardHeader />
      <BoardDnDContext>
        <div className="flex min-h-0 flex-1 gap-4 overflow-hidden p-4">
          <div className="flex min-w-0 flex-2 flex-col gap-4">{main}</div>
          <div className="flex min-w-0 flex-1 flex-col gap-4">{secondary}</div>
        </div>
      </BoardDnDContext>
    </>
  );
}
