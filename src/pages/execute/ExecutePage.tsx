import { BoardLayout } from "@/widgets/board/BoardLayout";
import { Section } from "@/widgets/board/Section";

export function ExecutePage() {
  return (
    <BoardLayout
      main={
        <>
          <Section section="current" label="Current" />
          <Section section="backlog" label="Backlog" />
        </>
      }
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
