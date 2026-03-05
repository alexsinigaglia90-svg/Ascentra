"use client";

import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BlueprintMap } from "@/app/operis/components/BlueprintMap";
import { ZonePreviewCard } from "@/app/operis/components/ZonePreviewCard";
import type { Department, DepartmentId } from "../data";

type CursorPreview = {
  x: number;
  y: number;
  departmentId: DepartmentId;
};

type Props = {
  departments: Department[];
  onOpenDepartment: (departmentId: DepartmentId, origin: { x: number; y: number }) => void;
};

export function OperationalNetwork({ departments, onOpenDepartment }: Props) {
  const [hoveredZoneId, setHoveredZoneId] = useState<DepartmentId | null>(null);
  const [preview, setPreview] = useState<CursorPreview | null>(null);
  const [peekZoneId, setPeekZoneId] = useState<DepartmentId | null>(null);
  const [camera, setCamera] = useState({ x: 0, y: 0 });
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const query = window.matchMedia("(hover: none), (pointer: coarse)");
    const update = () => setIsCoarsePointer(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const hoveredDepartment = useMemo(
    () => departments.find((d) => d.id === hoveredZoneId),
    [departments, hoveredZoneId]
  );

  const peekDepartment = useMemo(
    () => departments.find((d) => d.id === peekZoneId),
    [departments, peekZoneId]
  );

  const handleActivate = (departmentId: DepartmentId, event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const origin = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };

    if (isCoarsePointer) {
      if (peekZoneId !== departmentId) {
        setPeekZoneId(departmentId);
        return;
      }
    }

    onOpenDepartment(departmentId, origin);
  };

  return (
    <section
      id="operational-network"
      className="relative border-b border-[var(--om-stroke)] px-6 py-20 sm:px-10 lg:px-16"
      aria-labelledby="operis-network-title"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-end justify-between gap-8">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--om-brown)]">Operational Network</p>
            <h2 id="operis-network-title" className="mt-3 text-3xl font-semibold sm:text-5xl">
              Kies een domein. Zie direct hoe Operis capaciteit opbouwt.
            </h2>
            <p className="mt-4 text-[var(--om-ink)]/75">
              Een interactieve netwerkweergave van Operations, Control Room, Planning en
              Operational Management.
            </p>
          </div>
          <motion.div
            className="hidden rounded-2xl border border-[var(--om-stroke)] bg-white/40 px-5 py-4 text-sm text-[var(--om-ink)]/80 lg:block"
            animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
            transition={{ duration: 5.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            Hover voor preview. Klik voor volledig domeinprofiel.
          </motion.div>
        </div>

        <div className="relative">
          <BlueprintMap
            departments={departments}
            hoveredZoneId={hoveredZoneId}
            camera={camera}
            onCameraMove={setCamera}
            onHoverZone={(id: DepartmentId, x: number, y: number) => {
              if (isCoarsePointer) {
                return;
              }
              setHoveredZoneId(id);
              setPreview({ x, y, departmentId: id });
            }}
            onLeaveZone={() => {
              setHoveredZoneId(null);
              setPreview(null);
            }}
            onActivateZone={handleActivate}
            isCoarsePointer={isCoarsePointer}
          />

          {!isCoarsePointer && preview && hoveredDepartment && (
            <ZonePreviewCard
              x={preview.x}
              y={preview.y}
              department={hoveredDepartment}
              reducedMotion={Boolean(reduceMotion)}
            />
          )}
        </div>
      </div>

      {isCoarsePointer && peekDepartment && (
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 32 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-4 bottom-4 z-30 rounded-3xl border border-[var(--om-stroke)] bg-[var(--om-card)] p-5 shadow-2xl backdrop-blur"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--om-brown)]">{peekDepartment.kicker}</p>
          <h3 className="mt-2 text-xl font-semibold text-[var(--om-blue)]">{peekDepartment.name}</h3>
          <p className="mt-2 text-sm text-[var(--om-ink)]/80">{peekDepartment.summary}</p>
          <button
            className="mt-4 w-full rounded-xl bg-[var(--om-blue)] px-4 py-3 text-sm font-medium text-white"
            onClick={() => {
              onOpenDepartment(peekDepartment.id, {
                x: window.innerWidth / 2,
                y: window.innerHeight - 60,
              });
            }}
          >
            Open domein
          </button>
        </motion.div>
      )}
    </section>
  );
}
