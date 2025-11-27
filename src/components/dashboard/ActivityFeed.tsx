import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Calendar, Users } from 'lucide-react';
import { MatchWithPlayer } from '@/types/extended';

interface ActivityFeedProps {
    recentMatches: MatchWithPlayer[];
}

export function ActivityFeed({ recentMatches }: ActivityFeedProps) {
    if (recentMatches.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-indigo-500" />
                        Recent Activity
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-8">
                        No recent activity
                    </p>
                </CardContent>
            </Card>
        );
    }

    const getActivityIcon = (match: MatchWithPlayer) => {
        if (match.format === 'doubles') {
            return <Users className="h-4 w-4" />;
        }
        return <Calendar className="h-4 w-4" />;
    };

    const getResultColor = (result: string | null) => {
        if (result === 'win') return 'text-green-600 bg-green-50';
        if (result === 'loss') return 'text-red-600 bg-red-50';
        return 'text-gray-600 bg-gray-50';
    };

    return (
        <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-indigo-500" />
                    Recent Activity
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {recentMatches.slice(0, 10).map((match, index) => {
                        // Get opponents from match_players
                        const opponents = match.match_players?.filter(
                            mp => mp.side === 'B' || !mp.is_tracked
                        ) || [];
                        const opponentNames = opponents.map(opp =>
                            opp.players?.full_name || opp.display_name
                        ).join(' + ');

                        const isWin = match.final_result === 'win';

                        return (
                            <Link
                                key={match.match_id}
                                to={`/dashboard/matches/${match.match_id}`}
                                className="block group"
                            >
                                <div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent transition-colors">
                                    {/* Timeline indicator */}
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`p-2 rounded-full ${isWin ? 'bg-green-100' : 'bg-red-100'
                                                }`}
                                        >
                                            {getActivityIcon(match)}
                                        </div>
                                        {index < recentMatches.length - 1 && (
                                            <div className="w-0.5 h-full bg-border mt-2" />
                                        )}
                                    </div>

                                    {/* Activity content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <div>
                                                <p className="text-sm font-medium group-hover:text-primary transition-colors">
                                                    Match vs {opponentNames || 'Unknown'}
                                                </p>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>
                                                        {match.match_date
                                                            ? new Date(match.match_date).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                            })
                                                            : 'No Date'}
                                                    </span>
                                                    {match.surface && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="capitalize">{match.surface}</span>
                                                        </>
                                                    )}
                                                    {match.format === 'doubles' && (
                                                        <>
                                                            <span>•</span>
                                                            <span>Doubles</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div
                                                className={`px-2 py-1 rounded-md text-xs font-medium ${getResultColor(
                                                    match.final_result
                                                )}`}
                                            >
                                                {match.final_result?.toUpperCase() || 'N/A'}
                                            </div>
                                        </div>
                                        {match.score_line && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {match.score_line}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* View all link */}
                {recentMatches.length > 10 && (
                    <div className="mt-4 pt-4 border-t text-center">
                        <Link
                            to="/dashboard/matches"
                            className="text-sm text-primary hover:underline font-medium"
                        >
                            View all matches →
                        </Link>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
