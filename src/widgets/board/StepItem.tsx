import { Checkbox } from "@/components/ui/checkbox";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { useFlowStore } from "@/entities/board/model/store";

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
  const updateStep = useFlowStore((s) => s.updateStep);
  const toggleStepDone = useFlowStore((s) => s.toggleStepDone);

  if (!step) return null;

  const lineColor = "border-blue-400";
  const lineColorMuted = "border-muted-foreground/30";

  return (
    <InputGroup variant="ghost" className="h-auto items-stretch">
      {/* 왼쪽: 원형 체크 + 세로 연결선 */}
      <InputGroupAddon className="relative flex-col items-center justify-start gap-0 py-0 pl-0">
        {/* 윗쪽 연결선: 이전 step이 완료되었으면 파란색 */}
        {!isFirst && (
          <div
            className={cn(
              "absolute left-1/2 top-0 h-2.5 -translate-x-px border-l-[1.5px] border-dashed",
              prevDone ? lineColor : lineColorMuted,
            )}
          />
        )}
        {/* 아랫쪽 연결선: 현재 step이 완료되었으면 파란색 */}
        {!isLast && (
          <div
            className={cn(
              "absolute left-1/2 top-5 bottom-0 -translate-x-px border-l-[1.5px] border-dashed",
              step.done ? lineColor : lineColorMuted,
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
          placeholder="단계 내용"
          onChange={(e) =>
            updateStep(actionId, stepId, { content: e.target.value })
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
          }}
        />
        <InputGroupInput
          className="h-auto py-0 text-xs text-muted-foreground"
          value={step.completion}
          placeholder="완료 조건"
          onChange={(e) =>
            updateStep(actionId, stepId, { completion: e.target.value })
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
          }}
        />
      </div>
    </InputGroup>
  );
}
