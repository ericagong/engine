import type { StateCreator } from "zustand";
import type { FlowState, SectionKey } from "./types";

// active action이 속한 섹션을 찾는 헬퍼
export function findSectionByActionId(
  sections: FlowState["sections"],
  actionId: string,
): SectionKey | null {
  for (const [key, ids] of Object.entries(sections)) {
    if (ids.includes(actionId)) return key as SectionKey;
  }
  return null;
}

export type ReorderSlice = {
  reorderStepsWithinAction: (
    actionId: string,
    oldIndex: number,
    newIndex: number,
  ) => void;
  reorderActionWithinSection: (
    sectionKey: SectionKey,
    oldIndex: number,
    newIndex: number,
  ) => void;
  moveActionToSection: (
    actionId: string,
    fromSection: SectionKey,
    toSection: SectionKey,
    toIndex: number,
  ) => void;
};

export const createReorderSlice: StateCreator<
  FlowState & ReorderSlice,
  [],
  [],
  ReorderSlice
> = (set) => ({
  reorderStepsWithinAction: (actionId, oldIndex, newIndex) => {
    set((s) => {
      const action = s.actionsById[actionId];
      if (!action) return s;
      const steps = [...action.steps];
      const [moved] = steps.splice(oldIndex, 1);
      steps.splice(newIndex, 0, moved);
      return {
        actionsById: {
          ...s.actionsById,
          [actionId]: { ...action, steps },
        },
      };
    });
  },

  reorderActionWithinSection: (sectionKey, oldIndex, newIndex) => {
    set((s) => {
      const ids = [...s.sections[sectionKey]];
      const [moved] = ids.splice(oldIndex, 1);
      ids.splice(newIndex, 0, moved);
      return {
        sections: { ...s.sections, [sectionKey]: ids },
      };
    });
  },

  moveActionToSection: (actionId, fromSection, toSection, toIndex) => {
    set((s) => {
      const from = s.sections[fromSection].filter((id) => id !== actionId);
      const to = [...s.sections[toSection]];
      to.splice(toIndex, 0, actionId);
      return {
        sections: {
          ...s.sections,
          [fromSection]: from,
          [toSection]: to,
        },
      };
    });
  },
});
