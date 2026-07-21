"use client";

import { useEffect, useRef, type RefObject } from "react";
import { Environment, Lightformer } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MathUtils, type DirectionalLight, type PerspectiveCamera, type PointLight } from "three";
import { PALETTE } from "./door-config";
import { CAMERA_FOV, heroCameraEndZ, heroCameraStartZ } from "./camera";
import { ContactPool, DoorFrame, Doors } from "./doors";
import { applyMotion, useHeroMotion, type HeroMotion } from "./motion";
import { useHeroTextures } from "./textures";

/**
 * Where the reduced-motion pose sits on the timeline: doors part-way open, warm
 * light just beginning to spill. Must match `REDUCED_MOTION_POSE` in
 * `door-hero-section.tsx`, which poses the HTML overlay to go with it.
 */
const REDUCED_MOTION_POSE = 0.34;

/**
 * Moves the camera from "standing in front of the doors" to "stepping through them".
 *
 * The travel is deliberately understated: a slow push along z plus a few centimetres
 * of pointer parallax. Enough to feel like approaching a real threshold, not enough
 * to read as a camera move.
 */
function CameraRig({ motionRef, lite }: { motionRef: RefObject<HeroMotion>; lite: boolean }) {
  const size = useThree((state) => state.size);

  useFrame((state, delta) => {
    const camera = state.camera as PerspectiveCamera;
    const aspect = size.width / size.height;

    const start = heroCameraStartZ(aspect, lite);
    const end = heroCameraEndZ(start, lite);

    camera.position.z = MathUtils.lerp(start, end, motionRef.current.approach);

    const parallaxX = lite ? 0 : state.pointer.x * 0.18;
    const parallaxY = lite ? 0 : state.pointer.y * 0.1;
    // A slight descent as we approach, like walking toward a doorway.
    const driftY = MathUtils.lerp(0.12, -0.05, motionRef.current.approach);

    camera.position.x = MathUtils.damp(camera.position.x, parallaxX, 2.4, delta);
    camera.position.y = MathUtils.damp(camera.position.y, driftY + parallaxY, 2.4, delta);
    camera.lookAt(0, camera.position.y * 0.35, -2.5);
  });

  return null;
}

/**
 * Lighting. Soft and directional rather than bright: the doors are read through
 * their highlights, with the light spilling out of the opening growing as the
 * leaves part.
 *
 * There are deliberately no shadow maps. A shadow pass has to be re-rendered every
 * frame while the doors are moving, and at this scale it cost far more than it
 * added — the grazing key light and the contact pool carry the depth instead.
 */
function SceneLighting({ motionRef }: { motionRef: RefObject<HeroMotion> }) {
  const key = useRef<DirectionalLight>(null);
  const spill = useRef<PointLight>(null);

  useFrame(() => {
    // Warm light spilling out of the widening gap, onto the inner door edges.
    if (spill.current) spill.current.intensity = motionRef.current.reveal * 11;
    // The key light eases off as the space beyond takes over as the light source.
    if (key.current) key.current.intensity = MathUtils.lerp(2.8, 1.4, motionRef.current.reveal);
  });

  return (
    <>
      {/* Tinted cool-plum so the shadow side of the metal never goes flat black —
          this replaces a second fill light, one less term in every fragment. */}
      <ambientLight intensity={0.8} color="#7d6a82" />

      <directionalLight ref={key} position={[3.4, 5.2, 6.4]} intensity={2.8} color="#fff2df" />

      {/*
        A wide soft light grazing the door faces from above and in front. This is the
        one that makes the panels read as surfaces: it picks out the bevels, the stile
        edges and the brushed grain that the environment map alone leaves flat.
      */}
      <spotLight
        position={[0, 4.6, 5.2]}
        angle={0.62}
        penumbra={1}
        intensity={26}
        distance={16}
        decay={1.4}
        color="#ffe9cd"
      />

      {/* Light from beyond the doors, leaking through the opening. */}
      <pointLight
        ref={spill}
        position={[0, 0.3, -1.1]}
        intensity={0}
        distance={9}
        decay={2}
        color={PALETTE.goldSoft}
      />

      {/*
        A tiny hand-built environment map. Lightformers give the metal something real
        to reflect — long vertical highlights down the stiles and handles — without
        downloading an HDRI. Baked once on mount, never re-rendered.
      */}
      <Environment resolution={64} frames={1} environmentIntensity={1.45}>
        <Lightformer form="rect" intensity={4} position={[0, 5, 4]} scale={[10, 4, 1]} color="#fff4e4" />
        <Lightformer form="rect" intensity={6} position={[-5, 0, 3]} scale={[1, 8, 1]} color="#e8ecf5" />
        <Lightformer form="rect" intensity={6} position={[5, 0, 3]} scale={[1, 8, 1]} color="#e8ecf5" />
        <Lightformer form="rect" intensity={2} position={[0, -4, 3]} scale={[8, 2, 1]} color="#8a4a5f" />
      </Environment>
    </>
  );
}

/**
 * Advances `motion` from the scroll ref once per rendered frame.
 *
 * The damping — rather than assigning the scroll value straight through — is what
 * gives the doors their weight: they lag the wheel slightly and settle rather than snap.
 */
function MotionDriver({
  motionRef,
  progressRef,
  enabled,
}: {
  motionRef: RefObject<HeroMotion>;
  progressRef: RefObject<number>;
  enabled: boolean;
}) {
  useFrame((_, delta) => {
    if (!enabled) return;
    motionRef.current.target = progressRef.current;
    // Frame-rate independent exponential damping.
    applyMotion(
      motionRef.current,
      MathUtils.damp(motionRef.current.smooth, motionRef.current.target, 3.2, delta),
    );
  });

  return null;
}

/**
 * Decides when a frame is actually worth drawing.
 *
 * The canvas runs `frameloop="demand"`, so nothing renders unless something asks
 * for it. This watches the two things that can change the picture — the doors still
 * catching up to the scroll position, and pointer parallax still settling — and
 * requests frames only then.
 *
 * This is the single biggest win available here: most of the time the visitor is
 * reading rather than scrolling, and a hero sitting still now costs nothing.
 */
function RenderGate({
  motionRef,
  progressRef,
  parallax,
}: {
  motionRef: RefObject<HeroMotion>;
  progressRef: RefObject<number>;
  parallax: boolean;
}) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    let rafId = 0;
    let pointerFrames = 0;

    const drawUntilSettled = () => {
      rafId = 0;
      invalidate();

      const chasing = Math.abs(progressRef.current - motionRef.current.smooth) > 0.0002;
      if (pointerFrames > 0) pointerFrames -= 1;

      if (chasing || pointerFrames > 0) {
        rafId = requestAnimationFrame(drawUntilSettled);
      }
    };

    const wake = (frames = 0) => {
      pointerFrames = Math.max(pointerFrames, frames);
      if (rafId === 0) rafId = requestAnimationFrame(drawUntilSettled);
    };

    const onScroll = () => wake(2);
    const onPointerMove = () => wake(18);

    window.addEventListener("scroll", onScroll, { passive: true });
    if (parallax) window.addEventListener("pointermove", onPointerMove, { passive: true });
    wake(4);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [invalidate, motionRef, progressRef, parallax]);

  return null;
}

/**
 * Nudge a few frames on mount so the environment map and materials settle before
 * the first visible frame.
 */
function SettleOnMount() {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    let frames = 4;
    let id = 0;
    const tick = () => {
      invalidate();
      frames -= 1;
      if (frames > 0) id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [invalidate]);

  return null;
}

/** Reports readiness after the first WebGL frame has reached the browser paint. */
function FirstFrameReady({ onReady }: { onReady: () => void }) {
  const reported = useRef(false);
  const paintFrame = useRef(0);

  useEffect(
    () => () => {
      cancelAnimationFrame(paintFrame.current);
    },
    [],
  );

  useFrame(() => {
    if (reported.current) return;
    reported.current = true;
    paintFrame.current = requestAnimationFrame(onReady);
  });

  return null;
}

function Scene({
  progressRef,
  lite,
  reducedMotion,
  onReady,
}: {
  progressRef: RefObject<number>;
  lite: boolean;
  reducedMotion: boolean;
  onReady: () => void;
}) {
  const motionRef = useHeroMotion(reducedMotion ? REDUCED_MOTION_POSE : 0);
  const { brushedRoughness, lacquerColor } = useHeroTextures(!lite);

  return (
    <>
      {/* Mounted first so its useFrame runs before anything reads the motion values. */}
      <MotionDriver motionRef={motionRef} progressRef={progressRef} enabled={!reducedMotion} />
      <FirstFrameReady onReady={onReady} />
      <SettleOnMount />
      {!reducedMotion && (
        <RenderGate motionRef={motionRef} progressRef={progressRef} parallax={!lite} />
      )}

      <CameraRig motionRef={motionRef} lite={lite} />
      <SceneLighting motionRef={motionRef} />

      <DoorFrame roughnessMap={brushedRoughness} />
      <Doors
        motionRef={motionRef}
        roughnessMap={brushedRoughness}
        colorMap={lacquerColor}
      />
      {!lite && <ContactPool motionRef={motionRef} />}
    </>
  );
}

/**
 * The WebGL layer of the hero. Loaded lazily and client-only — the copy and CTAs
 * are already in the server-rendered HTML underneath, so this is pure enhancement.
 *
 * The canvas clears to transparent rather than to a colour. The wall around the
 * doorway is opaque geometry, so the only place anything shows through is the
 * opening itself — which is how the next section is revealed as the doors part.
 */
export default function DoorScene({
  progressRef,
  lite,
  reducedMotion,
  onReady,
}: {
  progressRef: RefObject<number>;
  lite: boolean;
  reducedMotion: boolean;
  onReady: () => void;
}) {
  return (
    <Canvas
      frameloop="demand"
      // Above 1.25 the extra pixels buy nothing here — the scene is soft, dark and has
      // almost no high-frequency detail — and cost a great deal of fill rate.
      dpr={lite ? 1 : [1, 1.25]}
      camera={{ fov: CAMERA_FOV, near: 0.1, far: 60, position: [0, 0.12, 6] }}
      gl={{
        antialias: !lite,
        alpha: true,
        precision: "mediump",
        powerPreference: "high-performance",
      }}
      style={{ position: "absolute", inset: 0 }}
      onCreated={({ gl }) => {
        // Lifted slightly above neutral: the palette is almost entirely shadow, and
        // the default exposure crushes the door detail into flat black.
        gl.toneMappingExposure = 1.34;
      }}
    >
      <Scene
        progressRef={progressRef}
        lite={lite}
        reducedMotion={reducedMotion}
        onReady={onReady}
      />
    </Canvas>
  );
}
