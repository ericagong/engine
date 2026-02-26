import type { StateCreator } from "zustand";
import { MAX_STEPS_PER_ACTION, type FlowState, type Step } from "./types";
import { uid } from "@/shared/lib/utils";

export type StepSlice = {
  createStep: (actionId: string) => void;
  updateStepContent: (
    actionId: string,
    stepId: string,
    patch: Partial<Pick<Step, "content" | "completion">>,
  ) => void;
  toggleStepDone: (actionId: string, stepId: string) => void;
  initializeSteps: (actionId: string, count: number) => void;
};

export const createStepSlice: StateCreator<
  FlowState & StepSlice,
  [],
  [],
  StepSlice
> = (set) => ({
  createStep: (actionId) => {
    set((s) => {
      const action = s.actionsById[actionId];
      if (!action || action.steps.length >= MAX_STEPS_PER_ACTION) return s;
      const newStep: Step = {
        id: uid(),
        content: "",
        completion: "",
        done: false,
      };
      return {
        actionsById: {
          ...s.actionsById,
          [actionId]: { ...action, steps: [...action.steps, newStep] },
        },
      };
    });
  },

  updateStepContent: (actionId, stepId, patch) => {
    set((s) => {
      const action = s.actionsById[actionId];
      if (!action) return s;
      const steps = action.steps.map((step) =>
        step.id === stepId ? { ...step, ...patch } : step,
      );
      return {
        actionsById: {
          ...s.actionsById,
          [actionId]: { ...action, steps },
        },
      };
    });
  },

  toggleStepDone: (actionId, stepId) => {
    set((s) => {
      const action = s.actionsById[actionId];
      if (!action) return s;
      const steps = action.steps.map((step) =>
        step.id === stepId ? { ...step, done: !step.done } : step,
      );
      return {
        actionsById: {
          ...s.actionsById,
          [actionId]: { ...action, steps },
        },
      };
    });
  },

  initializeSteps: (actionId, count) => {
    set((s) => {
      const action = s.actionsById[actionId];
      if (!action || action.steps.length > 0) return s;
      const newSteps: Step[] = Array.from({ length: count }, () => ({
        id: uid(),
        content: "",
        completion: "",
        done: false,
      }));
      return {
        actionsById: {
          ...s.actionsById,
          [actionId]: { ...action, steps: newSteps },
        },
      };
    });
  },
});
