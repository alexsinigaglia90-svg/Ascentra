export type DepartmentId =
  | "operations"
  | "control-room"
  | "planning"
  | "operational-management";

export type SimulatorInputs = {
  pressure: number;
  automation: number;
  maturity: number;
  variability: number;
};

export type RoleCapabilityMap = Record<string, string[]>;

export type Department = {
  id: DepartmentId;
  name: string;
  kicker: string;
  summary: string;
  roles: string[];
  capabilities: string[];
  scenarios: string[];
  zone: {
    x: number;
    y: number;
    w: number;
    h: number;
    depth: number;
  };
};

export type ConstellationNode = {
  capability: string;
  x: number;
  y: number;
  layer: 1 | 2 | 3;
};

export type Recommendation = {
  profile: string;
  fit: number;
  title: string;
  explanation: string;
  focus: string[];
};

export const departments: Department[] = [
  {
    id: "operations",
    name: "Operations",
    kicker: "Floor Execution",
    summary:
      "Operations vraagt ritme, discipline en directe executie op de vloer. Operis levert professionals die stabiliseren, versnellen en teams aantoonbaar in control brengen.",
    roles: [
      "Warehouse Supervisor",
      "Shift Leader",
      "Inbound Coordinator",
      "Outbound Coordinator",
      "Automation Operator",
      "Process Specialist",
      "Quality Lead",
    ],
    capabilities: [
      "Team Leadership",
      "Lean Execution",
      "Safety",
      "Flow Optimization",
      "KPI Rhythm",
      "Training",
      "Problem Solving",
      "Automation Awareness",
    ],
    scenarios: [
      "Operational Stabilization",
      "Peak Season Scaling",
      "Go-Live Support",
      "Temporary Leadership",
    ],
    zone: { x: 7, y: 14, w: 36, h: 30, depth: 18 },
  },
  {
    id: "control-room",
    name: "Control Room",
    kicker: "Real-time Steering",
    summary:
      "Control Room performance draait om snelheid in besluitvorming, datakwaliteit en strakke escalatie. Operis borgt dagelijkse regie met analytische en operationele slagkracht.",
    roles: [
      "Control Room Lead",
      "Real-time Analyst",
      "Wave Planner",
      "Exception Manager",
      "WMS Power User",
    ],
    capabilities: [
      "Real-time Decisioning",
      "WMS/MAWM",
      "KPI Cockpit",
      "Bottleneck Management",
      "Stakeholder Comms",
      "Incident Response",
    ],
    scenarios: [
      "Cockpit Setup",
      "Performance Recovery",
      "SLA Control",
      "Cut-off Management",
    ],
    zone: { x: 50, y: 10, w: 40, h: 27, depth: 20 },
  },
  {
    id: "planning",
    name: "Planning",
    kicker: "Predictive Orchestration",
    summary:
      "Planning verbindt vraag, capaciteit en constraints in een robuust plan. Operis professionals maken volatiliteit bestuurbaar en vertalen data naar heldere keuzes.",
    roles: [
      "Demand/Capacity Planner",
      "Inbound Planner",
      "Outbound Planner",
      "Workforce Planner",
      "Transport Planner",
    ],
    capabilities: [
      "Forecasting",
      "Capacity Modeling",
      "Constraints",
      "Scenario Planning",
      "Data Literacy",
      "Stakeholder Alignment",
    ],
    scenarios: [
      "Network Volatility",
      "Workforce Replan",
      "Peak Forecast",
      "Constraint Resolution",
    ],
    zone: { x: 13, y: 49, w: 35, h: 30, depth: 17 },
  },
  {
    id: "operational-management",
    name: "Operational Management",
    kicker: "Leadership Layer",
    summary:
      "Operational Management maakt het verschil tussen activiteit en resultaat. Operis levert leiderschap dat governance versterkt, verandering versnelt en teams structureel ontwikkelt.",
    roles: [
      "Interim Ops Manager",
      "Operations Excellence Lead",
      "Continuous Improvement Lead",
      "Site Lead Support",
    ],
    capabilities: [
      "Leadership",
      "Governance",
      "KPI System",
      "Change Delivery",
      "Culture",
      "Coaching",
      "Escalation Management",
    ],
    scenarios: [
      "Turnaround",
      "New Operating Model",
      "Org Strengthening",
      "Multi-department Alignment",
    ],
    zone: { x: 53, y: 43, w: 35, h: 33, depth: 22 },
  },
];

export const roleCapabilityMap: Record<DepartmentId, RoleCapabilityMap> = {
  operations: {
    "Warehouse Supervisor": [
      "Team Leadership",
      "Safety",
      "KPI Rhythm",
      "Problem Solving",
    ],
    "Shift Leader": [
      "Team Leadership",
      "Lean Execution",
      "Training",
      "Flow Optimization",
    ],
    "Inbound Coordinator": [
      "Flow Optimization",
      "Safety",
      "KPI Rhythm",
      "Automation Awareness",
    ],
    "Outbound Coordinator": [
      "Flow Optimization",
      "Problem Solving",
      "KPI Rhythm",
      "Lean Execution",
    ],
    "Automation Operator": [
      "Automation Awareness",
      "Problem Solving",
      "Safety",
      "Flow Optimization",
    ],
    "Process Specialist": [
      "Lean Execution",
      "Flow Optimization",
      "Training",
      "KPI Rhythm",
    ],
    "Quality Lead": ["Safety", "Training", "KPI Rhythm", "Problem Solving"],
  },
  "control-room": {
    "Control Room Lead": [
      "Real-time Decisioning",
      "KPI Cockpit",
      "Stakeholder Comms",
      "Incident Response",
    ],
    "Real-time Analyst": [
      "Real-time Decisioning",
      "KPI Cockpit",
      "Bottleneck Management",
      "WMS/MAWM",
    ],
    "Wave Planner": [
      "Bottleneck Management",
      "KPI Cockpit",
      "Real-time Decisioning",
      "WMS/MAWM",
    ],
    "Exception Manager": [
      "Incident Response",
      "Stakeholder Comms",
      "Bottleneck Management",
      "Real-time Decisioning",
    ],
    "WMS Power User": ["WMS/MAWM", "KPI Cockpit", "Incident Response"],
  },
  planning: {
    "Demand/Capacity Planner": [
      "Forecasting",
      "Capacity Modeling",
      "Scenario Planning",
      "Stakeholder Alignment",
    ],
    "Inbound Planner": [
      "Forecasting",
      "Constraints",
      "Data Literacy",
      "Stakeholder Alignment",
    ],
    "Outbound Planner": [
      "Capacity Modeling",
      "Constraints",
      "Scenario Planning",
      "Data Literacy",
    ],
    "Workforce Planner": [
      "Capacity Modeling",
      "Scenario Planning",
      "Stakeholder Alignment",
    ],
    "Transport Planner": [
      "Constraints",
      "Forecasting",
      "Data Literacy",
      "Scenario Planning",
    ],
  },
  "operational-management": {
    "Interim Ops Manager": [
      "Leadership",
      "Governance",
      "Escalation Management",
      "KPI System",
    ],
    "Operations Excellence Lead": [
      "KPI System",
      "Change Delivery",
      "Governance",
      "Coaching",
    ],
    "Continuous Improvement Lead": [
      "Change Delivery",
      "Culture",
      "Coaching",
      "Leadership",
    ],
    "Site Lead Support": [
      "Leadership",
      "Escalation Management",
      "Governance",
      "Culture",
    ],
  },
};

export const constellationPositions: Record<DepartmentId, ConstellationNode[]> = {
  operations: [
    { capability: "Team Leadership", x: 16, y: 45, layer: 3 },
    { capability: "Lean Execution", x: 35, y: 22, layer: 2 },
    { capability: "Safety", x: 52, y: 40, layer: 1 },
    { capability: "Flow Optimization", x: 66, y: 28, layer: 2 },
    { capability: "KPI Rhythm", x: 72, y: 52, layer: 3 },
    { capability: "Training", x: 44, y: 64, layer: 1 },
    { capability: "Problem Solving", x: 28, y: 58, layer: 2 },
    { capability: "Automation Awareness", x: 57, y: 70, layer: 2 },
  ],
  "control-room": [
    { capability: "Real-time Decisioning", x: 18, y: 35, layer: 3 },
    { capability: "WMS/MAWM", x: 38, y: 20, layer: 2 },
    { capability: "KPI Cockpit", x: 58, y: 34, layer: 3 },
    { capability: "Bottleneck Management", x: 74, y: 49, layer: 2 },
    { capability: "Stakeholder Comms", x: 44, y: 66, layer: 1 },
    { capability: "Incident Response", x: 23, y: 60, layer: 2 },
  ],
  planning: [
    { capability: "Forecasting", x: 20, y: 40, layer: 3 },
    { capability: "Capacity Modeling", x: 36, y: 24, layer: 2 },
    { capability: "Constraints", x: 57, y: 28, layer: 2 },
    { capability: "Scenario Planning", x: 70, y: 48, layer: 3 },
    { capability: "Data Literacy", x: 46, y: 64, layer: 1 },
    { capability: "Stakeholder Alignment", x: 26, y: 62, layer: 2 },
  ],
  "operational-management": [
    { capability: "Leadership", x: 22, y: 40, layer: 3 },
    { capability: "Governance", x: 43, y: 22, layer: 2 },
    { capability: "KPI System", x: 61, y: 36, layer: 3 },
    { capability: "Change Delivery", x: 75, y: 52, layer: 2 },
    { capability: "Culture", x: 50, y: 66, layer: 1 },
    { capability: "Coaching", x: 30, y: 64, layer: 2 },
    { capability: "Escalation Management", x: 66, y: 70, layer: 1 },
  ],
};

type ProfileRule = {
  id: string;
  title: string;
  focus: string[];
  evaluate: (input: SimulatorInputs, weightedScore: number) => number;
  explain: (input: SimulatorInputs) => string;
};

const profileRules: ProfileRule[] = [
  {
    id: "stabilisatie-cel",
    title: "Stabilisatiecel Operations",
    focus: ["Operations", "Operational Management"],
    evaluate: (i, score) => score + i.pressure * 0.35 + (100 - i.maturity) * 0.2,
    explain: (i) =>
      `Hoge druk (${i.pressure}) vraagt direct leiderschap op de vloer en dagritme op KPI's.`,
  },
  {
    id: "control-tower-acceleration",
    title: "Control Tower Acceleration",
    focus: ["Control Room", "Planning"],
    evaluate: (i, score) =>
      score + i.automation * 0.3 + i.variability * 0.25 + i.pressure * 0.15,
    explain: (i) =>
      `Met automatiseringscomplexiteit (${i.automation}) en variatie (${i.variability}) ontstaat directe behoefte aan real-time regie.`,
  },
  {
    id: "planning-recalibration",
    title: "Planning Recalibration Team",
    focus: ["Planning"],
    evaluate: (i, score) =>
      score + i.variability * 0.35 + (100 - i.maturity) * 0.18,
    explain: (i) =>
      `De combinatie van volumevolatiliteit (${i.variability}) en beperkte volwassenheid (${i.maturity}) vraagt een herijking van planhorizon en constraints.`,
  },
  {
    id: "go-live-bridge",
    title: "Go-Live Bridge Squad",
    focus: ["Operations", "Control Room"],
    evaluate: (i, score) => score + i.automation * 0.4 + i.pressure * 0.2,
    explain: (i) =>
      `Automatiseringsdruk (${i.automation}) gecombineerd met operationele druk (${i.pressure}) vereist een tijdelijke brug tussen vloer en cockpit.`,
  },
  {
    id: "leadership-upshift",
    title: "Leadership Upshift",
    focus: ["Operational Management"],
    evaluate: (i, score) =>
      score + (100 - i.maturity) * 0.45 + i.pressure * 0.1,
    explain: (i) =>
      `Wanneer teamvolwassenheid achterblijft (${i.maturity}), is versneld leiderschap bepalend voor structureel resultaat.`,
  },
  {
    id: "peak-flex-core",
    title: "Peak Flex Core",
    focus: ["Operations", "Planning", "Control Room"],
    evaluate: (i, score) =>
      score + i.variability * 0.4 + i.pressure * 0.2 + i.automation * 0.1,
    explain: (i) =>
      `In piekomstandigheden met hoge variatie (${i.variability}) houdt een flexibele kern bezetting, planning en cut-offs in balans.`,
  },
];

export const simulatorWeights = {
  pressure: 0.34,
  automation: 0.27,
  maturity: 0.17,
  variability: 0.22,
};

export function calculateDeploymentScore(input: SimulatorInputs): number {
  const maturityRisk = 100 - input.maturity;
  const score =
    input.pressure * simulatorWeights.pressure +
    input.automation * simulatorWeights.automation +
    maturityRisk * simulatorWeights.maturity +
    input.variability * simulatorWeights.variability;

  return Math.round(score);
}

export function getDeploymentRecommendations(
  input: SimulatorInputs,
  count = 4
): Recommendation[] {
  const baseScore = calculateDeploymentScore(input);

  return profileRules
    .map((rule) => {
      const fitRaw = Math.min(100, Math.round(rule.evaluate(input, baseScore)));
      return {
        profile: rule.id,
        fit: fitRaw,
        title: rule.title,
        explanation: rule.explain(input),
        focus: rule.focus,
      } satisfies Recommendation;
    })
    .sort((a, b) => b.fit - a.fit)
    .slice(0, count);
}

export function getDepartmentById(id: DepartmentId): Department {
  const department = departments.find((entry) => entry.id === id);
  if (!department) {
    throw new Error(`Unknown department: ${id}`);
  }
  return department;
}
