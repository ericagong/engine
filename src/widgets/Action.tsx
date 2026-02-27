import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { SectionKey } from "@/entities/types";
import { Card, CardAction, CardContent, CardHeader } from "@/shared/ui/card";
import { Collapsible, CollapsibleContent } from "@/shared/ui/collapsible";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/shared/ui/input-group";
import { cn } from "@/shared/lib/utils";
import { useFlowStore } from "@/entities/store";
import {
  DoneButton,
  DragActiveButton,
  ToggleExpandButton,
  DeleteButton,
} from "./Buttons";
import { StepInputField } from "./Step";

const MAX_STEPS_PER_ACTION = 3;

export type ActionId = string;

type ActionInputFieldProps = {
  actionId: ActionId;
};

function ActionInputField({ actionId }: ActionInputFieldProps) {
  const action = useFlowStore((s) => s.actionsById[actionId]);
  const updateAction = useFlowStore((s) => s.updateAction);

  if (!action) return null;
  return (
    <InputGroup variant="ghost" className="flex-1">
      <InputGroupAddon>
        <DoneButton
          done={action.done}
          onClick={() => updateAction(actionId, { done: !action.done })}
        />
      </InputGroupAddon>
      <InputGroupInput
        className={cn(
          "text-sm",
          action.done && "text-muted-foreground line-through opacity-60",
        )}
        value={action.content}
        placeholder="Action을 정의해주세요."
        onChange={(e) => updateAction(actionId, { content: e.target.value })}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
        }}
        aria-label="Action 내용 입력"
      />
    </InputGroup>
  );
}

type ActionCardProps = {
  actionId: ActionId;
  sectionKey: SectionKey;
};

export type ActionCardDragData = {
  sectionKey: SectionKey;
};

export function ActionCard({ actionId, sectionKey }: ActionCardProps) {
  const action = useFlowStore((s) => s.actionsById[actionId]);
  const deleteAction = useFlowStore((s) => s.deleteAction);
  const createStep = useFlowStore((s) => s.createStep);

  const {
    setNodeRef,
    setActivatorNodeRef,
    listeners,
    transform,
    transition,
    isDragging,
    isOver,
    index,
    activeIndex,
  } = useSortable({
    id: actionId,
    data: { sectionKey } satisfies ActionCardDragData,
  });

  const showTopIndicator =
    isOver && (activeIndex === -1 || activeIndex > index);
  const showBottomIndicator =
    isOver && activeIndex !== -1 && activeIndex < index;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };

  const [showSteps, setShowSteps] = useState(false);

  const hasSteps = action?.stepIds?.length > 0;

  const initializeSteps = () => {
    Array.from({ length: MAX_STEPS_PER_ACTION }).forEach(() =>
      createStep(actionId),
    );
  };

  const toggleStepsPanel = () => {
    if (!hasSteps) {
      initializeSteps();
      setShowSteps(true);
    } else setShowSteps((prev) => !prev);
  };

  if (!action) return null;
  return (
    <div ref={setNodeRef} style={style} className="group/action">
      {showTopIndicator && <DropIndicator />}
      <Card>
        <CardHeader className="flex flex-row items-center gap-0 pl-1 pr-3 py-0">
          <CardAction className="self-center">
            <DragActiveButton
              handleRef={setActivatorNodeRef}
              listeners={listeners}
            />
          </CardAction>
          <ActionInputField actionId={actionId} />
          <CardAction className="flex flex-row items-center self-center">
            <DeleteButton onClick={() => deleteAction(actionId)} />
            <ToggleExpandButton
              expanded={showSteps}
              onClick={toggleStepsPanel}
            />
          </CardAction>
        </CardHeader>
        <Collapsible open={showSteps} onOpenChange={toggleStepsPanel}>
          <CollapsibleContent>
            <CardContent className="flex flex-col pl-5 pr-3 pb-2 pt-3">
              {action.stepIds.map((stepId, i) => (
                <StepInputField
                  key={stepId}
                  stepId={stepId}
                  isFirst={i === 0}
                  isLast={i === action.stepIds.length - 1}
                  prevStepId={i > 0 ? action.stepIds[i - 1] : null}
                />
              ))}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
      {showBottomIndicator && <DropIndicator />}
    </div>
  );
}

function DropIndicator() {
  return <div className="h-0.5 rounded-full bg-blue-500" />;
}
