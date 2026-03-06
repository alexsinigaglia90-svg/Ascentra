"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import styles from "./championship.module.css";
import {
  calculateMetrics,
  CELL_SIZE,
  expandScenarioQueue,
  generateScenario,
  isValidPlacement,
  PALLET_DEPTH,
  PALLET_WIDTH,
  solveAiLayout,
} from "./gameLogic";
import type { BoxQueueItem } from "./gameLogic";
import type { GamePhase, PlacedBox, RunMetrics, Scenario, SolverMessage } from "./types";

const CAMERA_POSE = {
  hero: new THREE.Vector3(5.6, 4.8, 7.2),
  challenge: new THREE.Vector3(4.7, 5.1, 5.6),
  ai: new THREE.Vector3(7.4, 6.2, 6.9),
  results: new THREE.Vector3(6.2, 5.8, 7.8),
};

const CAMERA_ORBIT_RADIUS = {
  challenge: 0.38,
  ai: 0.86,
  results: 0.54,
};

const LOOK_AT = new THREE.Vector3(0, 0.8, 0);

const emptyMetrics: RunMetrics = {
  fillRate: 0,
  stability: 100,
  heightUsed: 0,
  placed: 0,
  total: 0,
  compressionRisk: 0,
  transportSafety: 100,
  score: 0,
};

const AI_MESSAGES = [
  "Scanning carton dimensions",
  "Mapping load distribution",
  "Exploring stacking permutations",
  "Evaluating load stability",
  "Synthesising candidate layer families",
  "Evaluating stability",
  "Projecting center-of-mass heatmaps",
  "Reducing compression risk",
  "Optimizing pallet density",
  "Candidate solutions: 42 -> 11 -> 3 -> 1",
  "Optimal pallet configuration identified",
];

function makeTopMap(placed: PlacedBox[]) {
  const map = Array.from({ length: PALLET_DEPTH }, () =>
    Array.from({ length: PALLET_WIDTH }, () => 0)
  );

  placed.forEach((box) => {
    for (let x = box.x; x < box.x + box.w; x += 1) {
      for (let z = box.z; z < box.z + box.d; z += 1) {
        map[z][x] = Math.max(map[z][x], box.y + box.h);
      }
    }
  });

  return map;
}

export default function MixedPalletizingChampionship() {
  const [phase, setPhase] = useState<GamePhase>("hero");
  const [scenario, setScenario] = useState<Scenario>(() => generateScenario());
  const [queue, setQueue] = useState<BoxQueueItem[]>(() => expandScenarioQueue(generateScenario()));
  const [selectedQueueId, setSelectedQueueId] = useState<string | null>(null);
  const [rotation, setRotation] = useState(false);
  const [placed, setPlaced] = useState<PlacedBox[]>([]);
  const [aiPlaced, setAiPlaced] = useState<PlacedBox[]>([]);
  const [userMetrics, setUserMetrics] = useState<RunMetrics>(emptyMetrics);
  const [aiMetrics, setAiMetrics] = useState<RunMetrics>(emptyMetrics);
  const [timer, setTimer] = useState(110);
  const [thinkingMessages, setThinkingMessages] = useState<SolverMessage[]>([]);
  const [aiBuildStep, setAiBuildStep] = useState(0);
  const [aiLayerStatus, setAiLayerStatus] = useState("Awaiting layer sequence");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameRef = useRef<number | null>(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const floorPlaneRef = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const pointerRef = useRef(new THREE.Vector2(0, 0));

  const palletGroupRef = useRef<THREE.Group | null>(null);
  const userBoxesGroupRef = useRef<THREE.Group | null>(null);
  const aiBoxesGroupRef = useRef<THREE.Group | null>(null);
  const candidateGroupRef = useRef<THREE.Group | null>(null);
  const candidateLayoutGroupRef = useRef<THREE.Group | null>(null);
  const ghostMeshRef = useRef<THREE.Mesh | null>(null);
  const pickMeshRef = useRef<THREE.Mesh | null>(null);
  const holoGridRef = useRef<THREE.Mesh | null>(null);
  const heatmapPlaneRef = useRef<THREE.Mesh | null>(null);
  const hoverCellRef = useRef<THREE.Mesh | null>(null);
  const ghostTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const rimLightRef = useRef<THREE.PointLight | null>(null);
  const fillLightRef = useRef<THREE.PointLight | null>(null);
  const phaseRef = useRef<GamePhase>("hero");
  const selectedItemRef = useRef<BoxQueueItem | null>(null);
  const rotationRef = useRef(false);
  const stabilityRef = useRef(100);
  const placedRef = useRef<PlacedBox[]>([]);
  const scenarioRef = useRef<Scenario>(scenario);
  const aiLayoutsRef = useRef<PlacedBox[][]>([]);
  const aiLayoutIndexRef = useRef(0);

  const AI_LAYER_TEXT = useRef([
    "Layer 1 stabilised",
    "Layer 2 interlocked",
    "Layer 3 density optimised",
    "Layer 4 compression balanced",
    "Top layer transport-ready",
  ]);

  const hoveredPlacementRef = useRef<{
    x: number;
    z: number;
    y: number;
    valid: boolean;
    w: number;
    d: number;
    h: number;
  } | null>(null);

  const selectedItem = useMemo(
    () => queue.find((item) => item.queueId === selectedQueueId) ?? null,
    [queue, selectedQueueId]
  );

  const isChallenge = phase === "challenge";
  const isAiVisual = phase === "aiTransition" || phase === "aiThinking" || phase === "aiBuild";

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    selectedItemRef.current = selectedItem;
  }, [selectedItem]);

  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  useEffect(() => {
    stabilityRef.current = userMetrics.stability;
  }, [userMetrics.stability]);

  useEffect(() => {
    placedRef.current = placed;
  }, [placed]);

  useEffect(() => {
    scenarioRef.current = scenario;
  }, [scenario]);

  const resetRun = useCallback((base: Scenario) => {
      const nextQueue = expandScenarioQueue(base);

      setQueue(nextQueue);
      setSelectedQueueId(nextQueue[0]?.queueId ?? null);
      setRotation(false);
      setPlaced([]);
      setAiPlaced([]);
      setAiBuildStep(0);
      setThinkingMessages([]);
      setTimer(base.timerSeconds);
      setUserMetrics(calculateMetrics(base, []));
      setAiMetrics(calculateMetrics(base, []));
    }, []);

  useEffect(() => {
    const seedScenario = generateScenario();
    setScenario(seedScenario);
    resetRun(seedScenario);
  }, [resetRun]);

  useEffect(() => {
    if (!isChallenge) {
      return;
    }

    const timerId = window.setInterval(() => {
      setTimer((current) => {
        if (current <= 1) {
          window.clearInterval(timerId);
          setPhase("aiTransition");
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [isChallenge]);

  useEffect(() => {
    setUserMetrics(calculateMetrics(scenario, placed));
  }, [scenario, placed]);

  useEffect(() => {
    if (!canvasRef.current || rendererRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#070d15");
    scene.fog = new THREE.Fog("#070d15", 4, 18);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      70
    );
    camera.position.copy(CAMERA_POSE.hero);
    camera.lookAt(LOOK_AT);
    cameraRef.current = camera;

    const ambient = new THREE.AmbientLight("#7ea8d8", 0.34);
    scene.add(ambient);

    const hemi = new THREE.HemisphereLight("#84b8f3", "#0b1119", 0.24);
    scene.add(hemi);

    const key = new THREE.DirectionalLight("#e5f3ff", 1.12);
    key.position.set(6.6, 9.2, 4.4);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 28;
    key.shadow.camera.left = -8;
    key.shadow.camera.right = 8;
    key.shadow.camera.top = 8;
    key.shadow.camera.bottom = -8;
    key.shadow.bias = -0.00015;
    keyLightRef.current = key;
    scene.add(key);

    const overhead = new THREE.SpotLight("#e3f1ff", 2.9, 24, Math.PI / 6, 0.42, 1.4);
    overhead.position.set(0.5, 8.8, 1.1);
    overhead.target.position.set(0, 0.4, 0);
    overhead.castShadow = true;
    overhead.shadow.mapSize.set(2048, 2048);
    overhead.shadow.bias = -0.00018;
    scene.add(overhead);
    scene.add(overhead.target);

    const rim = new THREE.PointLight("#5ac0ff", 2.6, 24, 1.9);
    rim.position.set(-5.5, 4.4, -4.6);
    rimLightRef.current = rim;
    scene.add(rim);

    const rearRim = new THREE.PointLight("#88dfff", 1.7, 24, 1.8);
    rearRim.position.set(4.8, 3.2, -5.8);
    scene.add(rearRim);

    const fill = new THREE.PointLight("#5a78a6", 1.2, 18, 2);
    fill.position.set(4.2, 2.8, -3.1);
    fillLightRef.current = fill;
    scene.add(fill);

    const floorGeo = new THREE.PlaneGeometry(22, 22);
    const floorMat = new THREE.MeshStandardMaterial({
      color: "#111922",
      roughness: 0.34,
      metalness: 0.38,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.02;
    floor.receiveShadow = true;
    scene.add(floor);

    const palletGroup = new THREE.Group();
    palletGroupRef.current = palletGroup;
    scene.add(palletGroup);

    const palletBaseGeo = new THREE.BoxGeometry(
      PALLET_WIDTH * CELL_SIZE,
      CELL_SIZE * 0.35,
      PALLET_DEPTH * CELL_SIZE
    );
    const palletBaseMat = new THREE.MeshStandardMaterial({
      color: "#7b5e45",
      roughness: 0.84,
      metalness: 0.08,
    });
    const palletBase = new THREE.Mesh(palletBaseGeo, palletBaseMat);
    palletBase.position.y = CELL_SIZE * 0.17;
    palletBase.receiveShadow = true;
    palletBase.castShadow = true;
    palletGroup.add(palletBase);

    const palletGrid = new THREE.GridHelper(
      PALLET_WIDTH * CELL_SIZE,
      PALLET_WIDTH,
      0x3f5f85,
      0x28405f
    );
    palletGrid.position.y = CELL_SIZE * 0.36;
    const gridMat = palletGrid.material as THREE.Material;
    gridMat.opacity = 0.28;
    gridMat.transparent = true;
    palletGroup.add(palletGrid);

    const palletOutline = new THREE.LineSegments(
      new THREE.EdgesGeometry(
        new THREE.BoxGeometry(PALLET_WIDTH * CELL_SIZE, CELL_SIZE * 0.36, PALLET_DEPTH * CELL_SIZE)
      ),
      new THREE.LineBasicMaterial({
        color: "#6ca4e6",
        transparent: true,
        opacity: 0.66,
      })
    );
    palletOutline.position.y = CELL_SIZE * 0.37;
    palletGroup.add(palletOutline);

    for (let i = -4; i <= 4; i += 2) {
      const beamGeo = new THREE.BoxGeometry(CELL_SIZE * 0.35, CELL_SIZE * 0.24, PALLET_DEPTH * CELL_SIZE);
      const beam = new THREE.Mesh(
        beamGeo,
        new THREE.MeshStandardMaterial({ color: "#664c38", roughness: 0.86 })
      );
      beam.position.set(i * CELL_SIZE * 0.65, -CELL_SIZE * 0.06, 0);
      beam.castShadow = true;
      palletGroup.add(beam);
    }

    const userBoxesGroup = new THREE.Group();
    userBoxesGroupRef.current = userBoxesGroup;
    scene.add(userBoxesGroup);

    const aiBoxesGroup = new THREE.Group();
    aiBoxesGroupRef.current = aiBoxesGroup;
    scene.add(aiBoxesGroup);

    const candidateGroup = new THREE.Group();
    candidateGroupRef.current = candidateGroup;
    scene.add(candidateGroup);

    const candidateLayoutGroup = new THREE.Group();
    candidateLayoutGroupRef.current = candidateLayoutGroup;
    scene.add(candidateLayoutGroup);

    const holoGridGeo = new THREE.PlaneGeometry(4.1, 3.4, 18, 14);
    const holoGridMat = new THREE.MeshBasicMaterial({
      color: "#4fc6f6",
      wireframe: true,
      transparent: true,
      opacity: 0,
    });
    const holoGrid = new THREE.Mesh(holoGridGeo, holoGridMat);
    holoGrid.rotation.x = -Math.PI / 2;
    holoGrid.position.set(0, CELL_SIZE * 0.62, 0);
    holoGridRef.current = holoGrid;
    scene.add(holoGrid);

    const heatmap = new THREE.Mesh(
      new THREE.PlaneGeometry(PALLET_WIDTH * CELL_SIZE, PALLET_DEPTH * CELL_SIZE),
      new THREE.MeshBasicMaterial({
        color: "#4bcbff",
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      })
    );
    heatmap.rotation.x = -Math.PI / 2;
    heatmap.position.y = CELL_SIZE * 0.38;
    heatmapPlaneRef.current = heatmap;
    scene.add(heatmap);

    const hoverCell = new THREE.Mesh(
      new THREE.PlaneGeometry(CELL_SIZE, CELL_SIZE),
      new THREE.MeshBasicMaterial({
        color: "#76ceff",
        transparent: true,
        opacity: 0,
      })
    );
    hoverCell.rotation.x = -Math.PI / 2;
    hoverCell.position.y = CELL_SIZE * 0.39;
    hoverCellRef.current = hoverCell;
    scene.add(hoverCell);

    const ghost = new THREE.Mesh(
      new THREE.BoxGeometry(CELL_SIZE, CELL_SIZE, CELL_SIZE),
      new THREE.MeshStandardMaterial({
        color: "#2fdc94",
        transparent: true,
        opacity: 0.3,
        emissive: "#2fdc94",
        emissiveIntensity: 0.5,
      })
    );
    ghost.visible = false;
    ghostMeshRef.current = ghost;
    scene.add(ghost);

    const pickMesh = new THREE.Mesh(
      new THREE.BoxGeometry(CELL_SIZE * 2, CELL_SIZE * 2, CELL_SIZE * 2),
      new THREE.MeshStandardMaterial({
        color: "#d3b186",
        roughness: 0.45,
        metalness: 0.05,
        transparent: true,
        opacity: 0.95,
        emissive: "#3f6c9a",
        emissiveIntensity: 0.2,
      })
    );
    pickMesh.position.set(-2.45, 0.8, 1.9);
    pickMesh.castShadow = true;
    pickMesh.visible = false;
    pickMeshRef.current = pickMesh;
    scene.add(pickMesh);

    let t = 0;

    const render = () => {
      frameRef.current = requestAnimationFrame(render);
      t += 0.008;
      const livePhase = phaseRef.current;

      const cam = cameraRef.current;
      if (cam) {
        const target =
          livePhase === "hero"
            ? CAMERA_POSE.hero
            : livePhase === "challenge"
              ? CAMERA_POSE.challenge
              : livePhase === "results"
                ? CAMERA_POSE.results
                : CAMERA_POSE.ai;

        const orbitStrength =
          livePhase === "challenge"
            ? CAMERA_ORBIT_RADIUS.challenge
            : livePhase === "results"
              ? CAMERA_ORBIT_RADIUS.results
              : livePhase === "aiThinking" || livePhase === "aiBuild"
                ? CAMERA_ORBIT_RADIUS.ai
                : 0.15;

        const orbitX = Math.sin(t * (livePhase === "aiThinking" ? 1.2 : 0.7)) * orbitStrength;
        const orbitZ = Math.cos(t * (livePhase === "aiThinking" ? 1.1 : 0.6)) * orbitStrength;

        cam.position.lerp(new THREE.Vector3(target.x + orbitX, target.y, target.z + orbitZ), 0.03);

        const look = LOOK_AT.clone();
        look.x = Math.sin(t * 0.52) * 0.06;
        look.z = Math.cos(t * 0.43) * 0.06;
        cam.lookAt(look);
      }

      const key = keyLightRef.current;
      const rim = rimLightRef.current;
      const fill = fillLightRef.current;
      if (key && rim && fill) {
        const aiMode = livePhase === "aiThinking" || livePhase === "aiBuild";
        key.intensity = THREE.MathUtils.lerp(key.intensity, aiMode ? 1.45 : 1.08, 0.04);
        rim.intensity = THREE.MathUtils.lerp(rim.intensity, aiMode ? 3.2 : 2.25, 0.05);
        fill.intensity = THREE.MathUtils.lerp(fill.intensity, aiMode ? 1.6 : 1.05, 0.05);
      }

      const pallet = palletGroupRef.current;
      if (pallet) {
        const instability = 1 - stabilityRef.current / 100;
        const tilt = livePhase === "challenge" ? instability * 0.04 : 0;
        pallet.rotation.z = THREE.MathUtils.lerp(pallet.rotation.z, Math.sin(t * 1.7) * tilt, 0.05);
        pallet.rotation.x = THREE.MathUtils.lerp(pallet.rotation.x, Math.cos(t * 1.4) * tilt * 0.8, 0.05);
      }

      const pick = pickMeshRef.current;
      const activeItem = selectedItemRef.current;
      if (pick && activeItem && livePhase === "challenge") {
        pick.visible = true;
        const isRotated = rotationRef.current;
        const w = (isRotated ? activeItem.sku.d : activeItem.sku.w) * CELL_SIZE;
        const d = (isRotated ? activeItem.sku.w : activeItem.sku.d) * CELL_SIZE;
        const h = activeItem.sku.h * CELL_SIZE;

        pick.geometry.dispose();
        pick.geometry = new THREE.BoxGeometry(w, h, d);
        pick.position.y = 0.9 + Math.sin(t * 2.4) * 0.08;
        pick.rotation.y = THREE.MathUtils.lerp(pick.rotation.y, rotationRef.current ? Math.PI * 0.5 : 0, 0.12);
      } else if (pick) {
        pick.visible = false;
      }

      const ghost = ghostMeshRef.current;
      if (ghost && ghost.visible) {
        ghost.position.lerp(ghostTargetRef.current, 0.28);
      }

      const hoverCell = hoverCellRef.current;
      if (hoverCell) {
        const hover = hoveredPlacementRef.current;
        const hoverMat = hoverCell.material as THREE.MeshBasicMaterial;
        if (hover && livePhase === "challenge") {
          hoverCell.visible = true;
          hoverCell.position.set(
            (hover.x + 0.5 - PALLET_WIDTH / 2) * CELL_SIZE,
            CELL_SIZE * 0.395,
            (hover.z + 0.5 - PALLET_DEPTH / 2) * CELL_SIZE
          );
          hoverMat.opacity = THREE.MathUtils.lerp(hoverMat.opacity, hover.valid ? 0.38 : 0.26, 0.22);
          hoverMat.color.set(hover.valid ? "#5bd7ff" : "#ff8186");
        } else {
          hoverMat.opacity = THREE.MathUtils.lerp(hoverMat.opacity, 0, 0.2);
          if (hoverMat.opacity < 0.02) {
            hoverCell.visible = false;
          }
        }
      }

      if (livePhase === "aiThinking") {
        const g = candidateGroupRef.current;
        if (g) {
          if (g.children.length < 26 && Math.random() < 0.42) {
            const cw = (Math.random() * 3.6 + 1) * CELL_SIZE;
            const ch = (Math.random() * 2.6 + 0.6) * CELL_SIZE;
            const cd = (Math.random() * 3.2 + 1) * CELL_SIZE;
            const m = new THREE.Mesh(
              new THREE.BoxGeometry(cw, ch, cd),
              new THREE.MeshBasicMaterial({
                color: Math.random() > 0.72 ? "#7fffe6" : "#4cd7ff",
                transparent: true,
                opacity: 0.2,
                wireframe: true,
              })
            );
            m.position.set((Math.random() - 0.5) * 3.3, Math.random() * 2.4 + 0.8, (Math.random() - 0.5) * 2.6);
            g.add(m);
          }

          g.children.forEach((child, index) => {
            const mesh = child as THREE.Mesh;
            mesh.rotation.y += 0.01;
            mesh.rotation.x += 0.004;
            if (index % 3 === 0) {
              mesh.position.y += Math.sin(t + index) * 0.0025;
            }
            const mat = mesh.material as THREE.MeshBasicMaterial;
            mat.opacity *= 0.995;
          });

          if (g.children.length > 0) {
            const remove = g.children.find((child) => {
              const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
              return mat.opacity < 0.03;
            });
            if (remove) {
              g.remove(remove);
              (remove as THREE.Mesh).geometry.dispose();
              ((remove as THREE.Mesh).material as THREE.Material).dispose();
            }
          }
        }

        const layoutGroup = candidateLayoutGroupRef.current;
        if (layoutGroup) {
          layoutGroup.children.forEach((child) => {
            const mesh = child as THREE.Mesh;
            const mat = mesh.material as THREE.MeshBasicMaterial;
            mat.opacity *= 0.988;
            mesh.position.y += Math.sin(t * 1.9 + mesh.position.x) * 0.0009;
          });
        }

        const holo = holoGridRef.current;
        if (holo) {
          const material = holo.material as THREE.MeshBasicMaterial;
          material.opacity = 0.2 + Math.sin(t * 2.6) * 0.08;
          holo.rotation.z += 0.0018;
        }

        const heatmap = heatmapPlaneRef.current;
        if (heatmap) {
          const heatMat = heatmap.material as THREE.MeshBasicMaterial;
          heatMat.opacity = 0.09 + Math.sin(t * 3.1) * 0.04;
        }
      } else {
        const g = candidateGroupRef.current;
        if (g && g.children.length > 0) {
          g.children.forEach((child) => {
            g.remove(child);
            const mesh = child as THREE.Mesh;
            mesh.geometry.dispose();
            (mesh.material as THREE.Material).dispose();
          });
        }

        const layoutGroup = candidateLayoutGroupRef.current;
        if (layoutGroup && layoutGroup.children.length > 0) {
          layoutGroup.children.forEach((child) => {
            layoutGroup.remove(child);
            const mesh = child as THREE.Mesh;
            mesh.geometry.dispose();
            (mesh.material as THREE.Material).dispose();
          });
        }

        const holo = holoGridRef.current;
        if (holo) {
          const material = holo.material as THREE.MeshBasicMaterial;
          material.opacity = Math.max(0, material.opacity - 0.02);
        }

        const heatmap = heatmapPlaneRef.current;
        if (heatmap) {
          const heatMat = heatmap.material as THREE.MeshBasicMaterial;
          heatMat.opacity = Math.max(0, heatMat.opacity - 0.025);
        }
      }

      renderer.render(scene, camera);
    };

    render();

    const handleResize = () => {
      if (!canvasRef.current || !cameraRef.current || !rendererRef.current) {
        return;
      }
      const c = canvasRef.current;
      const nextWidth = c.clientWidth;
      const nextHeight = c.clientHeight;
      cameraRef.current.aspect = nextWidth / nextHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(nextWidth, nextHeight, false);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      renderer.dispose();
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) {
          mesh.geometry.dispose();
        }
        if (mesh.material) {
          const material = mesh.material as THREE.Material | THREE.Material[];
          if (Array.isArray(material)) {
            material.forEach((item) => item.dispose());
          } else {
            material.dispose();
          }
        }
      });
      rendererRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
    };
  }, []);

  const syncPlacedMeshes = useCallback((items: PlacedBox[], mode: "user" | "ai") => {
    const group = mode === "user" ? userBoxesGroupRef.current : aiBoxesGroupRef.current;
    if (!group) {
      return;
    }

    group.children.forEach((child) => {
      group.remove(child);
      const mesh = child as THREE.Mesh;
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
    });

    items.forEach((box) => {
      const geo = new THREE.BoxGeometry(box.w * CELL_SIZE, box.h * CELL_SIZE, box.d * CELL_SIZE);
      const sizeSignal = Math.min(1, (box.w * box.d + box.h) / 18);
      const color =
        mode === "user"
          ? new THREE.Color().setHSL(0.08 + sizeSignal * 0.045, 0.34, box.fragile ? 0.62 : 0.56)
          : new THREE.Color().setHSL(0.48 + sizeSignal * 0.05, 0.53, box.fragile ? 0.54 : 0.48);
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.4,
        metalness: 0.12,
        emissive: mode === "ai" ? "#2ca8a0" : "#7a4f1f",
        emissiveIntensity: mode === "ai" ? 0.18 : 0.05,
      });
      const mesh = new THREE.Mesh(geo, mat);

      mesh.position.set(
        (box.x + box.w / 2 - PALLET_WIDTH / 2) * CELL_SIZE,
        box.y * CELL_SIZE + box.h * CELL_SIZE / 2 + CELL_SIZE * 0.35,
        (box.z + box.d / 2 - PALLET_DEPTH / 2) * CELL_SIZE
      );
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(geo),
        new THREE.LineBasicMaterial({
          color: mode === "ai" ? "#6be4d9" : "#d6b793",
          transparent: true,
          opacity: 0.34,
        })
      );
      mesh.add(edges);
      group.add(mesh);
    });
  }, []);

  useEffect(() => {
    syncPlacedMeshes(placed, "user");
  }, [placed, syncPlacedMeshes]);

  useEffect(() => {
    const target = aiPlaced.slice(0, aiBuildStep);
    syncPlacedMeshes(target, "ai");
  }, [aiBuildStep, aiPlaced, syncPlacedMeshes]);

  const updateGhost = useCallback(
    (x: number, z: number) => {
      if (!selectedItem || phase !== "challenge") {
        hoveredPlacementRef.current = null;
        if (ghostMeshRef.current) {
          ghostMeshRef.current.visible = false;
        }
        return;
      }

      const w = rotation ? selectedItem.sku.d : selectedItem.sku.w;
      const d = rotation ? selectedItem.sku.w : selectedItem.sku.d;
      const h = selectedItem.sku.h;
      const check = isValidPlacement(placed, scenario, x, z, w, d, h);

      hoveredPlacementRef.current = {
        x,
        z,
        y: check.y,
        valid: check.valid,
        w,
        d,
        h,
      };

      const ghost = ghostMeshRef.current;
      if (!ghost) {
        return;
      }

      const wasVisible = ghost.visible;
      ghost.visible = true;
      const previousSize = ghost.userData.size as string | undefined;
      const nextSize = `${w}-${d}-${h}`;
      if (previousSize !== nextSize) {
        ghost.geometry.dispose();
        ghost.geometry = new THREE.BoxGeometry(w * CELL_SIZE, h * CELL_SIZE, d * CELL_SIZE);
        ghost.userData.size = nextSize;
      }

      ghostTargetRef.current.set(
        (x + w / 2 - PALLET_WIDTH / 2) * CELL_SIZE,
        check.y * CELL_SIZE + h * CELL_SIZE / 2 + CELL_SIZE * 0.35,
        (z + d / 2 - PALLET_DEPTH / 2) * CELL_SIZE
      );
      if (!wasVisible) {
        ghost.position.copy(ghostTargetRef.current);
      }

      const material = ghost.material as THREE.MeshStandardMaterial;
      material.color.set(check.valid ? "#3fe095" : "#ff6f75");
      material.emissive.set(check.valid ? "#2cc883" : "#cf434b");
    },
    [phase, placed, rotation, scenario, selectedItem]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const onMove = (event: PointerEvent) => {
      if (phase !== "challenge" || !cameraRef.current) {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      pointerRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointerRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(pointerRef.current, cameraRef.current);
      const hit = new THREE.Vector3();

      if (raycasterRef.current.ray.intersectPlane(floorPlaneRef.current, hit)) {
        const localX = (hit.x + (PALLET_WIDTH * CELL_SIZE) / 2) / CELL_SIZE;
        const localZ = (hit.z + (PALLET_DEPTH * CELL_SIZE) / 2) / CELL_SIZE;
        const gridX = Math.floor(localX);
        const gridZ = Math.floor(localZ);

        if (gridX >= 0 && gridZ >= 0 && gridX < PALLET_WIDTH && gridZ < PALLET_DEPTH) {
          const candidates: Array<{ x: number; z: number; distance: number; valid: boolean }> = [];
          for (let ox = -1; ox <= 1; ox += 1) {
            for (let oz = -1; oz <= 1; oz += 1) {
              const x = gridX + ox;
              const z = gridZ + oz;
              if (x < 0 || z < 0 || x >= PALLET_WIDTH || z >= PALLET_DEPTH) {
                continue;
              }
              const d = Math.hypot(localX - (x + 0.5), localZ - (z + 0.5));
              const probe = selectedItemRef.current;
              let valid = false;
              if (probe) {
                const w = rotationRef.current ? probe.sku.d : probe.sku.w;
                const depth = rotationRef.current ? probe.sku.w : probe.sku.d;
                valid = isValidPlacement(
                  placedRef.current,
                  scenarioRef.current,
                  x,
                  z,
                  w,
                  depth,
                  probe.sku.h
                ).valid;
              }
              candidates.push({ x, z, distance: d, valid });
            }
          }

          const nearestValid = candidates
            .filter((candidate) => candidate.valid)
            .sort((a, b) => a.distance - b.distance)[0];
          const fallback = candidates.sort((a, b) => a.distance - b.distance)[0];
          const target = nearestValid ?? fallback;

          if (target) {
            updateGhost(target.x, target.z);
          }
          return;
        }
      }

      hoveredPlacementRef.current = null;
      if (ghostMeshRef.current) {
        ghostMeshRef.current.visible = false;
      }
    };

    const onClick = () => {
      if (phase !== "challenge") {
        return;
      }

      const hover = hoveredPlacementRef.current;
      if (!selectedItem || !hover || !hover.valid) {
        return;
      }

      const next: PlacedBox = {
        placementId: `U-${selectedItem.queueId}-${Date.now()}`,
        skuId: selectedItem.sku.id,
        label: selectedItem.sku.label,
        x: hover.x,
        y: hover.y,
        z: hover.z,
        w: hover.w,
        d: hover.d,
        h: hover.h,
        rotated: rotation,
        weight: selectedItem.sku.weight,
        fragile: selectedItem.sku.fragile,
      };

      setPlaced((current) => [...current, next]);
      setQueue((current) => {
        const remaining = current.filter((item) => item.queueId !== selectedItem.queueId);
        if (remaining.length > 0) {
          setSelectedQueueId((active) => (active === selectedItem.queueId ? remaining[0].queueId : active));
        } else {
          setSelectedQueueId(null);
          setPhase("aiTransition");
        }
        return remaining;
      });
    };

    const onKey = (event: KeyboardEvent) => {
      if (phase !== "challenge") {
        return;
      }
      if (event.key.toLowerCase() === "r") {
        setRotation((r) => !r);
      }
    };

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);

    return () => {
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [phase, rotation, selectedItem, updateGhost]);

  const beginChallenge = () => {
    setPhase("brief");
  };

  const launchMission = () => {
    setTimer(scenario.timerSeconds);
    setPhase("challenge");
  };

  useEffect(() => {
    if (phase !== "aiTransition") {
      return;
    }

    const id = window.setTimeout(() => {
      setPhase("aiThinking");
    }, 1100);

    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "aiThinking") {
      return;
    }

    setThinkingMessages([]);
    aiLayoutsRef.current = [];
    aiLayoutIndexRef.current = 0;

    const pushCandidateLayoutMeshes = (layout: PlacedBox[]) => {
      const group = candidateLayoutGroupRef.current;
      if (!group) {
        return;
      }

      group.children.forEach((child) => {
        group.remove(child);
        const mesh = child as THREE.Mesh;
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      });

      layout.slice(0, 18).forEach((box, idx) => {
        const mesh = new THREE.Mesh(
          new THREE.BoxGeometry(box.w * CELL_SIZE, box.h * CELL_SIZE, box.d * CELL_SIZE),
          new THREE.MeshBasicMaterial({
            color: idx % 3 === 0 ? "#6ff3ff" : "#4fd2ff",
            transparent: true,
            opacity: 0.2,
            wireframe: true,
          })
        );
        mesh.position.set(
          (box.x + box.w / 2 - PALLET_WIDTH / 2) * CELL_SIZE,
          box.y * CELL_SIZE + box.h * CELL_SIZE / 2 + CELL_SIZE * 0.48,
          (box.z + box.d / 2 - PALLET_DEPTH / 2) * CELL_SIZE
        );
        group.add(mesh);
      });
    };

    const isStrongUser = userMetrics.score >= 78;
    const solveStart = window.setTimeout(() => {
      const solved = solveAiLayout(scenario);
      const variants = [solved, solveAiLayout(scenario), solveAiLayout(scenario)].filter(
        (layout) => layout.length > 0
      );
      aiLayoutsRef.current = variants;
      if (variants[0]) {
        pushCandidateLayoutMeshes(variants[0]);
      }
      const aiBoost = isStrongUser ? 0 : 4;
      const solvedMetrics = calculateMetrics(scenario, solved, aiBoost);
      setAiPlaced(solved);
      setAiMetrics(solvedMetrics);
    }, 900);

    const interval = window.setInterval(() => {
      setThinkingMessages((current) => {
        if (current.length >= AI_MESSAGES.length) {
          return current;
        }
        const text = AI_MESSAGES[current.length];
        return [...current, { id: `${Date.now()}-${current.length}`, text }];
      });
    }, 620);

    const layoutPulse = window.setInterval(() => {
      const layouts = aiLayoutsRef.current;
      if (layouts.length === 0) {
        return;
      }
      aiLayoutIndexRef.current = (aiLayoutIndexRef.current + 1) % layouts.length;
      const nextLayout = layouts[aiLayoutIndexRef.current];
      pushCandidateLayoutMeshes(nextLayout);
    }, 1050);

    const end = window.setTimeout(() => {
      setPhase("aiBuild");
    }, 6200);

    return () => {
      window.clearTimeout(solveStart);
      window.clearInterval(interval);
      window.clearInterval(layoutPulse);
      window.clearTimeout(end);
    };
  }, [phase, scenario, userMetrics.score]);

  useEffect(() => {
    if (phase !== "aiBuild") {
      return;
    }

    setAiBuildStep(0);
    setAiLayerStatus("Computing layer path");

    if (aiPlaced.length === 0) {
      setPhase("results");
      return;
    }

    let cancelled = false;
    let index = 0;
    let timeoutId = 0;

    const tick = () => {
      if (cancelled) {
        return;
      }

      setAiBuildStep(index + 1);

      const current = aiPlaced[index];
      const layerText = AI_LAYER_TEXT.current[current.y] ?? `Layer ${current.y + 1} calibrated`;
      setAiLayerStatus(layerText);
      index += 1;

      if (index >= aiPlaced.length) {
        timeoutId = window.setTimeout(() => {
          if (!cancelled) {
            setPhase("results");
          }
        }, 420);
        return;
      }

      const next = aiPlaced[index];
      const layerChanged = next.y > current.y;
      timeoutId = window.setTimeout(tick, layerChanged ? 300 : 90);
    };

    timeoutId = window.setTimeout(tick, 180);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [phase, aiPlaced]);

  const missionCards = [
    { label: "Scenario ID", value: scenario.scenarioId },
    { label: "Destination", value: scenario.destination },
    { label: "Cartons", value: String(scenario.cartons) },
    { label: "SKU types", value: String(scenario.skuTypes) },
    { label: "Weight variance", value: scenario.weightVariance },
    { label: "Fragile", value: scenario.fragileItems ? "Yes" : "No" },
    { label: "Max pallet height", value: `${scenario.maxHeight} units` },
  ];

  const userTopMap = useMemo(() => makeTopMap(placed), [placed]);
  const aiTopMap = useMemo(() => makeTopMap(aiPlaced), [aiPlaced]);

  const benchmark = 71;
  const userVsAi = aiMetrics.score - userMetrics.score;
  const aiCurrentLayer =
    aiBuildStep > 0 && aiPlaced[aiBuildStep - 1]
      ? aiPlaced[aiBuildStep - 1].y + 1
      : 0;

  return (
    <main className={styles.page}>
      <div className={styles.frame}>
        <header className={styles.topbar}>
          <Link href="/ascentra-lab" className={styles.brand}>
            Ascentra Lab
          </Link>
          <div className={styles.statusLine}>
            <span className={styles.tag}>Mixed Palletizing Championship</span>
            <span className={styles.tag}>Cinematic Simulation</span>
            <span className={styles.tag}>{scenario.scenarioId}</span>
          </div>
        </header>

        <section className={styles.canvasShell}>
          <canvas ref={canvasRef} className={styles.canvas} aria-label="Mixed palletizing simulation" />

          <div className={styles.hudLayer}>
            {phase === "hero" && (
              <div className={styles.heroOverlay}>
                <div className={styles.heroInner}>
                  <p className={styles.overline}>Ascentra Lab</p>
                  <h1 className={styles.title}>Mixed Palletizing Championship</h1>
                  <p className={styles.subtitle}>
                    Can you beat the Ascentra AI? Step into a premium warehouse intelligence simulation and
                    engineer a mixed pallet under pressure.
                  </p>
                  <button type="button" className={`${styles.primaryBtn} ${styles.heroCta}`} onClick={beginChallenge}>
                    Start Challenge
                  </button>
                </div>
              </div>
            )}

            {phase === "brief" && (
              <aside className={styles.panel}>
                <p className={styles.panelTitle}>Mission Brief</p>
                <h2 className={styles.panelHead}>Store Replenishment Run</h2>
                <p className={styles.panelText}>
                  Build a stable, efficient mixed pallet for a high-tempo replenishment lane. Balance fill rate,
                  compressive safety, and time pressure.
                </p>
                <div className={styles.dataGrid}>
                  {missionCards.map((item) => (
                    <div key={item.label} className={styles.dataCard}>
                      <div className={styles.dataLabel}>{item.label}</div>
                      <div className={styles.dataValue}>{item.value}</div>
                    </div>
                  ))}
                </div>
                <div className={styles.panelActions}>
                  <button type="button" className={styles.primaryBtn} onClick={launchMission}>
                    Begin Mission
                  </button>
                  <button
                    type="button"
                    className={styles.ghostBtn}
                    onClick={() => {
                      const fresh = generateScenario();
                      setScenario(fresh);
                      resetRun(fresh);
                    }}
                  >
                    Generate New Scenario
                  </button>
                </div>
              </aside>
            )}

            {(phase === "challenge" || phase === "results") && (
              <aside className={styles.metrics}>
                <p className={styles.metricsTitle}>Live Metrics</p>
                <div className={styles.metricRow}>
                  <div className={styles.metricHeader}>
                    <span>Fill rate</span>
                    <span>{userMetrics.fillRate.toFixed(1)}%</span>
                  </div>
                  <div className={styles.barTrack}>
                    <div className={styles.barFill} style={{ width: `${Math.min(100, userMetrics.fillRate)}%` }} />
                  </div>
                </div>
                <div className={styles.metricRow}>
                  <div className={styles.metricHeader}>
                    <span>Stability</span>
                    <span>{userMetrics.stability.toFixed(1)}%</span>
                  </div>
                  <div className={styles.barTrack}>
                    <div className={styles.barFill} style={{ width: `${Math.min(100, userMetrics.stability)}%` }} />
                  </div>
                </div>
                <div className={styles.metricRow}>
                  <div className={styles.metricHeader}>
                    <span>Height used</span>
                    <span>{userMetrics.heightUsed.toFixed(1)}%</span>
                  </div>
                  <div className={styles.barTrack}>
                    <div className={styles.barFill} style={{ width: `${Math.min(100, userMetrics.heightUsed)}%` }} />
                  </div>
                </div>
                <div className={styles.metricRow}>
                  <div className={styles.metricHeader}>
                    <span>Boxes placed</span>
                    <span>
                      {userMetrics.placed}/{userMetrics.total}
                    </span>
                  </div>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      style={{ width: `${Math.min(100, (userMetrics.placed / Math.max(1, userMetrics.total)) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className={styles.metricRow}>
                  <div className={styles.metricHeader}>
                    <span>Time remaining</span>
                    <span className={timer < 20 ? styles.timerHot : undefined}>{timer}s</span>
                  </div>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      style={{
                        width: `${Math.min(100, (timer / Math.max(1, scenario.timerSeconds)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </aside>
            )}

            {isAiVisual && (
              <div className={styles.aiPanel}>
                <p className={styles.panelTitle}>Ascentra Pallet Intelligence</p>
                <h3 className={styles.panelHead}>Initiating Ascentra Pallet Intelligence Engine</h3>
                {phase === "aiTransition" && (
                  <p className={styles.panelText}>Reframing camera and activating cognition overlay...</p>
                )}
                {phase === "aiThinking" && (
                  <div>
                    {thinkingMessages.map((line) => (
                      <div key={line.id} className={styles.aiLine}>
                        {line.text}
                      </div>
                    ))}
                  </div>
                )}
                {phase === "aiBuild" && (
                  <p className={styles.panelText}>
                    AI build reveal in progress: layer {aiCurrentLayer}, precision placement ({aiBuildStep}/
                    {aiPlaced.length}) - {aiLayerStatus}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        {phase === "challenge" && (
          <div className={styles.challengeBar}>
            <section className={styles.staging}>
              <h3 className={styles.stagingHead}>Incoming Cartons</h3>
              <div className={styles.stagingGrid}>
                {queue.map((item) => {
                  const active = item.queueId === selectedQueueId;
                  return (
                    <button
                      key={item.queueId}
                      type="button"
                      className={`${styles.boxCard} ${active ? styles.boxCardActive : ""}`}
                      onClick={() => setSelectedQueueId(item.queueId)}
                    >
                      <div className={styles.boxLabel}>
                        {item.sku.id} • {item.sku.label}
                      </div>
                      <div className={styles.boxSpec}>
                        {item.sku.w}x{item.sku.d}x{item.sku.h} | {item.sku.weight}kg
                        {item.sku.fragile ? " | Fragile" : ""}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className={styles.controls}>
              <p className={styles.hint}>
                Move mouse over the pallet for snapped placement. Click to place. Press R to rotate the active
                carton. Green ghost is valid, red means invalid.
              </p>
              <div className={styles.buttonRow}>
                <button type="button" className={styles.secondaryBtn} onClick={() => setRotation((r) => !r)}>
                  Rotate (R)
                </button>
                <button type="button" className={styles.ghostBtn} onClick={() => setPhase("aiTransition")}>
                  End Run
                </button>
              </div>
              <p className={styles.hint}>
                Subtle instability feedback is active. Center-heavy, well-supported layers improve score and reduce
                transport risk.
              </p>
            </section>
          </div>
        )}

        {phase === "results" && (
          <section className={styles.resultsWrap}>
            <h2 className={styles.resultsTitle}>Results: User vs Ascentra AI</h2>
            <div className={styles.resultsGrid}>
              <article className={styles.scoreCard}>
                <h3>User pallet</h3>
                <p className={styles.scoreMain}>{userMetrics.score}</p>
                <p className={styles.scoreSub}>
                  Fill {userMetrics.fillRate.toFixed(1)}% • Stability {userMetrics.stability.toFixed(1)}% • Safety{" "}
                  {userMetrics.transportSafety.toFixed(1)}%
                </p>
                <div className={styles.mapGrid}>
                  {userTopMap.flatMap((row, rowIndex) =>
                    row.map((value, colIndex) => (
                      <div
                        key={`u-${rowIndex}-${colIndex}`}
                        className={`${styles.cell} ${value > 0 ? styles.cellFilled : ""}`}
                        title={value > 0 ? `height ${value}` : "empty"}
                      />
                    ))
                  )}
                </div>
              </article>

              <article className={styles.scoreCard}>
                <h3>Ascentra AI pallet</h3>
                <p className={styles.scoreMain}>{aiMetrics.score}</p>
                <p className={styles.scoreSub}>
                  Fill {aiMetrics.fillRate.toFixed(1)}% • Stability {aiMetrics.stability.toFixed(1)}% • Safety{" "}
                  {aiMetrics.transportSafety.toFixed(1)}%
                </p>
                <div className={styles.mapGrid}>
                  {aiTopMap.flatMap((row, rowIndex) =>
                    row.map((value, colIndex) => (
                      <div
                        key={`ai-${rowIndex}-${colIndex}`}
                        className={`${styles.cell} ${value > 0 ? styles.cellAi : ""}`}
                        title={value > 0 ? `height ${value}` : "empty"}
                      />
                    ))
                  )}
                </div>
              </article>
            </div>

            <div className={styles.benchmark}>
              Average warehouse operator benchmark: {benchmark} points. Your score: {userMetrics.score}. Ascentra AI:
              {" "}
              {aiMetrics.score}. {userVsAi > 0 ? `AI wins by ${userVsAi} points.` : "You matched or beat the AI."}
            </div>

            <div className={styles.resultActions}>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={() => {
                  resetRun(scenario);
                  setPhase("brief");
                }}
              >
                Try Again
              </button>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => {
                  const fresh = generateScenario();
                  setScenario(fresh);
                  resetRun(fresh);
                  setPhase("brief");
                }}
              >
                Generate New Scenario
              </button>
              <button type="button" className={styles.ghostBtn}>
                Share Score
              </button>
              <Link href="/operis" className={styles.ghostBtn}>
                See real-world applications
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
