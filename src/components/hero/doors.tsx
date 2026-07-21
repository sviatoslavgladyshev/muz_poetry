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

/** Leaf sub-dimensions: a stile-and-rail door with a smoked glass panel. */
const STILE_WIDTH = 0.13;
const TOP_RAIL_HEIGHT = 0.17;
const BOTTOM_RAIL_HEIGHT = 0.36;
const GLASS_THICKNESS = 0.05;

const GLASS_WIDTH = LEAF_WIDTH - STILE_WIDTH * 2;
const GLASS_HEIGHT = LEAF_HEIGHT - TOP_RAIL_HEIGHT - BOTTOM_RAIL_HEIGHT;
/** Vertical centre of the glazed opening — the rails are not symmetric. */
const GLASS_CENTER_Y = (BOTTOM_RAIL_HEIGHT - TOP_RAIL_HEIGHT) / 2;

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
  const pilasterHeight = TRIM_INNER_Y + TRIM_WIDTH - (FLOOR_Y - 0.1);
  const pilasterCenterY = (TRIM_INNER_Y + TRIM_WIDTH + FLOOR_Y - 0.1) / 2;

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

      {/* Threshold. Sits just below the leaves so they sweep clear of it. */}
      <mesh
        position={[0, FLOOR_Y - 0.045, (TRIM_DEPTH - WALL_DEPTH) / 2]}
      >
        <boxGeometry args={[trimHalfSpan * 2, 0.09, WALL_DEPTH + TRIM_DEPTH]} />
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

/**
 * One door leaf, modelled in its own local space with the centre of the panel at
 * the origin. `inward` is +1 for the left leaf (which extends toward +x) and -1
 * for the right, and flips the asymmetric details — handle, seam highlight — so
 * both leaves read as a mirrored pair.
 */
function DoorLeaf({
  inward,
  roughnessMap,
}: {
  inward: 1 | -1;
  roughnessMap: Texture | null;
}) {
  const stileOffset = (LEAF_WIDTH - STILE_WIDTH) / 2;
  const handleX = inward * (LEAF_WIDTH / 2 - 0.125);

  return (
    <group>
      {/* Stiles (vertical) */}
      {[-1, 1].map((side) => (
        <RoundedBox
          key={side}
          args={[STILE_WIDTH, LEAF_HEIGHT, LEAF_THICKNESS]}
          radius={0.011}
          smoothness={2}
          position={[side * stileOffset, 0, 0]}
        >
          <MetalSurface roughnessMap={roughnessMap} />
        </RoundedBox>
      ))}

      {/* Rails (horizontal) */}
      <RoundedBox
        args={[GLASS_WIDTH, TOP_RAIL_HEIGHT, LEAF_THICKNESS]}
        radius={0.011}
        smoothness={2}
        position={[0, (LEAF_HEIGHT - TOP_RAIL_HEIGHT) / 2, 0]}
      >
        <MetalSurface roughnessMap={roughnessMap} />
      </RoundedBox>
      <RoundedBox
        args={[GLASS_WIDTH, BOTTOM_RAIL_HEIGHT, LEAF_THICKNESS]}
        radius={0.011}
        smoothness={2}
        position={[0, -(LEAF_HEIGHT - BOTTOM_RAIL_HEIGHT) / 2, 0]}
      >
        <MetalSurface roughnessMap={roughnessMap} />
      </RoundedBox>

      {/* Smoked glazing. Kept opaque enough to hide the room until the doors part,
          but not so opaque that the warm light behind stops bleeding through. */}
      <mesh position={[0, GLASS_CENTER_Y, 0]}>
        <boxGeometry args={[GLASS_WIDTH, GLASS_HEIGHT, GLASS_THICKNESS]} />
        <meshStandardMaterial
          color={PALETTE.glass}
          transparent
          opacity={0.86}
          roughness={0.14}
          metalness={0.35}
          envMapIntensity={1.6}
        />
      </mesh>

      {/* Warm reflection catching the inner edge of the glazing. */}
      <EdgeHighlight
        position={[inward * (GLASS_WIDTH / 2 - 0.004), GLASS_CENTER_Y, GLASS_THICKNESS / 2]}
        size={[0.004, GLASS_HEIGHT * 0.92, 0.004]}
        opacity={0.3}
      />

      {/* Vertical pull handle, standing off the front face on two posts. */}
      <group position={[handleX, GLASS_CENTER_Y * 0.6, LEAF_THICKNESS / 2]}>
        {[-0.36, 0.36].map((y) => (
          <mesh key={y} position={[0, y, 0.035]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.014, 0.014, 0.07, 8]} />
            <meshStandardMaterial color={PALETTE.gold} roughness={0.28} metalness={1} />
          </mesh>
        ))}
        <mesh position={[0, 0, 0.07]}>
          <cylinderGeometry args={[0.019, 0.019, 0.86, 10]} />
          <meshStandardMaterial
            color={PALETTE.goldSoft}
            roughness={0.22}
            metalness={1}
            roughnessMap={roughnessMap}
          />
        </mesh>
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
}: {
  motionRef: RefObject<HeroMotion>;
  roughnessMap: Texture | null;
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
          <DoorLeaf inward={1} roughnessMap={roughnessMap} />
        </group>
      </group>

      <group name="RightDoor" ref={rightPivot} position={[HINGE_X, 0, LEAF_CENTER_Z]}>
        <group position={[-LEAF_OFFSET_X, 0, 0]}>
          <DoorLeaf inward={-1} roughnessMap={roughnessMap} />
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
