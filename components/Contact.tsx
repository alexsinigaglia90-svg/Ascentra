import Section from "./Section";

export default function Contact() {
  return (
    <Section id="contact" className="section-spacing">
      <div className="container-shell max-w-3xl">
        <div className="lux-panel p-6 md:p-8">
          <p className="section-kicker">Request an intro</p>
          <h2 className="text-balance text-4xl leading-tight md:text-5xl">Let&apos;s scope your next operational chapter.</h2>
          <p className="muted mt-5 max-w-md text-base leading-relaxed">
            Share your challenge and preferred timeline. We reply with a focused first conversation and fit assessment.
          </p>
          <div className="lux-panel mt-6 space-y-2 p-4 text-sm md:text-base">
            <p><span className="font-medium">Naam:</span> Ascentra</p>
            <p><span className="font-medium">WhatsApp:</span> 06 3838 3737</p>
            <p><span className="font-medium">Internationaal:</span> +31 6 3838 3737</p>
          </div>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-[var(--ink)]/80 md:text-base">
            Geen gedoe met mailen? Stuur ons liever direct een bericht op WhatsApp. We zijn te bereiken op 06 3838 3737.
          </p>
          <a
            href="/whatsapp"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block rounded-full bg-[var(--blue)] px-5 py-2.5 text-sm font-medium tracking-wide text-[var(--bg)] shadow-[0_12px_26px_rgba(30,58,95,0.28)] transition hover:brightness-110"
          >
            Open WhatsApp (+31 6 3838 3737)
          </a>
        </div>
      </div>
    </Section>
  );
}
