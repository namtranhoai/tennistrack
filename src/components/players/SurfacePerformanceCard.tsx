import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mountain } from 'lucide-react';

interface SurfacePerformanceCardProps {
    matchesBySurface: {
        [surface: string]: {
            wins: number;
            losses: number;
            total: number;
            winRate: number;
        };
    };
}

export function SurfacePerformanceCard({ matchesBySurface }: SurfacePerformanceCardProps) {
    const surfaces = Object.entries(matchesBySurface).sort((a, b) => b[1].total - a[1].total);

    const getSurfaceColor = (surface: string) => {
        const surfaceLower = surface.toLowerCase();
        if (surfaceLower.includes('hard')) return 'bg-blue-500';
        if (surfaceLower.includes('clay')) return 'bg-orange-500';
        if (surfaceLower.includes('grass')) return 'bg-green-500';
        if (surfaceLower.includes('carpet')) return 'bg-purple-500';
        return 'bg-gray-500';
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Mountain className="h-5 w-5 text-orange-500" />
                    Surface Performance
                </CardTitle>
            </CardHeader>
            <CardContent>
                {surfaces.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        No surface data available
                    </p>
                ) : (
                    <div className="space-y-4">
                        {surfaces.map(([surface, stats]) => (
                            <div key={surface} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${getSurfaceColor(surface)}`} />
                                        <span className="font-medium capitalize">{surface}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-green-600 font-medium">{stats.wins}</span>
                                        <span className="text-gray-400">-</span>
                                        <span className="text-red-600 font-medium">{stats.losses}</span>
                                        <span className="text-muted-foreground ml-2">
                                            ({stats.winRate.toFixed(0)}%)
                                        </span>
                                    </div>
                                </div>
                                {/* Progress bar */}
                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={`h-full ${getSurfaceColor(surface)} transition-all duration-500`}
                                        style={{ width: `${stats.winRate}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
