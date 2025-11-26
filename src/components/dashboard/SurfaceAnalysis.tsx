import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3 } from 'lucide-react';

interface SurfaceAnalysisProps {
    matchesBySurface: {
        [surface: string]: {
            total: number;
            wins: number;
            losses: number;
            winRate: number;
        };
    };
}

// Surface-specific colors
const SURFACE_COLORS: { [key: string]: string } = {
    Hard: '#3b82f6',      // Blue
    Clay: '#f97316',      // Orange
    Grass: '#22c55e',     // Green
    Carpet: '#8b5cf6',    // Purple
    Unknown: '#6b7280',   // Gray
};

export function SurfaceAnalysis({ matchesBySurface }: SurfaceAnalysisProps) {
    const data = Object.entries(matchesBySurface).map(([surface, stats]) => ({
        surface,
        total: stats.total,
        wins: stats.wins,
        losses: stats.losses,
        winRate: stats.winRate,
        color: SURFACE_COLORS[surface] || SURFACE_COLORS.Unknown,
    }));

    if (data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-orange-500" />
                        Surface Performance
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-8">
                        No surface data available
                    </p>
                </CardContent>
            </Card>
        );
    }

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-card border rounded-lg p-3 shadow-lg">
                    <p className="font-medium mb-1">{data.surface}</p>
                    <p className="text-sm text-green-600">Wins: {data.wins}</p>
                    <p className="text-sm text-red-600">Losses: {data.losses}</p>
                    <p className="text-sm text-muted-foreground">
                        Win Rate: {data.winRate.toFixed(1)}%
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-orange-500" />
                    Surface Performance
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                            dataKey="surface"
                            className="text-xs"
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            className="text-xs"
                            tick={{ fontSize: 12 }}
                            label={{ value: 'Matches', angle: -90, position: 'insideLeft', fontSize: 12 }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            formatter={(value) => {
                                if (value === 'wins') return 'Wins';
                                if (value === 'losses') return 'Losses';
                                return value;
                            }}
                        />
                        <Bar
                            dataKey="wins"
                            stackId="a"
                            fill="#10b981"
                            radius={[0, 0, 0, 0]}
                            animationBegin={0}
                            animationDuration={800}
                        />
                        <Bar
                            dataKey="losses"
                            stackId="a"
                            fill="#ef4444"
                            radius={[4, 4, 0, 0]}
                            animationBegin={0}
                            animationDuration={800}
                        />
                    </BarChart>
                </ResponsiveContainer>

                {/* Win rate indicators */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                    {data.map((item) => (
                        <div
                            key={item.surface}
                            className="flex items-center gap-2 p-2 rounded-lg bg-accent/50"
                        >
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium truncate">{item.surface}</div>
                                <div className="text-xs text-muted-foreground">
                                    {item.winRate.toFixed(0)}% wins
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
