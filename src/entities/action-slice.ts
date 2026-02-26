import type { StateCreator } from "zustand/vanilla";
import type {} from "zustand/middleware/immer";
import type { Action, SectionKey } from "./types";
import type { FlowStore } from "./store";
import { uid } from "@/shared/lib/utils";

export type ActionSlice = {
  createAction: (sectionKey: SectionKey) => void;
  updateAction: (
    actionId: string,
    patch: Partial<Pick<Action, "content" | "done">>,
  ) => void;
  deleteAction: (actionId: string) => void;
};

export const createActionSlice: StateCreator<
  FlowStore,
  [["zustand/immer", never]],
  [],
  ActionSlice
> = (set) => ({
  createAction: (sectionKey) => {
    const actionId = uid();
    const newAction: Action = {
      id: actionId,
      sectionKey,
      content: "",
      stepIds: [],
      done: false,
    };

    set((draft) => {
      draft.actionsById[actionId] = newAction;
      draft.sectionsByKey[sectionKey].unshift(actionId);
    });
  },

  updateAction: (actionId, patch) => {
    set((draft) => {
      const action = draft.actionsById[actionId];

      if (!action) return;

      Object.assign(action, patch);
    });
  },

  deleteAction: (actionId) => {
    set((draft) => {
      const action = draft.actionsById[actionId];

      if (!action) return;
      const sectionKey = action.sectionKey;

      const idx = draft.sectionsByKey[sectionKey].indexOf(actionId);
      if (idx !== -1) draft.sectionsByKey[sectionKey].splice(idx, 1);

      delete draft.actionsById[actionId];

      for (const stepId of action.stepIds) {
        delete draft.stepsById[stepId];
      }
    });
  },
});
