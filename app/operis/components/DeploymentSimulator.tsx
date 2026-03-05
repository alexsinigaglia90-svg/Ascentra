"use client";

import { useMemo, useState } from "react";
import {
  calculateDeploymentScore,
  getDeploymentRecommendations,
  type SimulatorInputs,
} from "../data";

const sliderClass =
  "h-2 w-full cursor-pointer appearance-none rounded-lg bg-[linear-gradient(to_right,var(--om-blue),var(--om-brown))] accent-[var(--om-blue)]";

export function DeploymentSimulator() {
  const [input, setInput] = useState<SimulatorInputs>({
    pressure: 58,
    automation: 62,
    maturity: 44,
    variability: 55,
  });

  const score = useMemo(() => calculateDeploymentScore(input), [input]);
  const suggestions = useMemo(() => getDeploymentRecommendations(input, 4), [input]);

  return (
    <section className="border-b border-[var(--om-stroke)] px-6 py-20 sm:px-10 lg:px-16" aria-labelledby="deployment-simulator-title">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--om-brown)]">Deployment Simulator</p>
        <h2 id="deployment-simulator-title" className="mt-3 text-3xl font-semibold sm:text-5xl">
          Simuleer druk. Ontvang direct voorstel voor inzetprofielen.
        </h2>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-6 rounded-3xl border border-[var(--om-stroke)] bg-white/50 p-6">
            <Slider
              label="Operational Pressure"
              value={input.pressure}
              onChange={(value) => setInput((prev) => ({ ...prev, pressure: value }))}
            />
            <Slider
              label="Automation Complexity"
              value={input.automation}
              onChange={(value) => setInput((prev) => ({ ...prev, automation: value }))}
            />
            <Slider
              label="Team Maturity"
              value={input.maturity}
              onChange={(value) => setInput((prev) => ({ ...prev, maturity: value }))}
            />
            <Slider
              label="Volume Variability"
              value={input.variability}
              onChange={(value) => setInput((prev) => ({ ...prev, variability: value }))}
            />
          </div>

          <div className="rounded-3xl border border-[var(--om-stroke)] bg-white/45 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--om-brown)]">Deployment Score</p>
            <p className="mt-2 text-5xl font-semibold text-[var(--om-blue)]">{score}</p>
            <p className="mt-2 text-sm text-[var(--om-ink)]/75">
              Indicatie op basis van operationele druk, complexiteit, teamvolwassenheid en
              volumeverloop.
            </p>

            <div className="mt-6 space-y-3">
              {suggestions.map((item) => (
                <article
                  key={item.profile}
                  className="rounded-2xl border border-[var(--om-stroke)] bg-white/60 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-base font-semibold text-[var(--om-ink)]">{item.title}</h3>
                    <span className="rounded-full bg-[var(--om-blue)]/10 px-2.5 py-1 text-xs font-semibold text-[var(--om-blue)]">
                      Fit {item.fit}%
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[var(--om-ink)]/75">{item.explanation}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.15em] text-[var(--om-brown)]">
                    Focus: {item.focus.join(" | ")}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type SliderProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
};

function Slider({ label, value, onChange }: SliderProps) {
  const id = `slider-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm font-medium">
        <label htmlFor={id} className="text-[var(--om-ink)]">
          {label}
        </label>
        <span className="text-[var(--om-blue)]">{value}</span>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className={sliderClass}
      />
    </div>
  );
}
