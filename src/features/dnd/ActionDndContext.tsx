import { type ReactNode, useState, useId } from "react";
import {
  DndContext,
  pointerWithin,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useFlowStore } from "@/entities/store";
import type { DndData } from "./types";

type ActionDndContextProps = {
  children: ReactNode;
  renderOverlay?: (activeActionId: string) => ReactNode;
};

export function ActionDndContext({
  children,
  renderOverlay,
}: ActionDndContextProps) {
  const moveAction = useFlowStore((s) => s.moveAction);

  const moveActionToSection = useFlowStore((s) => s.moveActionToSection);

  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const dndId = useId();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current as DndData | undefined;
    if (data?.type === "action") {
      setActiveActionId(data.actionId);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveActionId(null);
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current as DndData | undefined;

    // step 이벤트는 중첩 DndContext에서 처리
    if (activeData?.type !== "action") return;

    const overData = over.data.current as DndData | undefined;

    const activeId = String(active.id);
    const state = useFlowStore.getState();
    const fromSection = state.actionsById[activeId]?.sectionKey ?? null;
    if (!fromSection) return;

    // over 대상이 action인 경우
    if (overData?.type === "action") {
      const toSection = overData.section;

      if (fromSection === toSection) {
        // 같은 섹션 내 순서 변경
        const actionIds = state.sectionsByKey[fromSection];
        const newIndex = actionIds.indexOf(String(over.id));
        if (newIndex !== -1 && activeId !== String(over.id)) {
          moveAction(activeId, newIndex);
        }
      } else {
        // 다른 섹션으로 이동
        const toIndex = state.sectionsByKey[toSection].indexOf(String(over.id));
        moveActionToSection(activeId, toSection, toIndex);
      }
      return;
    }

    // over 대상이 section-top인 경우 (섹션 상단에 드롭 → 맨 앞에 삽입)
    if (overData?.type === "section-top") {
      const toSection = overData.section;
      if (fromSection === toSection) return;
      moveActionToSection(activeId, toSection, 0);
      return;
    }

    // over 대상이 section-bottom 또는 section인 경우 (섹션 하단/빈 섹션에 드롭 → 맨 끝에 삽입)
    if (overData?.type === "section-bottom" || overData?.type === "section") {
      const toSection = overData.section;
      if (fromSection === toSection) return;
      moveActionToSection(
        activeId,
        toSection,
        state.sectionsByKey[toSection].length,
      );
    }
  };

  return (
    <DndContext
      id={`action-dnd-${dndId}`}
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children}
      <DragOverlay dropAnimation={null}>
        {activeActionId && renderOverlay ? renderOverlay(activeActionId) : null}
      </DragOverlay>
    </DndContext>
  );
}
