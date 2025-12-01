import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';
import { MatchWithDetails } from '../../types/live';

interface MatchInfoTabProps {
    match: MatchWithDetails;
}

export default function MatchInfoTab({ match }: MatchInfoTabProps) {
    const queryClient = useQueryClient();
    const [status, setStatus] = useState(match.status);
    const [notes, setNotes] = useState(match.notes || '');
    const [isEditing, setIsEditing] = useState(false);

    const sideAPlayers = match.match_players.filter(p => p.side === 'A');
    const sideBPlayers = match.match_players.filter(p => p.side === 'B');

    const formatPlayerNames = (players: typeof match.match_players) => {
        return players.map(p => p.display_name).join(' / ');
    };

    const getMatchScore = () => {
        if (!match.sets || match.sets.length === 0) return 'No sets played';

        return match.sets.map(set => {
            const sideAGames = set.games_side_a || 0;
            const sideBGames = set.games_side_b || 0;
            return `${sideAGames}-${sideBGames}`;
        }).join(', ');
    };

    // Update match status
    const updateStatusMutation = useMutation({
        mutationFn: async (newStatus: string) => {
            const updates: any = { status: newStatus };

            if (newStatus === 'in_progress' && !match.started_at) {
                updates.started_at = new Date().toISOString();
            } else if (newStatus === 'completed' && !match.completed_at) {
                updates.completed_at = new Date().toISOString();
            }

            const { error } = await supabase
                .from('matches')
                .update(updates)
                .eq('match_id', match.match_id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['liveMatch', match.match_id] });
        },
    });

    // Update match notes
    const updateNotesMutation = useMutation({
        mutationFn: async (newNotes: string) => {
            const { error } = await supabase
                .from('matches')
                .update({ notes: newNotes })
                .eq('match_id', match.match_id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['liveMatch', match.match_id] });
            setIsEditing(false);
        },
    });

    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
        updateStatusMutation.mutate(newStatus);
    };

    const handleSaveNotes = () => {
        updateNotesMutation.mutate(notes);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
            {/* Match Header */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Match Information</h2>

                {/* Players */}
                <div className="space-y-3 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <span className="text-sm text-gray-600">Side A:</span>
                        <span className="font-semibold text-gray-900 text-base sm:text-lg">{formatPlayerNames(sideAPlayers)}</span>
                    </div>
                    <div className="flex items-center justify-center text-xl sm:text-2xl font-bold text-gray-400">
                        vs
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <span className="text-sm text-gray-600">Side B:</span>
                        <span className="font-semibold text-gray-900 text-base sm:text-lg">{formatPlayerNames(sideBPlayers)}</span>
                    </div>
                </div>

                {/* Match Details - Responsive Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                    <div>
                        <div className="text-xs text-gray-600 mb-1">Format</div>
                        <div className="font-medium capitalize text-sm sm:text-base">{match.format}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-600 mb-1">Surface</div>
                        <div className="font-medium text-sm sm:text-base">{match.surface}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-600 mb-1">Date</div>
                        <div className="font-medium text-sm sm:text-base">{new Date(match.match_date).toLocaleDateString()}</div>
                    </div>
                    <div className="col-span-2 lg:col-span-1">
                        <div className="text-xs text-gray-600 mb-1">Status</div>
                        <select
                            value={status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            disabled={updateStatusMutation.isPending}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base touch-manipulation disabled:opacity-50"
                        >
                            <option value="scheduled">Scheduled</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>

                {/* Current Score - Larger on Desktop */}
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                    <div className="text-sm text-gray-600 mb-2">Current Score</div>
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                        {getMatchScore()}
                    </div>
                </div>
            </div>

            {/* Quick Update Notes */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Match Notes</h3>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-green-600 hover:text-green-700 font-medium text-sm touch-manipulation px-3 py-1"
                        >
                            Edit
                        </button>
                    )}
                </div>

                {isEditing ? (
                    <div className="space-y-3">
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                            placeholder="Add match notes..."
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleSaveNotes}
                                disabled={updateNotesMutation.isPending}
                                className="flex-1 sm:flex-none bg-green-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium text-sm sm:text-base touch-manipulation"
                            >
                                {updateNotesMutation.isPending ? 'Saving...' : 'Save'}
                            </button>
                            <button
                                onClick={() => {
                                    setNotes(match.notes || '');
                                    setIsEditing(false);
                                }}
                                className="flex-1 sm:flex-none bg-gray-200 text-gray-700 px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-300 font-medium text-sm sm:text-base touch-manipulation"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                        <p className="text-sm sm:text-base text-gray-600 whitespace-pre-wrap">
                            {match.notes || 'No notes available. Click Edit to add notes.'}
                        </p>
                    </div>
                )}
            </div>

            {/* Location & Tournament - Responsive Layout */}
            {(match.location || match.tournament_name) && (
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Location & Tournament</h3>
                    <div className="space-y-2 sm:space-y-3">
                        {match.location && (
                            <div className="flex items-center gap-2 sm:gap-3">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-gray-700 text-sm sm:text-base">{match.location}</span>
                            </div>
                        )}
                        {match.tournament_name && (
                            <div className="flex items-center gap-2 sm:gap-3">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                                <span className="text-gray-700 text-sm sm:text-base">{match.tournament_name}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Pre-Match Strategy */}
            {match.pre_match_strategy && (
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Pre-Match Strategy</h3>
                    <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                        <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap">
                            {match.pre_match_strategy}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
