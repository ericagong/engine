import type { DraggableSyntheticListeners } from "@dnd-kit/core";
import { ChevronDown, ChevronUp, GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { cn } from "@/shared/lib/utils";

type DeleteButtonProps = {
  onClick: () => void;
};

const DeleteButton = ({ onClick }: DeleteButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="icon-xs"
      className="opacity-0 transition-opacity hover:text-destructive group-hover/action:opacity-60"
      onClick={onClick}
      aria-label="Action 삭제"
      tabIndex={-1}
    >
      <Trash2 className="h-3.5 w-3.5" />
    </Button>
  );
};

type ToggleExpandButtonProps = {
  expanded: boolean;
  onClick: () => void;
};

const ToggleExpandButton = ({ expanded, onClick }: ToggleExpandButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="icon-xs"
      onClick={onClick}
      aria-label="단계 펼치기/접기"
    >
      {expanded ? (
        <ChevronUp className="h-3.5 w-3.5" />
      ) : (
        <ChevronDown className="h-3.5 w-3.5" />
      )}
    </Button>
  );
};

type DoneButtonProps = {
  done: boolean;
  onClick: () => void;
  className?: string;
};

const DoneButton = ({ done, onClick, className }: DoneButtonProps) => {
  return (
    <Checkbox
      className={cn("rounded-[2px]", className)}
      checked={done}
      onCheckedChange={onClick}
      aria-label="완료 토글"
    />
  );
};

type DragHandleButtonProps = {
  handleRef: (element: HTMLElement | null) => void;
  listeners: DraggableSyntheticListeners;
  attributes: React.HTMLAttributes<HTMLButtonElement>;
};

const DragHandleButton = ({
  handleRef,
  listeners,
  attributes,
}: DragHandleButtonProps) => {
  return (
    <button
      ref={handleRef}
      className="flex size-6 shrink-0 cursor-grab items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity active:cursor-grabbing group-hover/action:opacity-60"
      {...attributes}
      {...listeners}
    >
      <GripVertical className="h-3.5 w-3.5" />
    </button>
  );
};

export { DeleteButton, ToggleExpandButton, DoneButton, DragHandleButton };
