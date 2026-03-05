"use client";

import type { MouseEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Department, DepartmentId } from "../data";

type Props = {
  departments: Department[];
  hoveredZoneId: DepartmentId | null;
  camera: { x: number; y: number };
  onCameraMove: (camera: { x: number; y: number }) => void;
  onHoverZone: (id: DepartmentId, x: number, y: number) => void;
  onLeaveZone: () => void;
  onActivateZone: (id: DepartmentId, event: MouseEvent<HTMLButtonElement>) => void;
  isCoarsePointer: boolean;
};

export function BlueprintMap({
  departments,
  hoveredZoneId,
  camera,
  onCameraMove,
  onHoverZone,
  onLeaveZone,
  onActivateZone,
  isCoarsePointer,
}: Props) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="relative mx-auto aspect-[16/10] w-full overflow-hidden rounded-[2rem] border border-[var(--om-stroke)] bg-gradient-to-br from-white/60 via-white/40 to-[var(--om-blue)]/10"
      onMouseMove={(event) => {
        if (isCoarsePointer) {
          return;
        }
        const rect = event.currentTarget.getBoundingClientRect();
        const nx = (event.clientX - rect.left) / rect.width - 0.5;
        const ny = (event.clientY - rect.top) / rect.height - 0.5;
        onCameraMove({ x: nx, y: ny });
      }}
      onMouseLeave={() => {
        onCameraMove({ x: 0, y: 0 });
        onLeaveZone();
      }}
      animate={
        reduceMotion
          ? undefined
          : {
              rotateX: -7 + camera.y * -2,
              rotateY: 8 + camera.x * 3,
              x: camera.x * 8,
              y: camera.y * 8,
            }
      }
      transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <svg className="absolute inset-0 h-full w-full opacity-55" viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M8 0H0V8" fill="none" stroke="var(--om-stroke)" strokeWidth="0.4" />
          </pattern>
          <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(30,58,95,0.16)" />
            <stop offset="100%" stopColor="rgba(106,75,42,0.18)" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="100" height="100" fill="url(#grid)" />
        <rect x="4" y="5" width="92" height="88" fill="url(#glow)" rx="6" />
      </svg>

      <div className="absolute inset-0">
        {departments.map((department) => {
          const active = hoveredZoneId === department.id;
          return (
            <motion.button
              key={department.id}
              type="button"
              className="absolute overflow-hidden rounded-2xl border border-[var(--om-stroke)] bg-white/25 p-4 text-left backdrop-blur-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--om-blue)]"
              style={{
                left: `${department.zone.x}%`,
                top: `${department.zone.y}%`,
                width: `${department.zone.w}%`,
                height: `${department.zone.h}%`,
                transform: `translateZ(${department.zone.depth}px)`,
              }}
              animate={
                reduceMotion
                  ? undefined
                  : {
                      y: active ? -8 : 0,
                      boxShadow: active
                        ? "0 16px 40px rgba(30,58,95,0.2), 0 0 0 1px rgba(30,58,95,0.24) inset"
                        : "0 10px 30px rgba(17,18,20,0.08)",
                      borderColor: active ? "rgba(30,58,95,0.45)" : "rgba(17,18,20,0.12)",
                    }
              }
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={(event) =>
                onHoverZone(department.id, event.clientX + 20, event.clientY + 18)
              }
              onMouseMove={(event) =>
                onHoverZone(department.id, event.clientX + 20, event.clientY + 18)
              }
              onMouseLeave={onLeaveZone}
              onClick={(event) => onActivateZone(department.id, event)}
              aria-label={`${department.name} openen`}
            >
              <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--om-brown)]">
                {department.kicker}
              </span>
              <p className="mt-1 text-lg font-semibold text-[var(--om-blue)] sm:text-xl">
                {department.name}
              </p>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
