import type { SectionKey } from "@/entities/types";

export type ActionDragData = {
  type: "action";
  actionId: string;
  section: SectionKey;
};
export type StepDragData = { type: "step"; actionId: string; stepId: string };
export type SectionDropData = { type: "section"; section: SectionKey };
export type SectionTopDropData = { type: "section-top"; section: SectionKey };
export type SectionBottomDropData = {
  type: "section-bottom";
  section: SectionKey;
};

export type DndData =
  | ActionDragData
  | StepDragData
  | SectionDropData
  | SectionTopDropData
  | SectionBottomDropData;
