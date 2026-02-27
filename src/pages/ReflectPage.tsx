import { Board } from "@/widgets/Board";
import { Section } from "@/widgets/Section";

export function ReflectPage() {
  return (
    <Board
      main={
        <>
          <Section sectionKey="current" label="Current" />
          <Section sectionKey="backlog" label="Backlog" />
        </>
      }
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
