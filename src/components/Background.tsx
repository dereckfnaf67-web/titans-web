import { useEffect, useState } from 'react';

export function Background() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setOffset(window.scrollY));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 bg-black overflow-hidden">
      {/* Radial glow that drifts with scroll */}
      <div
        className="absolute left-1/2 top-0 h-[120vh] w-[120vw] -translate-x-1/2 rounded-full opacity-60 transition-opacity duration-700"
        style={{
          background:
            'radial-gradient(circle at 50% 38%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 22%, transparent 60%)',
          transform: `translate(-50%, ${-offset * 0.12}px)`,
        }}
      />
      {/* Fine grid */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage:
            'radial-gradient(ellipse at 50% 35%, black 30%, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at 50% 35%, black 30%, transparent 75%)',
        }}
      />
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.7) 100%)',
        }}
      />
    </div>
  );
}
