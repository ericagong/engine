import type { SectionKey } from "@/entities/types";
import { useFlowStore } from "@/entities/store";
import { Button } from "@/shared/ui/button";
import { Plus } from "lucide-react";
import { SortableAction } from "@/features/dnd/SortableAction";
import { SectionDropZone } from "@/features/dnd/SectionDropZone";
import { ActionCard } from "./ActionCard";

// 섹션 헤더: label + count + 추가 버튼
function SectionHeader({
  label,
  count,
  onAdd,
}: {
  label: string;
  count: number;
  onAdd: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-2 py-2">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold">{label}</h2>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {count}
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={onAdd}
        aria-label="카드 추가"
      >
        <Plus className="h-4 w-4 text-muted-foreground" />
      </Button>
    </div>
  );
}

export function Section({
  sectionKey,
  label,
}: {
  sectionKey: SectionKey;
  label: string;
}) {
  const actionIds = useFlowStore((s) => s.sections[sectionKey]);
  const createAction = useFlowStore((s) => s.createAction);

  const handleAdd = () => createAction(sectionKey);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <SectionHeader label={label} count={actionIds.length} onAdd={handleAdd} />
      <SectionDropZone sectionKey={sectionKey} actionIds={actionIds}>
        {actionIds.map((actionId) => (
          <SortableAction
            key={actionId}
            actionId={actionId}
            sectionKey={sectionKey}
          >
            <ActionCard actionId={actionId} />
          </SortableAction>
        ))}
      </SectionDropZone>
    </div>
  );
}
