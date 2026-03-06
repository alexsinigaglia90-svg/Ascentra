"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { EmployeeProfile } from "../data";

type Props = {
  roles: string[];
  selectedRole: string | null;
  onSelectRole: (role: string) => void;
  roleTeams: Record<string, EmployeeProfile[]>;
  hasActiveTalentFilters: boolean;
};

export function RoleGrid({
  roles,
  selectedRole,
  onSelectRole,
  roleTeams,
  hasActiveTalentFilters,
}: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {roles.map((role) => {
        const selected = role === selectedRole;
        const team = roleTeams[role] ?? [];
        return (
          <motion.article
            key={role}
            className="group rounded-2xl border border-[var(--om-stroke)] bg-white/45 p-3 text-left transition"
            animate={{
              borderColor: selected ? "rgba(30,58,95,0.46)" : "rgba(17,18,20,0.12)",
              backgroundColor: selected ? "rgba(30,58,95,0.09)" : "rgba(255,255,255,0.45)",
            }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={() => onSelectRole(selected ? "" : role)}
              className="w-full rounded-xl px-2 py-1 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--om-blue)]"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-[var(--om-ink)]">{role}</p>
                {team.length > 0 && (
                  <span className="rounded-full bg-[var(--om-blue)]/12 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--om-blue)]">
                    {team.length} match
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-[var(--om-ink)]/65">
                {selected
                  ? "Actieve capability-link zichtbaar"
                  : "Selecteer voor capability-highlight"}
              </p>
            </button>

            {team.length > 0 && (
              <div className="mt-3 border-t border-[var(--om-stroke)]/80 px-2 pt-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--om-brown)]">
                  Beschikbare professionals
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {team.map((person) => (
                    <Link
                      key={person.slug}
                      href={`/operis/profielen/${person.slug}/`}
                      className="rounded-full border border-[var(--om-stroke)] bg-white/75 px-2.5 py-1 text-xs font-medium text-[var(--om-ink)] transition hover:border-[var(--om-blue)]/40 hover:text-[var(--om-blue)]"
                    >
                      {person.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {team.length === 0 && hasActiveTalentFilters && (
              <div className="mt-3 border-t border-[var(--om-stroke)]/80 px-2 pt-3">
                <p className="text-xs text-[var(--om-ink)]/60">
                  Geen professionals voor deze rol binnen de actieve filters.
                </p>
              </div>
            )}
          </motion.article>
        );
      })}
    </div>
  );
}
