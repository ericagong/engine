import { Checkbox } from "@/shared/ui/checkbox";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/shared/ui/input-group";
import { cn } from "@/shared/lib/utils";
import { useFlowStore } from "@/entities/store";

const PROGRESS_LINE_ACTIVE = "border-blue-400";
const PROGRESS_LINE_INACTIVE = "border-muted-foreground/30";

export function StepItem({
  actionId,
  stepId,
  isFirst,
  isLast,
  prevDone,
}: {
  actionId: string;
  stepId: string;
  isFirst: boolean;
  isLast: boolean;
  prevDone: boolean;
}) {
  const step = useFlowStore((s) =>
    s.actionsById[actionId]?.steps.find((st) => st.id === stepId),
  );
  const updateStepContent = useFlowStore((s) => s.updateStepContent);
  const toggleStepDone = useFlowStore((s) => s.toggleStepDone);

  if (!step) return null;

  return (
    <InputGroup variant="ghost" className="h-auto items-stretch">
      {/* 왼쪽: 원형 체크 + 세로 연결선 */}
      <InputGroupAddon className="relative flex-col items-center justify-start gap-0 py-0 pl-0">
        {/* 윗쪽 연결선: 이전 step이 완료되었으면 파란색 */}
        {!isFirst && (
          <div
            className={cn(
              "absolute left-1/2 top-0 h-2.5 -translate-x-px border-l-[1.5px] border-dashed",
              prevDone ? PROGRESS_LINE_ACTIVE : PROGRESS_LINE_INACTIVE,
            )}
          />
        )}
        {/* 아랫쪽 연결선: 현재 step이 완료되었으면 파란색 */}
        {!isLast && (
          <div
            className={cn(
              "absolute left-1/2 top-5 bottom-0 -translate-x-px border-l-[1.5px] border-dashed",
              step.done ? PROGRESS_LINE_ACTIVE : PROGRESS_LINE_INACTIVE,
            )}
          />
        )}
        <Checkbox
          className="relative z-10 bg-background"
          checked={step.done}
          onCheckedChange={() => toggleStepDone(actionId, stepId)}
          aria-label="단계 완료 토글"
        />
      </InputGroupAddon>

      {/* 오른쪽: content + completion */}
      <div className={cn("flex min-w-0 flex-1 flex-col", !isLast && "pb-5")}>
        <InputGroupInput
          className="h-auto py-0 text-sm font-semibold"
          value={step.content}
          placeholder="Step을 정의해주세요."
          onChange={(e) =>
            updateStepContent(actionId, stepId, { content: e.target.value })
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
          }}
        />
        <InputGroupInput
          className="h-auto py-0 text-xs text-muted-foreground"
          value={step.completion}
          placeholder="Step을 완료한 상태를 한 문장으로 정의해주세요."
          onChange={(e) =>
            updateStepContent(actionId, stepId, { completion: e.target.value })
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
          }}
        />
      </div>
    </InputGroup>
  );
}
