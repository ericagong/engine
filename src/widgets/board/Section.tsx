import { useState } from "react";
import type { Section as SectionType } from "@/entities/board/model/types";
import { useFlowStore } from "@/entities/board/model/store";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight, MoreHorizontal, Plus } from "lucide-react";
import { ActionCard } from "./ActionCard";

export function Section({
  section,
  label,
}: {
  section: SectionType;
  label: string;
}) {
  const actionIds = useFlowStore((s) => s.sections[section]);
  const createAction = useFlowStore((s) => s.createAction);
  const [open, setOpen] = useState(true);

  const totalActionCount = actionIds.length;

  // 카드 리스트 + 추가 버튼
  const cardList = (
    <ScrollArea className="flex-1 overflow-hidden p-2">
      <div className="flex flex-col gap-2">
        {actionIds.map((actionId) => (
          <ActionCard key={actionId} actionId={actionId} />
        ))}
        <Button
          variant="outline"
          className="w-full text-sm text-muted-foreground"
          onClick={() => createAction(section)}
        >
          <Plus className="h-4 w-4" />
          카드 추가
        </Button>
      </div>
    </ScrollArea>
  );

  // Queue 섹션: Collapsible로 래핑
  if (section === "queue") {
    return (
      <Collapsible
        open={open}
        onOpenChange={setOpen}
        className="flex min-h-0 flex-1 flex-col"
      >
        <CollapsibleTrigger className="flex items-center gap-2 px-2 py-2">
          <ChevronRight
            className={`h-4 w-4 text-muted-foreground transition-transform ${
              open ? "rotate-90" : ""
            }`}
          />
          <h2 className="text-sm font-semibold">{label}</h2>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {totalActionCount}
          </span>
        </CollapsibleTrigger>
        <CollapsibleContent className="flex min-h-0 flex-1 flex-col">
          {cardList}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  // 기본 섹션: 기존 레이아웃
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* 섹션 헤더 */}
      <div className="flex items-center justify-between px-2 py-2">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold">{label}</h2>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {totalActionCount}
          </span>
        </div>
        <Button variant="ghost" size="icon-xs">
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>

      {cardList}
    </div>
  );
}
