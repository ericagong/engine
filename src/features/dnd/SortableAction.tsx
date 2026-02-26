import type { ReactNode } from "react";
import type { SectionKey } from "@/entities/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { useFlowStore } from "@/entities/store";
import { Button } from "@/shared/ui/button";
import { DropIndicator } from "./DropIndicator";
import type { ActionDragData } from "./types";

export function SortableAction({
  actionId,
  sectionKey,
  children,
}: {
  actionId: string;
  sectionKey: SectionKey;
  children: ReactNode;
}) {
  const removeAction = useFlowStore((s) => s.removeAction);

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
    active,
    isOver,
    index,
    activeIndex,
  } = useSortable({
    id: actionId,
    data: {
      type: "action",
      section: sectionKey,
      actionId,
    } satisfies ActionDragData,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : undefined,
  };

  // 드롭 위치 인디케이터 표시 조건
  // isSorting 대신 active !== null 사용: 크로스 섹션 드래그 시에도 인디케이터 표시
  const showIndicator = active !== null && !isDragging && isOver;
  const showTopIndicator =
    showIndicator && (activeIndex === -1 || activeIndex > index);
  const showBottomIndicator =
    showIndicator && activeIndex !== -1 && activeIndex < index;

  return (
    <div ref={setNodeRef} style={style} className="group/action relative">
      {/* 드롭 인디케이터 - 위쪽 */}
      {showTopIndicator && <DropIndicator position="top" />}

      {/* 드래그 핸들 - 좌측 오버레이 */}
      <Button
        ref={setActivatorNodeRef}
        variant="ghost"
        size="icon-xs"
        className="absolute left-1 top-[18px] z-10 cursor-grab opacity-0 transition-opacity group-hover/action:opacity-60"
        aria-label="카드 이동"
        {...attributes}
        {...listeners}
        tabIndex={-1}
      >
        <GripVertical className="h-3.5 w-3.5" />
      </Button>
      {/* 카드 - 전체 너비 사용 */}
      <div className="w-full">{children}</div>
      {/* 삭제 버튼 - 우측 오버레이 */}
      <Button
        variant="ghost"
        size="icon-xs"
        className="absolute right-2 top-[18px] z-10 opacity-0 transition-opacity hover:text-destructive group-hover/action:opacity-60"
        onClick={() => removeAction(actionId)}
        aria-label="Action 삭제"
        tabIndex={-1}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>

      {/* 드롭 인디케이터 - 아래쪽 */}
      {showBottomIndicator && <DropIndicator position="bottom" />}
    </div>
  );
}
