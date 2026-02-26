import { type ReactNode, useId } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useFlowStore } from "@/entities/store";
import type { DndData } from "./types";

export function StepDndContext({
  actionId,
  stepIds,
  children,
}: {
  actionId: string;
  stepIds: string[];
  children: ReactNode;
}) {
  const moveStep = useFlowStore((s) => s.moveStep);
  const dndId = useId();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleStepDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // 같은 action 내 step만 처리
    const activeData = active.data.current as DndData | undefined;
    const overData = over.data.current as DndData | undefined;
    if (
      activeData?.type !== "step" ||
      overData?.type !== "step" ||
      activeData.actionId !== actionId ||
      overData.actionId !== actionId
    )
      return;

    const newIndex = stepIds.indexOf(String(over.id));
    if (newIndex === -1) return;

    moveStep(String(active.id), newIndex);
  };

  return (
    <DndContext
      id={`step-dnd-${dndId}`}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleStepDragEnd}
    >
      <SortableContext items={stepIds} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}
