"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { AnimatePresence } from "framer-motion";
import {
  constellationPositions,
  departments,
  getDepartmentById,
  roleCapabilityMap,
  type DepartmentId,
} from "../data";
import { DepartmentPanel } from "@/app/operis/components/DepartmentPanel";
import { DeploymentSimulator } from "@/app/operis/components/DeploymentSimulator";
import { HeroCinematic } from "@/app/operis/components/HeroCinematic";
import { OperationalNetwork } from "@/app/operis/components/OperationalNetwork";
import { TrustCTA } from "@/app/operis/components/TrustCTA";

type PanelOrigin = {
  x: number;
  y: number;
};

export function OperisPageShell() {
  const [activeDepartmentId, setActiveDepartmentId] = useState<DepartmentId | null>(
    null
  );
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [origin, setOrigin] = useState<PanelOrigin | null>(null);

  const activeDepartment = useMemo(
    () =>
      activeDepartmentId ? getDepartmentById(activeDepartmentId) : undefined,
    [activeDepartmentId]
  );

  const openDepartment = (departmentId: DepartmentId, panelOrigin: PanelOrigin) => {
    setActiveDepartmentId(departmentId);
    setOrigin(panelOrigin);
    setSelectedRole(null);
  };

  const closeDepartment = () => {
    setActiveDepartmentId(null);
    setSelectedRole(null);
  };

  return (
    <main
      className="min-h-screen bg-[var(--om-bg)] text-[var(--om-ink)] selection:bg-[var(--om-blue)]/20"
      style={
        {
          "--om-bg": "#F6F1E7",
          "--om-ink": "#111214",
          "--om-blue": "#1E3A5F",
          "--om-brown": "#6A4B2A",
          "--om-card": "rgba(255,255,255,0.55)",
          "--om-stroke": "rgba(17,18,20,0.12)",
        } as CSSProperties
      }
    >
      <HeroCinematic />
      <OperationalNetwork departments={departments} onOpenDepartment={openDepartment} />
      <DeploymentSimulator />
      <TrustCTA />

      <AnimatePresence>
        {activeDepartment && (
          <DepartmentPanel
            department={activeDepartment}
            isOpen={Boolean(activeDepartmentId)}
            onClose={closeDepartment}
            roleCapabilities={roleCapabilityMap[activeDepartment.id]}
            nodes={constellationPositions[activeDepartment.id]}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            origin={origin}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
