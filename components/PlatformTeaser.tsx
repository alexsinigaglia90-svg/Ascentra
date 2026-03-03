import Section from "./Section";

const modules = ["Slotting", "Putaway", "Wave/Flow", "KPI Cockpit", "Labour Performance", "Inventory Accuracy"];

export default function PlatformTeaser() {
  return (
    <Section id="platform" className="section-spacing">
      <div className="container-shell grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[var(--blue)]">Ascentra BI Platform</p>
          <h2 className="text-balance text-4xl leading-tight md:text-5xl">Operational intelligence unlocked the moment Operis is deployed.</h2>
          <p className="muted mt-5 max-w-xl text-base leading-relaxed">
            Teams receive one practical cockpit for daily flow, labour discipline, and inventory reliability. Built for warehouse rhythm, not presentation theatre.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {modules.map((module) => (
              <span key={module} className="pill">
                {module}
              </span>
            ))}
          </div>
        </div>

        <div className="group surface relative overflow-hidden p-5 transition hover:-translate-y-0.5 hover:border-[var(--blue)]">
          <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100" aria-hidden="true">
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white/25 to-transparent [transform:translateX(-100%)] group-hover:animate-[shimmer_1.6s_ease]" />
          </div>
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--brown)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--blue)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--ink)]" />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-[var(--line)] bg-white/70 p-3">
              <div className="mb-2 h-2 w-20 rounded bg-[var(--ink)]/20" />
              <div className="space-y-2">
                <div className="h-2 rounded bg-[var(--ink)]/10" />
                <div className="h-2 rounded bg-[var(--ink)]/10" />
                <div className="h-2 w-2/3 rounded bg-[var(--ink)]/10" />
              </div>
            </div>
            <div className="rounded-lg border border-[var(--line)] bg-white/70 p-3">
              <div className="mb-2 h-2 w-14 rounded bg-[var(--ink)]/20" />
              <div className="grid grid-cols-4 gap-2 pt-1">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="h-5 rounded bg-[var(--blue)]/12" />
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-[var(--line)] bg-white/70 p-3 md:col-span-2">
              <div className="mb-2 h-2 w-24 rounded bg-[var(--ink)]/20" />
              <div className="h-24 rounded bg-gradient-to-r from-[var(--blue)]/10 via-[var(--brown)]/12 to-[var(--blue)]/8" />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
