import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useReveal } from '@/lib/useReveal';
import type { Scrim } from '@/types';

type FilterKey = 'all' | 'upcoming' | 'past';

function formatDate(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    time: d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }),
  };
}

function resultBadge(result: string | null) {
  if (!result) return null;
  const map: Record<string, string> = {
    Win: 'bg-white text-black',
    Loss: 'border border-white/20 text-white/60',
    TBD: 'border border-white/10 text-white/40',
  };
  return map[result] ?? map['TBD'];
}

export function Scrims() {
  const [scrims, setScrims] = useState<Scrim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterKey>('all');
  const upcomingRef = useReveal<HTMLDivElement>();
  const pastRef = useReveal<HTMLDivElement>();

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from('scrims')
        .select('*')
        .order('date', { ascending: true });
      if (!active) return;
      if (error) {
        setError('Could not load the scrims schedule. Please try again later.');
      } else {
        setScrims((data ?? []) as Scrim[]);
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const now = Date.now();
  const { upcoming, past } = useMemo(() => {
    const up: Scrim[] = [];
    const pa: Scrim[] = [];
    for (const s of scrims) {
      if (new Date(s.date).getTime() >= now) up.push(s);
      else pa.push(s);
    }
    return { upcoming: up, past: pa.reverse() };
  }, [scrims, now]);

  const showUpcoming = filter === 'all' || filter === 'upcoming';
  const showPast = filter === 'all' || filter === 'past';

  const filters: { key: FilterKey; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'past', label: 'Past' },
  ];

  return (
    <main className="relative z-10 min-h-screen px-5 pt-28 pb-20 sm:px-8 sm:pt-36">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="animate-fade-up">
          <div className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-white/50">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse-dot" />
            Schedule
          </div>
          <h1 className="font-display text-5xl font-bold tracking-tight sm:text-7xl">
            Scrims
          </h1>
          <p className="mt-4 max-w-lg text-base text-white/55 sm:text-lg">
            Our practice and competitive schedule. Times shown in your local
            timezone.
          </p>
        </div>

        {/* Filters */}
        <div className="animate-fade-up delay-200 mt-10 flex items-center gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                filter === f.key
                  ? 'bg-white text-black'
                  : 'border border-white/15 text-white/60 hover:border-white/30 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-12 flex flex-col gap-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="mt-12 rounded-2xl border border-white/15 bg-white/[0.03] px-6 py-10 text-center">
            <p className="text-white/70">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && scrims.length === 0 && (
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
            <p className="text-lg font-medium text-white/70">No scrims scheduled.</p>
            <p className="mt-2 text-sm text-white/40">
              Check back soon for upcoming matches.
            </p>
          </div>
        )}

        {/* Lists */}
        {!loading && !error && scrims.length > 0 && (
          <div className="mt-12 space-y-16">
            {showUpcoming && upcoming.length > 0 && (
              <section ref={upcomingRef} className="reveal">
                <div className="mb-6 flex items-center gap-3">
                  <h2 className="text-xl font-bold uppercase tracking-[0.15em]">
                    Upcoming
                  </h2>
                  <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white/60">
                    {upcoming.length}
                  </span>
                  <span className="h-px flex-1 bg-white/10" />
                </div>
                <div className="flex flex-col gap-4">
                  {upcoming.map((s, i) => (
                    <ScrimRow key={s.id} scrim={s} index={i} />
                  ))}
                </div>
              </section>
            )}

            {showPast && past.length > 0 && (
              <section ref={pastRef} className="reveal">
                <div className="mb-6 flex items-center gap-3">
                  <h2 className="text-xl font-bold uppercase tracking-[0.15em] text-white/60">
                    Past Results
                  </h2>
                  <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white/50">
                    {past.length}
                  </span>
                  <span className="h-px flex-1 bg-white/10" />
                </div>
                <div className="flex flex-col gap-4">
                  {past.map((s, i) => (
                    <ScrimRow key={s.id} scrim={s} index={i} muted />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function ScrimRow({
  scrim,
  index,
  muted = false,
}: {
  scrim: Scrim;
  index: number;
  muted?: boolean;
}) {
  const { date, time } = formatDate(scrim.date);
  const badge = resultBadge(scrim.result);

  return (
    <div
      className={`group animate-fade-up relative flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-500 hover:border-white/25 hover:bg-white/[0.05] sm:flex-row sm:items-center sm:gap-6 sm:p-6 ${
        muted ? 'opacity-75 hover:opacity-100' : ''
      }`}
      style={{ animationDelay: `${Math.min(index * 0.06, 0.5)}s` }}
    >
      {/* Date block */}
      <div className="flex shrink-0 items-center gap-4 sm:w-56">
        <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-white/10 bg-black sm:h-16 sm:w-16">
          <span className="text-2xl font-bold leading-none">
            {new Date(scrim.date).getDate()}
          </span>
          <span className="mt-0.5 text-[0.6rem] uppercase tracking-wider text-white/50">
            {new Date(scrim.date).toLocaleDateString('en-US', { month: 'short' })}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-white/80">{date}</span>
          <span className="text-sm text-white/40">{time}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="hidden h-12 w-px bg-white/10 sm:block" />

      {/* Details */}
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-white/40">
            vs
          </span>
          <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
            {scrim.opponent}
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/50">
          <span>{scrim.format}</span>
          {scrim.location && (
            <span className="flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-white/30" />
              {scrim.location}
            </span>
          )}
          {scrim.notes && (
            <span className="flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-white/30" />
              {scrim.notes}
            </span>
          )}
        </div>
      </div>

      {/* Result badge */}
      {badge && (
        <div className="shrink-0 self-start sm:self-center">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${badge}`}
          >
            {scrim.result}
          </span>
        </div>
      )}
    </div>
  );
}
