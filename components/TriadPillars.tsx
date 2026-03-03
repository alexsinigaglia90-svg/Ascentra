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
  },
];

const desktopPositions: Record<Pillar["key"], string> = {
  ascentra: "left-1/2 top-3 -translate-x-1/2",
  operis: "left-8 bottom-4",
  astra: "right-8 bottom-4",
};

export default function TriadPillars() {
  const [active, setActive] = useState<Pillar["key"]>("ascentra");
  const reducedMotion = useReducedMotion();

  const activePillar = useMemo(() => pillars.find((pillar) => pillar.key === active) ?? pillars[0], [active]);

  return (
    <Section id="pillars" className="section-spacing border-y border-[var(--line)] bg-white/35">
      <div className="container-shell">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[var(--blue)]">Three Pillars</p>
        <h2 className="text-balance text-4xl leading-tight md:text-5xl">The operating triad behind Ascentra.</h2>

        <div className="mt-10 hidden gap-8 lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="surface relative h-[360px] overflow-hidden p-6">
            <motion.svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <motion.path
                d="M50 18 L20 72 L80 72 Z"
                fill="none"
                stroke="rgba(30,58,95,0.24)"
                strokeWidth="1"
                initial={reducedMotion ? false : { pathLength: 0 }}
                whileInView={reducedMotion ? {} : { pathLength: 1 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              />
            </motion.svg>

            {pillars.map((pillar) => (
              <button
                key={pillar.key}
                type="button"
                onClick={() => setActive(pillar.key)}
                className={`absolute rounded-full border px-4 py-2 text-sm font-medium transition ${desktopPositions[pillar.key]} ${
                  active === pillar.key
                    ? "border-[var(--blue)] bg-[var(--blue)] text-[var(--bg)]"
                    : "border-[var(--line)] bg-white/75 text-[var(--ink)] hover:border-[var(--blue)]"
                }`}
              >
                {pillar.title}
              </button>
            ))}
          </div>

          <div className="surface min-h-[360px] p-8">
            <AnimatePresence mode="wait">
              <motion.article
                key={activePillar.key}
                initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
                exit={reducedMotion ? {} : { opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-3xl">{activePillar.title}</h3>
                <p className="muted mt-3 text-base leading-relaxed">{activePillar.tagline}</p>
                <ul className="mt-5 space-y-2 text-sm leading-relaxed md:text-base">
                  {activePillar.capabilities.map((item) => (
                    <li key={item} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--blue)]" />{item}</li>
                  ))}
                </ul>
                <div className="mt-6 border-t border-[var(--line)] pt-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--brown)]">Signature deliverables</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {activePillar.deliverables.map((item) => (
                      <span key={item} className="pill">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:hidden">
          {pillars.map((pillar) => {
            const isOpen = active === pillar.key;
            return (
              <article key={pillar.key} className="surface overflow-hidden">
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                  onClick={() => setActive(isOpen ? "ascentra" : pillar.key)}
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-2xl">{pillar.title}</span>
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
                          <li key={item} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--blue)]" />{item}</li>
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
