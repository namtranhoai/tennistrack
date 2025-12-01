import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface MatchTimerProps {
    startedAt: string | null;
    completedAt: string | null;
    status: 'scheduled' | 'in_progress' | 'completed';
    className?: string;
}

export function MatchTimer({ startedAt, completedAt, status, className = '' }: MatchTimerProps) {
    const [elapsedTime, setElapsedTime] = useState<number>(0);

    useEffect(() => {
        if (status === 'in_progress' && startedAt) {
            const interval = setInterval(() => {
                const start = new Date(startedAt).getTime();
                const now = new Date().getTime();
                setElapsedTime(Math.floor((now - start) / 1000));
            }, 1000);

            return () => clearInterval(interval);
        } else if (status === 'completed' && startedAt && completedAt) {
            const start = new Date(startedAt).getTime();
            const end = new Date(completedAt).getTime();
            setElapsedTime(Math.floor((end - start) / 1000));
        }
    }, [startedAt, completedAt, status]);

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    if (!startedAt) {
        return null;
    }

    return (
        <div className={`flex items-center gap-2 text-sm ${className}`}>
            <Clock className="h-4 w-4" />
            <span className="font-mono">
                {formatTime(elapsedTime)}
            </span>
            {status === 'completed' && (
                <span className="text-muted-foreground text-xs">(Total Duration)</span>
            )}
        </div>
    );
}
