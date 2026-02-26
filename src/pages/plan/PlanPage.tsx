import { BoardLayout } from "@/widgets/board/BoardLayout";
import { Section } from "@/widgets/board/Section";

export function PlanPage() {
  return (
    <BoardLayout
      main={<Section section="current" label="Current" />}
      secondary={
        <>
          <Section section="keep" label="Keep" />
          <Section section="try" label="Try" />
          <Section section="queue" label="Queue" />
        </>
      }
    />
  );
}
