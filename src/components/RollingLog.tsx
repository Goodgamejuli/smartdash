import React, { useEffect, useMemo, useRef } from 'react';
import { useTopologyStore } from '../store/useTopologyStore';
import type { LogEvent } from '../model/schema';

const severityStyles: Record<LogEvent['severity'], string> = {
  info: 'border-slate-200 bg-white text-slate-700',
  warn: 'border-amber-200 bg-amber-50 text-amber-800',
  error: 'border-red-200 bg-red-50 text-red-700',
};

const RollingLog: React.FC = () => {
  const logs = useTopologyStore((state) => state.log);
  const scrollRef = useRef<HTMLDivElement>(null);

  const formattedLogs = useMemo(() => logs ?? [], [logs]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.scrollTo({ top: 0, behavior: 'smooth' });
  }, [formattedLogs]);

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2">
        <h2 className="text-sm font-semibold text-slate-700">System Log</h2>
        <span className="text-xs font-medium text-slate-400">
          {formattedLogs.length} {formattedLogs.length === 1 ? 'entry' : 'entries'}
        </span>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 space-y-1 overflow-y-auto px-3 py-2 font-mono text-xs"
        role="log"
        aria-live="polite"
      >
        {formattedLogs.length === 0 ? (
          <p className="rounded-md bg-slate-100 px-3 py-6 text-center text-xs text-slate-400">
            Noch keine Meldungen vorhanden.
          </p>
        ) : (
          formattedLogs.map((entry) => {
            const severity = severityStyles[entry.severity] ?? severityStyles.info;
            const timestamp = new Date(entry.ts).toLocaleTimeString('de-DE', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            });

            return (
              <article
                key={entry.id}
                className={`rounded-lg border px-3 py-2 shadow-sm transition-colors ${severity}`}
              >
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wide">
                  <span className="font-semibold">
                    {entry.severity === 'info'
                      ? 'Info'
                      : entry.severity === 'warn'
                      ? 'Warnung'
                      : 'Fehler'}
                  </span>
                  <time className="text-slate-500" dateTime={entry.ts}>
                    {timestamp}
                  </time>
                </div>
                <p className="mt-1 whitespace-pre-line text-[11px] leading-relaxed text-slate-700">
                  {entry.text}
                </p>
                {entry.deviceId ? (
                  <p className="mt-1 text-[10px] font-medium text-slate-400">
                    Gerät: <span className="text-slate-500">{entry.deviceId}</span>
                  </p>
                ) : null}
              </article>
            );
          })
        )}
      </div>
    </section>
  );
};

export default RollingLog;
