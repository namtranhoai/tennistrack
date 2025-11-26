import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

interface TechnicalStatsCardProps {
    technicalStats: {
        avgFirstServePercentage: number;
        avgAcesPerMatch: number;
        avgDoubleFaultsPerMatch: number;
        avgWinnersPerMatch: number;
        avgUnforcedErrorsPerMatch: number;
        avgNetSuccessRate: number;
    };
}

export function TechnicalStatsCard({ technicalStats }: TechnicalStatsCardProps) {
    const stats = [
        {
            label: '1st Serve %',
            value: technicalStats.avgFirstServePercentage.toFixed(1),
            suffix: '%',
            color: 'text-blue-600',
        },
        {
            label: 'Aces/Match',
            value: technicalStats.avgAcesPerMatch.toFixed(1),
            suffix: '',
            color: 'text-green-600',
        },
        {
            label: 'Double Faults/Match',
            value: technicalStats.avgDoubleFaultsPerMatch.toFixed(1),
            suffix: '',
            color: 'text-red-600',
        },
        {
            label: 'Winners/Match',
            value: technicalStats.avgWinnersPerMatch.toFixed(1),
            suffix: '',
            color: 'text-purple-600',
        },
        {
            label: 'Unforced Errors/Match',
            value: technicalStats.avgUnforcedErrorsPerMatch.toFixed(1),
            suffix: '',
            color: 'text-orange-600',
        },
        {
            label: 'Net Success %',
            value: technicalStats.avgNetSuccessRate.toFixed(1),
            suffix: '%',
            color: 'text-teal-600',
        },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-500" />
                    Technical Statistics
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat) => (
                        <div key={stat.label} className="space-y-1">
                            <p className="text-xs text-muted-foreground">{stat.label}</p>
                            <p className={`text-2xl font-bold ${stat.color}`}>
                                {stat.value}
                                <span className="text-sm ml-1">{stat.suffix}</span>
                            </p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
