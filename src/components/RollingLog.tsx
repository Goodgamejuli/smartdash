import React, { useEffect, useRef } from 'react';
import { useTopologyStore } from '../store/useTopologyStore';
import { LogEvent } from '../model/schema';

const LogEntry: React.FC<{ log: LogEvent }> = ({ log }) => {
    let severityClass = 'text-gray-700';
    if (log.severity === 'warn') {
        severityClass = 'text-yellow-600';
    } else if (log.severity === 'error') {
        severityClass = 'text-red-600 font-medium';
    }

    // Format timestamp (assuming log.ts is an ISO string)
    const time = new Date(log.ts).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    return (
        <div className={`text-xs p-0.5 border-b border-gray-100 ${severityClass}`}>
            <span className="font-mono text-gray-400 mr-2">[{time}]</span>
            {log.text}
        </div>
    );
};

const RollingLog: React.FC = () => {
    // We rely on the summary of useTopologyStore which includes `log: LogEvent[]`
    const logs = useTopologyStore((state) => state.log);
    const logEndRef = useRef<HTMLDivElement>(null);

    // Effect to scroll to the bottom whenever logs change
    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className="flex flex-col h-full bg-white border border-gray-200 rounded shadow-xl">
            <h3 className="p-2 text-lg font-semibold border-b border-gray-200">System Log</h3>
            <div className="flex-grow overflow-y-auto p-2 space-y-1 font-mono text-sm">
                {logs.map((log) => (
                    // Using log.id for key, assuming it's unique
                    <LogEntry key={log.id} log={log} />
                ))}
                <div ref={logEndRef} />
            </div>
        </div>
    );
};

export default RollingLog;
