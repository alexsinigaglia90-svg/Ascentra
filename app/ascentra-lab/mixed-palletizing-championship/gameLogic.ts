import type {
  PlacementCandidate,
  PlacedBox,
  RunMetrics,
  Scenario,
  ScenarioSku,
} from "./types";

export const PALLET_WIDTH = 12;
export const PALLET_DEPTH = 10;
export const CELL_SIZE = 0.3;

const DESTINATIONS = [
  "Rotterdam DC-4",
  "Eindhoven Fulfillment Hub",
  "Utrecht Store Cluster",
  "Antwerp Omni-Node",
  "Tilburg Rapid Replenishment",
  "Breda Fresh Lane",
];

const SKU_LABELS = [
  "Dry Goods",
  "Health & Care",
  "Seasonal Promo",
  "Home Essentials",
  "Beverage Light",
  "Beverage Dense",
  "Fragile Glass",
  "Soft Pack",
  "Personal Care",
  "Household Mix",
];

const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pick = <T>(arr: T[]): T => arr[rand(0, arr.length - 1)];

const buildSku = (index: number): ScenarioSku => {
  const footprint = pick([
    [1, 2],
    [2, 1],
    [2, 2],
    [3, 3],
    [3, 2],
    [2, 3],
    [4, 3],
    [2, 4],
    [4, 2],
    [5, 2],
    [2, 5],
  ]);
  const h = pick([1, 1, 2, 2, 3, 3, 4]);
  const fragile = Math.random() < 0.2;
  const density = fragile ? 0.6 : Math.random() * 0.9 + 0.7;
  const volume = footprint[0] * footprint[1] * h;

  return {
    id: `SKU-${String(index + 1).padStart(2, "0")}`,
    label: pick(SKU_LABELS),
    w: footprint[0],
    d: footprint[1],
    h,
    quantity: rand(2, 8),
    weight: Math.round(volume * density),
    fragile,
  };
};

export function generateScenario(seed = Date.now()): Scenario {
  const skuTypes = rand(5, 8);
  const skus = Array.from({ length: skuTypes }, (_, index) => buildSku(index));
  const cartons = skus.reduce((sum, sku) => sum + sku.quantity, 0);
  const fragileItems = skus.some((sku) => sku.fragile);
  const maxHeight = rand(8, 12);
  const minWeight = Math.min(...skus.map((sku) => sku.weight));
  const maxWeight = Math.max(...skus.map((sku) => sku.weight));

  return {
    scenarioId: `MP-${String(seed).slice(-5)}-${rand(10, 99)}`,
    destination: pick(DESTINATIONS),
    skuTypes,
    cartons,
    maxHeight,
    fragileItems,
    weightVariance: `${minWeight}kg - ${maxWeight}kg`,
    timerSeconds: cartons > 34 ? 130 : 105,
    skus,
  };
}

export type BoxQueueItem = {
  queueId: string;
  sku: ScenarioSku;
};

export function expandScenarioQueue(scenario: Scenario): BoxQueueItem[] {
  const queue: BoxQueueItem[] = [];

  scenario.skus.forEach((sku) => {
    for (let i = 0; i < sku.quantity; i += 1) {
      queue.push({
        queueId: `${sku.id}-${i + 1}`,
        sku,
      });
    }
  });

  for (let i = queue.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [queue[i], queue[j]] = [queue[j], queue[i]];
  }

  return queue;
}

export function collides(
  placed: PlacedBox[],
  x: number,
  y: number,
  z: number,
  w: number,
  d: number,
  h: number
): boolean {
  return placed.some((item) => {
    const overlapX = x < item.x + item.w && x + w > item.x;
    const overlapY = y < item.y + item.h && y + h > item.y;
    const overlapZ = z < item.z + item.d && z + d > item.z;
    return overlapX && overlapY && overlapZ;
  });
}

const hasSupport = (
  placed: PlacedBox[],
  x: number,
  y: number,
  z: number,
  w: number,
  d: number
): boolean => {
  if (y === 0) {
    return true;
  }

  let supportedCells = 0;
  const totalCells = w * d;

  for (let ix = x; ix < x + w; ix += 1) {
    for (let iz = z; iz < z + d; iz += 1) {
      const supported = placed.some((item) => {
        const topMatches = item.y + item.h === y;
        const insideX = ix >= item.x && ix < item.x + item.w;
        const insideZ = iz >= item.z && iz < item.z + item.d;
        return topMatches && insideX && insideZ;
      });
      if (supported) {
        supportedCells += 1;
      }
    }
  }

  return supportedCells / totalCells >= 0.65;
};

export function findBaseY(
  placed: PlacedBox[],
  x: number,
  z: number,
  w: number,
  d: number
): number {
  let y = 0;

  placed.forEach((item) => {
    const overlapX = x < item.x + item.w && x + w > item.x;
    const overlapZ = z < item.z + item.d && z + d > item.z;
    if (overlapX && overlapZ) {
      y = Math.max(y, item.y + item.h);
    }
  });

  return y;
}

export function isValidPlacement(
  placed: PlacedBox[],
  scenario: Scenario,
  x: number,
  z: number,
  w: number,
  d: number,
  h: number
) {
  if (x < 0 || z < 0 || x + w > PALLET_WIDTH || z + d > PALLET_DEPTH) {
    return { valid: false, y: 0 };
  }

  const y = findBaseY(placed, x, z, w, d);

  if (y + h > scenario.maxHeight) {
    return { valid: false, y };
  }

  if (collides(placed, x, y, z, w, d, h)) {
    return { valid: false, y };
  }

  if (!hasSupport(placed, x, y, z, w, d)) {
    return { valid: false, y };
  }

  return { valid: true, y };
}

function centerDistancePenalty(x: number, z: number, w: number, d: number) {
  const cx = x + w / 2;
  const cz = z + d / 2;
  const dx = Math.abs(cx - PALLET_WIDTH / 2);
  const dz = Math.abs(cz - PALLET_DEPTH / 2);
  return (dx + dz) / (PALLET_WIDTH + PALLET_DEPTH);
}

function overlapArea2d(
  a: { x: number; z: number; w: number; d: number },
  b: { x: number; z: number; w: number; d: number }
) {
  const overlapX = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x));
  const overlapZ = Math.max(0, Math.min(a.z + a.d, b.z + b.d) - Math.max(a.z, b.z));
  return overlapX * overlapZ;
}

function supportRatioForPlacement(
  placed: PlacedBox[],
  x: number,
  y: number,
  z: number,
  w: number,
  d: number
) {
  if (y === 0) {
    return 1;
  }

  let supported = 0;
  for (let ix = x; ix < x + w; ix += 1) {
    for (let iz = z; iz < z + d; iz += 1) {
      const hasBase = placed.some((item) => {
        const topMatches = item.y + item.h === y;
        const insideX = ix >= item.x && ix < item.x + item.w;
        const insideZ = iz >= item.z && iz < item.z + item.d;
        return topMatches && insideX && insideZ;
      });
      if (hasBase) {
        supported += 1;
      }
    }
  }

  return supported / Math.max(1, w * d);
}

function contactRatioOnLayer(
  placed: PlacedBox[],
  x: number,
  y: number,
  z: number,
  w: number,
  d: number
) {
  const sameLayer = placed.filter((item) => item.y === y);
  if (sameLayer.length === 0) {
    return 0.65;
  }

  let touches = 0;
  sameLayer.forEach((item) => {
    const touchX = item.x + item.w === x || x + w === item.x;
    const overlapZ = z < item.z + item.d && z + d > item.z;
    const touchZ = item.z + item.d === z || z + d === item.z;
    const overlapX = x < item.x + item.w && x + w > item.x;
    if ((touchX && overlapZ) || (touchZ && overlapX)) {
      touches += 1;
    }
  });

  return Math.min(1, touches / Math.max(1, Math.sqrt(w * d)));
}

function layerCoverage(placed: PlacedBox[], layer: number) {
  const occupied = new Set<string>();
  placed
    .filter((item) => item.y === layer)
    .forEach((item) => {
      for (let x = item.x; x < item.x + item.w; x += 1) {
        for (let z = item.z; z < item.z + item.d; z += 1) {
          occupied.add(`${x}:${z}`);
        }
      }
    });
  return occupied.size / (PALLET_WIDTH * PALLET_DEPTH);
}

function pickTargetLayer(placed: PlacedBox[]) {
  if (placed.length === 0) {
    return 0;
  }
  const highestLayer = placed.reduce((max, box) => Math.max(max, box.y), 0);
  for (let layer = 0; layer <= highestLayer; layer += 1) {
    if (layerCoverage(placed, layer) < 0.84) {
      return layer;
    }
  }
  return highestLayer + 1;
}

function centerOfGravityDistance(placed: PlacedBox[]) {
  if (placed.length === 0) {
    return 0;
  }

  let sumWeight = 0;
  let cx = 0;
  let cz = 0;
  placed.forEach((item) => {
    const mass = Math.max(1, item.weight);
    sumWeight += mass;
    cx += (item.x + item.w / 2) * mass;
    cz += (item.z + item.d / 2) * mass;
  });

  cx /= Math.max(1, sumWeight);
  cz /= Math.max(1, sumWeight);
  const dx = cx - PALLET_WIDTH / 2;
  const dz = cz - PALLET_DEPTH / 2;
  const maxDist = Math.hypot(PALLET_WIDTH / 2, PALLET_DEPTH / 2);
  return Math.hypot(dx, dz) / Math.max(1, maxDist);
}

function skylineRoughness(placed: PlacedBox[]) {
  if (placed.length === 0) {
    return 0;
  }

  const top = Array.from({ length: PALLET_DEPTH }, () => Array.from({ length: PALLET_WIDTH }, () => 0));
  placed.forEach((item) => {
    for (let x = item.x; x < item.x + item.w; x += 1) {
      for (let z = item.z; z < item.z + item.d; z += 1) {
        top[z][x] = Math.max(top[z][x], item.y + item.h);
      }
    }
  });

  let edges = 0;
  let diffs = 0;
  for (let z = 0; z < PALLET_DEPTH; z += 1) {
    for (let x = 0; x < PALLET_WIDTH; x += 1) {
      const current = top[z][x];
      if (x + 1 < PALLET_WIDTH) {
        diffs += Math.abs(current - top[z][x + 1]);
        edges += 1;
      }
      if (z + 1 < PALLET_DEPTH) {
        diffs += Math.abs(current - top[z + 1][x]);
        edges += 1;
      }
    }
  }

  return diffs / Math.max(1, edges * Math.max(1, 0.5 * 12));
}

function heavyOnFragileViolations(placed: PlacedBox[]) {
  let violations = 0;
  placed.forEach((base) => {
    if (!base.fragile) {
      return;
    }
    const above = placed.some((top) => {
      if (top.y < base.y + base.h) {
        return false;
      }
      if (top.weight <= base.weight) {
        return false;
      }
      return overlapArea2d(base, top) > 0;
    });
    if (above) {
      violations += 1;
    }
  });
  return violations;
}

function floatingPenalty(placed: PlacedBox[]) {
  return placed.reduce((sum, item) => {
    if (item.y === 0) {
      return sum;
    }
    const support = supportRatioForPlacement(placed, item.x, item.y, item.z, item.w, item.d);
    return sum + (support < 0.8 ? 1 : 0);
  }, 0);
}

export function calculateMetrics(
  scenario: Scenario,
  placed: PlacedBox[],
  aiBoost = 0
): RunMetrics {
  const usedVolume = placed.reduce((sum, item) => sum + item.w * item.d * item.h, 0);
  const footprint = PALLET_WIDTH * PALLET_DEPTH;
  const maxVolume = footprint * scenario.maxHeight;
  const fillRate = Math.min(100, (usedVolume / maxVolume) * 100);

  const highest = placed.reduce((max, item) => Math.max(max, item.y + item.h), 0);
  const heightUsed = scenario.maxHeight > 0 ? (highest / scenario.maxHeight) * 100 : 0;

  const avgCenterPenalty =
    placed.length > 0
      ? placed.reduce((sum, item) => sum + centerDistancePenalty(item.x, item.z, item.w, item.d), 0) /
        placed.length
      : 1;

  const supportSamples = placed
    .filter((item) => item.y > 0)
    .map((item) => supportRatioForPlacement(placed, item.x, item.y, item.z, item.w, item.d));
  const avgSupport =
    supportSamples.length > 0
      ? supportSamples.reduce((sum, value) => sum + value, 0) / supportSamples.length
      : 1;

  const fragilePenalty = heavyOnFragileViolations(placed);
  const skylinePenalty = skylineRoughness(placed);

  const stabilityRaw =
    100 -
    avgCenterPenalty * 34 -
    floatingPenalty(placed) * 13 -
    (1 - avgSupport) * 42 -
    skylinePenalty * 22 -
    fragilePenalty * 8 +
    aiBoost;
  const stability = Math.max(12, Math.min(99, stabilityRaw));

  const compressionRisk = Math.max(
    4,
    Math.min(96, 100 - stability + Math.max(0, (heightUsed - 84) * 0.6) + fragilePenalty * 5)
  );

  const transportSafety = Math.max(8, Math.min(99, 100 - compressionRisk * 0.7 - skylinePenalty * 16));

  const score = Math.round(
    fillRate * 0.23 +
      stability * 0.29 +
      transportSafety * 0.2 +
      (100 - Math.abs(80 - heightUsed)) * 0.12 +
      avgSupport * 100 * 0.1 +
      (placed.length / Math.max(1, scenario.cartons)) * 100 * 0.06
  );

  return {
    fillRate,
    stability,
    heightUsed,
    placed: placed.length,
    total: scenario.cartons,
    compressionRisk,
    transportSafety,
    score,
  };
}

type SolverCandidate = PlacementCandidate & {
  supportRatio: number;
  contactRatio: number;
  localScore: number;
};

type BeamState = {
  placed: PlacedBox[];
  remaining: BoxQueueItem[];
  score: number;
};

function projectionScore(
  placed: PlacedBox[],
  x: number,
  z: number,
  w: number,
  d: number,
  layer: number
) {
  const occupied = new Set<string>();
  placed
    .filter((item) => item.y === layer)
    .forEach((item) => {
      for (let ix = item.x; ix < item.x + item.w; ix += 1) {
        for (let iz = item.z; iz < item.z + item.d; iz += 1) {
          occupied.add(`${ix}:${iz}`);
        }
      }
    });

  let newlyCovered = 0;
  for (let ix = x; ix < x + w; ix += 1) {
    for (let iz = z; iz < z + d; iz += 1) {
      if (!occupied.has(`${ix}:${iz}`)) {
        newlyCovered += 1;
      }
    }
  }
  return newlyCovered / Math.max(1, w * d);
}

function countEdgeExposure(x: number, z: number, w: number, d: number) {
  let edges = 0;
  if (x === 0) {
    edges += 1;
  }
  if (z === 0) {
    edges += 1;
  }
  if (x + w === PALLET_WIDTH) {
    edges += 1;
  }
  if (z + d === PALLET_DEPTH) {
    edges += 1;
  }
  return edges / 4;
}

function causesHeavyOnFragile(
  placed: PlacedBox[],
  candidate: PlacementCandidate,
  sku: ScenarioSku
) {
  if (candidate.y === 0) {
    return false;
  }
  return placed.some((base) => {
    if (!base.fragile) {
      return false;
    }
    if (base.y + base.h !== candidate.y) {
      return false;
    }
    if (sku.weight <= base.weight) {
      return false;
    }
    return overlapArea2d(base, candidate) > 0;
  });
}

function scoreCandidate(
  placed: PlacedBox[],
  candidate: PlacementCandidate,
  sku: ScenarioSku,
  targetLayer: number,
  scenario: Scenario
): number {
  const support = supportRatioForPlacement(
    placed,
    candidate.x,
    candidate.y,
    candidate.z,
    candidate.w,
    candidate.d
  );
  const contact = contactRatioOnLayer(
    placed,
    candidate.x,
    candidate.y,
    candidate.z,
    candidate.w,
    candidate.d
  );
  const coverage = projectionScore(
    placed,
    candidate.x,
    candidate.z,
    candidate.w,
    candidate.d,
    Math.max(0, targetLayer)
  );

  const tentative: PlacedBox[] = [
    ...placed,
    {
      placementId: "probe",
      skuId: sku.id,
      label: sku.label,
      x: candidate.x,
      y: candidate.y,
      z: candidate.z,
      w: candidate.w,
      d: candidate.d,
      h: candidate.h,
      rotated: candidate.rotated,
      weight: sku.weight,
      fragile: sku.fragile,
    },
  ];

  const cogDistance = centerOfGravityDistance(tentative);
  const edgeExposure = countEdgeExposure(candidate.x, candidate.z, candidate.w, candidate.d);
  const footprintArea = candidate.w * candidate.d;
  const areaNorm = footprintArea / 20;
  const center = 1 - centerDistancePenalty(candidate.x, candidate.z, candidate.w, candidate.d);
  const lowBias = 1 - candidate.y / Math.max(1, scenario.maxHeight);
  const layerDiscipline = Math.max(0, 1 - Math.abs(candidate.y - targetLayer) / 4);
  const isBasePhase = targetLayer <= 1;
  const isLarge = footprintArea >= 8;
  const isHeavy = sku.weight >= 15;
  const fragileBias = sku.fragile ? (candidate.y >= 1 ? 1 : 0) : 0.6;

  let hardPenalty = 0;
  if (support < (candidate.y === 0 ? 1 : isHeavy || isLarge ? 0.9 : 0.82)) {
    hardPenalty += 100;
  }
  if (sku.fragile && candidate.y === 0 && placed.length > 0) {
    hardPenalty += 45;
  }
  if (causesHeavyOnFragile(placed, candidate, sku)) {
    hardPenalty += 120;
  }
  if (isHeavy && candidate.y > Math.max(2, Math.floor(scenario.maxHeight * 0.45))) {
    hardPenalty += 50;
  }
  if (isBasePhase && isLarge && candidate.y > 1) {
    hardPenalty += 38;
  }
  if (edgeExposure > 0.5 && candidate.y > 1 && support < 0.96) {
    hardPenalty += 28;
  }

  return (
    center * 18 +
    lowBias * (isHeavy ? 20 : 12) +
    areaNorm * (isBasePhase ? 18 : 8) +
    fragileBias * 8 +
    support * 28 +
    contact * 15 +
    coverage * 14 +
    layerDiscipline * 14 +
    (1 - cogDistance) * 16 -
    edgeExposure * 10 -
    hardPenalty
  );
}

function generateCandidates(
  placed: PlacedBox[],
  scenario: Scenario,
  sku: ScenarioSku,
  targetLayer: number
) {
  const candidates: SolverCandidate[] = [];
  const orientations = [
    { w: sku.w, d: sku.d, rotated: false },
    { w: sku.d, d: sku.w, rotated: true },
  ];

  orientations.forEach((orientation) => {
    for (let x = 0; x <= PALLET_WIDTH - orientation.w; x += 1) {
      for (let z = 0; z <= PALLET_DEPTH - orientation.d; z += 1) {
        const check = isValidPlacement(
          placed,
          scenario,
          x,
          z,
          orientation.w,
          orientation.d,
          sku.h
        );
        if (check.valid) {
          const baseCandidate: PlacementCandidate = {
            x,
            z,
            y: check.y,
            rotated: orientation.rotated,
            w: orientation.w,
            d: orientation.d,
            h: sku.h,
          };

          const support = supportRatioForPlacement(
            placed,
            baseCandidate.x,
            baseCandidate.y,
            baseCandidate.z,
            baseCandidate.w,
            baseCandidate.d
          );
          const contact = contactRatioOnLayer(
            placed,
            baseCandidate.x,
            baseCandidate.y,
            baseCandidate.z,
            baseCandidate.w,
            baseCandidate.d
          );
          const score = scoreCandidate(placed, baseCandidate, sku, targetLayer, scenario);

          if (score > -55) {
            candidates.push({
              ...baseCandidate,
              supportRatio: support,
              contactRatio: contact,
              localScore: score,
            });
          }
        }
      }
    }
  });

  candidates.sort((a, b) => b.localScore - a.localScore);
  return candidates;
}

function evaluateStateScore(scenario: Scenario, placed: PlacedBox[]) {
  if (placed.length === 0) {
    return 0;
  }

  const metrics = calculateMetrics(scenario, placed);
  const supportSamples = placed
    .filter((item) => item.y > 0)
    .map((item) => supportRatioForPlacement(placed, item.x, item.y, item.z, item.w, item.d));
  const avgSupport =
    supportSamples.length > 0
      ? supportSamples.reduce((sum, value) => sum + value, 0) / supportSamples.length
      : 1;

  const heavyLowScore =
    placed
      .filter((item) => item.weight >= 15)
      .reduce((sum, item, _, arr) => {
        const low = 1 - item.y / Math.max(1, scenario.maxHeight);
        return sum + low / Math.max(1, arr.length);
      }, 0) || 0.75;

  const baseLargeRatio =
    placed.filter((item) => item.w * item.d >= 8 && item.y <= 1).length /
    Math.max(1, placed.filter((item) => item.w * item.d >= 8).length);

  const cog = centerOfGravityDistance(placed);
  const skyline = skylineRoughness(placed);
  const heavyFragile = heavyOnFragileViolations(placed);
  const floating = floatingPenalty(placed);

  const penalty =
    floating * 22 +
    Math.max(0, 0.86 - avgSupport) * 120 +
    heavyFragile * 34 +
    skyline * 36 +
    Math.max(0, cog - 0.46) * 180;

  return (
    metrics.score * 1.5 +
    avgSupport * 58 +
    heavyLowScore * 34 +
    baseLargeRatio * 28 +
    (1 - cog) * 42 -
    penalty
  );
}

function expansionIndices(remaining: BoxQueueItem[], targetLayer: number) {
  const candidates: number[] = [];
  const add = (index: number) => {
    if (index >= 0 && index < remaining.length && !candidates.includes(index)) {
      candidates.push(index);
    }
  };

  remaining.slice(0, 6).forEach((_, index) => add(index));

  if (targetLayer <= 1) {
    remaining.forEach((item, index) => {
      if (candidates.length >= 10) {
        return;
      }
      const area = item.sku.w * item.sku.d;
      if (!item.sku.fragile && (item.sku.weight >= 15 || area >= 8)) {
        add(index);
      }
    });
  } else {
    remaining.forEach((item, index) => {
      if (candidates.length >= 10) {
        return;
      }
      const area = item.sku.w * item.sku.d;
      if (item.sku.fragile || area <= 4) {
        add(index);
      }
    });
  }

  return candidates.slice(0, 8);
}

export function solveAiLayout(scenario: Scenario): PlacedBox[] {
  const queue = expandScenarioQueue(scenario);
  queue.sort((a, b) => {
    const areaA = a.sku.w * a.sku.d;
    const areaB = b.sku.w * b.sku.d;
    const fragA = a.sku.fragile ? 1 : 0;
    const fragB = b.sku.fragile ? 1 : 0;
    if (fragA !== fragB) {
      return fragA - fragB;
    }
    const heavyA = a.sku.weight >= 15 ? 1 : 0;
    const heavyB = b.sku.weight >= 15 ? 1 : 0;
    if (heavyA !== heavyB) {
      return heavyB - heavyA;
    }
    if (areaA !== areaB) {
      return areaB - areaA;
    }
    return b.sku.weight - a.sku.weight;
  });

  const beamWidth = 14;
  const candidatesPerItem = 6;
  let beams: BeamState[] = [{ placed: [], remaining: queue, score: 0 }];

  for (let step = 0; step < scenario.cartons; step += 1) {
    const expanded: BeamState[] = [];

    beams.forEach((state) => {
      if (state.remaining.length === 0) {
        expanded.push(state);
        return;
      }

      const targetLayer = pickTargetLayer(state.placed);
      const indices = expansionIndices(state.remaining, targetLayer);
      let madeMove = false;

      indices.forEach((itemIndex) => {
        const item = state.remaining[itemIndex];
        const localCandidates = generateCandidates(state.placed, scenario, item.sku, targetLayer).slice(
          0,
          candidatesPerItem
        );

        localCandidates.forEach((choice, choiceIdx) => {
          const nextPlaced: PlacedBox = {
            placementId: `AI-${item.queueId}-${step}-${choiceIdx}`,
            skuId: item.sku.id,
            label: item.sku.label,
            x: choice.x,
            y: choice.y,
            z: choice.z,
            w: choice.w,
            d: choice.d,
            h: choice.h,
            rotated: choice.rotated,
            weight: item.sku.weight,
            fragile: item.sku.fragile,
          };

          const placed = [...state.placed, nextPlaced];
          const remaining = state.remaining.filter((_, idx) => idx !== itemIndex);
          const score = evaluateStateScore(scenario, placed) + placed.length * 5;
          expanded.push({ placed, remaining, score });
          madeMove = true;
        });
      });

      if (!madeMove) {
        expanded.push(state);
      }
    });

    if (expanded.length === 0) {
      break;
    }

    expanded.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return b.placed.length - a.placed.length;
    });

    const deduped: BeamState[] = [];
    const seen = new Set<string>();
    expanded.forEach((state) => {
      if (deduped.length >= beamWidth) {
        return;
      }
      const signature = state.placed
        .slice(-10)
        .map((item) => `${item.x}:${item.y}:${item.z}:${item.w}:${item.d}:${item.h}`)
        .join("|");
      if (seen.has(signature)) {
        return;
      }
      seen.add(signature);
      deduped.push(state);
    });

    beams = deduped;

    if (beams.every((state) => state.remaining.length === 0)) {
      break;
    }
  }

  const best = beams.sort((a, b) => b.score - a.score || b.placed.length - a.placed.length)[0];
  const placed = best?.placed ?? [];

  return placed.sort((a, b) => {
    if (a.y !== b.y) {
      return a.y - b.y;
    }
    if (a.z !== b.z) {
      return a.z - b.z;
    }
    return a.x - b.x;
  });
}
