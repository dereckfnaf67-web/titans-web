import { useEffect, useState } from 'react';

interface NavProps {
  route: '/' | '/scrims';
  navigate: (to: '/' | '/scrims') => void;
}

export function Nav({ route, navigate }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (to: '/' | '/scrims') => {
    navigate(to);
    setMenuOpen(false);
  };

  const links: { label: string; to: '/' | '/scrims' }[] = [
    { label: 'Home', to: '/' },
    { label: 'Scrims', to: '/scrims' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/70 backdrop-blur-xl border-b border-white/10'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-20 sm:px-8">
        <button
          onClick={() => go('/')}
          className="group flex items-center gap-2.5"
          aria-label="Titans home"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black transition-transform duration-300 group-hover:scale-110">
            <svg viewBox="0 0 64 64" className="h-5 w-5" aria-hidden="true">
              <path d="M32 12 L48 52 H40 L32 30 L24 52 H16 Z" fill="currentColor" />
            </svg>
          </span>
          <span className="text-lg font-semibold tracking-[0.2em] uppercase">
            Titans
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 sm:flex">
          {links.map((l) => (
            <button
              key={l.to}
              onClick={() => go(l.to)}
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                route === l.to
                  ? 'text-black'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {route === l.to && (
                <span className="absolute inset-0 rounded-full bg-white" />
              )}
              <span className="relative">{l.label}</span>
            </button>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 sm:hidden"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <div className="flex flex-col gap-1.5">
            <span
              className={`block h-0.5 w-5 bg-white transition-all duration-300 ${
                menuOpen ? 'translate-y-2 rotate-45' : ''
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-white transition-all duration-300 ${
                menuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-white transition-all duration-300 ${
                menuOpen ? '-translate-y-2 -rotate-45' : ''
              }`}
            />
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-t border-white/10 bg-black/95 backdrop-blur-xl transition-all duration-400 sm:hidden ${
          menuOpen ? 'max-h-72' : 'max-h-0 border-transparent'
        }`}
      >
        <div className="flex flex-col gap-1 px-5 py-4">
          {links.map((l) => (
            <button
              key={l.to}
              onClick={() => go(l.to)}
              className={`rounded-xl px-4 py-3 text-left text-base font-medium transition-colors ${
                route === l.to
                  ? 'bg-white text-black'
                  : 'text-white/80 hover:bg-white/5'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
