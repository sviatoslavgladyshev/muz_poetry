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
  LEAF_HINGE_GAP,
  LEAF_THICKNESS,
  LEFT_LEAF_WIDTH,
  MAX_OPEN_ANGLE,
  OPENING_HEIGHT,
  OPENING_WIDTH,
  PALETTE,
  RIGHT_LEAF_WIDTH,
  TRIM_DEPTH,
  TRIM_INNER_X,
  TRIM_INNER_Y,
  WALL_DEPTH,
  WALL_HEIGHT,
  WALL_WIDTH,
} from "./door-config";
import type { HeroMotion } from "./motion";

const FRONT_FACE_Z = LEAF_CENTER_Z + LEAF_THICKNESS / 2;
const TRIM_WIDTH = 0.25;

type WoodMaps = {
  roughnessMap: Texture | null;
  colorMap: Texture | null;
};

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
    <mesh geometry={geometry} position={[0, 0, -WALL_DEPTH]}>
      <meshLambertMaterial color={PALETTE.ink} />
    </mesh>
  );
}

function WoodSurface({
  colorMap,
  roughnessMap,
  roughness = 0.66,
}: WoodMaps & { color?: string; roughness?: number }) {
  return (
    <meshStandardMaterial
      color={colorMap ? "#969696" : PALETTE.wood}
      map={colorMap}
      roughness={roughness}
      roughnessMap={roughnessMap}
      bumpMap={roughnessMap}
      bumpScale={0.009}
      metalness={0.02}
      envMapIntensity={0.48}
    />
  );
}

function BrassSurface({ roughnessMap }: { roughnessMap: Texture | null }) {
  return (
    <meshStandardMaterial
      color={PALETTE.goldSoft}
      roughness={0.3}
      metalness={0.88}
      roughnessMap={roughnessMap}
    />
  );
}

function HingeStack({ x, roughnessMap }: { x: number; roughnessMap: Texture | null }) {
  return (
    <group position={[x, 0, LEAF_CENTER_Z]}>
      {[-1.25, 0, 1.25].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.24, 8]} />
          <BrassSurface roughnessMap={roughnessMap} />
        </mesh>
      ))}
    </group>
  );
}

function Crown({ roughnessMap, colorMap }: WoodMaps) {
  const backing = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(-1.34, -0.13);
    shape.lineTo(1.34, -0.13);
    shape.lineTo(1.18, 0.06);
    shape.lineTo(0.5, 0.13);
    shape.lineTo(0.2, 0.28);
    shape.lineTo(0, 0.36);
    shape.lineTo(-0.2, 0.28);
    shape.lineTo(-0.5, 0.13);
    shape.lineTo(-1.18, 0.06);
    shape.closePath();
    return new ExtrudeGeometry(shape, {
      depth: 0.08,
      bevelEnabled: true,
      bevelSegments: 1,
      bevelSize: 0.018,
      bevelThickness: 0.012,
    });
  }, []);

  return (
    <group position={[0, TRIM_INNER_Y + 0.42, 0.055]}>
      <mesh geometry={backing} position={[0, 0, 0]}>
        <WoodSurface colorMap={colorMap} roughnessMap={roughnessMap} color="#a67c68" />
      </mesh>

      <mesh position={[0, 0.12, 0.105]}>
        <torusGeometry args={[0.12, 0.027, 6, 18]} />
        <WoodSurface colorMap={colorMap} roughnessMap={roughnessMap} color="#d0a48b" />
      </mesh>

      {[-1, 1].flatMap((side) =>
        [0.25, 0.48, 0.73].map((x, index) => (
          <mesh
            key={`${side}-${x}`}
            position={[side * x, 0.1 - index * 0.025, 0.11]}
            rotation={[0, 0, side * (0.58 - index * 0.1)]}
            scale={[1.45, 0.52, 0.28]}
          >
            <sphereGeometry args={[0.095, 8, 5]} />
            <WoodSurface colorMap={colorMap} roughnessMap={roughnessMap} color="#c69a82" />
          </mesh>
        )),
      )}

      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 1.04, 0.02, 0.105]} rotation={[0, 0, side * 0.5]}>
          <torusGeometry args={[0.11, 0.022, 6, 14, Math.PI * 1.55]} />
          <WoodSurface colorMap={colorMap} roughnessMap={roughnessMap} color="#c69a82" />
        </mesh>
      ))}
    </group>
  );
}

/** Heavy carved casing and crown from the historic entrance reference. */
export function DoorFrame({ roughnessMap, colorMap }: WoodMaps) {
  const trimHalfSpan = TRIM_INNER_X + TRIM_WIDTH;
  const pilasterBottom = FLOOR_Y - 0.12;
  const pilasterTop = TRIM_INNER_Y + 0.2;
  const pilasterHeight = pilasterTop - pilasterBottom;
  const pilasterY = (pilasterTop + pilasterBottom) / 2;

  return (
    <group name="DoorFrame">
      <WallWithOpening />

      {[-1, 1].map((side) => (
        <group key={side} position={[side * (TRIM_INNER_X + TRIM_WIDTH / 2), pilasterY, 0]}>
          <RoundedBox args={[TRIM_WIDTH, pilasterHeight, TRIM_DEPTH]} radius={0.012} smoothness={2}>
            <WoodSurface colorMap={colorMap} roughnessMap={roughnessMap} color="#9f755f" />
          </RoundedBox>

          {[-0.055, 0, 0.055].map((x) => (
            <RoundedBox
              key={x}
              args={[0.022, pilasterHeight - 0.48, 0.025]}
              radius={0.006}
              smoothness={1}
              position={[x, -0.1, TRIM_DEPTH / 2 + 0.018]}
            >
              <WoodSurface colorMap={colorMap} roughnessMap={roughnessMap} color="#c0967f" />
            </RoundedBox>
          ))}

          <RoundedBox
            args={[0.38, 0.17, 0.23]}
            radius={0.014}
            smoothness={2}
            position={[0, pilasterHeight / 2 - 0.12, 0.02]}
          >
            <WoodSurface colorMap={colorMap} roughnessMap={roughnessMap} color="#b98c74" />
          </RoundedBox>
          <mesh position={[0, pilasterHeight / 2 - 0.29, 0.13]} scale={[1, 1.35, 0.55]}>
            <sphereGeometry args={[0.085, 8, 6]} />
            <WoodSurface colorMap={colorMap} roughnessMap={roughnessMap} color="#c49a82" />
          </mesh>
        </group>
      ))}

      <RoundedBox
        args={[trimHalfSpan * 2, 0.27, TRIM_DEPTH + 0.035]}
        radius={0.014}
        smoothness={2}
        position={[0, TRIM_INNER_Y + 0.12, 0.018]}
      >
        <WoodSurface colorMap={colorMap} roughnessMap={roughnessMap} color="#a77b65" />
      </RoundedBox>
      <RoundedBox
        args={[trimHalfSpan * 2 + 0.24, 0.1, 0.22]}
        radius={0.012}
        smoothness={2}
        position={[0, TRIM_INNER_Y + 0.29, 0.025]}
      >
        <WoodSurface colorMap={colorMap} roughnessMap={roughnessMap} color="#c09278" />
      </RoundedBox>

      <Crown roughnessMap={roughnessMap} colorMap={colorMap} />

      <mesh position={[0, FLOOR_Y - 0.05, -WALL_DEPTH / 2]}>
        <boxGeometry args={[trimHalfSpan * 2, 0.1, WALL_DEPTH]} />
        <WoodSurface colorMap={colorMap} roughnessMap={roughnessMap} color="#77503f" />
      </mesh>

      <HingeStack x={-HINGE_X} roughnessMap={roughnessMap} />
      <HingeStack x={HINGE_X} roughnessMap={roughnessMap} />
    </group>
  );
}

function DoorLeaf({
  width,
  maps,
  faceMap,
}: {
  width: number;
  maps: WoodMaps;
  faceMap: Texture | null;
}) {
  return (
    <group>
      <RoundedBox
        args={[width - 0.012, LEAF_HEIGHT - 0.018, LEAF_THICKNESS]}
        radius={0.01}
        smoothness={2}
      >
        <WoodSurface {...maps} roughness={0.72} />
      </RoundedBox>
      {faceMap && (
        <mesh position={[0, 0, LEAF_THICKNESS / 2 + 0.006]}>
          <planeGeometry args={[width - 0.018, LEAF_HEIGHT - 0.025]} />
          <meshBasicMaterial
            map={faceMap}
            transparent
            toneMapped={false}
          />
        </mesh>
      )}
    </group>
  );
}

export function Doors({
  motionRef,
  roughnessMap,
  colorMap,
  leftDoorFace,
  rightDoorFace,
}: {
  motionRef: RefObject<HeroMotion>;
  roughnessMap: Texture | null;
  colorMap: Texture | null;
  leftDoorFace: Texture | null;
  rightDoorFace: Texture | null;
}) {
  const leftPivot = useRef<Group>(null);
  const rightPivot = useRef<Group>(null);
  const maps = { roughnessMap, colorMap };

  useFrame(() => {
    const angle = motionRef.current.open * MAX_OPEN_ANGLE;
    if (leftPivot.current) leftPivot.current.rotation.y = -angle;
    if (rightPivot.current) rightPivot.current.rotation.y = angle;
  });

  return (
    <group>
      <group name="LeftDoor" ref={leftPivot} position={[-HINGE_X, 0, LEAF_CENTER_Z]}>
        <group position={[LEAF_HINGE_GAP + LEFT_LEAF_WIDTH / 2, 0, 0]}>
          <DoorLeaf width={LEFT_LEAF_WIDTH} maps={maps} faceMap={leftDoorFace} />
        </group>
      </group>

      <group name="RightDoor" ref={rightPivot} position={[HINGE_X, 0, LEAF_CENTER_Z]}>
        <group position={[-(LEAF_HINGE_GAP + RIGHT_LEAF_WIDTH / 2), 0, 0]}>
          <DoorLeaf width={RIGHT_LEAF_WIDTH} maps={maps} faceMap={rightDoorFace} />
        </group>
      </group>
    </group>
  );
}

export function ContactPool({ motionRef }: { motionRef: RefObject<HeroMotion> }) {
  const ref = useRef<Group>(null);

  useFrame(() => {
    if (!ref.current) return;
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
