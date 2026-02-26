import type { ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Button } from "@/shared/ui/button";
import type { StepDragData } from "./types";

export function SortableStep({
  actionId,
  stepId,
  children,
}: {
  actionId: string;
  stepId: string;
  children: ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: stepId,
    data: { type: "step", actionId, stepId } satisfies StepDragData,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="group/step relative">
      {/* 드래그 핸들 - 체크박스 좌측 오버레이 */}
      <Button
        ref={setActivatorNodeRef}
        variant="ghost"
        size="icon-xs"
        className="absolute left-0 top-0 z-10 cursor-grab opacity-0 transition-opacity group-hover/step:opacity-60"
        aria-label="순서 변경"
        {...attributes}
        {...listeners}
        tabIndex={-1}
      >
        <GripVertical className="h-3 w-3 text-muted-foreground" />
      </Button>
      {/* 컨텐츠 - 좌측 패딩으로 핸들 공간 확보 */}
      <div className="w-full pl-7">{children}</div>
    </div>
  );
}
