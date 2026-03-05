"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ConstellationNode, Department, RoleCapabilityMap } from "../data";
import { CapabilityConstellation } from "./CapabilityConstellation";
import { RoleGrid } from "./RoleGrid";

type Props = {
  department: Department;
  isOpen: boolean;
  onClose: () => void;
  roleCapabilities: RoleCapabilityMap;
  nodes: ConstellationNode[];
  selectedRole: string | null;
  setSelectedRole: (role: string | null) => void;
  origin: { x: number; y: number } | null;
};

export function DepartmentPanel({
  department,
  isOpen,
  onClose,
  roleCapabilities,
  nodes,
  selectedRole,
  setSelectedRole,
  origin,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const sync = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };

    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(() => {
      panelRef.current?.focus();
    }, 40);

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previous;
      window.clearTimeout(timer);
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose]);

  const initialX = origin ? origin.x - viewport.width / 2 : 0;
  const initialY = origin ? origin.y - viewport.height / 2 : 16;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[var(--om-ink)]/35 p-2 sm:p-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="department-panel-title"
        className="max-h-[92vh] w-full max-w-6xl overflow-auto rounded-[2rem] border border-[var(--om-stroke)] bg-[var(--om-card)] p-5 shadow-2xl backdrop-blur-xl sm:p-8"
        initial={
          reduceMotion
            ? { opacity: 0 }
            : { opacity: 0, x: initialX * 0.18, y: initialY * 0.18, scale: 0.88 }
        }
        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        exit={
          reduceMotion
            ? { opacity: 0 }
            : { opacity: 0, x: initialX * 0.12, y: initialY * 0.12, scale: 0.92 }
        }
        transition={{ duration: reduceMotion ? 0.01 : 0.26, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--om-stroke)] pb-5">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--om-brown)]">{department.kicker}</p>
            <h3 id="department-panel-title" className="mt-2 text-3xl font-semibold text-[var(--om-blue)] sm:text-4xl">
              {department.name}
            </h3>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--om-ink)]/80 sm:text-base">
              {department.summary}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[var(--om-stroke)] bg-white/60 px-3 py-1.5 text-sm font-medium text-[var(--om-ink)] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--om-blue)]"
          >
            Sluiten
          </button>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <section>
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--om-brown)]">Rollen</h4>
            <p className="mt-2 text-sm text-[var(--om-ink)]/70">Selecteer een rol en zie welke capabilities dominant zijn.</p>
            <div className="mt-4">
              <RoleGrid
                roles={department.roles}
                selectedRole={selectedRole}
                onSelectRole={(role) => setSelectedRole(role || null)}
              />
            </div>
          </section>

          <section>
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--om-brown)]">
              Capability Constellation
            </h4>
            <p className="mt-2 text-sm text-[var(--om-ink)]/70">
              Netwerk van kerncapabilities met nadruk op rol-specifieke impact.
            </p>
            <div className="mt-4">
              <CapabilityConstellation
                nodes={nodes}
                roleCapabilities={roleCapabilities}
                selectedRole={selectedRole}
              />
            </div>
          </section>
        </div>

        <section className="mt-8 border-t border-[var(--om-stroke)] pt-6">
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--om-brown)]">Deployment Scenarios</h4>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {department.scenarios.map((scenario) => (
              <div
                key={scenario}
                className="rounded-2xl border border-[var(--om-stroke)] bg-white/45 p-4 text-sm font-medium text-[var(--om-ink)]"
              >
                {scenario}
              </div>
            ))}
          </div>
        </section>

        <div className="mt-8 flex flex-wrap gap-3 border-t border-[var(--om-stroke)] pt-6">
          <button className="rounded-full bg-[var(--om-blue)] px-5 py-2.5 text-sm font-medium text-white">
            Plan een capability review
          </button>
          <button className="rounded-full border border-[var(--om-stroke)] bg-white/60 px-5 py-2.5 text-sm font-medium text-[var(--om-ink)]">
            Ontvang profielvoorstel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
