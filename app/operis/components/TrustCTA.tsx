export function TrustCTA() {
  return (
    <section className="px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-[var(--om-stroke)] bg-gradient-to-br from-white/70 via-white/45 to-[var(--om-brown)]/10 p-8 sm:p-12">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--om-brown)]">Operis Standard</p>
        <h2 className="mt-3 max-w-3xl text-3xl font-semibold sm:text-5xl">
          Niet staffing. Operational capability.
        </h2>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--om-ink)]/80 sm:text-base">
          Operis levert professionals die cultuur, governance en executie tastbaar verbeteren.
          Inzetbaar vanaf dag één, met focus op continu resultaat.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button className="rounded-full bg-[var(--om-blue)] px-6 py-3 text-sm font-medium text-white">
            Plan een strategische intake
          </button>
          <button className="rounded-full border border-[var(--om-stroke)] bg-white/70 px-6 py-3 text-sm font-medium text-[var(--om-ink)]">
            Download capability deck
          </button>
        </div>
      </div>
    </section>
  );
}
