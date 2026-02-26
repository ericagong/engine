export type ActionId = string;
export type StepId = string;

export type SectionKey = "current" | "queue" | "keep" | "try" | "backlog";

export type Step = {
  id: StepId;
  actionId: ActionId;
  content: string;
  completion: string;
  done: boolean;
};

export type Action = {
  id: ActionId;
  sectionKey: SectionKey;
  content: string;
  stepIds: StepId[];
  done: boolean;
};

export type FlowState = {
  sectionsByKey: Record<SectionKey, ActionId[]>;
  actionsById: Record<ActionId, Action>;
  stepsById: Record<StepId, Step>;
};

export type Phase = "plan" | "execute" | "reflect";
