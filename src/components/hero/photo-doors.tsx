"use client";

import Image from "next/image";
import { publicAssetPath } from "@/lib/utils";
import { NextSectionBody, type NextSectionCopy } from "./next-section-reveal";

/**
 * Historic door photograph that swings open like a real pair of leaves.
 *
 * The stage stays black. Only the clear opening between the leaves shows the
 * warm About copy — nowhere else.
 */

const DOOR_SRC = publicAssetPath("/images/historic-door.webp");
const IMAGE_W = 995;
const IMAGE_H = 1581;

const LEAF_TOP = 155;
const LEAF_BOTTOM = 1463;
const LEAF_HEIGHT = LEAF_BOTTOM - LEAF_TOP;
const LEFT_X = 166;
const SPLIT_X = 432;
const RIGHT_END = 828;
const LEFT_W = SPLIT_X - LEFT_X;
const RIGHT_X = SPLIT_X;
const RIGHT_W = RIGHT_END - RIGHT_X;
const RIGHT_EDGE = IMAGE_W - RIGHT_END;
const LEAF_FOOT = IMAGE_H - LEAF_BOTTOM;

/** Real doors rarely swing fully flat to the wall in a hero shot. */
const MAX_OPEN_DEG = 72;
/** Timber thickness — enough to read, not so much it looks toy-like. */
const DEPTH = 16;

const pct = (value: number, total: number) => `${(value / total) * 100}%`;

function PhotoCrop({
  left,
  top,
  width,
  height,
  cropX,
  cropY,
  cropW,
  cropH,
}: {
  left: string;
  top: string;
  width: string;
  height: string;
  cropX: number;
  cropY: number;
  cropW: number;
  cropH: number;
}) {
  return (
    <div className="absolute overflow-hidden" style={{ left, top, width, height }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={DOOR_SRC}
        alt=""
        draggable={false}
        className="pointer-events-none absolute max-w-none select-none"
        style={{
          width: pct(IMAGE_W, cropW),
          height: pct(IMAGE_H, cropH),
          left: pct(-cropX, cropW),
          top: pct(-cropY, cropH),
        }}
      />
    </div>
  );
}

function LeafPhoto({
  x,
  width,
  mirror = false,
  inner = false,
}: {
  x: number;
  width: number;
  mirror?: boolean;
  inner?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={DOOR_SRC}
      alt=""
      draggable={false}
      className="pointer-events-none absolute max-w-none select-none"
      style={{
        width: pct(IMAGE_W, width),
        height: pct(IMAGE_H, LEAF_HEIGHT),
        left: pct(-x, width),
        top: pct(-LEAF_TOP, LEAF_HEIGHT),
        transform: mirror ? "scaleX(-1)" : undefined,
        transformOrigin: "center",
        // Inner side of a real door: same wood, quieter light, no fake mouldings.
        filter: inner
          ? "brightness(0.55) contrast(1.08) saturate(0.9)"
          : undefined,
      }}
    />
  );
}

/** Thickness face: vertical strip of the real photo wood. */
function PhotoEdge({
  cropX,
}: {
  cropX: number;
}) {
  const strip = 10;
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#2a160f]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={DOOR_SRC}
        alt=""
        draggable={false}
        className="pointer-events-none absolute max-w-none select-none"
        style={{
          // Stretch a thin photo column across the edge so grain/colour match.
          width: pct(IMAGE_W, strip),
          height: pct(IMAGE_H, LEAF_HEIGHT),
          left: pct(-(cropX - strip / 2), strip),
          top: pct(-LEAF_TOP, LEAF_HEIGHT),
          filter: "brightness(0.62) contrast(1.15)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.45) 0%, transparent 40%, rgba(0,0,0,0.35) 100%)",
        }}
      />
    </div>
  );
}

function DoorLeaf({
  side,
  openSign,
}: {
  side: "left" | "right";
  openSign: 1 | -1;
}) {
  const isLeft = side === "left";
  const x = isLeft ? LEFT_X : RIGHT_X;
  const width = isLeft ? LEFT_W : RIGHT_W;
  const meetingCropX = isLeft ? SPLIT_X - 4 : SPLIT_X + 4;
  const hingeCropX = isLeft ? LEFT_X + 4 : RIGHT_END - 4;

  return (
    <div
      className="absolute"
      style={{
        left: pct(x, IMAGE_W),
        top: pct(LEAF_TOP, IMAGE_H),
        width: pct(width, IMAGE_W),
        height: pct(LEAF_HEIGHT, IMAGE_H),
        transformOrigin: isLeft ? "left center" : "right center",
        transform: `rotateY(calc(var(--hero-door-open, 0) * ${openSign * MAX_OPEN_DEG}deg))`,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {/* Street side — photograph. */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          transform: `translateZ(${DEPTH / 2}px)`,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          boxShadow: `
            calc(var(--hero-door-open, 0) * ${openSign * -18}px)
            calc(var(--hero-door-open, 0) * 10px)
            calc(var(--hero-door-open, 0) * 28px)
            rgba(0,0,0,calc(var(--hero-door-open, 0) * 0.45))
          `,
        }}
      >
        <LeafPhoto x={x} width={width} />
        {/* Soft contact shadow as the leaf turns — not a painted overlay. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: isLeft
              ? "linear-gradient(90deg, rgba(0,0,0,0.4) 0%, transparent 22%)"
              : "linear-gradient(270deg, rgba(0,0,0,0.4) 0%, transparent 22%)",
            opacity: "calc(var(--hero-door-open, 0) * 0.75)",
          }}
        />
      </div>

      {/* Room side — same timber from the photo, just the reverse. */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          transform: `rotateY(180deg) translateZ(${DEPTH / 2}px)`,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        <LeafPhoto x={x} width={width} mirror inner />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, transparent 30%, rgba(0,0,0,0.35) 100%)",
          }}
        />
      </div>

      {/* Meeting edge — real wood from the photo. */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 overflow-hidden"
        style={{
          ...(isLeft ? { left: "100%" } : { right: "100%" }),
          width: `${DEPTH}px`,
          transformOrigin: isLeft ? "left center" : "right center",
          transform: isLeft ? "rotateY(-90deg)" : "rotateY(90deg)",
        }}
      >
        <PhotoEdge cropX={meetingCropX} />
      </div>

      {/* Hinge edge */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 overflow-hidden"
        style={{
          ...(isLeft ? { right: "100%" } : { left: "100%" }),
          width: `${DEPTH}px`,
          transformOrigin: isLeft ? "right center" : "left center",
          transform: isLeft ? "rotateY(90deg)" : "rotateY(-90deg)",
        }}
      >
        <PhotoEdge cropX={hingeCropX} />
      </div>
    </div>
  );
}

/** Shallow wooden throat behind the leaves — what you glimpse through a real doorway. */
function DoorJamb() {
  const depth = 22;
  return (
    <div
      className="absolute overflow-hidden"
      style={{
        left: pct(LEFT_X, IMAGE_W),
        top: pct(LEAF_TOP, IMAGE_H),
        width: pct(LEFT_W + RIGHT_W, IMAGE_W),
        height: pct(LEAF_HEIGHT, IMAGE_H),
        transformStyle: "preserve-3d",
        opacity: "calc(0.15 + var(--hero-door-open, 0) * 0.85)",
      }}
    >
      {/* Left jamb wall */}
      <div
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{
          width: `${depth}px`,
          transformOrigin: "left center",
          transform: "rotateY(90deg)",
        }}
      >
        <PhotoEdge cropX={LEFT_X + 2} />
        <div className="absolute inset-0 bg-black/35" />
      </div>
      {/* Right jamb wall */}
      <div
        className="absolute inset-y-0 right-0 overflow-hidden"
        style={{
          width: `${depth}px`,
          transformOrigin: "right center",
          transform: "rotateY(-90deg)",
        }}
      >
        <PhotoEdge cropX={RIGHT_END - 2} />
        <div className="absolute inset-0 bg-black/35" />
      </div>
      {/* Head */}
      <div
        className="absolute inset-x-0 top-0 overflow-hidden"
        style={{
          height: `${depth}px`,
          transformOrigin: "top center",
          transform: "rotateX(-90deg)",
          background: "linear-gradient(180deg, #4c2a1c, #1a0c08)",
        }}
      />
    </div>
  );
}

/**
 * Full About composition, clipped to the leaf opening. Sized to the viewport and
 * counter-scaled against the door zoom so it matches the final reveal exactly.
 */
function DoorwayPeek({ copy }: { copy: NextSectionCopy }) {
  return (
    <div
      className="absolute overflow-hidden"
      style={{
        left: pct(LEFT_X, IMAGE_W),
        top: pct(LEAF_TOP, IMAGE_H),
        width: pct(LEFT_W + RIGHT_W, IMAGE_W),
        height: pct(LEAF_HEIGHT, IMAGE_H),
      }}
    >
      <div
        className="absolute top-1/2 left-1/2 h-[100svh] w-screen overflow-hidden"
        style={{
          transform:
            "translate(-50%, -50%) scale(calc(var(--hero-beyond-scale, 1) / (1 + var(--hero-door-zoom, 0))))",
          transformOrigin: "center center",
        }}
      >
        <NextSectionBody copy={copy} />
      </div>
    </div>
  );
}

export function PhotoDoors({
  onReady,
  beyond,
}: {
  onReady: () => void;
  beyond: NextSectionCopy;
}) {
  const openingCenterX = ((LEFT_X + RIGHT_END) / 2 / IMAGE_W) * 100;
  const openingCenterY = ((LEAF_TOP + LEAF_HEIGHT / 2) / IMAGE_H) * 100;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden bg-[#120609]"
      style={{ opacity: "var(--hero-photo-opacity, 1)" }}
    >
      <Image
        src={DOOR_SRC}
        alt=""
        width={IMAGE_W}
        height={IMAGE_H}
        priority
        onLoad={onReady}
        onError={onReady}
        className="pointer-events-none absolute h-px w-px opacity-0"
      />

      <div
        className="absolute top-1/2 left-1/2 h-[92svh] w-auto max-w-none md:h-[94svh]"
        style={{
          aspectRatio: `${IMAGE_W} / ${IMAGE_H}`,
          transform: `translate3d(-50%, calc(-50% + 3.5vh), 0) scale(calc(1 + var(--hero-door-zoom, 0)))`,
          transformOrigin: `${openingCenterX}% ${openingCenterY}%`,
          willChange: "transform",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            perspective: "1400px",
            perspectiveOrigin: `${openingCenterX}% ${openingCenterY}%`,
          }}
        >
          <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
            {/* Text only inside the leaf opening — rests on the black stage. */}
            <DoorwayPeek copy={beyond} />

            <PhotoCrop
              left="0"
              top="0"
              width="100%"
              height={pct(LEAF_TOP, IMAGE_H)}
              cropX={0}
              cropY={0}
              cropW={IMAGE_W}
              cropH={LEAF_TOP}
            />
            <PhotoCrop
              left="0"
              top={pct(LEAF_BOTTOM, IMAGE_H)}
              width="100%"
              height={pct(LEAF_FOOT, IMAGE_H)}
              cropX={0}
              cropY={LEAF_BOTTOM}
              cropW={IMAGE_W}
              cropH={LEAF_FOOT}
            />
            <PhotoCrop
              left="0"
              top={pct(LEAF_TOP, IMAGE_H)}
              width={pct(LEFT_X, IMAGE_W)}
              height={pct(LEAF_HEIGHT, IMAGE_H)}
              cropX={0}
              cropY={LEAF_TOP}
              cropW={LEFT_X}
              cropH={LEAF_HEIGHT}
            />
            <PhotoCrop
              left={pct(RIGHT_END, IMAGE_W)}
              top={pct(LEAF_TOP, IMAGE_H)}
              width={pct(RIGHT_EDGE, IMAGE_W)}
              height={pct(LEAF_HEIGHT, IMAGE_H)}
              cropX={RIGHT_END}
              cropY={LEAF_TOP}
              cropW={RIGHT_EDGE}
              cropH={LEAF_HEIGHT}
            />

            <DoorJamb />
            <DoorLeaf side="left" openSign={-1} />
            <DoorLeaf side="right" openSign={1} />
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(0,0,0,0.55)_100%)] opacity-[calc(1-var(--hero-door-open,0))]" />
    </div>
  );
}
