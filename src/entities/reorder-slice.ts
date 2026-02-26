import type { StateCreator } from "zustand/vanilla";
import type {} from "zustand/middleware/immer";
import type { ActionId, SectionKey, StepId } from "./types";
import type { FlowStore } from "./store";

export type ReorderSlice = {
  moveStep: (stepId: StepId, targetIndex: number) => void;
  moveAction: (actionId: ActionId, targetIndex: number) => void;
  moveActionToSection: (
    actionId: ActionId,
    targetSection: SectionKey,
    targetIndex: number,
  ) => void;
};

export const createReorderSlice: StateCreator<
  FlowStore,
  [["zustand/immer", never]],
  [],
  ReorderSlice
> = (set) => ({
  moveStep: (stepId, targetIndex) => {
    set((draft) => {
      const step = draft.stepsById[stepId];
      if (!step) return;

      const action = draft.actionsById[step.actionId];
      if (!action) return;

      const currIndex = action.stepIds.indexOf(stepId);
      if (currIndex === -1) return;

      action.stepIds.splice(currIndex, 1);
      action.stepIds.splice(targetIndex, 0, stepId);
    });
  },

  moveAction: (actionId, targetIndex) => {
    set((draft) => {
      const action = draft.actionsById[actionId];
      if (!action) return;

      const actionIds = draft.sectionsByKey[action.sectionKey];
      const currActionIdx = actionIds.indexOf(actionId);

      if (currActionIdx === -1) return;

      actionIds.splice(currActionIdx, 1);
      actionIds.splice(targetIndex, 0, actionId);
    });
  },

  moveActionToSection: (actionId, targetSection, targetIndex) => {
    set((draft) => {
      const action = draft.actionsById[actionId];

      if (!action) return;

      const actionIdsInCurrSection = draft.sectionsByKey[action.sectionKey];
      const actionIdxInCurrSection = actionIdsInCurrSection.indexOf(actionId);

      if (actionIdxInCurrSection === -1) return;

      actionIdsInCurrSection.splice(actionIdxInCurrSection, 1);

      draft.sectionsByKey[targetSection].splice(targetIndex, 0, actionId);
      action.sectionKey = targetSection;
    });
  },
});
