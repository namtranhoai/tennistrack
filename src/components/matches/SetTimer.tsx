import { useEffect, useState } from 'react';
import { Timer } from 'lucide-react';

interface SetTimerProps {
    startedAt: string | null;
    completedAt: string | null;
    className?: string;
}

export function SetTimer({ startedAt, completedAt, className = '' }: SetTimerProps) {
    const [elapsedTime, setElapsedTime] = useState<number>(0);

    useEffect(() => {
        if (startedAt && !completedAt) {
            // Set is in progress
            const interval = setInterval(() => {
                const start = new Date(startedAt).getTime();
                const now = new Date().getTime();
                setElapsedTime(Math.floor((now - start) / 1000));
            }, 1000);

            return () => clearInterval(interval);
        } else if (startedAt && completedAt) {
            // Set is completed
            const start = new Date(startedAt).getTime();
            const end = new Date(completedAt).getTime();
            setElapsedTime(Math.floor((end - start) / 1000));
        }
    }, [startedAt, completedAt]);

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    if (!startedAt) {
        return (
            <div className={`flex items-center gap-2 text-xs text-muted-foreground ${className}`}>
                <Timer className="h-3 w-3" />
                <span>Not started</span>
            </div>
        );
    }

    return (
        <div className={`flex items-center gap-2 text-xs ${className}`}>
            <Timer className="h-3 w-3" />
            <span className="font-mono">
                {formatTime(elapsedTime)}
            </span>
            {completedAt && (
                <span className="text-muted-foreground">(Completed)</span>
            )}
        </div>
    );
}
