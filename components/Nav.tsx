const links = [
  { label: "Capabilities", href: "#system" },
  { label: "Platform", href: "#platform" },
  { label: "Products", href: "#pillars" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="container-shell flex items-center justify-between py-6 text-[var(--bg)]">
        <a href="#top" className="font-serif text-3xl font-semibold tracking-wide">
          Ascentra
        </a>
        <nav aria-label="Homepage sections" className="hidden gap-2 md:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-full border border-white/30 px-4 py-2 text-sm tracking-wide text-white/90 transition hover:border-white/70 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      <nav aria-label="Homepage sections mobile" className="container-shell flex gap-2 pb-4 md:hidden">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="rounded-full border border-white/30 bg-black/10 px-3 py-1.5 text-xs tracking-wide text-white"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
