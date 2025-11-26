import { useParams, Link } from 'react-router-dom';
import { useMatch } from '@/hooks/useMatches';
import { useCreateSet, useDeleteSet } from '@/hooks/useSetStats';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, MapPin, Trophy, Edit, Plus, Trash2, BarChart3, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import SetStatsEditor from '@/components/matches/SetStatsEditor';

export default function MatchDetailPage() {
    const { id } = useParams<{ id: string }>();
    const matchId = parseInt(id || '0');
    const { data: match, isLoading } = useMatch(matchId);
    const [activeSetTab, setActiveSetTab] = useState<number>(0);
    const [editingSetId, setEditingSetId] = useState<number | null>(null);
    const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<'team' | 'opponents'>('team');
    const createSetMutation = useCreateSet();
    const deleteSetMutation = useDeleteSet();

    // Set default selected player when match loads
    useEffect(() => {
        if (match && match.match_players && match.match_players.length > 0 && !selectedPlayerId) {
            // Default to the first player on side A (User's side)
            const firstPlayer = match.match_players.find(p => p.side === 'A') || match.match_players[0];
            setSelectedPlayerId(firstPlayer.match_player_id);
        }
    }, [match, selectedPlayerId]);

    if (isLoading) return <div className="p-8">Loading match details...</div>;
    if (!match) return <div className="p-8">Match not found</div>;

    const sets = match.sets || [];
    const currentSet = sets[activeSetTab];

    // Filter stats for the selected player
    const techStats = currentSet?.set_player_tech_stats?.find(s => s.match_player_id === selectedPlayerId);
    const tacticalStats = currentSet?.set_player_tactical_stats?.find(s => s.match_player_id === selectedPlayerId);
    const pmStats = currentSet?.set_player_physical_mental_stats?.find(s => s.match_player_id === selectedPlayerId);

    const isDoubles = match.format === 'doubles';
    const teamPlayers = match.match_players?.filter(p => p.side === 'A') || [];
    const opponents = match.match_players?.filter(p => p.side === 'B' || !p.is_tracked) || [];
    const opponentNames = opponents.map(opp => opp.players?.full_name || opp.display_name).join(' + ');

    // Get available players based on current view mode
    const availablePlayers = viewMode === 'team' ? teamPlayers : opponents;

    // Get the currently selected player info
    const selectedPlayer = match.match_players?.find(p => p.match_player_id === selectedPlayerId);

    const handleAddSet = async () => {
        try {
            await createSetMutation.mutateAsync({
                matchId: match.match_id,
                setNumber: sets.length + 1,
            });
        } catch (error) {
            console.error('Failed to add set:', error);
        }
    };

    const handleDeleteSet = async (setId: number) => {
        if (!confirm('Are you sure you want to delete this set? This action cannot be undone.')) {
            return;
        }
        try {
            await deleteSetMutation.mutateAsync(setId);
            if (activeSetTab >= sets.length - 1) {
                setActiveSetTab(Math.max(0, sets.length - 2));
            }
        } catch (error) {
            console.error('Failed to delete set:', error);
        }
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link to="/matches">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h2 className="text-3xl font-bold tracking-tight">Match Details</h2>
                </div>
                <div className="flex gap-2">
                    <Link to={`/matches/${matchId}/edit`}>
                        <Button variant="outline" className="gap-2">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Match
                        </Button>
                    </Link>
                    <Link to={`/matches/${matchId}/compare`}>
                        <Button variant="outline" className="gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Compare Performance
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Header Info */}
            <div className="bg-white rounded-xl border shadow-sm p-6">
                <div className="grid md:grid-cols-3 gap-6 items-center">
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                            <p className="text-sm text-muted-foreground">Your Team</p>
                            {isDoubles && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Doubles</span>}
                        </div>
                        <div className="space-y-1">
                            {teamPlayers.length > 0 ? (
                                teamPlayers.map(p => (
                                    <h3 key={p.match_player_id} className="text-xl font-bold text-indigo-600">
                                        {p.players?.full_name || p.display_name}
                                    </h3>
                                ))
                            ) : (
                                <h3 className="text-2xl font-bold text-indigo-600">Unknown</h3>
                            )}
                        </div>
                    </div>
                    <div className="text-center flex flex-col items-center">
                        <div className="text-4xl font-black tracking-tight my-2">
                            {match.score_line}
                        </div>
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${match.final_result === 'win' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {match.final_result?.toUpperCase()}
                        </span>
                    </div>
                    <div className="text-center md:text-right">
                        <p className="text-sm text-muted-foreground mb-1">Opponent{isDoubles ? 's' : ''}</p>
                        <h3 className="text-2xl font-bold text-gray-700">{opponentNames || 'Unknown'}</h3>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{match.match_date ? new Date(match.match_date).toLocaleDateString() : '-'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{match.location || 'Unknown Location'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                        <Trophy className="h-4 w-4" />
                        <span className="capitalize">{match.format || '-'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                        <span className="font-semibold">Surface:</span>
                        <span className="capitalize">{match.surface || '-'}</span>
                    </div>
                </div>

                {match.notes && !match.notes.startsWith('Partner:') && (
                    <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
                        <span className="font-semibold text-gray-700">Notes:</span> {match.notes.replace(/Partner: .*\n?/, '')}
                    </div>
                )}
            </div>

            {/* View Mode Toggle and Player Selection */}
            <div className="bg-white rounded-xl border shadow-sm p-4 space-y-4">
                {/* Toggle between Team and Opponents */}
                <div className="flex space-x-2 justify-center">
                    <button
                        onClick={() => {
                            setViewMode('team');
                            if (teamPlayers.length > 0) {
                                setSelectedPlayerId(teamPlayers[0].match_player_id);
                            }
                        }}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${viewMode === 'team'
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        <Users className="w-4 h-4" />
                        Your Team
                    </button>
                    <button
                        onClick={() => {
                            setViewMode('opponents');
                            if (opponents.length > 0) {
                                setSelectedPlayerId(opponents[0].match_player_id);
                            }
                        }}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${viewMode === 'opponents'
                            ? 'bg-orange-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        <Users className="w-4 h-4" />
                        Opponents
                    </button>
                </div>

                {/* Player Selection Tabs */}
                {availablePlayers.length > 1 && (
                    <div className="flex space-x-2 justify-center flex-wrap gap-2">
                        {availablePlayers.map(p => (
                            <button
                                key={p.match_player_id}
                                onClick={() => setSelectedPlayerId(p.match_player_id)}
                                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedPlayerId === p.match_player_id
                                    ? viewMode === 'team'
                                        ? 'bg-indigo-100 border-2 border-indigo-600 text-indigo-700'
                                        : 'bg-orange-100 border-2 border-orange-600 text-orange-700'
                                    : 'bg-gray-50 border-2 border-gray-200 text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {p.players?.full_name || p.display_name}
                            </button>
                        ))}
                    </div>
                )}

                {/* Current selection indicator */}
                {selectedPlayer && (
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            Viewing stats for{' '}
                            <span className={`font-semibold ${viewMode === 'team' ? 'text-indigo-600' : 'text-orange-600'}`}>
                                {selectedPlayer.players?.full_name || selectedPlayer.display_name}
                            </span>
                            {' '}({viewMode === 'team' ? 'Your Team' : 'Opponent'})
                        </p>
                    </div>
                )}
            </div>

            {/* Stats Section */}
            {sets.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex space-x-2 overflow-x-auto pb-2 flex-1">
                            {sets.map((set, index) => (
                                <button
                                    key={set.set_id}
                                    onClick={() => setActiveSetTab(index)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activeSetTab === index
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white border text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    Set {set.set_number} ({set.games_side_a}-{set.games_side_b})
                                </button>
                            ))}
                        </div>
                        <Button
                            onClick={handleAddSet}
                            size="sm"
                            className="ml-4"
                            disabled={createSetMutation.isPending}
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Set
                        </Button>
                    </div>

                    {/* Edit Mode */}
                    {editingSetId === currentSet?.set_id && selectedPlayerId !== null ? (
                        <SetStatsEditor
                            set={currentSet}
                            matchPlayerId={selectedPlayerId}
                            playerInfo={selectedPlayer}
                            isOpponent={viewMode === 'opponents'}
                            onClose={() => setEditingSetId(null)}
                        />
                    ) : (
                        <>
                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-2">
                                <Button
                                    onClick={() => setEditingSetId(currentSet?.set_id)}
                                    variant="outline"
                                    size="sm"
                                    className={viewMode === 'opponents' ? 'border-orange-300 hover:bg-orange-50' : ''}
                                >
                                    <Edit className="h-4 w-4 mr-1" />
                                    Edit Stats for {selectedPlayer?.players?.full_name || selectedPlayer?.display_name || 'Player'}
                                </Button>
                                <Button
                                    onClick={() => handleDeleteSet(currentSet?.set_id)}
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    disabled={deleteSetMutation.isPending || sets.length === 1}
                                >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete Set
                                </Button>
                            </div>

                            {/* Stats Display */}
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {/* Serve Stats */}
                                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                                    <h4 className="font-semibold mb-4 text-indigo-600">Serve Performance</h4>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Aces</span>
                                            <span className="font-medium">{techStats?.aces || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Double Faults</span>
                                            <span className="font-medium">{techStats?.double_faults || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">1st Serve %</span>
                                            <span className="font-medium">
                                                {techStats?.first_serve_total ? Math.round((techStats.first_serve_in || 0) / techStats.first_serve_total * 100) : 0}%
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">1st Serve Points Won</span>
                                            <span className="font-medium">{techStats?.first_serve_points_won || 0}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Groundstrokes */}
                                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                                    <h4 className="font-semibold mb-4 text-indigo-600">Groundstrokes</h4>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">FH Winners</span>
                                            <span className="font-medium">{techStats?.fh_winners || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">FH Unforced Errors</span>
                                            <span className="font-medium">{techStats?.fh_unforced_errors || 0}</span>
                                        </div>
                                        <div className="border-t my-2"></div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">BH Winners</span>
                                            <span className="font-medium">{techStats?.bh_winners || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">BH Unforced Errors</span>
                                            <span className="font-medium">{techStats?.bh_unforced_errors || 0}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Net & Return */}
                                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                                    <h4 className="font-semibold mb-4 text-indigo-600">Net & Return</h4>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Net Points Won</span>
                                            <span className="font-medium">{techStats?.net_points_won || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Volley Winners</span>
                                            <span className="font-medium">{techStats?.volley_winners || 0}</span>
                                        </div>
                                        <div className="border-t my-2"></div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Return Winners</span>
                                            <span className="font-medium">{techStats?.return_winners || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Break Points Won</span>
                                            <span className="font-medium">{techStats?.break_points_won || 0}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Tactical Stats */}
                                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                                    <h4 className="font-semibold mb-4 text-indigo-600">Tactical Performance</h4>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Deuce Games Won</span>
                                            <span className="font-medium">{tacticalStats?.game_deuce_won || 0}/{tacticalStats?.game_deuce_played || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">BP Saved</span>
                                            <span className="font-medium">{tacticalStats?.bp_saved || 0}/{tacticalStats?.bp_faced || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Deep Shots</span>
                                            <span className="font-medium">{tacticalStats?.deep_shots || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Short Balls Given</span>
                                            <span className="font-medium">{tacticalStats?.short_balls_given || 0}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Physical/Mental Stats */}
                                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                                    <h4 className="font-semibold mb-4 text-indigo-600">Physical Performance</h4>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Speed Rating</span>
                                            <span className="font-medium">{pmStats?.speed_rating || 0}/10</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Recovery Rating</span>
                                            <span className="font-medium">{pmStats?.recovery_rating || 0}/10</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Fatigue Errors</span>
                                            <span className="font-medium">{pmStats?.fatigue_errors || 0}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Mental Stats */}
                                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                                    <h4 className="font-semibold mb-4 text-indigo-600">Mental Performance</h4>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Confidence</span>
                                            <span className="font-medium">{pmStats?.confidence_rating || 0}/10</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Emotion Control</span>
                                            <span className="font-medium">{pmStats?.emotion_control || 0}/10</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Focus</span>
                                            <span className="font-medium">{pmStats?.focus_rating || 0}/10</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Tactical Adjustment</span>
                                            <span className="font-medium">{pmStats?.tactical_adjustment || 0}/10</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {pmStats?.coach_notes && (
                                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                                    <h4 className="font-semibold mb-3 text-indigo-600">Coach Notes</h4>
                                    <p className="text-sm text-muted-foreground">{pmStats.coach_notes}</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {sets.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border">
                    <p className="text-muted-foreground mb-4">No sets recorded for this match yet.</p>
                    <Button onClick={handleAddSet} disabled={createSetMutation.isPending}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add First Set
                    </Button>
                </div>
            )}
        </div>
    );
}
