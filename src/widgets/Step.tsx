import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/shared/ui/input-group";
import { cn } from "@/shared/lib/utils";
import { useFlowStore } from "@/entities/store";
import { DoneButton } from "./Buttons";

const PROGRESS_LINE_ACTIVE = "border-blue-400";
const PROGRESS_LINE_INACTIVE = "border-muted-foreground/30";

function ProgressLine({
  position,
  active,
}: {
  position: "top" | "bottom";
  active: boolean;
}) {
  return (
    <div
      className={cn(
        "absolute left-1/2 -translate-x-px border-l-[1.5px] border-dashed",
        position === "top" ? "top-0 h-2.5" : "top-5 bottom-0",
        active ? PROGRESS_LINE_ACTIVE : PROGRESS_LINE_INACTIVE,
      )}
    />
  );
}

type StepInputFieldProps = {
  stepId: string;
  isFirst: boolean;
  isLast: boolean;
  prevStepId: string | null;
};

export function StepInputField({
  stepId,
  isFirst,
  isLast,
  prevStepId,
}: StepInputFieldProps) {
  const step = useFlowStore((s) => s.stepsById[stepId]);
  const prevDone = useFlowStore((s) =>
    prevStepId ? (s.stepsById[prevStepId]?.done ?? false) : false,
  );
  const updateStep = useFlowStore((s) => s.updateStep);

  const handleBlur = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Escape") e.currentTarget.blur();
  };

  if (!step) return null;
  return (
    <InputGroup variant="ghost" className="h-auto w-full items-stretch pl-7">
      <InputGroupAddon className="relative flex-col items-center justify-start gap-0 py-0 pl-0">
        {!isFirst && <ProgressLine position="top" active={prevDone} />}
        {!isLast && <ProgressLine position="bottom" active={step.done} />}
        <DoneButton
          done={step.done}
          onClick={() => updateStep(stepId, { done: !step.done })}
          className="relative z-10 rounded-full bg-background"
        />
      </InputGroupAddon>
      <div className={cn("flex flex-col", !isLast && "pb-5")}>
        <InputGroupInput
          className="h-auto py-0 text-sm font-semibold"
          value={step.content}
          placeholder="Step을 정의해주세요."
          onChange={(e) => updateStep(stepId, { content: e.target.value })}
          onKeyDown={handleBlur}
        />
        <InputGroupInput
          className="h-auto py-0 text-xs text-muted-foreground"
          value={step.completion}
          placeholder="Step을 완료한 상태를 한 문장으로 정의해주세요."
          onChange={(e) => updateStep(stepId, { completion: e.target.value })}
          onKeyDown={handleBlur}
        />
      </div>
    </InputGroup>
  );
}
