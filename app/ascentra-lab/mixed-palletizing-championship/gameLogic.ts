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

function floatingPenalty(placed: PlacedBox[]) {
  const floating = placed.filter((item) => {
    if (item.y === 0) {
      return false;
    }
    let support = 0;
    for (let ix = item.x; ix < item.x + item.w; ix += 1) {
      for (let iz = item.z; iz < item.z + item.d; iz += 1) {
        const backed = placed.some((base) => {
          const matchTop = base.y + base.h === item.y;
          const inX = ix >= base.x && ix < base.x + base.w;
          const inZ = iz >= base.z && iz < base.z + base.d;
          return matchTop && inX && inZ;
        });
        if (backed) {
          support += 1;
        }
      }
    }
    return support / (item.w * item.d) < 0.8;
  });

  return floating.length;
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

  const fragilePenalty = placed.reduce((sum, item) => {
    if (!item.fragile) {
      return sum;
    }

    const heavyAbove = placed.some((other) => {
      const overlaps =
        item.x < other.x + other.w &&
        item.x + item.w > other.x &&
        item.z < other.z + other.d &&
        item.z + item.d > other.z;
      return overlaps && other.y >= item.y + item.h && other.weight > item.weight;
    });

    return sum + (heavyAbove ? 1 : 0);
  }, 0);

  const stabilityRaw =
    100 - avgCenterPenalty * 40 - floatingPenalty(placed) * 8 - fragilePenalty * 5 + aiBoost;
  const stability = Math.max(12, Math.min(99, stabilityRaw));

  const compressionRisk = Math.max(
    4,
    Math.min(96, 100 - stability + Math.max(0, (heightUsed - 82) * 0.5))
  );

  const transportSafety = Math.max(8, Math.min(99, 100 - compressionRisk * 0.75));

  const score = Math.round(
    fillRate * 0.32 +
      stability * 0.4 +
      (100 - Math.abs(78 - heightUsed)) * 0.13 +
      (placed.length / Math.max(1, scenario.cartons)) * 100 * 0.15
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

function scoreCandidate(
  placed: PlacedBox[],
  candidate: PlacementCandidate,
  sku: ScenarioSku,
  targetLayer: number,
  fillerBias: number
): number {
  const sameLayer = placed.filter((item) => item.y === candidate.y);
  const layerCoherence =
    sameLayer.length === 0
      ? 0.68
      : sameLayer.reduce((sum, item) => {
          const touchX =
            item.x + item.w === candidate.x || candidate.x + candidate.w === item.x;
          const overlapZ =
            candidate.z < item.z + item.d && candidate.z + candidate.d > item.z;
          const touchZ =
            item.z + item.d === candidate.z || candidate.z + candidate.d === item.z;
          const overlapX =
            candidate.x < item.x + item.w && candidate.x + candidate.w > item.x;
          return sum + (touchX && overlapZ ? 1 : 0) + (touchZ && overlapX ? 1 : 0);
        }, 0) /
        Math.max(1, sameLayer.length);

  const flatTopBonus =
    placed.length === 0
      ? 0
      : placed.reduce((sum, item) => {
          const supportX =
            candidate.x < item.x + item.w && candidate.x + candidate.w > item.x;
          const supportZ =
            candidate.z < item.z + item.d && candidate.z + candidate.d > item.z;
          return sum + (supportX && supportZ && item.y + item.h === candidate.y ? 1 : 0);
        }, 0) /
        Math.max(1, candidate.w * candidate.d);

  const center = 1 - centerDistancePenalty(candidate.x, candidate.z, candidate.w, candidate.d);
  const lowBias = 1 - candidate.y / 12;
  const area = (candidate.w * candidate.d) / 16;
  const fragileBias = sku.fragile ? (candidate.y > 1 ? 1 : 0.2) : 0;
  const layerPenalty = candidate.y > 0 ? 0 : 0.12;
  const layerDiscipline = Math.max(0, 1 - Math.abs(candidate.y - targetLayer) / 5);
  const fillerLift = fillerBias * (1 - area) * 0.22;

  return (
    center * 0.24 +
    lowBias * 0.2 +
    area * 0.15 +
    fragileBias * 0.14 +
    layerCoherence * 0.16 +
    flatTopBonus * 0.17 +
    layerPenalty +
    layerDiscipline * 0.14 +
    fillerLift
  );
}

function generateCandidates(placed: PlacedBox[], scenario: Scenario, sku: ScenarioSku) {
  const candidates: PlacementCandidate[] = [];
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
          candidates.push({
            x,
            z,
            y: check.y,
            rotated: orientation.rotated,
            w: orientation.w,
            d: orientation.d,
            h: sku.h,
          });
        }
      }
    }
  });

  return candidates;
}

export function solveAiLayout(scenario: Scenario): PlacedBox[] {
  const queue = expandScenarioQueue(scenario);

  // Heavier and larger cartons first, fragile cartons later to improve top-layer protection.
  queue.sort((a, b) => {
    const fragileRank = Number(a.sku.fragile) - Number(b.sku.fragile);
    if (fragileRank !== 0) {
      return fragileRank;
    }
    const areaA = a.sku.w * a.sku.d;
    const areaB = b.sku.w * b.sku.d;
    if (areaB !== areaA) {
      return areaB - areaA;
    }
    return b.sku.weight - a.sku.weight;
  });

  const anchors = queue.filter((item) => item.sku.weight >= 16 || item.sku.w * item.sku.d >= 8);
  const fillers = queue.filter((item) => !anchors.includes(item));
  fillers.sort((a, b) => a.sku.w * a.sku.d - b.sku.w * b.sku.d || a.sku.weight - b.sku.weight);

  const ordered = [...anchors, ...fillers];

  const placed: PlacedBox[] = [];
  let targetLayer = 0;

  const estimateLayerCoverage = (layer: number) => {
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
  };

  ordered.forEach((item, index) => {
    const candidates = generateCandidates(placed, scenario, item.sku);
    if (candidates.length === 0) {
      return;
    }

    const sameLayer = candidates.filter((candidate) => candidate.y === targetLayer);
    const nearLayer = candidates.filter((candidate) => candidate.y <= targetLayer + 1);
    const pool = sameLayer.length > 0 ? sameLayer : nearLayer.length > 0 ? nearLayer : candidates;

    const fillerBias = item.sku.w * item.sku.d <= 4 ? 1 : 0;

    pool.sort((a, b) => {
      const scoreA = scoreCandidate(placed, a, item.sku, targetLayer, fillerBias);
      const scoreB = scoreCandidate(placed, b, item.sku, targetLayer, fillerBias);
      return scoreB - scoreA;
    });

    const choice = pool[0];

    placed.push({
      placementId: `AI-${item.queueId}-${index}`,
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
    });

    const coverage = estimateLayerCoverage(targetLayer);
    const hasFutureAtLayer = ordered.slice(index + 1).some((next) => {
      const opts = generateCandidates(placed, scenario, next.sku);
      return opts.some((candidate) => candidate.y === targetLayer);
    });
    if (coverage >= 0.74 || !hasFutureAtLayer) {
      targetLayer += 1;
    }
  });

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
