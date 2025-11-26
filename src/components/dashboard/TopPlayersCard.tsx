import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { PlayerAvatar } from '@/components/players/PlayerAvatar';

interface TopPlayer {
    player_id: number;
    full_name: string;
    avatar_url: string | null;
    totalMatches: number;
    wins: number;
    losses: number;
    winRate: number;
}

interface TopPlayersCardProps {
    topPlayers: TopPlayer[];
}

export function TopPlayersCard({ topPlayers }: TopPlayersCardProps) {
    if (topPlayers.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        Top Players
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-8">
                        No players with 3+ matches yet
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    Top Players
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {topPlayers.map((player, index) => (
                        <Link
                            key={player.player_id}
                            to={`/players/${player.player_id}`}
                            className="block group"
                        >
                            <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors">
                                {/* Rank badge */}
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold text-sm flex-shrink-0">
                                    {index + 1}
                                </div>

                                {/* Player avatar */}
                                <PlayerAvatar
                                    url={player.avatar_url}
                                    alt={player.full_name}
                                    size="sm"
                                />

                                {/* Player info */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate group-hover:text-primary transition-colors">
                                        {player.full_name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {player.totalMatches} matches
                                    </p>
                                </div>

                                {/* Stats */}
                                <div className="text-right flex-shrink-0">
                                    <div className="flex items-center gap-1.5 text-sm mb-1">
                                        <span className="text-green-600 font-medium">{player.wins}</span>
                                        <span className="text-gray-400">-</span>
                                        <span className="text-red-600 font-medium">{player.losses}</span>
                                    </div>
                                    <div className="text-xs font-medium text-primary">
                                        {player.winRate.toFixed(1)}% wins
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Summary */}
                <div className="mt-4 pt-4 border-t text-center">
                    <p className="text-xs text-muted-foreground">
                        Top 5 players with 3+ matches
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
