import { create } from "zustand";
import type { Action, FlowState, Section, Step } from "./types";

// 유니크 ID 생성 유틸
let counter = 0;
function uid(): string {
  return `${Date.now()}-${++counter}`;
}

// 빈 초기 상태
const initialState: FlowState = {
  sections: {
    current: [],
    queue: [],
    keep: [],
    try: [],
    backlog: [],
  },
  actionsById: {},
};

type FlowActions = {
  // Action CRUD
  createAction: (section: Section) => void;
  updateAction: (actionId: string, content: string) => void;
  toggleActionDone: (actionId: string) => void;
  commitActionContent: (actionId: string) => void;
  removeAction: (actionId: string) => void;

  // Step CRUD
  createStep: (actionId: string) => void;
  updateStep: (
    actionId: string,
    stepId: string,
    patch: Partial<Pick<Step, "content" | "completion">>,
  ) => void;
  toggleStepDone: (actionId: string, stepId: string) => void;

  // DnD
  reorderStepsWithinAction: (
    actionId: string,
    oldIndex: number,
    newIndex: number,
  ) => void;
  reorderActionWithinSection: (
    section: Section,
    oldIndex: number,
    newIndex: number,
  ) => void;
  moveAction: (
    actionId: string,
    fromSection: Section,
    toSection: Section,
    toIndex: number,
  ) => void;
};

export const useFlowStore = create<FlowState & FlowActions>()((set) => ({
  ...initialState,

  // --- Action CRUD ---
  createAction: (section) => {
    const id = uid();
    const newAction: Action = { id, content: "", steps: [], done: false };
    set((s) => ({
      actionsById: { ...s.actionsById, [id]: newAction },
      sections: {
        ...s.sections,
        [section]: [...s.sections[section], id],
      },
    }));
  },

  updateAction: (actionId, content) => {
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
  commitActionContent: (actionId) => {
    set((s) => {
      const action = s.actionsById[actionId];
      if (!action) return s;
      if (action.content.trim() !== "") return s;

      // content가 비어 있으므로 삭제
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [actionId]: _, ...restActions } = s.actionsById;
      const sections = { ...s.sections };
      for (const key of Object.keys(sections) as Section[]) {
        sections[key] = sections[key].filter((id) => id !== actionId);
      }
      return { actionsById: restActions, sections };
    });
  },

  removeAction: (actionId) => {
    set((s) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [actionId]: _, ...restActions } = s.actionsById;
      const sections = { ...s.sections };
      for (const key of Object.keys(sections) as Section[]) {
        sections[key] = sections[key].filter((id) => id !== actionId);
      }
      return { actionsById: restActions, sections };
    });
  },

  // --- Step CRUD ---
  createStep: (actionId) => {
    set((s) => {
      const action = s.actionsById[actionId];
      if (!action || action.steps.length >= 3) return s;
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

  updateStep: (actionId, stepId, patch) => {
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

  // --- DnD ---
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

  reorderActionWithinSection: (section, oldIndex, newIndex) => {
    set((s) => {
      const ids = [...s.sections[section]];
      const [moved] = ids.splice(oldIndex, 1);
      ids.splice(newIndex, 0, moved);
      return {
        sections: { ...s.sections, [section]: ids },
      };
    });
  },

  moveAction: (actionId, fromSection, toSection, toIndex) => {
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
}));
