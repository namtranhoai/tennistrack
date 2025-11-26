import { useDashboardStats } from '@/hooks/useDashboardStats';
import { OverallStatsCards } from '@/components/dashboard/OverallStatsCards';
import { MatchTypeDistribution } from '@/components/dashboard/MatchTypeDistribution';
import { SurfaceAnalysis } from '@/components/dashboard/SurfaceAnalysis';
import { TopPlayersCard } from '@/components/dashboard/TopPlayersCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { LayoutDashboard } from 'lucide-react';

export default function DashboardPage() {
    const { data: stats, isLoading, error } = useDashboardStats();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
                    <p className="text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-red-600 font-medium mb-2">Error loading dashboard</p>
                    <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
                </div>
            </div>
        );
    }

    if (!stats) {
        return null;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#132d24] via-[#1a4030] to-[#a3cf08] p-8 text-white shadow-2xl">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.5))]" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                            <LayoutDashboard className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
                            <p className="text-[#a3cf08] mt-1 font-medium">
                                Tennis Performance Analytics
                            </p>
                        </div>
                    </div>
                    <p className="text-white/90 max-w-2xl">
                        Track your progress, analyze your performance, and discover insights to improve your game.
                    </p>
                </div>
            </div>

            {/* Overall Stats Cards */}
            <OverallStatsCards
                totalPlayers={stats.totalPlayers}
                totalMatches={stats.totalMatches}
                winRate={stats.winRate}
                newPlayersThisMonth={stats.newPlayersThisMonth}
            />

            {/* Charts Row */}
            <div className="grid gap-6 md:grid-cols-2">
                <MatchTypeDistribution
                    singles={stats.matchesByType.singles}
                    doubles={stats.matchesByType.doubles}
                />
                <SurfaceAnalysis matchesBySurface={stats.matchesBySurface} />
            </div>

            {/* Bottom Row: Top Players + Activity Feed */}
            <div className="grid gap-6 lg:grid-cols-2">
                <TopPlayersCard topPlayers={stats.topPlayers} />
                <ActivityFeed recentMatches={stats.recentMatches} />
            </div>

            {/* Footer Info */}
            <div className="text-center text-sm text-muted-foreground pb-8">
                <p>Data updates in real-time as you add matches and players</p>
            </div>
        </div>
    );
}
