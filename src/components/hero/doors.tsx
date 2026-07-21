"use client";

import { useMemo, useRef, type RefObject } from "react";
import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  ExtrudeGeometry,
  Group,
  MathUtils,
  Path,
  Shape,
  type Texture,
} from "three";
import {
  FLOOR_Y,
  HINGE_X,
  LEAF_CENTER_Z,
  LEAF_HEIGHT,
  LEAF_OFFSET_X,
  LEAF_THICKNESS,
  LEAF_WIDTH,
  MAX_OPEN_ANGLE,
  OPENING_HEIGHT,
  OPENING_WIDTH,
  PALETTE,
  TRIM_DEPTH,
  TRIM_INNER_X,
  TRIM_INNER_Y,
  WALL_DEPTH,
  WALL_HEIGHT,
  WALL_WIDTH,
} from "./door-config";
import type { HeroMotion } from "./motion";

/**
 * The doorway: a wall with a real opening cut through it, an architectural frame,
 * and two leaves that rotate around their *outer* hinges.
 *
 * Everything here is built procedurally rather than loaded from a GLB so the hero
 * ships no binary assets. The node structure mirrors what an authored model would
 * expose — `DoorFrame`, `LeftDoor`, `RightDoor` — so swapping in a real GLB later
 * is a matter of replacing the meshes inside each pivot group with
 * `useGLTF(...).nodes.LeftDoor` etc.; the pivots and animation stay as they are.
 */

/** Leaf sub-dimensions: a solid stile-and-rail door with a recessed centre panel. */
const STILE_WIDTH = 0.13;
const TOP_RAIL_HEIGHT = 0.17;
const BOTTOM_RAIL_HEIGHT = 0.36;
const MID_RAIL_HEIGHT = 0.15;
/** The panel sits proud of nothing and shy of the frame, leaving a shadow reveal. */
const PANEL_THICKNESS = LEAF_THICKNESS - 0.045;

const PANEL_WIDTH = LEAF_WIDTH - STILE_WIDTH * 2;
const UPPER_PANEL_HEIGHT = 1.56;
const UPPER_PANEL_Y = 0.58;
const LOWER_PANEL_HEIGHT = 0.78;
const LOWER_PANEL_Y = -0.92;
const MID_RAIL_Y = -0.31;
const HANDLE_Y = 0.06;

/**
 * Astragal — the strip carried on the leading edge of the left leaf that laps the
 * meeting stile of the right one. Real double doors have one for exactly the reason
 * we need it: without it there is a slot straight through the centre of the pair,
 * and the lit space behind blazes through it as a hard white line.
 */
const ASTRAGAL_WIDTH = 0.06;

const TRIM_WIDTH = 0.24;
const FRONT_FACE_Z = LEAF_CENTER_Z + LEAF_THICKNESS / 2;

/**
 * The wall the doorway is cut into. Built as an extruded shape with a rectangular
 * hole so the room behind is only ever visible *through* the opening — this is what
 * keeps the frame edges reading as real architecture instead of a floating panel.
 */
function WallWithOpening() {
  const geometry = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(-WALL_WIDTH / 2, -WALL_HEIGHT / 2);
    shape.lineTo(WALL_WIDTH / 2, -WALL_HEIGHT / 2);
    shape.lineTo(WALL_WIDTH / 2, WALL_HEIGHT / 2);
    shape.lineTo(-WALL_WIDTH / 2, WALL_HEIGHT / 2);
    shape.closePath();

    const opening = new Path();
    opening.moveTo(-OPENING_WIDTH / 2, FLOOR_Y);
    opening.lineTo(-OPENING_WIDTH / 2, FLOOR_Y + OPENING_HEIGHT);
    opening.lineTo(OPENING_WIDTH / 2, FLOOR_Y + OPENING_HEIGHT);
    opening.lineTo(OPENING_WIDTH / 2, FLOOR_Y);
    opening.closePath();
    shape.holes.push(opening);

    return new ExtrudeGeometry(shape, { depth: WALL_DEPTH, bevelEnabled: false });
  }, []);

  return (
    // ExtrudeGeometry grows along +z, so push it back to land the front face on z = 0.
    <mesh geometry={geometry} position={[0, 0, -WALL_DEPTH]}>
      {/*
        Lambert, not standard: this mesh covers the entire viewport, so its fragment
        shader is the most expensive thing in the scene by a wide margin. It is a flat
        matte surface with no roughness map (tiled across 30 units the grain just reads
        as banding), so the full PBR lighting model buys nothing here.
      */}
      <meshLambertMaterial color={PALETTE.ink} />
    </mesh>
  );
}

/** Dark anodised metal used for the frame and the door stiles. */
function MetalSurface({
  roughnessMap,
  color = PALETTE.panel,
  roughness = 0.38,
  metalness = 0.62,
}: {
  roughnessMap: Texture | null;
  color?: string;
  roughness?: number;
  metalness?: number;
}) {
  return (
    <meshStandardMaterial
      color={color}
      roughness={roughness}
      metalness={metalness}
      roughnessMap={roughnessMap}
    />
  );
}

/** Polished plum lacquer used on the leaves, with enough clear coat to catch the room. */
function LacquerSurface({
  colorMap,
  roughnessMap,
  roughness = 0.3,
}: {
  colorMap: Texture | null;
  roughnessMap: Texture | null;
  roughness?: number;
}) {
  return (
    <meshPhysicalMaterial
      color={PALETTE.panel}
      map={colorMap}
      roughness={roughness}
      roughnessMap={roughnessMap}
      bumpMap={roughnessMap}
      bumpScale={0.012}
      metalness={0.08}
      clearcoat={0.62}
      clearcoatRoughness={0.24}
      envMapIntensity={1.35}
    />
  );
}

/** A hairline of warm light along an edge. Sells the bevels without adding geometry. */
function EdgeHighlight({
  position,
  size,
  opacity = 0.42,
}: {
  position: [number, number, number];
  size: [number, number, number];
  opacity?: number;
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshBasicMaterial color={PALETTE.gold} transparent opacity={opacity} toneMapped={false} />
    </mesh>
  );
}

/** Three barrel hinges per leaf, sitting exactly on the rotation axis. */
function HingeStack({ x }: { x: number }) {
  return (
    <group position={[x, 0, LEAF_CENTER_Z]}>
      {[-1.28, 1.28].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.26, 8]} />
          <meshStandardMaterial color={PALETTE.gold} roughness={0.3} metalness={1} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * The static architecture around the doors: wall, pilasters, lintel, threshold,
 * hinges and the warm reveal lines that trace the opening.
 */
export function DoorFrame({
  roughnessMap,
}: {
  roughnessMap: Texture | null;
}) {
  const trimHalfSpan = TRIM_INNER_X + TRIM_WIDTH;
  const outerCasingX = trimHalfSpan + 0.085;
  const pilasterBottom = FLOOR_Y - 0.1;
  // Stop the vertical pieces at the underside of each lintel. Overlapping coplanar
  // rounded boxes at these joins caused z-fighting flashes in the upper corners.
  const pilasterTop = TRIM_INNER_Y;
  const pilasterHeight = pilasterTop - pilasterBottom;
  const pilasterCenterY = (pilasterTop + pilasterBottom) / 2;
  const outerLintelY = TRIM_INNER_Y + TRIM_WIDTH + 0.085;
  const outerPilasterTop = outerLintelY - 0.05;
  const outerPilasterHeight = outerPilasterTop - pilasterBottom;
  const outerPilasterCenterY = (outerPilasterTop + pilasterBottom) / 2;

  return (
    <group name="DoorFrame">
      <WallWithOpening />

      {/* Pilasters flanking the opening. Held clear of the hinge axes so the
          swinging leaves never intersect them. */}
      {[-1, 1].map((side) => (
        <RoundedBox
          key={side}
          args={[TRIM_WIDTH, pilasterHeight, TRIM_DEPTH]}
          radius={0.014}
          smoothness={2}
          position={[side * (TRIM_INNER_X + TRIM_WIDTH / 2), pilasterCenterY, TRIM_DEPTH / 2]}
        >
          <MetalSurface roughnessMap={roughnessMap} roughness={0.52} metalness={0.45} />
        </RoundedBox>
      ))}

      {/* Lintel spanning the pilasters. */}
      <RoundedBox
        args={[trimHalfSpan * 2, TRIM_WIDTH, TRIM_DEPTH]}
        radius={0.014}
        smoothness={2}
        position={[0, TRIM_INNER_Y + TRIM_WIDTH / 2, TRIM_DEPTH / 2]}
      >
        <MetalSurface roughnessMap={roughnessMap} roughness={0.52} metalness={0.45} />
      </RoundedBox>

      {/* A second, slimmer casing gives the portal a stepped silhouette and catches
          a separate highlight, which makes the frame feel built into the wall. */}
      {[-1, 1].map((side) => (
        <RoundedBox
          key={`outer-${side}`}
          args={[0.1, outerPilasterHeight, 0.1]}
          radius={0.012}
          smoothness={2}
          position={[side * outerCasingX, outerPilasterCenterY, 0.018]}
        >
          <MetalSurface
            roughnessMap={roughnessMap}
            color={PALETTE.plumDeep}
            roughness={0.4}
            metalness={0.42}
          />
        </RoundedBox>
      ))}
      <RoundedBox
        args={[outerCasingX * 2 + 0.1, 0.1, 0.1]}
        radius={0.012}
        smoothness={2}
        position={[0, outerLintelY, 0.018]}
      >
        <MetalSurface
          roughnessMap={roughnessMap}
          color={PALETTE.plumDeep}
          roughness={0.4}
          metalness={0.42}
        />
      </RoundedBox>

      {[-1, 1].map((side) => (
        <EdgeHighlight
          key={`outer-gold-${side}`}
          position={[side * (outerCasingX - 0.048), outerPilasterCenterY, 0.074]}
          size={[0.006, outerPilasterHeight - 0.05, 0.004]}
          opacity={0.3}
        />
      ))}

      {/* Threshold, flush with the floor of the opening and kept behind the wall face
          so the leaves — which now lap below the opening — sweep clear of it. */}
      <mesh position={[0, FLOOR_Y - 0.045, -WALL_DEPTH / 2]}>
        <boxGeometry args={[trimHalfSpan * 2, 0.09, WALL_DEPTH]} />
        <MetalSurface roughnessMap={roughnessMap} roughness={0.45} metalness={0.7} />
      </mesh>

      {/* Warm hairlines tracing the reveal between frame and leaves. */}
      {[-1, 1].map((side) => (
        <EdgeHighlight
          key={side}
          position={[side * TRIM_INNER_X, 0, 0.004]}
          size={[0.006, OPENING_HEIGHT, 0.004]}
        />
      ))}
      <EdgeHighlight
        position={[0, TRIM_INNER_Y, 0.004]}
        size={[TRIM_INNER_X * 2, 0.006, 0.004]}
      />

      <HingeStack x={-HINGE_X} />
      <HingeStack x={HINGE_X} />
    </group>
  );
}

function InsetPanel({
  height,
  y,
  roughnessMap,
  colorMap,
}: {
  height: number;
  y: number;
  roughnessMap: Texture | null;
  colorMap: Texture | null;
}) {
  const mouldingWidth = PANEL_WIDTH + 0.055;
  const mouldingHeight = height + 0.055;
  const frontZ = LEAF_THICKNESS / 2 + 0.006;

  return (
    <group position={[0, y, 0]}>
      <RoundedBox
        args={[PANEL_WIDTH, height, PANEL_THICKNESS]}
        radius={0.012}
        smoothness={3}
      >
        <LacquerSurface colorMap={colorMap} roughnessMap={roughnessMap} roughness={0.38} />
      </RoundedBox>

      {/* Stepped moulding and a restrained brass keyline make the recess read at
          a distance without turning the doors into ornate stage scenery. */}
      {[-1, 1].map((side) => (
        <RoundedBox
          key={`v-${side}`}
          args={[0.042, mouldingHeight, 0.028]}
          radius={0.007}
          smoothness={2}
          position={[side * mouldingWidth / 2, 0, frontZ]}
        >
          <LacquerSurface colorMap={colorMap} roughnessMap={roughnessMap} roughness={0.25} />
        </RoundedBox>
      ))}
      {[-1, 1].map((side) => (
        <RoundedBox
          key={`h-${side}`}
          args={[mouldingWidth, 0.042, 0.028]}
          radius={0.007}
          smoothness={2}
          position={[0, side * mouldingHeight / 2, frontZ]}
        >
          <LacquerSurface colorMap={colorMap} roughnessMap={roughnessMap} roughness={0.25} />
        </RoundedBox>
      ))}
      {[-1, 1].map((side) => (
        <EdgeHighlight
          key={`gold-v-${side}`}
          position={[side * (PANEL_WIDTH / 2 - 0.012), 0, frontZ + 0.017]}
          size={[0.006, height - 0.025, 0.004]}
          opacity={0.55}
        />
      ))}
      {[-1, 1].map((side) => (
        <EdgeHighlight
          key={`gold-h-${side}`}
          position={[0, side * (height / 2 - 0.012), frontZ + 0.017]}
          size={[PANEL_WIDTH - 0.025, 0.006, 0.004]}
          opacity={0.55}
        />
      ))}
    </group>
  );
}

/**
 * One door leaf, modelled in its own local space with the centre of the panel at
 * the origin. `inward` is +1 for the left leaf (which extends toward +x) and -1
 * for the right, and flips the asymmetric details — handle, seam highlight — so
 * both leaves read as a mirrored pair.
 */
function DoorLeaf({
  inward,
  roughnessMap,
  colorMap,
}: {
  inward: 1 | -1;
  roughnessMap: Texture | null;
  colorMap: Texture | null;
}) {
  const stileOffset = (LEAF_WIDTH - STILE_WIDTH) / 2;
  const handleX = inward * (LEAF_WIDTH / 2 - 0.125);

  return (
    <group>
      {/* Continuous structural slab behind the joinery. Besides giving the open
          leaves a convincing back face, it prevents light from leaking between
          rails and panels while the bright About section is behind them. */}
      <RoundedBox
        args={[LEAF_WIDTH - 0.018, LEAF_HEIGHT - 0.018, 0.055]}
        radius={0.012}
        smoothness={2}
        position={[0, 0, -0.035]}
      >
        <LacquerSurface colorMap={colorMap} roughnessMap={roughnessMap} roughness={0.42} />
      </RoundedBox>

      {/* Stiles (vertical) */}
      {[-1, 1].map((side) => (
        <RoundedBox
          key={side}
          args={[STILE_WIDTH, LEAF_HEIGHT, LEAF_THICKNESS]}
          radius={0.011}
          smoothness={2}
          position={[side * stileOffset, 0, 0]}
        >
          <LacquerSurface colorMap={colorMap} roughnessMap={roughnessMap} />
        </RoundedBox>
      ))}

      {/* Rails (horizontal) */}
      <RoundedBox
        args={[PANEL_WIDTH, TOP_RAIL_HEIGHT, LEAF_THICKNESS]}
        radius={0.011}
        smoothness={2}
        position={[0, (LEAF_HEIGHT - TOP_RAIL_HEIGHT) / 2, 0]}
      >
        <LacquerSurface colorMap={colorMap} roughnessMap={roughnessMap} />
      </RoundedBox>
      <RoundedBox
        args={[PANEL_WIDTH, BOTTOM_RAIL_HEIGHT, LEAF_THICKNESS]}
        radius={0.011}
        smoothness={2}
        position={[0, -(LEAF_HEIGHT - BOTTOM_RAIL_HEIGHT) / 2, 0]}
      >
        <LacquerSurface colorMap={colorMap} roughnessMap={roughnessMap} />
      </RoundedBox>

      {/* A middle rail separates the tall upper panel from the grounded lower one,
          giving the pair the proportions of mansion doors rather than cabinet fronts. */}
      <RoundedBox
        args={[PANEL_WIDTH, MID_RAIL_HEIGHT, LEAF_THICKNESS]}
        radius={0.011}
        smoothness={2}
        position={[0, MID_RAIL_Y, 0]}
      >
        <LacquerSurface colorMap={colorMap} roughnessMap={roughnessMap} />
      </RoundedBox>

      <InsetPanel
        height={UPPER_PANEL_HEIGHT}
        y={UPPER_PANEL_Y}
        roughnessMap={roughnessMap}
        colorMap={colorMap}
      />
      <InsetPanel
        height={LOWER_PANEL_HEIGHT}
        y={LOWER_PANEL_Y}
        roughnessMap={roughnessMap}
        colorMap={colorMap}
      />

      {/* Astragal, on the left leaf only, closing the joint between the pair. */}
      {inward === 1 && (
        <RoundedBox
          args={[ASTRAGAL_WIDTH, LEAF_HEIGHT, LEAF_THICKNESS + 0.012]}
          radius={0.008}
          smoothness={2}
          position={[LEAF_WIDTH / 2 + 0.01, 0, 0]}
        >
          <MetalSurface
            roughnessMap={roughnessMap}
            color={PALETTE.plumDeep}
            roughness={0.3}
            metalness={0.5}
          />
        </RoundedBox>
      )}

      {/* Vertical pull handle with rosettes, posts and rounded finials. */}
      <group position={[handleX, HANDLE_Y, LEAF_THICKNESS / 2]}>
        {[-0.36, 0.36].map((y) => (
          <mesh key={`plate-${y}`} position={[0, y, 0.025]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.055, 0.055, 0.022, 20]} />
            <meshStandardMaterial color={PALETTE.gold} roughness={0.25} metalness={1} />
          </mesh>
        ))}
        {[-0.36, 0.36].map((y) => (
          <mesh key={y} position={[0, y, 0.035]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.016, 0.016, 0.09, 16]} />
            <meshStandardMaterial color={PALETTE.gold} roughness={0.28} metalness={1} />
          </mesh>
        ))}
        <mesh position={[0, 0, 0.085]}>
          <cylinderGeometry args={[0.021, 0.021, 0.88, 20]} />
          <meshStandardMaterial
            color={PALETTE.goldSoft}
            roughness={0.18}
            metalness={1}
            roughnessMap={roughnessMap}
          />
        </mesh>
        {[-0.44, 0.44].map((y) => (
          <mesh key={`finial-${y}`} position={[0, y, 0.085]}>
            <sphereGeometry args={[0.027, 16, 10]} />
            <meshStandardMaterial color={PALETTE.goldSoft} roughness={0.18} metalness={1} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/**
 * Both leaves, each wrapped in a pivot group positioned exactly on its hinge axis.
 *
 * This is the part that makes the effect read as physical: the group sits at
 * `x = ±HINGE_X` and the leaf mesh is offset *inside* it by `LEAF_OFFSET_X`, so
 * rotating the group swings the leaf around its outer edge. Rotating the leaf
 * itself would spin it about its centre and instantly look like a flat card.
 */
export function Doors({
  motionRef,
  roughnessMap,
  colorMap,
}: {
  motionRef: RefObject<HeroMotion>;
  roughnessMap: Texture | null;
  colorMap: Texture | null;
}) {
  const leftPivot = useRef<Group>(null);
  const rightPivot = useRef<Group>(null);

  useFrame(() => {
    const angle = motionRef.current.open * MAX_OPEN_ANGLE;
    // Opening outward (toward the camera) means opposite signs on the two hinges.
    if (leftPivot.current) leftPivot.current.rotation.y = -angle;
    if (rightPivot.current) rightPivot.current.rotation.y = angle;
  });

  return (
    <group>
      <group name="LeftDoor" ref={leftPivot} position={[-HINGE_X, 0, LEAF_CENTER_Z]}>
        <group position={[LEAF_OFFSET_X, 0, 0]}>
          <DoorLeaf inward={1} roughnessMap={roughnessMap} colorMap={colorMap} />
        </group>
      </group>

      <group name="RightDoor" ref={rightPivot} position={[HINGE_X, 0, LEAF_CENTER_Z]}>
        <group position={[-LEAF_OFFSET_X, 0, 0]}>
          <DoorLeaf inward={-1} roughnessMap={roughnessMap} colorMap={colorMap} />
        </group>
      </group>
    </group>
  );
}

/**
 * Soft contact shadow pooled at the base of the doors. A single fading plane is
 * far cheaper than a real shadow pass and is all the grounding the composition needs.
 */
export function ContactPool({ motionRef }: { motionRef: RefObject<HeroMotion> }) {
  const ref = useRef<Group>(null);

  useFrame(() => {
    if (!ref.current) return;
    // The pool tightens as the doors swing away from the threshold.
    ref.current.scale.z = MathUtils.lerp(1, 0.55, motionRef.current.open);
  });

  return (
    <group ref={ref} position={[0, FLOOR_Y + 0.003, FRONT_FACE_Z + 0.1]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[OPENING_WIDTH * 1.5, 0.9]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.55} depthWrite={false} />
      </mesh>
    </group>
  );
}
