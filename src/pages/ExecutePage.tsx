import Board from "@/features/board/Board";
import Section from "@/features/board/Section";

const ExecutePage = () => {
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
};

export default ExecutePage;
