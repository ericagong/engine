import { Board } from "@/widgets/Board";
import { Section } from "@/widgets/Section";

export function PlanPage() {
  return (
    <Board
      main={<Section sectionKey="current" label="Current" />}
      secondary={
        <>
          <Section sectionKey="keep" label="Keep" />
          <Section sectionKey="try" label="Try" />
          <Section sectionKey="queue" label="Queue" />
        </>
      }
    />
  );
}
