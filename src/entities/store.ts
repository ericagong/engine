import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type {} from "zustand/middleware/immer";
import type { StateCreator } from "zustand/vanilla";
import type { FlowState } from "./types";
import type { ActionSlice } from "./action-slice";
import type { StepSlice } from "./step-slice";
import type { ReorderSlice } from "./reorder-slice";
import { createActionSlice } from "./action-slice";
import { createStepSlice } from "./step-slice";
import { createReorderSlice } from "./reorder-slice";

export type FlowStore = FlowState & ActionSlice & StepSlice & ReorderSlice;

const initialState: FlowState = {
  sectionsByKey: {
    current: [],
    queue: [],
    keep: [],
    try: [],
    backlog: [],
  },
  actionsById: {},
  stepsById: {},
};

const flowInitializer = immer<FlowStore>((...args) => ({
  ...initialState,
  ...createActionSlice(...args),
  ...createStepSlice(...args),
  ...createReorderSlice(...args),
})) as unknown as StateCreator<FlowStore>;

export const useFlowStore = create<FlowStore>()(flowInitializer);
