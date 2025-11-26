import { useState } from 'react';
import { usePlayerStats, DateRange } from '@/hooks/usePlayerStats';
import { WinLossCard } from './WinLossCard';
import { PerformanceTrendsChart } from './PerformanceTrendsChart';
import { SurfacePerformanceCard } from './SurfacePerformanceCard';
import { TechnicalStatsCard } from './TechnicalStatsCard';
import { RecentMatchesTimeline } from './RecentMatchesTimeline';
import { Button } from '@/components/ui/button';

interface PlayerDashboardProps {
    playerId: number;
}

export function PlayerDashboard({ playerId }: PlayerDashboardProps) {
    const [dateRange, setDateRange] = useState<DateRange>('6months');
    const { data: stats, isLoading, error } = usePlayerStats(playerId, dateRange);

    const dateRangeOptions: { value: DateRange; label: string }[] = [
        { value: '1month', label: '1 Month' },
        { value: '3months', label: '3 Months' },
        { value: '6months', label: '6 Months' },
        { value: '1year', label: '1 Year' },
        { value: 'all', label: 'All Time' },
    ];

    if (isLoading) {
        return (
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-8">
                <p className="text-center text-muted-foreground">Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-8">
                <p className="text-center text-red-600">Error loading dashboard</p>
            </div>
        );
    }

    if (!stats) {
        return null;
    }

    return (
        <div className="space-y-6">
            {/* Header with Date Range Selector */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold tracking-tight">Performance Dashboard</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Overview of player statistics and trends
                    </p>
                </div>
                <div className="flex gap-2">
                    {dateRangeOptions.map((option) => (
                        <Button
                            key={option.value}
                            variant={dateRange === option.value ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setDateRange(option.value)}
                        >
                            {option.label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Empty State */}
            {stats.totalMatches === 0 ? (
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-12">
                    <div className="text-center">
                        <p className="text-lg font-medium mb-2">No matches found</p>
                        <p className="text-sm text-muted-foreground">
                            No matches recorded for the selected time period. Try selecting a different date range.
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    {/* First Row: Win/Loss and Performance Trends */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <WinLossCard
                            wins={stats.wins}
                            losses={stats.losses}
                            totalMatches={stats.totalMatches}
                            winRate={stats.winRate}
                            singleStats={stats.matchesByType.singles}
                            doublesStats={stats.matchesByType.doubles}
                        />
                        <PerformanceTrendsChart monthlyTrends={stats.monthlyTrends} />
                    </div>

                    {/* Second Row: Surface Performance and Technical Stats */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <SurfacePerformanceCard matchesBySurface={stats.matchesBySurface} />
                        <TechnicalStatsCard technicalStats={stats.technicalStats} />
                    </div>

                    {/* Third Row: Recent Matches Timeline */}
                    <RecentMatchesTimeline recentMatches={stats.recentMatches} />
                </>
            )}
        </div>
    );
}
