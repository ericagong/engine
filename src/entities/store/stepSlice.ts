import type { StateCreator } from "zustand/vanilla";
import type {} from "zustand/middleware/immer";
import { type Step } from "@/entities/types";
import type { FlowStore } from "./store";
import { uid } from "@/shared/lib/utils";

export type StepSlice = {
  createStep: (actionId: string) => void;
  updateStep: (
    stepId: string,
    patch: Partial<Pick<Step, "content" | "completion" | "done">>,
  ) => void;
  deleteStep: (stepId: string) => void;
};

export const createStepSlice: StateCreator<
  FlowStore,
  [["zustand/immer", never]],
  [],
  StepSlice
> = (set) => ({
  createStep: (actionId) => {
    set((draft) => {
      const action = draft.actionsById[actionId];

      if (!action) return;

      const stepId = uid();

      const newStep: Step = {
        id: stepId,
        actionId,
        content: "",
        completion: "",
        done: false,
      };

      draft.stepsById[stepId] = newStep;

      action.stepIds.push(stepId);
    });
  },

  updateStep: (stepId, patch) => {
    set((draft) => {
      const step = draft.stepsById[stepId];

      if (!step) return;

      Object.assign(step, patch);
    });
  },

  deleteStep: (stepId) => {
    set((draft) => {
      const step = draft.stepsById[stepId];
      if (!step) return;

      const action = draft.actionsById[step.actionId];
      if (action) {
        const idx = action.stepIds.indexOf(stepId);
        if (idx !== -1) action.stepIds.splice(idx, 1);
      }

      delete draft.stepsById[stepId];
    });
  },
});
