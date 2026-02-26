import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Checkbox } from "@/shared/ui/checkbox";
import { Collapsible, CollapsibleContent } from "@/shared/ui/collapsible";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/shared/ui/input-group";
import { useFlowStore } from "@/entities/store";
import { MAX_STEPS_PER_ACTION } from "@/entities/types";
import { StepDndContext } from "@/features/dnd/StepDndContext";
import { SortableStep } from "@/features/dnd/SortableStep";
import { StepItem } from "./StepItem";

export function ActionCard({ actionId }: { actionId: string }) {
  const action = useFlowStore((s) => s.actionsById[actionId]);
  const toggleActionDone = useFlowStore((s) => s.toggleActionDone);
  const updateActionContent = useFlowStore((s) => s.updateActionContent);
  const initializeSteps = useFlowStore((s) => s.initializeSteps);
  const removeEmptyAction = useFlowStore((s) => s.removeEmptyAction);

  const [stepsExpanded, setStepsExpanded] = useState(false);

  if (!action) return null;

  const toggleStepsPanel = () => {
    if (action.steps.length === 0) {
      initializeSteps(actionId, MAX_STEPS_PER_ACTION);
      setStepsExpanded(true);
    } else {
      setStepsExpanded((prev) => !prev);
    }
  };

  const stepIds = action.steps.map((s) => s.id);

  return (
    <Card className="group/card">
      <div className="flex items-center pl-3 pr-1">
        {/* Action content + 체크 */}
        <InputGroup variant="ghost" className="flex-1">
          <InputGroupAddon>
            <Checkbox
              className="rounded-[2px]"
              checked={action.done}
              onCheckedChange={() => toggleActionDone(actionId)}
              aria-label="완료 토글"
            />
          </InputGroupAddon>
          <InputGroupInput
            className={`text-sm ${
              action.done ? "text-muted-foreground line-through opacity-60" : ""
            }`}
            value={action.content}
            placeholder="Action을 정의해주세요."
            onChange={(e) => updateActionContent(actionId, e.target.value)}
            onBlur={() => removeEmptyAction(actionId)}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
            }}
          />
        </InputGroup>

        {/* chevron */}
        <div className="flex shrink-0 items-center pr-4">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={toggleStepsPanel}
            aria-label="단계 펼치기/접기"
          >
            {stepsExpanded ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>

      {/* Step 목록: StepDndContext로 래핑 */}
      <Collapsible open={stepsExpanded} onOpenChange={setStepsExpanded}>
        <CollapsibleContent>
          <CardContent className="flex flex-col pl-5 pr-3 pb-2 pt-3">
            <StepDndContext actionId={actionId} stepIds={stepIds}>
              {action.steps.map((step, i) => (
                <SortableStep
                  key={step.id}
                  actionId={actionId}
                  stepId={step.id}
                >
                  <StepItem
                    actionId={actionId}
                    stepId={step.id}
                    isFirst={i === 0}
                    isLast={i === action.steps.length - 1}
                    prevDone={i > 0 ? action.steps[i - 1].done : false}
                  />
                </SortableStep>
              ))}
            </StepDndContext>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
