export type DepartmentId =
  | "operations"
  | "control-room"
  | "planning"
  | "operational-management";

export type EmployeeProfile = {
  slug: string;
  name: string;
  title: string;
  seniority: string;
  seniorityYears: number;
  location: string;
  availability: string;
  availabilityCode: "immediate" | "two-weeks" | "month-plus";
  summary: string;
  focus: string[];
  certifications: string[];
  sectorExperience: string[];
  profileHighlights: string[];
};

export type SimulatorInputs = {
  pressure: number;
  automation: number;
  maturity: number;
  variability: number;
};

export type RoleCapabilityMap = Record<string, string[]>;
export type RoleStaffingMap = Record<DepartmentId, Record<string, string[]>>;

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
      "Warehouse Operations Manager",
      "Warehouse Supervisor",
      "Shift Leader",
      "Inbound Coordinator",
      "Outbound Coordinator",
      "Crossdock Coordinator",
      "Inventory Control Specialist",
      "Returns & Reverse Flow Coordinator",
      "Automation Operator",
      "Process Specialist",
      "Quality Lead",
      "Continuous Improvement Specialist",
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
      "Yard & Dock Controller",
      "Labor Control Analyst",
      "Slotting Analyst",
      "SLA Performance Controller",
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
      "Master Planner",
      "Inbound Planner",
      "Outbound Planner",
      "Workforce Planner",
      "Transport Planner",
      "Network Planner",
      "S&OP Analyst",
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
      "Warehouse Manager",
      "Operations Excellence Lead",
      "Continuous Improvement Lead",
      "Site Lead Support",
      "Program Manager Logistics Transformation",
      "Start-up & Go-Live Manager",
      "Customer Operations Manager",
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
    "Warehouse Operations Manager": [
      "Team Leadership",
      "KPI Rhythm",
      "Flow Optimization",
      "Safety",
    ],
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
    "Crossdock Coordinator": [
      "Flow Optimization",
      "KPI Rhythm",
      "Problem Solving",
      "Safety",
    ],
    "Inventory Control Specialist": [
      "KPI Rhythm",
      "Problem Solving",
      "Training",
      "Lean Execution",
    ],
    "Returns & Reverse Flow Coordinator": [
      "Flow Optimization",
      "Problem Solving",
      "Safety",
      "Training",
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
    "Continuous Improvement Specialist": [
      "Lean Execution",
      "Flow Optimization",
      "KPI Rhythm",
      "Training",
    ],
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
    "Yard & Dock Controller": [
      "Real-time Decisioning",
      "Bottleneck Management",
      "Incident Response",
      "Stakeholder Comms",
    ],
    "Labor Control Analyst": [
      "KPI Cockpit",
      "Real-time Decisioning",
      "Stakeholder Comms",
      "Bottleneck Management",
    ],
    "Slotting Analyst": [
      "WMS/MAWM",
      "KPI Cockpit",
      "Real-time Decisioning",
      "Bottleneck Management",
    ],
    "SLA Performance Controller": [
      "KPI Cockpit",
      "Stakeholder Comms",
      "Incident Response",
      "Real-time Decisioning",
    ],
  },
  planning: {
    "Demand/Capacity Planner": [
      "Forecasting",
      "Capacity Modeling",
      "Scenario Planning",
      "Stakeholder Alignment",
    ],
    "Master Planner": [
      "Forecasting",
      "Capacity Modeling",
      "Scenario Planning",
      "Constraints",
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
    "Network Planner": [
      "Capacity Modeling",
      "Scenario Planning",
      "Stakeholder Alignment",
      "Data Literacy",
    ],
    "S&OP Analyst": [
      "Forecasting",
      "Stakeholder Alignment",
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
    "Warehouse Manager": [
      "Leadership",
      "Governance",
      "KPI System",
      "Culture",
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
    "Program Manager Logistics Transformation": [
      "Change Delivery",
      "Governance",
      "Escalation Management",
      "Leadership",
    ],
    "Start-up & Go-Live Manager": [
      "Change Delivery",
      "Escalation Management",
      "KPI System",
      "Leadership",
    ],
    "Customer Operations Manager": [
      "Leadership",
      "Culture",
      "Escalation Management",
      "Coaching",
    ],
  },
};

export const employees: EmployeeProfile[] = [
  {
    slug: "martijn-ridder",
    name: "Martijn Ridder",
    title: "Senior Operations & Control Lead",
    seniority: "12+ jaar operationele logistiek",
    seniorityYears: 12,
    location: "Randstad | NL",
    availability: "Beschikbaar binnen 2 weken",
    availabilityCode: "two-weeks",
    summary:
      "Martijn brengt operationele rust in complexe warehouse- en control-room omgevingen. Zijn kracht ligt in ritme bouwen, escalaties regisseren en teams versneld in eigenaarschap zetten.",
    focus: [
      "Operations governance",
      "Control room performance",
      "Go-live stabilisatie",
      "KPI cadence en floor discipline",
    ],
    certifications: [
      "Lean Six Sigma Green Belt",
      "APICS Certified in Logistics, Transportation and Distribution",
      "VCA VOL",
    ],
    sectorExperience: [
      "3PL",
      "E-commerce fulfilment",
      "Retail distributie",
      "Automatiseringsintensieve sites",
    ],
    profileHighlights: [
      "Leidde een 24/7 operatie met 220+ FTE door een piekseizoen zonder SLA-verlies.",
      "Richtte een control-room ritme in waarmee backlog in 6 weken met 31% daalde.",
      "Bouwde een operations review cadence op C-level niveau met dagelijks uitvoerbaar ritme.",
    ],
  },
  {
    slug: "noor-van-dijk",
    name: "Noor van Dijk",
    title: "Warehouse Performance Manager",
    seniority: "9+ jaar warehousing operations",
    seniorityYears: 9,
    location: "Utrecht | NL",
    availability: "Direct inzetbaar",
    availabilityCode: "immediate",
    summary:
      "Noor specialiseert in performance op inbound en inventory control. Ze brengt structuur in ploegoverdracht, KPI-ritme en afwijkingsopvolging.",
    focus: [
      "Inbound performance",
      "Inventory accuracy",
      "Shift governance",
      "Safety routines",
    ],
    certifications: ["Lean Practitioner", "VCA VOL"],
    sectorExperience: ["Retail distributie", "Food logistics", "3PL"],
    profileHighlights: [
      "Verhoogde inventory reliability naar 99,4% in een multi-client warehouse.",
      "Bouwde een ochtend-control cadence die escalatietijd met 40% verkortte.",
      "Verbeterde inbound dock turn-around met 18% zonder extra headcount.",
    ],
  },
  {
    slug: "jeroen-smit",
    name: "Jeroen Smit",
    title: "Control Room Lead",
    seniority: "11+ jaar real-time logistieke regie",
    seniorityYears: 11,
    location: "Breda | NL",
    availability: "Beschikbaar binnen 4 weken",
    availabilityCode: "month-plus",
    summary:
      "Jeroen combineert WMS-diepte met operationele besluitvorming. Hij stuurt op bottlenecks, cut-offs en stakeholdercommunicatie onder hoge druk.",
    focus: [
      "Control tower setup",
      "Wave governance",
      "Incident response",
      "SLA performance",
    ],
    certifications: ["APICS CLTD", "Prince2 Foundation"],
    sectorExperience: ["E-commerce", "Parcel hubs", "Airport logistics"],
    profileHighlights: [
      "Stabiliseerde same-day cut-off reliability naar 98,8%.",
      "Introduceerde cross-functional war-room ritme voor piekoperaties.",
      "Verlaagde expedite-kosten met 23% door realtime beslisregels.",
    ],
  },
  {
    slug: "farah-el-baz",
    name: "Farah El Baz",
    title: "Senior Planning & S&OP Analyst",
    seniority: "8+ jaar planning en capaciteitssturing",
    seniorityYears: 8,
    location: "Rotterdam | NL",
    availability: "Beschikbaar binnen 2 weken",
    availabilityCode: "two-weeks",
    summary:
      "Farah vertaalt volatiliteit naar robuuste planbeslissingen. Ze brengt forecasting-discipline en scenario gestuurd capaciteitsmanagement.",
    focus: [
      "Demand-capacity alignment",
      "S&OP cycles",
      "Constraint management",
      "Scenario planning",
    ],
    certifications: ["IBF CPF", "Lean Green Belt"],
    sectorExperience: ["Consumer goods", "Fashion", "3PL"],
    profileHighlights: [
      "Reductie van planafwijkingen met 27% in zes maanden.",
      "Zette een rolling capacity model op voor 5 DC locaties.",
      "Verhoogde forecast reliability voor piekperiode met 14 punten.",
    ],
  },
  {
    slug: "bas-koster",
    name: "Bas Koster",
    title: "Interim Operations Manager",
    seniority: "15+ jaar operationeel leiderschap",
    seniorityYears: 15,
    location: "Eindhoven | NL",
    availability: "Direct inzetbaar",
    availabilityCode: "immediate",
    summary:
      "Bas wordt ingezet waar tempo en structuur tegelijk omhoog moeten. Hij leidt turnarounds met heldere governance en sterke floor presence.",
    focus: [
      "Turnaround management",
      "Operational governance",
      "Leadership coaching",
      "Cross-department alignment",
    ],
    certifications: ["Black Belt Lean Six Sigma", "NEVI 2"],
    sectorExperience: ["Automotive logistics", "High-tech", "3PL"],
    profileHighlights: [
      "Bracht een verlieslatende site in 4 maanden terug naar operationele stabiliteit.",
      "Verhoogde outbound OTIF naar 99,1% tijdens transitieperiode.",
      "Implementeerde dagstart- en weekritme op managementniveau.",
    ],
  },
  {
    slug: "ilse-wouters",
    name: "Ilse Wouters",
    title: "Operations Excellence Lead",
    seniority: "10+ jaar continuous improvement",
    seniorityYears: 10,
    location: "Tilburg | NL",
    availability: "Beschikbaar binnen 2 weken",
    availabilityCode: "two-weeks",
    summary:
      "Ilse bouwt excellence-programmas die in de operatie blijven werken. Ze koppelt KPI-systemen aan gedrag, coaching en verbeterdiscipline.",
    focus: [
      "KPI system design",
      "CI governance",
      "Coaching on the floor",
      "Change delivery",
    ],
    certifications: ["Lean Six Sigma Black Belt", "Prosci Change Practitioner"],
    sectorExperience: ["Retail", "Pharma logistics", "E-fulfilment"],
    profileHighlights: [
      "Leverde 11% throughput uplift via standaardisatie en lijncoaching.",
      "Richtte een CI-board op met aantoonbare weekly savings.",
      "Verkortte onboarding tijd van team leads met 30%.",
    ],
  },
  {
    slug: "dennis-verbraak",
    name: "Dennis Verbraak",
    title: "WMS & Slotting Specialist",
    seniority: "7+ jaar WMS optimalisatie",
    seniorityYears: 7,
    location: "Venlo | NL",
    availability: "Beschikbaar binnen 4 weken",
    availabilityCode: "month-plus",
    summary:
      "Dennis verbindt systeemlogica met vloerrealiteit. Hij optimaliseert slotting, labor-aansturing en exception-flows binnen WMS-gedreven omgevingen.",
    focus: [
      "WMS power usage",
      "Slotting strategy",
      "Labor analytics",
      "Exception handling",
    ],
    certifications: ["Blue Yonder WMS Practitioner", "SQL for Operations"],
    sectorExperience: ["3PL", "Consumer electronics", "Omnichannel retail"],
    profileHighlights: [
      "Verbeterde pick path efficiency met 16% door slotting redesign.",
      "Zette exception dashboards op voor control-room sturing.",
      "Verlaagde wave planning rework met 22%.",
    ],
  },
  {
    slug: "eva-janssen",
    name: "Eva Janssen",
    title: "Network & Transport Planner",
    seniority: "9+ jaar netwerkplanning",
    seniorityYears: 9,
    location: "Zwolle | NL",
    availability: "Direct inzetbaar",
    availabilityCode: "immediate",
    summary:
      "Eva brengt voorspelbaarheid in transport en netwerkstromen. Ze stuurt op constraints, cost-to-serve en servicebalans in dynamische netwerken.",
    focus: [
      "Transport planning",
      "Network optimization",
      "Constraint resolution",
      "Stakeholder alignment",
    ],
    certifications: ["APICS CSCP", "Lean Green Belt"],
    sectorExperience: ["FMCG", "Parcel", "Retail"],
    profileHighlights: [
      "Reduceerde linehaul variatie met 19% in een multi-carrier netwerk.",
      "Verhoogde on-time departure via constraint-based planning.",
      "Borgde transport SLA control in S&OP cadans.",
    ],
  },
];

export const roleStaffingMap: RoleStaffingMap = {
  operations: {
    "Warehouse Operations Manager": ["martijn-ridder", "bas-koster"],
    "Warehouse Supervisor": ["martijn-ridder", "noor-van-dijk"],
    "Shift Leader": ["noor-van-dijk", "bas-koster"],
    "Inbound Coordinator": ["noor-van-dijk"],
    "Outbound Coordinator": ["martijn-ridder", "noor-van-dijk"],
    "Crossdock Coordinator": ["noor-van-dijk"],
    "Inventory Control Specialist": ["noor-van-dijk", "dennis-verbraak"],
    "Returns & Reverse Flow Coordinator": ["noor-van-dijk"],
    "Automation Operator": ["dennis-verbraak"],
    "Process Specialist": ["martijn-ridder", "ilse-wouters"],
    "Quality Lead": ["ilse-wouters"],
    "Continuous Improvement Specialist": ["ilse-wouters", "bas-koster"],
  },
  "control-room": {
    "Control Room Lead": ["martijn-ridder", "jeroen-smit"],
    "Real-time Analyst": ["jeroen-smit"],
    "Wave Planner": ["jeroen-smit", "dennis-verbraak"],
    "Exception Manager": ["martijn-ridder", "jeroen-smit"],
    "WMS Power User": ["dennis-verbraak"],
    "Yard & Dock Controller": ["jeroen-smit"],
    "Labor Control Analyst": ["dennis-verbraak", "jeroen-smit"],
    "Slotting Analyst": ["dennis-verbraak"],
    "SLA Performance Controller": ["martijn-ridder", "jeroen-smit"],
  },
  planning: {
    "Demand/Capacity Planner": ["farah-el-baz"],
    "Master Planner": ["farah-el-baz", "eva-janssen"],
    "Inbound Planner": ["farah-el-baz"],
    "Outbound Planner": ["farah-el-baz", "eva-janssen"],
    "Workforce Planner": ["farah-el-baz"],
    "Transport Planner": ["eva-janssen"],
    "Network Planner": ["eva-janssen", "farah-el-baz"],
    "S&OP Analyst": ["farah-el-baz", "eva-janssen"],
  },
  "operational-management": {
    "Interim Ops Manager": ["bas-koster", "martijn-ridder"],
    "Warehouse Manager": ["bas-koster", "martijn-ridder"],
    "Operations Excellence Lead": ["ilse-wouters", "bas-koster"],
    "Continuous Improvement Lead": ["ilse-wouters"],
    "Site Lead Support": ["bas-koster"],
    "Program Manager Logistics Transformation": ["bas-koster", "ilse-wouters"],
    "Start-up & Go-Live Manager": ["martijn-ridder", "bas-koster"],
    "Customer Operations Manager": ["bas-koster"],
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

export function getEmployeeBySlug(slug: string): EmployeeProfile | undefined {
  return employees.find((entry) => entry.slug === slug);
}

export function getEmployeesByRole(
  departmentId: DepartmentId,
  role: string
): EmployeeProfile[] {
  const slugs = roleStaffingMap[departmentId]?.[role] ?? [];
  return slugs
    .map((slug) => getEmployeeBySlug(slug))
    .filter((entry): entry is EmployeeProfile => Boolean(entry));
}

export function getRolesForEmployee(slug: string): Array<{
  departmentId: DepartmentId;
  departmentName: string;
  role: string;
}> {
  return departments.flatMap((department) => {
    return department.roles
      .filter((role) => (roleStaffingMap[department.id]?.[role] ?? []).includes(slug))
      .map((role) => ({
        departmentId: department.id,
        departmentName: department.name,
        role,
      }));
  });
}
