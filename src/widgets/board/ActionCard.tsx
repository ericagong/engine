import { useState } from "react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useFlowStore } from "@/entities/board/model/store";
import { StepItem } from "./StepItem";

export function ActionCard({ actionId }: { actionId: string }) {
  const action = useFlowStore((s) => s.actionsById[actionId]);
  const toggleActionDone = useFlowStore((s) => s.toggleActionDone);
  const updateAction = useFlowStore((s) => s.updateAction);
  const removeAction = useFlowStore((s) => s.removeAction);
  const createStep = useFlowStore((s) => s.createStep);

  const [open, setOpen] = useState(false);

  if (!action) return null;

  const handleChevronClick = () => {
    if (action.steps.length === 0) {
      createStep(actionId);
      createStep(actionId);
      createStep(actionId);
      setOpen(true);
    } else {
      setOpen((prev) => !prev);
    }
  };

  return (
    <Card className="group/card">
      <div className="flex items-center">
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
            onChange={(e) => updateAction(actionId, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
            }}
          />
        </InputGroup>

        {/* chevron + 삭제 */}
        <div className="flex shrink-0 items-center gap-0.5 pr-1">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={handleChevronClick}
            aria-label="단계 펼치기/접기"
          >
            {open ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            className="opacity-0 transition-opacity hover:text-destructive group-hover/card:opacity-100"
            onClick={() => removeAction(actionId)}
            aria-label="Action 삭제"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Step 목록: Collapsible → CardContent */}
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleContent>
          <CardContent className="flex flex-col px-3 pb-2 pt-1">
            {action.steps.map((step, i) => (
              <StepItem
                key={step.id}
                actionId={actionId}
                stepId={step.id}
                isFirst={i === 0}
                isLast={i === action.steps.length - 1}
                prevDone={i > 0 ? action.steps[i - 1].done : false}
              />
            ))}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
