import type { StateCreator } from "zustand";
import type { Action, FlowState, SectionKey } from "./types";
import { uid } from "@/shared/lib/utils";

// Action 삭제 공통 헬퍼
function purgeAction(
  actionsById: FlowState["actionsById"],
  sections: FlowState["sections"],
  actionId: string,
): Pick<FlowState, "actionsById" | "sections"> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [actionId]: _, ...restActions } = actionsById;
  const newSections = { ...sections };
  for (const key of Object.keys(newSections) as SectionKey[]) {
    newSections[key] = newSections[key].filter((id) => id !== actionId);
  }
  return { actionsById: restActions, sections: newSections };
}

export type ActionSlice = {
  createAction: (sectionKey: SectionKey) => void;
  updateActionContent: (actionId: string, content: string) => void;
  toggleActionDone: (actionId: string) => void;
  removeEmptyAction: (actionId: string) => void;
  removeAction: (actionId: string) => void;
};

export const createActionSlice: StateCreator<
  FlowState & ActionSlice,
  [],
  [],
  ActionSlice
> = (set) => ({
  createAction: (sectionKey) => {
    const id = uid();
    const newAction: Action = { id, content: "", steps: [], done: false };
    set((s) => ({
      actionsById: { ...s.actionsById, [id]: newAction },
      sections: {
        ...s.sections,
        [sectionKey]: [id, ...s.sections[sectionKey]],
      },
    }));
  },

  updateActionContent: (actionId, content) => {
    set((s) => {
      const action = s.actionsById[actionId];
      if (!action) return s;
      return {
        actionsById: {
          ...s.actionsById,
          [actionId]: { ...action, content },
        },
      };
    });
  },

  toggleActionDone: (actionId) => {
    set((s) => {
      const action = s.actionsById[actionId];
      if (!action) return s;
      return {
        actionsById: {
          ...s.actionsById,
          [actionId]: { ...action, done: !action.done },
        },
      };
    });
  },

  // content가 비어 있으면 자동 삭제
  removeEmptyAction: (actionId) => {
    set((s) => {
      const action = s.actionsById[actionId];
      if (!action) return s;
      if (action.content.trim() !== "") return s;
      return purgeAction(s.actionsById, s.sections, actionId);
    });
  },

  removeAction: (actionId) => {
    set((s) => purgeAction(s.actionsById, s.sections, actionId));
  },
});
