import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';
import { MatchWithPlayer } from '@/types/extended';

interface RecentMatchesTimelineProps {
    recentMatches: MatchWithPlayer[];
}

export function RecentMatchesTimeline({ recentMatches }: RecentMatchesTimelineProps) {
    if (recentMatches.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-indigo-500" />
                        Recent Matches
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-4">
                        No recent matches
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-indigo-500" />
                    Recent Matches
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {recentMatches.map((match, index) => {
                        const isWin = match.final_result === 'win';

                        // Get opponents from match_players
                        const opponents = match.match_players?.filter(mp => mp.side === 'B' || !mp.is_tracked) || [];
                        const opponentNames = opponents.map(opp =>
                            opp.players?.full_name || opp.display_name
                        ).join(' + ');

                        return (
                            <Link
                                key={match.match_id}
                                to={`/matches/${match.match_id}`}
                                className="block group"
                            >
                                <div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent transition-colors">
                                    {/* Timeline dot */}
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`w-3 h-3 rounded-full ${isWin ? 'bg-green-500' : 'bg-red-500'
                                                }`}
                                        />
                                        {index < recentMatches.length - 1 && (
                                            <div className="w-0.5 h-full bg-border mt-1" />
                                        )}
                                    </div>

                                    {/* Match info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="h-3 w-3" />
                                                <span>
                                                    {match.match_date
                                                        ? new Date(match.match_date).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                        })
                                                        : 'No Date'}
                                                </span>
                                                {match.surface && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="capitalize">{match.surface}</span>
                                                    </>
                                                )}
                                            </div>
                                            <div
                                                className={`font-bold text-sm ${isWin ? 'text-green-600' : 'text-red-600'
                                                    }`}
                                            >
                                                {isWin ? 'W' : 'L'}
                                            </div>
                                        </div>
                                        <p className="font-medium text-sm mb-1">
                                            vs {opponentNames || 'Unknown'}
                                            {match.format === 'doubles' && (
                                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">
                                                    Doubles
                                                </span>
                                            )}
                                        </p>
                                        {match.score_line && (
                                            <p className="text-xs text-muted-foreground">{match.score_line}</p>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
