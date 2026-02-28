import { useState } from "react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type Modifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ActionId, SectionKey } from "@/entities/types";
import { GripVertical } from "lucide-react";
import { Card, CardAction, CardContent, CardHeader } from "@/shared/ui/card";
import { Collapsible, CollapsibleContent } from "@/shared/ui/collapsible";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/shared/ui/input-group";
import { Checkbox } from "@/shared/ui/checkbox";
import { cn } from "@/shared/lib/utils";
import { useFlowStore } from "@/entities/store/store";

type ActionDragData = {
  kind: "action-card";
  sectionKey: SectionKey;
};
import {
  DoneButton,
  DragHandleButton,
  ToggleExpandButton,
  DeleteButton,
} from "./Buttons";
import Step from "./Step";

const MAX_STEPS_PER_ACTION = 3;

const restrictToVerticalAxis: Modifier = ({ transform }) => ({
  ...transform,
  x: 0,
});

type ActionInputProps = {
  actionId: ActionId;
};

const ActionInput = ({ actionId }: ActionInputProps) => {
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
};

type StepDnDContextProps = {
  stepIds: string[];
};

const StepDnDContext = ({ stepIds }: StepDnDContextProps) => {
  const reorderStepWithinAction = useFlowStore(
    (s) => s.reorderStepWithinAction,
  );

  const stepSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  const handleStepDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const targetIndex = stepIds.indexOf(over.id as string);
    if (targetIndex >= 0) {
      reorderStepWithinAction(active.id as string, targetIndex);
    }
  };

  return (
    <DndContext
      sensors={stepSensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleStepDragEnd}
    >
      <SortableContext items={stepIds} strategy={verticalListSortingStrategy}>
        {stepIds.map((stepId, i) => (
          <Step
            key={stepId}
            stepId={stepId}
            isFirst={i === 0}
            isLast={i === stepIds.length - 1}
            prevStepId={i > 0 ? stepIds[i - 1] : null}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};

type ActionProps = {
  actionId: ActionId;
  sectionKey: SectionKey;
};

type ActionOverlayProps = {
  actionId: ActionId;
};

const ActionOverlay = ({ actionId }: ActionOverlayProps) => {
  const action = useFlowStore((s) => s.actionsById[actionId]);

  if (!action) return null;
  return (
    <div className="group/action">
      <Card>
        <CardHeader className="flex flex-row items-center gap-0 pl-1 pr-3 py-0">
          <CardAction className="self-center">
            <div className="flex size-6 shrink-0 cursor-grabbing items-center justify-center rounded-md text-muted-foreground opacity-60">
              <GripVertical className="h-3.5 w-3.5" />
            </div>
          </CardAction>
          <InputGroup variant="ghost" className="flex-1">
            <InputGroupAddon>
              <Checkbox
                className="rounded-[2px]"
                checked={action.done}
                aria-label="완료 토글"
              />
            </InputGroupAddon>
            <InputGroupInput
              className={cn(
                "text-sm",
                action.done && "text-muted-foreground line-through opacity-60",
              )}
              value={action.content}
              placeholder="Action을 정의해주세요."
              disabled
            />
          </InputGroup>
        </CardHeader>
      </Card>
    </div>
  );
};

const Action = ({ actionId, sectionKey }: ActionProps) => {
  const action = useFlowStore((s) => s.actionsById[actionId]);
  const deleteAction = useFlowStore((s) => s.deleteAction);
  const createStep = useFlowStore((s) => s.createStep);

  const {
    setNodeRef,
    setActivatorNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: actionId,
    data: { kind: "action-card", sectionKey } satisfies ActionDragData,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // 드래그 중 원본은 숨기고, DragOverlay(Board.tsx)가 미리보기를 대신 표시
    opacity: isDragging ? 0 : undefined,
  };

  const [showSteps, setShowSteps] = useState(false);

  const hasSteps = action?.stepIds?.length > 0;

  const initializeSteps = () => {
    Array.from({ length: MAX_STEPS_PER_ACTION }).forEach(() =>
      createStep(actionId),
    );
  };

  // TODO 그냥 Action 생성 단계에서 DB 내에서 3개 Step 자동으로 만들지, 아니면 코드에서 만들지 고려.
  const toggleStepsPanel = () => {
    if (!hasSteps) {
      initializeSteps();
      setShowSteps(true);
    } else setShowSteps((prev) => !prev);
  };

  if (!action) return null;
  return (
    <div ref={setNodeRef} style={style}>
      <div>
        <Card>
          <CardHeader className="group/action flex flex-row items-center gap-0 pl-1 pr-3 py-0">
            <CardAction className="self-center">
              <DragHandleButton
                handleRef={setActivatorNodeRef}
                attributes={attributes}
                listeners={listeners}
              />
            </CardAction>
            <ActionInput actionId={actionId} />
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
              <CardContent className="flex flex-col pl-8 pr-3 pb-2 pt-3">
                <StepDnDContext stepIds={action.stepIds} />
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </div>
    </div>
  );
};

export { ActionOverlay };
export default Action;
