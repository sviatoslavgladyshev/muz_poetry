/**
 * Static stand-in for the 3D scene, shown while the WebGL chunk loads and left in
 * place permanently when WebGL is unavailable.
 *
 * It is pure CSS: a dark wall, a lit doorway, two panels and a warm seam. Not a
 * substitute for the real thing, but it holds the same composition so the hero
 * copy always sits against the background it was designed for.
 */
export function DoorHeroFallback({ animated = true }: { animated?: boolean }) {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-[#120609]">
      {/* Atmospheric light pooling around the doorway. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(227,199,137,0.14),transparent_62%)]" />

      {/* The doorway itself, matching the carved walnut framing. */}
      <div className="absolute top-1/2 left-1/2 h-[86svh] w-[min(58svh,86vw)] -translate-x-1/2 -translate-y-1/2">
        <div className="absolute -inset-x-[7%] -top-[5%] h-[8%] bg-[#704333] shadow-[0_0_120px_rgba(0,0,0,0.9)] ring-1 ring-[#a46f57]/50" />
        <div className="absolute inset-0 rounded-[2px] bg-[#3c211c] shadow-[0_0_120px_rgba(0,0,0,0.9)] ring-1 ring-[#9a6850]/50" />

        {/* Narrow left leaf and wider two-column right leaf. */}
        <div className="absolute inset-[3%] flex gap-[2px]">
          <div className="w-[35%] rounded-[2px] bg-gradient-to-br from-[#8a5945] to-[#4c2b23] ring-1 ring-[#c79a7e]/30" />
          <div className="flex-1 rounded-[2px] bg-gradient-to-bl from-[#8a5945] to-[#4c2b23] ring-1 ring-[#c79a7e]/30" />
        </div>

        <div className="absolute inset-y-[6%] left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#c6963d]/45 to-transparent" />

        {animated && (
          <div className="absolute inset-0 animate-pulse rounded-[2px] bg-[radial-gradient(ellipse_at_center,rgba(227,199,137,0.06),transparent_70%)]" />
        )}
      </div>

      {/* Vignette, so the copy always has contrast to sit against. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.72)_100%)]" />
    </div>
  );
}
