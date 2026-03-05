"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ConstellationNode, RoleCapabilityMap } from "../data";

type Props = {
  nodes: ConstellationNode[];
  roleCapabilities: RoleCapabilityMap;
  selectedRole: string | null;
};

export function CapabilityConstellation({ nodes, roleCapabilities, selectedRole }: Props) {
  const reduceMotion = useReducedMotion();

  const highlighted = useMemo(() => {
    if (!selectedRole || !roleCapabilities[selectedRole]) {
      return new Set(nodes.map((node) => node.capability));
    }
    return new Set(roleCapabilities[selectedRole]);
  }, [nodes, roleCapabilities, selectedRole]);

  return (
    <div className="relative h-[18rem] overflow-hidden rounded-3xl border border-[var(--om-stroke)] bg-white/40">
      <svg className="absolute inset-0 h-full w-full opacity-45" viewBox="0 0 100 100" aria-hidden="true">
        {nodes.map((node, i) => {
          return nodes.slice(i + 1).map((target) => {
            const lineActive =
              highlighted.has(node.capability) && highlighted.has(target.capability);
            return (
              <line
                key={`${node.capability}-${target.capability}`}
                x1={node.x}
                y1={node.y}
                x2={target.x}
                y2={target.y}
                stroke={lineActive ? "rgba(30,58,95,0.34)" : "rgba(17,18,20,0.08)"}
                strokeWidth={lineActive ? 0.32 : 0.2}
              />
            );
          });
        })}
      </svg>

      {nodes.map((node, index) => {
        const isActive = highlighted.has(node.capability);
        return (
          <motion.div
            key={node.capability}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            animate={
              reduceMotion
                ? undefined
                : {
                    x: [0, node.layer * 0.7, 0],
                    y: [0, -node.layer * 0.9, 0],
                  }
            }
            transition={{
              duration: 3.2 + index * 0.25,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <div
              className="rounded-full border px-3 py-1 text-[11px] tracking-wide backdrop-blur-sm"
              style={{
                background: isActive ? "rgba(30,58,95,0.16)" : "rgba(255,255,255,0.64)",
                borderColor: isActive ? "rgba(30,58,95,0.45)" : "rgba(17,18,20,0.12)",
                color: isActive ? "rgb(30,58,95)" : "rgba(17,18,20,0.72)",
                boxShadow: isActive
                  ? "0 0 0 1px rgba(30,58,95,0.15), 0 12px 25px rgba(30,58,95,0.16)"
                  : "none",
              }}
            >
              {node.capability}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
