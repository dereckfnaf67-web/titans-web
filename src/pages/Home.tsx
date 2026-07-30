import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CountdownTimer } from '@/components/CountdownTimer';
import { useReveal } from '@/lib/useReveal';
import type { SiteSettings } from '@/types';

interface HomeProps {
  navigate: (to: '/' | '/scrims') => void;
}

export function Home({ navigate }: HomeProps) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const revealRef = useReveal<HTMLDivElement>();

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();
      if (!active) return;
      if (!error && data) setSettings(data as SiteSettings);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const targetMs = settings ? new Date(settings.countdown_target).getTime() : 0;
  const label = settings?.countdown_label ?? 'Next Event';

  return (
    <main className="relative z-10">
      {/* Hero */}
      <section className="flex min-h-screen flex-col items-center justify-center px-5 pt-24 pb-16 text-center sm:px-8">
        <div className="animate-fade-up mb-8 flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-1.5 backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-white animate-pulse-dot" />
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/70">
            Official Team Website
          </span>
        </div>

        <h1 className="animate-fade-up delay-100 font-display text-6xl font-bold leading-[1.05] tracking-tighter sm:text-8xl md:text-[9rem] lg:text-[11rem]">
          Titans
        </h1>

        <p className="animate-fade-up delay-200 mt-4 text-sm font-medium uppercase tracking-[0.35em] text-white/50 sm:text-base">
          Website
        </p>

        <p className="animate-fade-up delay-300 mt-8 max-w-xl text-base text-white/60 sm:text-lg">
          Precision. Discipline. Dominance. We are the Titans.
        </p>

        {/* Countdown */}
        <div className="animate-fade-up delay-500 mt-14 w-full max-w-3xl">
          {loading ? (
            <div className="grid w-full grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-2 py-6 sm:py-8"
                >
                  <span className="h-12 w-20 animate-pulse rounded-lg bg-white/10 sm:h-16" />
                  <span className="mt-3 h-3 w-12 animate-pulse rounded bg-white/10" />
                </div>
              ))}
            </div>
          ) : settings ? (
            <>
              <div className="mb-6 flex items-center justify-center gap-3">
                <span className="h-px w-8 bg-white/20" />
                <span className="text-xs font-medium uppercase tracking-[0.3em] text-white/60">
                  {label}
                </span>
                <span className="h-px w-8 bg-white/20" />
              </div>
              <CountdownTimer target={targetMs} />
            </>
          ) : (
            <p className="text-sm text-white/50">
              Countdown target will appear here once configured.
            </p>
          )}
        </div>

        <button
          onClick={() => navigate('/scrims')}
          className="animate-fade-up delay-700 mt-14 group flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition-all duration-300 hover:gap-3 hover:shadow-[0_0_40px_rgba(255,255,255,0.25)]"
        >
          View Scrims Schedule
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            &rarr;
          </span>
        </button>
      </section>

      {/* Marquee strip */}
      <div className="relative z-10 border-y border-white/10 py-5 overflow-hidden">
        <div className="flex w-max animate-marquee">
          {Array.from({ length: 2 }).map((_, dup) => (
            <div key={dup} className="flex items-center">
              {['Discipline', 'Dominance', 'Precision', 'Power', 'Unity', 'Legacy'].map(
                (word, i) => (
                  <span key={`${dup}-${i}`} className="flex items-center">
                    <span className="mx-6 text-xl font-bold uppercase tracking-[0.25em] text-white/30 sm:text-2xl">
                      {word}
                    </span>
                    <span className="text-white/20">&bull;</span>
                  </span>
                )
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stats / about strip */}
      <section
        ref={revealRef}
        className="reveal mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28"
      >
        <div className="grid gap-12 sm:grid-cols-3 sm:gap-8">
          {[
            { stat: '12', label: 'Roster Members', sub: 'Active competitors' },
            { stat: '47', label: 'Scrims Played', sub: 'This season' },
            { stat: '8', label: 'Tournament Wins', sub: 'And counting' },
          ].map((s) => (
            <div key={s.label} className="text-center sm:text-left">
              <div className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
                {s.stat}
              </div>
              <div className="mt-3 text-sm font-semibold uppercase tracking-[0.15em] text-white/80">
                {s.label}
              </div>
              <div className="mt-1 text-sm text-white/40">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
