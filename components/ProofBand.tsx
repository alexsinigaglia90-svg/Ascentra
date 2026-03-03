import Section from "./Section";

const ecosystems = ["Enterprise Retail", "3PL", "Airport Logistics", "Automation Integrators", "WMS ecosystems"];
const metrics = ["Board-level clarity", "Operational stability under pressure", "Product-grade engineering discipline"];

export default function ProofBand() {
  return (
    <Section className="section-spacing border-y border-[var(--line)] bg-white/45">
      <div className="container-shell">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--brown)]">Selected environments & ecosystems</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {ecosystems.map((item) => (
            <span key={item} className="pill">
              {item}
            </span>
          ))}
        </div>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {metrics.map((item) => (
            <div key={item} className="surface p-5 text-sm font-medium tracking-wide md:text-base">
              {item}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
