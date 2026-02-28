import type { StateCreator } from "zustand/vanilla";
import type {} from "zustand/middleware/immer";
import type { ActionId, SectionKey, StepId } from "@/entities/types";
import type { FlowStore } from "./store";

export type ReorderSlice = {
  reorderStepWithinAction: (stepId: StepId, toIndex: number) => void;
  reorderActionWithinSection: (actionId: ActionId, toIndex: number) => void;
  reorderActionAcrossSections: (
    actionId: ActionId,
    toSection: SectionKey,
    toIndex: number,
  ) => void;
};

const moveItem = <T>(list: T[], fromIndex: number, toIndex: number) => {
  if (fromIndex === toIndex) return;
  if (fromIndex < 0 || fromIndex >= list.length) return;

  const clamped =
    toIndex < 0 ? 0 : toIndex > list.length ? list.length : toIndex;

  const [item] = list.splice(fromIndex, 1);
  list.splice(clamped, 0, item);
};

export const createReorderSlice: StateCreator<
  FlowStore,
  [["zustand/immer", never]],
  [],
  ReorderSlice
> = (set) => ({
  reorderStepWithinAction: (stepId, toIndex) => {
    set((draft) => {
      const step = draft.stepsById[stepId];
      if (!step) return;

      const action = draft.actionsById[step.actionId];
      if (!action) return;

      const fromIndex = action.stepIds.indexOf(stepId);
      moveItem(action.stepIds, fromIndex, toIndex);
    });
  },

  reorderActionWithinSection: (actionId, toIndex) => {
    set((draft) => {
      const action = draft.actionsById[actionId];
      if (!action) return;

      const ids = draft.sectionsByKey[action.sectionKey];
      const fromIndex = ids.indexOf(actionId);
      moveItem(ids, fromIndex, toIndex);
    });
  },

  reorderActionAcrossSections: (actionId, toSection, toIndex) => {
    set((draft) => {
      const action = draft.actionsById[actionId];
      if (!action) return;

      const fromSection = action.sectionKey;

      // 같은 섹션이면 "within" 의미를 유지
      if (fromSection === toSection) {
        const ids = draft.sectionsByKey[fromSection];
        const fromIndex = ids.indexOf(actionId);
        moveItem(ids, fromIndex, toIndex);
        return;
      }

      const fromIds = draft.sectionsByKey[fromSection];
      const fromIndex = fromIds.indexOf(actionId);
      if (fromIndex === -1) return;

      fromIds.splice(fromIndex, 1);
      draft.sectionsByKey[toSection].splice(toIndex, 0, actionId);

      action.sectionKey = toSection;
    });
  },
});

export { moveItem };
