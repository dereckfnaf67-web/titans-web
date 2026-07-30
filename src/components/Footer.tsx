interface FooterProps {
  navigate: (to: '/' | '/scrims') => void;
}

export function Footer({ navigate }: FooterProps) {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-black">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-black">
              <svg viewBox="0 0 64 64" className="h-4 w-4" aria-hidden="true">
                <path d="M32 12 L48 52 H40 L32 30 L24 52 H16 Z" fill="currentColor" />
              </svg>
            </span>
            <span className="text-base font-semibold tracking-[0.2em] uppercase">
              Titans
            </span>
          </div>

          <nav className="flex items-center gap-6 text-sm text-white/60">
            <button
              onClick={() => navigate('/')}
              className="transition-colors hover:text-white"
            >
              Home
            </button>
            <button
              onClick={() => navigate('/scrims')}
              className="transition-colors hover:text-white"
            >
              Scrims
            </button>
          </nav>

          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Titans. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
