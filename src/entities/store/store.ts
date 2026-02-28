import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type {} from "zustand/middleware/immer";
import type { StateCreator } from "zustand/vanilla";
import type { FlowState } from "@/entities/types";
import type { ActionSlice } from "./actionSlice";
import type { StepSlice } from "./stepSlice";
import type { ReorderSlice } from "./reorderSlice";
import { createActionSlice } from "./actionSlice";
import { createStepSlice } from "./stepSlice";
import { createReorderSlice } from "./reorderSlice";

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
