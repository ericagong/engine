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

// IDB에 저장되는 영속 데이터
export type PersistedFlowState = {
  sectionsByKey: Record<SectionKey, ActionId[]>;
  actionsById: Record<ActionId, Action>;
  stepsById: Record<StepId, Step>;
};

// 영속 데이터 + 런타임 플래그
export type FlowState = PersistedFlowState & {
  _hydrated: boolean;
};

export type Phase = "plan" | "execute" | "reflect";
