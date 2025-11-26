import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Trophy, Target, TrendingUp } from 'lucide-react';

interface OverallStatsCardsProps {
    totalPlayers: number;
    totalMatches: number;
    winRate: number;
    newPlayersThisMonth: number;
}

export function OverallStatsCards({
    totalPlayers,
    totalMatches,
    winRate,
    newPlayersThisMonth,
}: OverallStatsCardsProps) {
    const stats = [
        {
            title: 'Total Players',
            value: totalPlayers,
            icon: Users,
            gradient: 'from-blue-500 to-cyan-500',
            iconColor: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Total Matches',
            value: totalMatches,
            icon: Trophy,
            gradient: 'from-purple-500 to-pink-500',
            iconColor: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            title: 'Overall Win Rate',
            value: `${winRate.toFixed(1)}%`,
            icon: Target,
            gradient: 'from-green-500 to-emerald-500',
            iconColor: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            title: 'Active This Month',
            value: newPlayersThisMonth,
            icon: TrendingUp,
            gradient: 'from-orange-500 to-red-500',
            iconColor: 'text-orange-600',
            bgColor: 'bg-orange-50',
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <Card
                        key={stat.title}
                        className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4"
                        style={{
                            animationDelay: `${index * 100}ms`,
                            animationFillMode: 'backwards',
                        }}
                    >
                        {/* Gradient background overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5`} />

                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className={`${stat.bgColor} p-2 rounded-lg`}>
                                <Icon className={`h-4 w-4 ${stat.iconColor}`} />
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                                {stat.value}
                            </div>
                            {stat.title === 'Overall Win Rate' && totalMatches > 0 && (
                                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full bg-gradient-to-r ${stat.gradient} transition-all duration-1000 ease-out`}
                                        style={{ width: `${winRate}%` }}
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
