/* eslint-disable react/no-unknown-property */
'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame, useThree, type ThreeElement, type ThreeEvent } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
  type RigidBodyProps
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';

// replace with your own imports, see the usage snippet for details
import cardGLB from './card.glb';
import lanyard from './lanyard.png';

extend({ MeshLineGeometry, MeshLineMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
    meshLineMaterial: ThreeElement<typeof MeshLineMaterial>;
  }
}

// 1x1 transparent pixel — lets useTexture be called unconditionally when a
// front/back image isn't supplied.
const BLANK_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

// The card model's front face is UV-mapped to the LEFT half of the texture
// atlas and the back face to the RIGHT half (measured from card.glb). Each
// custom image is composited into its own half so the two faces render
// independently, aspect-preserving (no stretching).
// 0.7572 is the card mesh's real maximum V (read from card.glb's TEXCOORD_0);
// the shipped 0.755/0.757 stopped just short and left a thin strip of the
// original texture showing along the bottom of each face.
// Radius in world units treated as "over the card" for pointer hit-testing.
// The card's collider is 0.8 x 1.125, so this covers it with a little slack.
const CARD_HIT_RADIUS = 1.35;

const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.7572 };
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.7572 };

/** Height of the card in world units (its collider is 0.8 x 1.125 half-extents). */
const CARD_WORLD_HEIGHT = 2.25;

// Drives the camera imperatively rather than through <Canvas camera={...}>,
// which R3F only applies when the camera is first created — changing that prop
// later silently does nothing, so the card's size would drift with the canvas.
//
// - cardHeightPx pins the card's on-screen height by solving for the camera
//   distance, so resizing the canvas cannot change how big the card looks.
// - anchorRightPx pans the camera sideways so the rig hangs a fixed distance
//   from the canvas's right edge, letting the canvas span the full page (room
//   to swing) while the card still hangs from one specific spot.
function CameraRig({
  cardHeightPx,
  anchorRightPx
}: {
  cardHeightPx?: number | null;
  anchorRightPx?: number | null;
}) {
  const { camera, size } = useThree();

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const halfFovTan = Math.tan((cam.fov * Math.PI) / 180 / 2);

    if (cardHeightPx != null && cardHeightPx > 0) {
      cam.position.z = (CARD_WORLD_HEIGHT * size.height) / (2 * halfFovTan * cardHeightPx);
    }

    if (anchorRightPx != null) {
      const worldHeight = 2 * halfFovTan * cam.position.z;
      const unitsPerPx = worldHeight / size.height;
      const targetFromLeft = size.width - anchorRightPx;
      cam.position.x = -(targetFromLeft - size.width / 2) * unitsPerPx;
    }

    cam.updateProjectionMatrix();
  }, [camera, size.width, size.height, cardHeightPx, anchorRightPx]);

  return null;
}

interface LanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  /** Distance in px from the canvas's right edge to hang the rig from. */
  anchorRightPx?: number | null;
  /** Pins the card's rendered height in px, independent of canvas size. */
  cardHeightPx?: number | null;
  /** Length of each of the strap's three segments, in world units. */
  ropeSegmentLength?: number;
  /** World length of one repeat of the strap print. Larger = fewer, longer tiles. */
  strapTileLength?: number;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: 'cover' | 'contain';
  lanyardImage?: string | null;
  lanyardWidth?: number;
}

export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  anchorRightPx = null,
  cardHeightPx = null,
  ropeSegmentLength = 1,
  strapTileLength = 0.8,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = (): void => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative h-full w-full flex justify-center items-center transform scale-100 origin-center">
      <Canvas
        camera={{ position, fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        // `flat` disables tone mapping. R3F defaults to ACES Filmic, a
        // cinematic curve that desaturates and rolls off highlights — on a
        // photographic card face that reads as a colour filter over the photo.
        // With NoToneMapping the texture renders at its true colours.
        flat
        // The container must not capture pointer events — the canvas child
        // re-enables them for itself only while the pointer is over the card.
        style={{ pointerEvents: 'none' }}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={Math.PI} />
        <CameraRig cardHeightPx={cardHeightPx} anchorRightPx={anchorRightPx} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band
            isMobile={isMobile}
            frontImage={frontImage}
            backImage={backImage}
            imageFit={imageFit}
            lanyardImage={lanyardImage}
            lanyardWidth={lanyardWidth}
            ropeSegmentLength={ropeSegmentLength}
            strapTileLength={strapTileLength}
          />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: 'cover' | 'contain';
  lanyardImage?: string | null;
  lanyardWidth?: number;
  ropeSegmentLength?: number;
  strapTileLength?: number;
}

type LanyardRigidBody = RapierRigidBody & {
  lerped?: THREE.Vector3;
};

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1,
  ropeSegmentLength = 1,
  strapTileLength = 0.8
}: BandProps) {
  const band = useRef<THREE.Mesh<InstanceType<typeof MeshLineGeometry>, InstanceType<typeof MeshLineMaterial>>>(null!);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<LanyardRigidBody>(null!);
  const j2 = useRef<LanyardRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps: RigidBodyProps = {
    type: 'dynamic',
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4
  };

  const getLerped = (body: LanyardRigidBody): THREE.Vector3 => {
    if (!body.lerped) {
      body.lerped = new THREE.Vector3().copy(body.translation());
    }

    return body.lerped;
  };

  const { nodes, materials } = useGLTF(cardGLB) as any;
  const texture = useTexture(lanyardImage || lanyard);
  // useTexture must be called unconditionally; use a blank pixel when an image
  // isn't supplied for a given face, then skip compositing it below.
  const frontTex = useTexture(frontImage || BLANK_PIXEL);
  const backTex = useTexture(backImage || BLANK_PIXEL);

  // Composite the front/back images into the card's texture atlas (front = left
  // half, back = right half). Each image is drawn aspect-preserving (no stretch).
  const cardMap = useMemo(() => {
    const baseMap = materials.base.map as THREE.Texture;
    if (!frontImage && !backImage) return baseMap;

    const baseImg = baseMap.image as any;
    const W = baseImg.width;
    const H = baseImg.height;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return baseMap;
    // Keep the original baked atlas for the card edges and any untouched face.
    ctx.drawImage(baseImg, 0, 0, W, H);

    const drawFitted = (img: any, rect: typeof FRONT_UV_RECT) => {
      const rx = rect.x * W;
      const ry = rect.y * H;
      const rw = rect.w * W;
      const rh = rect.h * H;
      const pick = imageFit === 'contain' ? Math.min : Math.max;
      const scale = pick(rw / img.width, rh / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = rx + (rw - dw) / 2;
      const dy = ry + (rh - dh) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.rect(rx, ry, rw, rh);
      ctx.clip();
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();
    };

    if (frontImage && frontTex.image) drawFitted(frontTex.image, FRONT_UV_RECT);
    if (backImage && backTex.image) drawFitted(backTex.image, BACK_UV_RECT);

    const composite = new THREE.CanvasTexture(canvas);
    composite.colorSpace = THREE.SRGBColorSpace;
    composite.flipY = baseMap.flipY;
    composite.anisotropy = 16;
    composite.needsUpdate = true;
    return composite;
  }, [frontImage, backImage, imageFit, frontTex, backTex, materials.base.map]);
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
  );
  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  // Three equal segments make up the strap, so the card hangs
  // 3 * ropeSegmentLength below the anchor, plus the 1.45 spherical-joint drop
  // to the card's centre and its 1.125 half-height. Shortening these raises the
  // card and shortens the visible strap.
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], ropeSegmentLength]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], ropeSegmentLength]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], ropeSegmentLength]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.45, 0]
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => {
        document.body.style.cursor = 'auto';
      };
    }
  }, [hovered, dragged]);

  // Where the pointer is, tracked on window rather than on the canvas: the
  // canvas spends most of its life with pointer-events disabled (below), so it
  // cannot report this itself.
  const pointerPx = useRef({ x: -1e4, y: -1e4 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointerPx.current.x = e.clientX;
      pointerPx.current.y = e.clientY;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  // The canvas spans the page so the card can swing freely, which would
  // otherwise make everything beneath it unclickable. So enable pointer events
  // only while the pointer is actually over the card (or mid-drag) and let
  // every other pixel fall through to the page.
  const updatePointerPassthrough = (state: { gl: THREE.WebGLRenderer; camera: THREE.Camera }) => {
    const el = state.gl.domElement;
    if (dragged) {
      el.style.pointerEvents = 'auto';
      return;
    }
    if (!card.current) return;

    const rect = el.getBoundingClientRect();
    const centre = vec.copy(card.current.translation() as THREE.Vector3);
    const edge = dir.copy(centre).setX(centre.x + CARD_HIT_RADIUS);
    centre.project(state.camera);
    edge.project(state.camera);

    const cx = rect.left + (centre.x * 0.5 + 0.5) * rect.width;
    const cy = rect.top + (-centre.y * 0.5 + 0.5) * rect.height;
    const radiusPx = Math.abs(edge.x - centre.x) * 0.5 * rect.width;

    const dx = pointerPx.current.x - cx;
    const dy = pointerPx.current.y - cy;
    el.style.pointerEvents = dx * dx + dy * dy <= radiusPx * radiusPx ? 'auto' : 'none';
  };

  useFrame((state, delta) => {
    updatePointerPassthrough(state);

    if (dragged && typeof dragged !== 'boolean') {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z
      });
    }
    if (fixed.current) {
      [j1, j2].forEach(ref => {
        const lerped = getLerped(ref.current);
        const clampedDistance = Math.max(0.1, Math.min(1, lerped.distanceTo(ref.current.translation())));
        lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(getLerped(j2.current));
      curve.points[2].copy(getLerped(j1.current));
      curve.points[3].copy(fixed.current.translation());
      const points = curve.getPoints(isMobile ? 16 : 32);
      band.current.geometry.setPoints(points);

      // Tile the strap print by its actual length rather than a fixed count.
      // meshline maps u across 0..1 of the whole line, so a constant repeat
      // squeezes the print when the strap hangs short and spreads it as the
      // strap is pulled — which is why it only looked right while stretched.
      let strapLength = 0;
      for (let i = 1; i < points.length; i++) strapLength += points[i].distanceTo(points[i - 1]);
      const bandMaterial = band.current.material as InstanceType<typeof MeshLineMaterial>;
      bandMaterial.repeat.set(-strapLength / strapTileLength, 1);
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
    }
  });

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        {/* Start each body where it will hang, straight down from the anchor.
            These shipped spread out along +X, so on load the whole rig was
            horizontal and gravity (-40) whipped it down through a swing before
            settling — the glitch on refresh. Starting at rest means there is
            nothing to settle. */}
        <RigidBody position={[0, -ropeSegmentLength, 0]} ref={j1} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, -2 * ropeSegmentLength, 0]} ref={j2} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, -3 * ropeSegmentLength, 0]} ref={j3} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[0, -3 * ropeSegmentLength - 1.45, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: ThreeEvent<PointerEvent>) => {
              (e.target as Element).releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e: ThreeEvent<PointerEvent>) => {
              (e.target as Element).setPointerCapture(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              {/* Unlit on purpose. Any lit material modulates the map by the
                  scene's lighting — ambient plus environment IBL — so a
                  photograph on the card never matches the file it came from,
                  and the dark rims came from the same place. meshBasicMaterial
                  samples the texture directly, so the card face renders exactly
                  as imported. Swap back to meshPhysicalMaterial (metalness 0)
                  if shading on the card is ever worth the colour shift. */}
              <meshBasicMaterial map={cardMap} map-anisotropy={16} toneMapped={false} />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          args={[{ resolution: new THREE.Vector2(1000, isMobile ? 2000 : 1000) }]}
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap={1}
          map={texture}
          repeat={[-4, 1]}
          lineWidth={lanyardWidth}
        />
      </mesh>
    </>
  );
}
