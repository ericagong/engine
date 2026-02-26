import type { ReactNode } from "react";
import type { SectionKey } from "@/entities/types";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { DropIndicator } from "./DropIndicator";
import type {
  SectionDropData,
  SectionTopDropData,
  SectionBottomDropData,
} from "./types";

export function SectionDropZone({
  sectionKey,
  actionIds,
  children,
}: {
  sectionKey: SectionKey;
  actionIds: string[];
  children: ReactNode;
}) {
  // 섹션 전체 droppable (빈 섹션 + 레이아웃 용도)
  const { setNodeRef: setDroppableRef } = useDroppable({
    id: `section-${sectionKey}`,
    data: { type: "section", section: sectionKey } satisfies SectionDropData,
  });

  // 상단 드롭 존: 아이템 위 빈 영역 → index 0에 삽입
  const { setNodeRef: setTopDropRef, isOver: isTopOver } = useDroppable({
    id: `section-${sectionKey}-top`,
    data: {
      type: "section-top",
      section: sectionKey,
    } satisfies SectionTopDropData,
  });

  // 하단 드롭 존: 아이템 아래 빈 영역 → 맨 끝에 삽입
  const { setNodeRef: setBottomDropRef, isOver: isBottomOver } = useDroppable({
    id: `section-${sectionKey}-bottom`,
    data: {
      type: "section-bottom",
      section: sectionKey,
    } satisfies SectionBottomDropData,
  });

  return (
    <div ref={setDroppableRef} className="flex min-h-0 flex-1 flex-col">
      <ScrollArea className="flex-1 overflow-hidden p-2">
        <SortableContext
          items={actionIds}
          strategy={verticalListSortingStrategy}
        >
          {/* 상단 드롭 존 */}
          <div ref={setTopDropRef} className="relative min-h-[4px]">
            {isTopOver && <DropIndicator position="section-top" />}
          </div>

          <div className="flex min-h-0 flex-col gap-2">{children}</div>

          {/* 하단 드롭 존 */}
          <div ref={setBottomDropRef} className="relative min-h-[20px] flex-1">
            {isBottomOver && <DropIndicator position="section-bottom" />}
          </div>
        </SortableContext>
      </ScrollArea>
    </div>
  );
}
