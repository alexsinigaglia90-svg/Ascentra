import Section from "./Section";

export default function Contact() {
  return (
    <Section id="contact" className="section-spacing">
      <div className="container-shell grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[var(--blue)]">Request an intro</p>
          <h2 className="text-balance text-4xl leading-tight md:text-5xl">Let&apos;s scope your next operational chapter.</h2>
          <p className="muted mt-5 max-w-md text-base leading-relaxed">
            Share your challenge and preferred timeline. We reply with a focused first conversation and fit assessment.
          </p>
          <div className="mt-6 space-y-1 text-sm md:text-base">
            <p>Name: Your Name</p>
            <p>Email: hello@ascentra.example</p>
            <p>Phone: +00 000 000 0000</p>
          </div>
          <a href="mailto:hello@ascentra.example" className="mt-5 inline-block text-sm font-medium text-[var(--blue)] underline-offset-4 hover:underline">
            Prefer email? Reach us directly.
          </a>
        </div>
        <form className="surface space-y-4 p-6">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">
              Name
            </label>
            <input id="name" name="name" type="text" className="w-full rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3" />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input id="email" name="email" type="email" className="w-full rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3" />
          </div>
          <div>
            <label htmlFor="company" className="mb-1 block text-sm font-medium">
              Company
            </label>
            <input id="company" name="company" type="text" className="w-full rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3" />
          </div>
          <div>
            <label htmlFor="message" className="mb-1 block text-sm font-medium">
              Message
            </label>
            <textarea id="message" name="message" rows={5} className="w-full rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3" />
          </div>
          <button type="button" className="rounded-full bg-[var(--blue)] px-6 py-3 text-sm font-medium text-[var(--bg)] transition hover:brightness-110">
            Send request
          </button>
        </form>
      </div>
    </Section>
  );
}
