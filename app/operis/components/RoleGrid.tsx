"use client";

import { motion } from "framer-motion";

type Props = {
  roles: string[];
  selectedRole: string | null;
  onSelectRole: (role: string) => void;
};

export function RoleGrid({ roles, selectedRole, onSelectRole }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {roles.map((role) => {
        const selected = role === selectedRole;
        return (
          <motion.button
            key={role}
            type="button"
            onClick={() => onSelectRole(selected ? "" : role)}
            className="group rounded-2xl border border-[var(--om-stroke)] bg-white/45 px-4 py-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--om-blue)]"
            animate={{
              borderColor: selected ? "rgba(30,58,95,0.46)" : "rgba(17,18,20,0.12)",
              backgroundColor: selected ? "rgba(30,58,95,0.09)" : "rgba(255,255,255,0.45)",
            }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-sm font-medium text-[var(--om-ink)]">{role}</p>
            <p className="mt-1 text-xs text-[var(--om-ink)]/65">
              {selected ? "Actieve capability-link zichtbaar" : "Selecteer voor capability-highlight"}
            </p>
          </motion.button>
        );
      })}
    </div>
  );
}
