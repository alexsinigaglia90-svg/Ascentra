"use client";

import { motion } from "framer-motion";
import type { Department } from "../data";

type Props = {
  x: number;
  y: number;
  department: Department;
  reducedMotion: boolean;
};

export function ZonePreviewCard({ x, y, department, reducedMotion }: Props) {
  return (
    <motion.aside
      className="pointer-events-none fixed z-40 w-[min(28rem,calc(100vw-2rem))] rounded-2xl border border-[var(--om-stroke)] bg-[var(--om-card)] p-4 shadow-2xl backdrop-blur-md"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 8 }}
      transition={{ duration: reducedMotion ? 0.01 : 0.18, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden="true"
    >
      <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--om-brown)]">{department.kicker}</p>
      <h3 className="mt-1 text-lg font-semibold text-[var(--om-blue)]">{department.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--om-ink)]/80">{department.summary}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {department.roles.slice(0, 4).map((role) => (
          <span
            key={role}
            className="rounded-full border border-[var(--om-stroke)] bg-white/50 px-2.5 py-1 text-xs text-[var(--om-ink)]/80"
          >
            {role}
          </span>
        ))}
      </div>
    </motion.aside>
  );
}
