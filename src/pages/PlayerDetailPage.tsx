import { useParams, Link } from 'react-router-dom';
import { usePlayer } from '@/hooks/usePlayers';
import { usePlayerMatches } from '@/hooks/useMatches';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar } from 'lucide-react';
import { PlayerAvatar } from '@/components/players/PlayerAvatar';
import { PlayerDashboard } from '@/components/players/PlayerDashboard';

export default function PlayerDetailPage() {
    const { id } = useParams<{ id: string }>();
    const playerId = parseInt(id || '0');
    const { data: player, isLoading: playerLoading } = usePlayer(playerId);
    const { data: matches, isLoading: matchesLoading } = usePlayerMatches(playerId);

    if (playerLoading) return <div className="p-8">Loading player...</div>;
    if (!player) return <div className="p-8">Player not found</div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center space-x-4">
                <Link to="/players">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <PlayerAvatar url={player.avatar_url} alt={player.full_name} size="xl" />
                <h2 className="text-3xl font-bold tracking-tight">{player.full_name}</h2>
            </div>

            {/* Dashboard Section */}
            <PlayerDashboard playerId={playerId} />

            {/* Profile and Match History */}

            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-4">
                    <h3 className="font-semibold text-lg">Profile</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">Level</p>
                            <p className="font-medium">{player.level || '-'}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Gender</p>
                            <p className="font-medium capitalize">{player.gender || '-'}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Dominant Hand</p>
                            <p className="font-medium capitalize">{player.dominant_hand || '-'}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Backhand</p>
                            <p className="font-medium capitalize">{player.backhand_type || '-'}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Birth Date</p>
                            <p className="font-medium">{player.birth_date || '-'}</p>
                        </div>
                    </div>
                    {player.notes && (
                        <div className="pt-2">
                            <p className="text-muted-foreground text-sm">Notes</p>
                            <p className="text-sm mt-1 whitespace-pre-wrap">{player.notes}</p>
                        </div>
                    )}
                </div>

                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                    <h3 className="font-semibold text-lg mb-4">Match History</h3>
                    <div className="space-y-4">
                        {matchesLoading ? (
                            <p>Loading matches...</p>
                        ) : matches?.length === 0 ? (
                            <p className="text-muted-foreground text-sm">No matches recorded.</p>
                        ) : (
                            matches?.map((match) => {
                                // Get opponents (side B or non-tracked players)
                                const opponents = match.match_players?.filter((mp: any) => mp.side === 'B' || !mp.is_tracked) || [];
                                const opponentNames = opponents.map((opp: any) =>
                                    opp.players?.full_name || opp.display_name
                                ).join(' + ');

                                return (
                                    <Link
                                        key={match.match_id}
                                        to={`/matches/${match.match_id}`}
                                        className="block group"
                                    >
                                        <div className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0 group-hover:bg-gray-50 p-2 rounded-md transition-colors">
                                            <div className="space-y-1">
                                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>{match.match_date ? new Date(match.match_date).toLocaleDateString() : 'No Date'}</span>
                                                    {match.surface && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="capitalize">{match.surface}</span>
                                                        </>
                                                    )}
                                                    {match.format === 'doubles' && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="text-xs bg-blue-100 text-blue-800 px-1.5 rounded-full">Doubles</span>
                                                        </>
                                                    )}
                                                </div>
                                                <p className="font-medium">vs {opponentNames || 'Unknown'}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className={`font-bold ${match.final_result === 'win' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {match.final_result?.toUpperCase()}
                                                </div>
                                                <p className="text-sm text-muted-foreground">{match.score_line}</p>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
