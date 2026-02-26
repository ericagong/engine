const positionClass = {
  top: "absolute -top-[5px] left-0 right-0 z-20 h-[3px] rounded-full bg-blue-400/60",
  bottom:
    "absolute -bottom-[5px] left-0 right-0 z-20 h-[3px] rounded-full bg-blue-400/60",
  "section-top":
    "absolute left-0 right-0 bottom-0 z-20 h-[3px] rounded-full bg-blue-400/60",
  "section-bottom":
    "absolute left-0 right-0 top-0 z-20 h-[3px] rounded-full bg-blue-400/60",
} as const;

export function DropIndicator({
  position,
}: {
  position: keyof typeof positionClass;
}) {
  return <div className={positionClass[position]} />;
}
