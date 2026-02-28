import { useState, type ReactNode } from "react";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";

import type { ActionId } from "@/entities/types";
import type { Phase, SectionKey } from "@/entities/types";
import { useCurrentPhase } from "@/shared/hooks/useCurrentPhase";
import { useFlowStore } from "@/entities/store/store";
import { ActionOverlay } from "./Action";

type Destination = {
  sectionKey: SectionKey;
  index: number;
};

const resolveDestination = (over: DragEndEvent["over"]): Destination | null => {
  if (!over) return null;

  const sectionKey = over.data.current?.sectionKey as SectionKey | undefined;
  if (!sectionKey) return null;

  const ids = useFlowStore.getState().sectionsByKey[sectionKey];

  const isSectionContainer = over.data.current?.kind === "droppable-section";
  if (isSectionContainer) return { sectionKey, index: ids.length };

  const idx = ids.indexOf(over.id as ActionId);
  return { sectionKey, index: idx >= 0 ? idx : ids.length };
};

type BoardProps = {
  main: ReactNode;
  secondary: ReactNode;
};

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

const BoardHeader = () => {
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
};

const DRAG_ACTIVATION_DISTANCE = 8;

type BoardDnDContextProps = {
  children: ReactNode;
};

const BoardDnDContext = ({ children }: BoardDnDContextProps) => {
  const [activeActionId, setActiveActionId] = useState<ActionId | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: DRAG_ACTIVATION_DISTANCE },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveActionId(event.active.id as ActionId);
  };

  /** 섹션 간 이동: 경계를 넘는 순간만 커밋 */
  const handleDragOver = (event: DragOverEvent) => {
    const activeId = event.active.id as ActionId;
    const dest = resolveDestination(event.over);
    if (!dest) return;

    const { actionsById, reorderActionAcrossSections } =
      useFlowStore.getState();
    const activeAction = actionsById[activeId];
    if (!activeAction) return;

    if (activeAction.sectionKey === dest.sectionKey) return;

    reorderActionAcrossSections(activeId, dest.sectionKey, dest.index);
  };

  /** 같은 섹션 내 재정렬: 드랍 시 최종 위치만 확정 */
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveActionId(null);

    const activeId = event.active.id as ActionId;
    const dest = resolveDestination(event.over);
    if (!dest) return;

    const { actionsById, reorderActionWithinSection } = useFlowStore.getState();
    const activeAction = actionsById[activeId];
    if (!activeAction) return;

    if (activeAction.sectionKey !== dest.sectionKey) return;
    if (event.over && event.active.id === event.over.id) return;

    reorderActionWithinSection(activeId, dest.index);
  };

  const handleDragCancel = () => {
    setActiveActionId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {children}
      <DragOverlay>
        {activeActionId && <ActionOverlay actionId={activeActionId} />}
      </DragOverlay>
    </DndContext>
  );
};

const Board = ({ main, secondary }: BoardProps) => {
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
};

export default Board;
