export type Step = {
  id: string;
  content: string;
  completion: string;
  done: boolean;
};

export type Action = {
  id: string;
  content: string;
  steps: Step[];
  done: boolean;
};

export type Section = "current" | "queue" | "keep" | "try" | "backlog";

export type FlowState = {
  sections: Record<Section, string[]>;
  actionsById: Record<string, Action>;
};

export type Phase = "plan" | "execute" | "reflect";
