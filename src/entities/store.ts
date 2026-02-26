import { create } from "zustand";
import type { FlowState } from "./types";
import { createActionSlice, type ActionSlice } from "./action-slice";
import { createStepSlice, type StepSlice } from "./step-slice";
import { createReorderSlice, type ReorderSlice } from "./reorder-slice";

export { findSectionByActionId } from "./reorder-slice";

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

type FlowStore = FlowState & ActionSlice & StepSlice & ReorderSlice;

export const useFlowStore = create<FlowStore>()((...args) => ({
  ...initialState,
  ...createActionSlice(...args),
  ...createStepSlice(...args),
  ...createReorderSlice(...args),
}));
