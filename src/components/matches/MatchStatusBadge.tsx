import { Badge } from '@/components/ui/badge';

interface MatchStatusBadgeProps {
    status: 'scheduled' | 'in_progress' | 'completed';
    className?: string;
}

export function MatchStatusBadge({ status, className = '' }: MatchStatusBadgeProps) {
    const statusConfig = {
        scheduled: {
            label: 'Scheduled',
            variant: 'secondary' as const,
            className: 'bg-gray-100 text-gray-700 hover:bg-gray-100'
        },
        in_progress: {
            label: 'In Progress',
            variant: 'default' as const,
            className: 'bg-green-100 text-green-700 hover:bg-green-100 animate-pulse'
        },
        completed: {
            label: 'Completed',
            variant: 'outline' as const,
            className: 'bg-blue-100 text-blue-700 hover:bg-blue-100'
        }
    };

    const config = statusConfig[status];

    return (
        <Badge
            variant={config.variant}
            className={`${config.className} ${className}`}
        >
            {config.label}
        </Badge>
    );
}
