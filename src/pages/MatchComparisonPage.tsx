import { useParams, Link } from 'react-router-dom';
import { useMatchComparison } from '@/hooks/useMatchComparison';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, MapPin, Trophy } from 'lucide-react';
import PlayerComparisonCard from '@/components/matches/PlayerComparisonCard';
import ComparisonChart from '@/components/matches/ComparisonChart';

export default function MatchComparisonPage() {
    const { id } = useParams<{ id: string }>();
    const matchId = parseInt(id || '0');
    const { data: comparison, isLoading, error } = useMatchComparison(matchId);

    if (isLoading) return <div className="p-8">Loading comparison data...</div>;
    if (error) return <div className="p-8 text-red-600">Error loading comparison: {(error as Error).message}</div>;
    if (!comparison) return <div className="p-8">No comparison data available</div>;

    const isDoubles = comparison.matchType === 'doubles';
    const playerWithStats = comparison.players.find(p => p.stats);

    // Group players for doubles
    const team1 = isDoubles ? comparison.players.filter(p => p.role === 'player' || p.role === 'partner') : [];
    const team2 = isDoubles ? comparison.players.filter(p => p.role.startsWith('opponent')) : [];

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <Link to={`/dashboard/matches/${matchId}`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Performance Comparison</h2>
                    <p className="text-muted-foreground">
                        {isDoubles ? 'Doubles Match - 4 Players' : 'Singles Match - 2 Players'}
                    </p>
                </div>
            </div>

            {/* Match Info */}
            <div className="bg-white rounded-xl border shadow-sm p-6">
                <div className="grid md:grid-cols-3 gap-6 items-center">
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-bold">
                            {isDoubles ? `${team1.map(p => p.name).join(' + ')}` : comparison.players[0]?.name}
                        </h3>
                    </div>
                    <div className="text-center flex flex-col items-center">
                        <div className="text-3xl font-black tracking-tight my-2">
                            {comparison.scoreLine || 'N/A'}
                        </div>
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${comparison.finalResult === 'win' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {comparison.finalResult?.toUpperCase()}
                        </span>
                    </div>
                    <div className="text-center md:text-right">
                        <h3 className="text-xl font-bold">
                            {isDoubles ? `${team2.map(p => p.name).join(' + ')}` : comparison.players[1]?.name}
                        </h3>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{comparison.matchDate ? new Date(comparison.matchDate).toLocaleDateString() : '-'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{comparison.location || 'Unknown Location'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                        <Trophy className="h-4 w-4" />
                        <span className="capitalize">{comparison.matchType}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                        <span className="font-semibold">Surface:</span>
                        <span className="capitalize">{comparison.surface || '-'}</span>
                    </div>
                </div>
            </div>

            {/* Performance Chart - Only for player with stats */}
            {playerWithStats && (
                <ComparisonChart
                    playerStats={playerWithStats.stats}
                    playerName={playerWithStats.name}
                />
            )}

            {/* Player Cards */}
            <div>
                <h3 className="text-xl font-semibold mb-4">Player Statistics</h3>

                {isDoubles ? (
                    <div className="space-y-8">
                        {/* Team 1 */}
                        <div>
                            <h4 className="text-lg font-medium mb-3 text-indigo-600">Your Team</h4>
                            <div className="grid md:grid-cols-2 gap-6">
                                {team1.map((player, index) => (
                                    <PlayerComparisonCard
                                        key={index}
                                        player={player}
                                        isWinner={comparison.finalResult === 'win'}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Team 2 */}
                        <div>
                            <h4 className="text-lg font-medium mb-3 text-gray-600">Opponent Team</h4>
                            <div className="grid md:grid-cols-2 gap-6">
                                {team2.map((player, index) => (
                                    <PlayerComparisonCard
                                        key={index}
                                        player={player}
                                        isWinner={comparison.finalResult === 'loss'}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {comparison.players.map((player, index) => (
                            <PlayerComparisonCard
                                key={index}
                                player={player}
                                isWinner={
                                    (player.role === 'player' && comparison.finalResult === 'win') ||
                                    (player.role.startsWith('opponent') && comparison.finalResult === 'loss')
                                }
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Info Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                    <span className="font-semibold">Note:</span> Detailed statistics are only available for the main player.
                    Opponent and partner statistics are not tracked in the current system.
                </p>
            </div>
        </div>
    );
}
