import Board from "@/features/board/Board";
import Section from "@/features/board/Section";

const PlanPage = () => {
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
};

export default PlanPage;
