import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';
import { LiveMatchDetails, SetWithStatus } from '../../types/live';
import SetSelector from './SetSelector';

interface SetManagementTabProps {
    match: LiveMatchDetails;
    selectedSetId: number | null;
    onSelectSet: (setId: number) => void;
}

export default function SetManagementTab({ match, selectedSetId, onSelectSet }: SetManagementTabProps) {
    const queryClient = useQueryClient();
    const sets = match.sets || [];
    const selectedSet = sets.find((s: SetWithStatus) => s.set_id === selectedSetId);

    const [gamesA, setGamesA] = useState(selectedSet?.games_side_a || 0);
    const [gamesB, setGamesB] = useState(selectedSet?.games_side_b || 0);
    const [tiebreakPlayed, setTiebreakPlayed] = useState(selectedSet?.tiebreak_played || false);
    const [tiebreakScore, setTiebreakScore] = useState(selectedSet?.tiebreak_score || '');

    // Update games score
    const updateGamesMutation = useMutation({
        mutationFn: async ({ sideAGames, sideBGames }: { sideAGames: number; sideBGames: number }) => {
            if (!selectedSetId) return;

            const query = supabase
                .from('sets')
                // @ts-ignore - Supabase type inference issue with update
                .update({
                    games_side_a: sideAGames,
                    games_side_b: sideBGames,
                })
                .eq('set_id', selectedSetId);

            const { error } = await query;

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['liveMatch', match.match_id] });
        },
    });

    // Complete set
    const completeSetMutation = useMutation({
        mutationFn: async () => {
            if (!selectedSetId) return;

            const query = supabase
                .from('sets')
                // @ts-ignore - Supabase type inference issue with update
                .update({
                    completed_at: new Date().toISOString(),
                    games_side_a: gamesA,
                    games_side_b: gamesB,
                    tiebreak_played: tiebreakPlayed,
                    tiebreak_score: tiebreakPlayed ? tiebreakScore : null,
                })
                .eq('set_id', selectedSetId);

            const { error } = await query;

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['liveMatch', match.match_id] });
        },
    });

    // Start set
    const startSetMutation = useMutation({
        mutationFn: async () => {
            if (!selectedSetId) return;

            const query = supabase
                .from('sets')
                // @ts-ignore - Supabase type inference issue with update
                .update({
                    started_at: new Date().toISOString(),
                })
                .eq('set_id', selectedSetId);

            const { error } = await query;

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['liveMatch', match.match_id] });
        },
    });

    const handleGamesChange = (side: 'A' | 'B', delta: number) => {
        if (side === 'A') {
            const newValue = Math.max(0, gamesA + delta);
            setGamesA(newValue);
            updateGamesMutation.mutate({ sideAGames: newValue, sideBGames: gamesB });
        } else {
            const newValue = Math.max(0, gamesB + delta);
            setGamesB(newValue);
            updateGamesMutation.mutate({ sideAGames: gamesA, sideBGames: newValue });
        }
    };

    const handleCompleteSet = () => {
        completeSetMutation.mutate();
    };

    const handleStartSet = () => {
        startSetMutation.mutate();
    };

    // Update local state when selected set changes
    useState(() => {
        if (selectedSet) {
            setGamesA(selectedSet.games_side_a || 0);
            setGamesB(selectedSet.games_side_b || 0);
            setTiebreakPlayed(selectedSet.tiebreak_played || false);
            setTiebreakScore(selectedSet.tiebreak_score || '');
        }
    });

    const isCompleted = selectedSet?.completed_at !== null;
    const isInProgress = selectedSet?.started_at !== null && !isCompleted;
    const isNotStarted = !selectedSet?.started_at;

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Set Management</h2>
                <p className="text-sm sm:text-base text-gray-600">Create and manage sets for this match</p>
            </div>

            {/* Set Selector */}
            <SetSelector
                matchId={match.match_id}
                sets={sets}
                selectedSetId={selectedSetId}
                onSelectSet={onSelectSet}
            />

            {/* Instructions */}
            {sets.length === 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 text-center">
                    <p className="text-blue-800 font-medium text-sm sm:text-base">
                        Click "Create New Set" above to start tracking
                    </p>
                </div>
            )}

            {/* Selected Set Quick Update */}
            {selectedSetId && selectedSet && (
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-4 sm:space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Quick Update</h3>
                        <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${isCompleted ? 'bg-blue-100 text-blue-700' :
                            isInProgress ? 'bg-green-100 text-green-700' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                            {isCompleted ? 'Completed' : isInProgress ? 'In Progress' : 'Not Started'}
                        </span>
                    </div>

                    {/* Games Score Controls - Responsive */}
                    <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                        <div className="text-sm sm:text-base text-gray-600 mb-4">Games Score</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            {/* Side A */}
                            <div>
                                <div className="text-xs sm:text-sm text-gray-500 mb-2">Side A</div>
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <button
                                        onClick={() => handleGamesChange('A', -1)}
                                        disabled={isCompleted || gamesA === 0}
                                        className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-red-100 text-red-600 rounded-lg hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xl sm:text-2xl touch-manipulation transition-colors"
                                    >
                                        −
                                    </button>
                                    <div className="flex-1 text-center">
                                        <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900">
                                            {gamesA}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleGamesChange('A', 1)}
                                        disabled={isCompleted}
                                        className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-green-100 text-green-600 rounded-lg hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xl sm:text-2xl touch-manipulation transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Side B */}
                            <div>
                                <div className="text-xs sm:text-sm text-gray-500 mb-2">Side B</div>
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <button
                                        onClick={() => handleGamesChange('B', -1)}
                                        disabled={isCompleted || gamesB === 0}
                                        className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-red-100 text-red-600 rounded-lg hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xl sm:text-2xl touch-manipulation transition-colors"
                                    >
                                        −
                                    </button>
                                    <div className="flex-1 text-center">
                                        <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900">
                                            {gamesB}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleGamesChange('B', 1)}
                                        disabled={isCompleted}
                                        className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-green-100 text-green-600 rounded-lg hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xl sm:text-2xl touch-manipulation transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tiebreak */}
                    {!isCompleted && (
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 sm:gap-3 cursor-pointer touch-manipulation">
                                <input
                                    type="checkbox"
                                    checked={tiebreakPlayed}
                                    onChange={(e) => setTiebreakPlayed(e.target.checked)}
                                    className="w-5 h-5 sm:w-6 sm:h-6 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                />
                                <span className="text-sm sm:text-base font-medium text-gray-700">Tiebreak Played</span>
                            </label>

                            {tiebreakPlayed && (
                                <input
                                    type="text"
                                    value={tiebreakScore}
                                    onChange={(e) => setTiebreakScore(e.target.value)}
                                    placeholder="e.g., 7-5"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                                />
                            )}
                        </div>
                    )}

                    {/* Action Buttons - Responsive */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        {isNotStarted && (
                            <button
                                onClick={handleStartSet}
                                disabled={startSetMutation.isPending}
                                className="flex-1 bg-green-600 text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium text-sm sm:text-base touch-manipulation transition-colors"
                            >
                                {startSetMutation.isPending ? 'Starting...' : 'Start Set'}
                            </button>
                        )}

                        {isInProgress && (
                            <button
                                onClick={handleCompleteSet}
                                disabled={completeSetMutation.isPending}
                                className="flex-1 bg-blue-600 text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium text-sm sm:text-base touch-manipulation transition-colors"
                            >
                                {completeSetMutation.isPending ? 'Completing...' : 'Complete Set'}
                            </button>
                        )}
                    </div>

                    {/* Timestamps */}
                    {(selectedSet.started_at || selectedSet.completed_at) && (
                        <div className="border-t border-gray-200 pt-4 space-y-2 text-sm sm:text-base">
                            {selectedSet.started_at && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Started:</span>
                                    <span className="text-gray-900 font-medium">
                                        {new Date(selectedSet.started_at).toLocaleTimeString()}
                                    </span>
                                </div>
                            )}
                            {selectedSet.completed_at && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Completed:</span>
                                    <span className="text-gray-900 font-medium">
                                        {new Date(selectedSet.completed_at).toLocaleTimeString()}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
