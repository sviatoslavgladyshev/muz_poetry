type DirectionBridgeProps = {
  phrases: string;
};

export function DirectionBridge({ phrases }: DirectionBridgeProps) {
  return (
    <div
      aria-hidden="true"
      className="direction-bridge relative flex flex-col justify-center overflow-hidden py-4 md:py-5"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="direction-bridge-marquee relative z-10 overflow-hidden">
        <div className="direction-bridge-marquee-track flex w-max gap-12 whitespace-nowrap px-4 text-xs font-semibold uppercase tracking-[0.32em] text-leaf/65">
          <span>{phrases}</span>
          <span aria-hidden="true">{phrases}</span>
        </div>
      </div>

      <div className="direction-bridge-marquee relative z-10 mt-1.5 overflow-hidden opacity-75">
        <div className="direction-bridge-marquee-track direction-bridge-marquee-track--reverse flex w-max gap-12 whitespace-nowrap px-4 text-[0.65rem] font-semibold uppercase tracking-[0.36em] text-primary/40">
          <span>{phrases}</span>
          <span aria-hidden="true">{phrases}</span>
        </div>
      </div>
    </div>
  );
}
