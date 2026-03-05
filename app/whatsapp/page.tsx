"use client";

import { useEffect, useMemo } from "react";

export default function WhatsAppRedirectPage() {
  const target = useMemo(() => {
    const digits = [51, 49, 54, 51, 56, 51, 56, 51, 55, 51, 55];
    return `https://wa.me/${String.fromCharCode(...digits)}`;
  }, []);

  useEffect(() => {
    window.location.replace(target);
  }, [target]);

  return (
    <main className="container-shell section-spacing">
      <div className="lux-panel max-w-xl p-6 md:p-8">
        <p className="section-kicker">Redirecting</p>
        <h1 className="text-3xl leading-tight md:text-4xl">Je wordt doorgestuurd naar WhatsApp…</h1>
        <p className="muted mt-4 text-sm leading-relaxed md:text-base">
          Werkt het niet automatisch? Gebruik dan de knop hieronder.
        </p>
        <a
          href={target}
          className="mt-5 inline-block rounded-full bg-[var(--blue)] px-5 py-2.5 text-sm font-medium tracking-wide text-[var(--bg)] shadow-[0_12px_26px_rgba(30,58,95,0.28)] transition hover:brightness-110"
        >
          Open WhatsApp
        </a>
      </div>
    </main>
  );
}
