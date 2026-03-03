import Section from "./Section";

export default function Intro() {
  return (
    <Section id="system" className="section-spacing">
      <div className="container-shell grid gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-end">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[var(--blue)]">The Ascentra System</p>
          <h2 className="text-balance text-4xl leading-tight md:text-5xl">One leadership layer from strategy through execution.</h2>
          <p className="muted mt-5 max-w-xl text-base leading-relaxed md:text-lg">
            We operate across boardroom strategy, daily warehouse orchestration, and product development. Clients get coherent direction and measurable control.
          </p>
        </div>
        <ul className="surface space-y-4 p-7 text-sm leading-relaxed md:text-base">
          <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--blue)]" /> Governance that stays clear under pressure.</li>
          <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--brown)]" /> Performance steering rooted in operational reality.</li>
          <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--ink)]" /> Scalable execution supported by product-grade tooling.</li>
        </ul>
      </div>
    </Section>
  );
}
