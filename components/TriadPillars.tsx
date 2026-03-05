"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import Section from "./Section";

type Pillar = {
  key: "ascentra" | "operis" | "astra";
  title: string;
  tagline: string;
  capabilities: string[];
  deliverables: string[];
  flavor: string;
};

type NodePosition = {
  top: string;
  left: string;
  transform: string;
};

const pillars: Pillar[] = [
  {
    key: "ascentra",
    title: "Ascentra",
    tagline: "Strategic consultancy and interim leadership where consequence is high.",
    capabilities: [
      "Supply chain strategy and network-capacity design",
      "Warehousing design and operating model definition",
      "Transformation leadership from blueprint to execution",
      "Interim roles: Head of Supply Chain, Warehouse Director, Program Lead, Control Tower Lead",
    ],
    deliverables: ["Board-ready roadmap", "Governance cadence", "KPI architecture"],
    flavor: "Strategic authority",
  },
  {
    key: "operis",
    title: "Operis",
    tagline: "Operational staffing with a BI platform built for warehousing performance.",
    capabilities: [
      "Supervisors, planners, control room teams, team leads, process engineers",
      "Client platform access: dashboards, labour performance, slotting, putaway logic",
      "Continuous improvement cockpit for daily steering",
      "Backed by senior professionals",
    ],
    deliverables: ["Daily control routines", "Throughput visibility", "Performance playbooks"],
    flavor: "Operational control",
  },
  {
    key: "astra",
    title: "Astra",
    tagline: "Product development for resilient warehouse operations.",
    capabilities: [
      "Modular, API-first WMS development",
      "Autonomous drone cycle counting workflows",
      "Vision, navigation, and reconciliation orchestration",
      "Enterprise-minded deployment and security posture",
    ],
    deliverables: ["ROI-first release scope", "Deployment-ready modules", "Measured rollout blueprint"],
    flavor: "Product innovation",
  },
];

const desktopPositions: Record<Pillar["key"], NodePosition> = {
  ascentra: { top: "8%", left: "50%", transform: "translate(-50%, 0)" },
  operis: { top: "79%", left: "14%", transform: "translate(0, -50%)" },
  astra: { top: "79%", left: "86%", transform: "translate(-100%, -50%)" },
};

const contentVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.05, delayChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0 },
};

export default function TriadPillars() {
  const [active, setActive] = useState<Pillar["key"]>("ascentra");
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const reducedMotion = useReducedMotion();

  const activePillar = useMemo(() => pillars.find((pillar) => pillar.key === active) ?? pillars[0], [active]);

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 8, y: y * 8 });
  };

  const handleLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <Section id="pillars" className="section-spacing border-y border-[var(--line)] bg-white/35">
      <div className="container-shell">
        <p className="section-kicker">Three Pillars</p>
        <h2 className="text-balance text-4xl leading-tight md:text-5xl">The operating triad behind Ascentra.</h2>

        <div className="mt-10 hidden gap-8 lg:grid lg:grid-cols-[0.96fr_1.04fr] lg:items-start">
          <motion.div
            className="triad-stage triad-grid relative h-[460px] p-6"
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            style={
              reducedMotion
                ? undefined
                : {
                    transform: `perspective(1200px) rotateX(${-tilt.y}deg) rotateY(${tilt.x}deg)`,
                  }
            }
          >
            <span className="ambient-orb left-[8%] top-[12%] h-24 w-24 bg-[var(--blue)]/16" aria-hidden="true" />
            <span className="ambient-orb right-[8%] top-[72%] h-28 w-28 bg-[var(--brown)]/14 [animation-delay:1.3s]" aria-hidden="true" />

            <svg viewBox="0 0 100 100" className="triad-connectors" aria-hidden="true">
              <defs>
                <linearGradient id="triadEnergyGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="rgba(30,58,95,0)" />
                  <stop offset="48%" stopColor="rgba(30,58,95,0.9)" />
                  <stop offset="100%" stopColor="rgba(107,78,61,0.15)" />
                </linearGradient>
              </defs>
              <path className="triad-connector" d="M50 16 L23 70 L77 70 Z" />
              {!reducedMotion && <path className="triad-energy" d="M50 16 L23 70 L77 70 Z" />}
              <circle cx="50" cy="16" r="1.3" fill="rgba(30,58,95,0.62)" />
              <circle cx="23" cy="70" r="1.3" fill="rgba(30,58,95,0.52)" />
              <circle cx="77" cy="70" r="1.3" fill="rgba(30,58,95,0.52)" />
            </svg>

            {pillars.map((pillar) => (
              <div
                key={pillar.key}
                className="node-wrap absolute"
                style={desktopPositions[pillar.key]}
                data-active={active === pillar.key}
              >
                <span className="node-halo" aria-hidden="true" />
                <button
                  type="button"
                  onClick={() => setActive(pillar.key)}
                  className="triad-node-btn relative px-6 py-2.5 text-sm font-medium tracking-wide"
                  data-active={active === pillar.key}
                >
                  {pillar.title}
                </button>
              </div>
            ))}

            <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between text-[0.62rem] uppercase tracking-[0.2em] text-[var(--ink)]/45">
              <span>Strategy</span>
              <span>Operations</span>
              <span>Products</span>
            </div>
          </motion.div>

          <div className="triad-panel min-h-[460px] p-8">
            <AnimatePresence mode="wait">
              <motion.article
                key={activePillar.key}
                variants={contentVariants}
                initial="hidden"
                animate="show"
                exit="hidden"
                transition={{ duration: 0.35 }}
              >
                <motion.p variants={itemVariants} className="section-kicker">
                  {activePillar.flavor}
                </motion.p>
                <motion.h3 variants={itemVariants} className="text-4xl leading-tight">
                  {activePillar.title}
                </motion.h3>
                <motion.p variants={itemVariants} className="muted mt-3 max-w-xl text-base leading-relaxed">
                  {activePillar.tagline}
                </motion.p>

                <motion.ul variants={contentVariants} className="mt-5 space-y-2 text-sm leading-relaxed md:text-base">
                  {activePillar.capabilities.map((item) => (
                    <motion.li key={item} variants={itemVariants} className="triad-metric flex gap-3 px-4 py-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--blue)]" />
                      {item}
                    </motion.li>
                  ))}
                </motion.ul>

                <motion.div variants={itemVariants} className="mt-6 border-t border-[var(--line)] pt-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--brown)]">Signature deliverables</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {activePillar.deliverables.map((item) => (
                      <span key={item} className="pill">
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:hidden">
          {pillars.map((pillar) => {
            const isOpen = active === pillar.key;
            return (
              <article key={pillar.key} className="triad-panel overflow-hidden">
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                  onClick={() => setActive(isOpen ? "ascentra" : pillar.key)}
                  aria-expanded={isOpen}
                >
                  <div>
                    <p className="text-[0.62rem] uppercase tracking-[0.18em] text-[var(--blue)]/72">{pillar.flavor}</p>
                    <span className="font-serif text-2xl">{pillar.title}</span>
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] text-[var(--blue)]">{isOpen ? "Open" : "Tap"}</span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={reducedMotion ? false : { opacity: 0, height: 0 }}
                      animate={reducedMotion ? {} : { opacity: 1, height: "auto" }}
                      exit={reducedMotion ? {} : { opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-5 pb-5"
                    >
                      <p className="muted mb-4 text-sm">{pillar.tagline}</p>
                      <ul className="space-y-2 text-sm">
                        {pillar.capabilities.map((item) => (
                          <li key={item} className="triad-metric flex gap-3 px-3 py-2">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--blue)]" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </article>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
