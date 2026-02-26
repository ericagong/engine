import type { Phase } from "@/entities/types";
import { useCurrentPhase } from "@/entities/useCurrentPhase";

const PHASE_INFO: Record<Phase, { label: string; guideMessage: string }> = {
  plan: {
    label: "Plan",
    guideMessage: "다음 90분 간 집중할 목표를 세워보세요.",
  },
  execute: {
    label: "Execute",
    guideMessage:
      "90분 동안 3개의 action을 step별로 실행하세요.\n작업 중 필요한 기록은 Backlog에 작성하세요.",
  },
  reflect: {
    label: "Reflect",
    guideMessage:
      "90분간 집중한 결과를 회고하세요.\nBacklog에 작성한 기록을 Keep/Try/Queue로 분류해주세요.",
  },
};

export function BoardHeader() {
  const phase = useCurrentPhase();

  if (!phase) return null;

  const info = PHASE_INFO[phase];

  return (
    <div className="h-24 px-6 pt-6 pb-2">
      <h1 className="text-2xl font-bold">{info.label}</h1>
      <p className="mt-1 text-sm text-muted-foreground whitespace-pre-line">
        {info.guideMessage}
      </p>
    </div>
  );
}
