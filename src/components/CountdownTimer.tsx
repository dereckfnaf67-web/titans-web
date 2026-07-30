import { useEffect, useState } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(target: number): TimeLeft {
  const diff = target - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1_000) % 60),
  };
}

interface CountdownTimerProps {
  target: number;
}

export function CountdownTimer({ target }: CountdownTimerProps) {
  const [time, setTime] = useState<TimeLeft>(() => calcTimeLeft(target));

  useEffect(() => {
    setTime(calcTimeLeft(target));
    const id = setInterval(() => setTime(calcTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const units: { label: string; value: number }[] = [
    { label: 'Days', value: time.days },
    { label: 'Hours', value: time.hours },
    { label: 'Minutes', value: time.minutes },
    { label: 'Seconds', value: time.seconds },
  ];

  return (
    <div className="grid w-full grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
      {units.map((u, i) => (
        <div
          key={u.label}
          className="animate-scale-in group relative flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-2 py-6 backdrop-blur-sm transition-all duration-500 hover:border-white/25 hover:bg-white/[0.06] sm:py-8"
          style={{ animationDelay: `${0.4 + i * 0.08}s` }}
        >
          {/* Corner accents */}
          <span className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-white/20 transition-colors duration-500 group-hover:border-white/50" />
          <span className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-white/20 transition-colors duration-500 group-hover:border-white/50" />

          <span
            key={`${u.value}`}
            className="animate-fade-in font-display text-5xl font-bold tabular-nums leading-none tracking-tight sm:text-6xl md:text-7xl"
          >
            {String(u.value).padStart(2, '0')}
          </span>
          <span className="mt-3 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-white/50 sm:text-xs">
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}
