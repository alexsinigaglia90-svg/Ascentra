"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import Nav from "./Nav";

export default function HeroVideo() {
  const reducedMotion = useReducedMotion();
  const [videoFailed, setVideoFailed] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const parallaxStyle = useMemo(
    () => ({
      transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0)`,
    }),
    [parallax.x, parallax.y],
  );

  const handleMove = (event: React.MouseEvent<HTMLElement>) => {
    if (reducedMotion) return;
    if (window.innerWidth < 992) return;

    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - left) / width - 0.5;
    const py = (event.clientY - top) / height - 0.5;
    setParallax({ x: px * 10, y: py * 10 });
  };

  return (
    <section id="top" onMouseMove={handleMove} className="relative isolate min-h-screen overflow-hidden">
      {!videoFailed ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/media/hero-poster.jpg"
          aria-hidden="true"
          onError={() => setVideoFailed(true)}
        >
          <source src="/media/hero.webm" type="video/webm" />
          <source src="/media/hero.mp4" type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/media/hero-poster.jpg')" }}
          aria-hidden="true"
        />
      )}

      <div className="hero-vignette grain-overlay absolute inset-0" aria-hidden="true" />
      <Nav />

      <div className="container-shell relative z-20 flex min-h-screen items-end pb-16 pt-32 md:items-center md:pb-0">
        <motion.div
          style={reducedMotion ? undefined : parallaxStyle}
          initial={reducedMotion ? false : { opacity: 0, y: 10 }}
          animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl text-white"
        >
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-white/75">Supply chain leadership, operations, and products</p>
          <h1 className="text-balance text-5xl leading-[0.95] font-semibold md:text-7xl">
            Stately strategy. Relentless execution.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
            Ascentra aligns board-level supply chain direction, operational warehousing scale, and product innovation into one cohesive system.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#pillars"
              className="rounded-full bg-[var(--bg)] px-6 py-3 text-sm font-medium text-[var(--ink)] transition hover:translate-y-[-1px]"
            >
              Explore the three pillars
            </a>
            <a
              href="#contact"
              className="rounded-full border border-white/55 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Request an intro
            </a>
          </div>
        </motion.div>
      </div>

      {!reducedMotion && (
        <motion.a
          href="#system"
          aria-label="Scroll to the Ascentra system section"
          className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-sm tracking-wide text-white/80"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          Scroll
        </motion.a>
      )}
    </section>
  );
}
