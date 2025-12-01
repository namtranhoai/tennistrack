import { useCallback, useEffect, useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { EventCounters, DetailedStats, SPInputState } from '../types/live';
import {
    initQuickKPIs,
    initEventCounters,
    initDetailedStats,
    mergeEventCounters,
} from '../lib/spInputHelpers';
import { Database } from '../types/db';

type TechStatsRow = Database['public']['Tables']['set_player_tech_stats']['Row'];
type TacticalStatsRow = Database['public']['Tables']['set_player_tactical_stats']['Row'];
type PhysicalMentalStatsRow = Database['public']['Tables']['set_player_physical_mental_stats']['Row'];

/**
 * Core hook for SP-Input state management
 * Handles loading, saving, and managing all three layers of input
 */
export function useSPInput(setId: number | null, matchPlayerId: number | null) {
    const queryClient = useQueryClient();

    const [state, setState] = useState<SPInputState>({
        quickKPIs: initQuickKPIs(),
        eventCounters: initEventCounters(),
        detailedStats: initDetailedStats(),
        isLoading: false,
        isSaving: false,
        lastSaved: null,
    });

    /**
     * Load existing stats from database
     */
    const loadStats = useCallback(async (setId: number, matchPlayerId: number) => {
        setState(prev => ({ ...prev, isLoading: true }));

        try {
            // Load all three stat tables
            const [techResult, tacticalResult, pmResult] = await Promise.all([
                supabase
                    .from('set_player_tech_stats')
                    .select('*')
                    .eq('set_id', setId)
                    .eq('match_player_id', matchPlayerId)
                    .maybeSingle(),
                supabase
                    .from('set_player_tactical_stats')
                    .select('*')
                    .eq('set_id', setId)
                    .eq('match_player_id', matchPlayerId)
                    .maybeSingle(),
                supabase
                    .from('set_player_physical_mental_stats')
                    .select('*')
                    .eq('set_id', setId)
                    .eq('match_player_id', matchPlayerId)
                    .maybeSingle(),
            ]);

            if (techResult.error) throw techResult.error;
            if (tacticalResult.error) throw tacticalResult.error;
            if (pmResult.error) throw pmResult.error;

            const techStats = techResult.data as TechStatsRow | null;
            const tacticalStats = tacticalResult.data as TacticalStatsRow | null;
            const pmStats = pmResult.data as PhysicalMentalStatsRow | null;

            // Merge loaded stats into detailedStats
            const loadedStats: DetailedStats = {
                // Tech stats
                first_serve_in: techStats?.first_serve_in ?? 0,
                first_serve_total: techStats?.first_serve_total ?? 0,
                first_serve_points_won: techStats?.first_serve_points_won ?? 0,
                second_serve_in: techStats?.second_serve_in ?? 0,
                second_serve_total: techStats?.second_serve_total ?? 0,
                second_serve_points_won: techStats?.second_serve_points_won ?? 0,
                aces: techStats?.aces ?? 0,
                double_faults: techStats?.double_faults ?? 0,
                serve_plus1_points_won: techStats?.serve_plus1_points_won ?? 0,
                returns_in: techStats?.returns_in ?? 0,
                returns_total: techStats?.returns_total ?? 0,
                deep_returns: techStats?.deep_returns ?? 0,
                return_winners: techStats?.return_winners ?? 0,
                return_unforced_errors: techStats?.return_unforced_errors ?? 0,
                breaks_won: techStats?.breaks_won ?? 0,
                break_points_won: techStats?.break_points_won ?? 0,
                break_points_total: techStats?.break_points_total ?? 0,
                avg_rally_length: techStats?.avg_rally_length ?? 0,
                long_rallies_won: techStats?.long_rallies_won ?? 0,
                long_rallies_lost: techStats?.long_rallies_lost ?? 0,
                attacking_points_played: techStats?.attacking_points_played ?? 0,
                attacking_points_won: techStats?.attacking_points_won ?? 0,
                defensive_points_played: techStats?.defensive_points_played ?? 0,
                defensive_points_won: techStats?.defensive_points_won ?? 0,
                fh_winners: techStats?.fh_winners ?? 0,
                fh_unforced_errors: techStats?.fh_unforced_errors ?? 0,
                fh_forced_errors_drawn: techStats?.fh_forced_errors_drawn ?? 0,
                bh_winners: techStats?.bh_winners ?? 0,
                bh_unforced_errors: techStats?.bh_unforced_errors ?? 0,
                bh_forced_errors_drawn: techStats?.bh_forced_errors_drawn ?? 0,
                net_approaches: techStats?.net_approaches ?? 0,
                net_points_won: techStats?.net_points_won ?? 0,
                volley_winners: techStats?.volley_winners ?? 0,
                volley_errors: techStats?.volley_errors ?? 0,
                smash_winners: techStats?.smash_winners ?? 0,
                smash_errors: techStats?.smash_errors ?? 0,

                // Tactical stats
                game_deuce_played: tacticalStats?.game_deuce_played ?? 0,
                game_deuce_won: tacticalStats?.game_deuce_won ?? 0,
                bp_saved: tacticalStats?.bp_saved ?? 0,
                bp_faced: tacticalStats?.bp_faced ?? 0,
                game_from_40_0_lost: tacticalStats?.game_from_40_0_lost ?? 0,
                deep_shots: tacticalStats?.deep_shots ?? 0,
                mid_court_shots: tacticalStats?.mid_court_shots ?? 0,
                short_balls_given: tacticalStats?.short_balls_given ?? 0,
                shots_to_opponent_bh: tacticalStats?.shots_to_opponent_bh ?? 0,
                shots_to_opponent_fh: tacticalStats?.shots_to_opponent_fh ?? 0,

                // Physical/Mental stats
                speed_rating: pmStats?.speed_rating ?? 5,
                recovery_rating: pmStats?.recovery_rating ?? 5,
                fatigue_errors: pmStats?.fatigue_errors ?? 0,
                confidence_rating: pmStats?.confidence_rating ?? 5,
                emotion_control: pmStats?.emotion_control ?? 5,
                focus_rating: pmStats?.focus_rating ?? 5,
                tactical_adjustment: pmStats?.tactical_adjustment ?? 5,
                coach_notes: pmStats?.coach_notes ?? '',
            };

            // Initialize event counters from loaded stats
            const loadedEvents: EventCounters = {
                fhWinners: loadedStats.fh_winners,
                bhWinners: loadedStats.bh_winners,
                fhUnforcedErrors: loadedStats.fh_unforced_errors,
                bhUnforcedErrors: loadedStats.bh_unforced_errors,
                aces: loadedStats.aces,
                doubleFaults: loadedStats.double_faults,
                netErrors: 0, // Not stored separately
                longRalliesWon: loadedStats.long_rallies_won,
                longRalliesLost: loadedStats.long_rallies_lost,
                volleyWinners: loadedStats.volley_winners,
                volleyErrors: loadedStats.volley_errors,
            };

            // Try to parse Quick KPIs from coach_notes if they exist
            let loadedKPIs = initQuickKPIs();
            if (pmStats?.coach_notes) {
                try {
                    const notesLines = pmStats.coach_notes.split('\n');
                    const kpiLine = notesLines.find(line => line.startsWith('QUICK_KPIs:'));
                    if (kpiLine) {
                        const kpiJson = kpiLine.replace('QUICK_KPIs:', '').trim();
                        loadedKPIs = JSON.parse(kpiJson);
                    }
                } catch (e) {
                    console.log('Could not parse Quick KPIs from notes');
                }
            }

            setState({
                quickKPIs: loadedKPIs, // Load KPIs from coach_notes
                eventCounters: loadedEvents,
                detailedStats: loadedStats,
                isLoading: false,
                isSaving: false,
                lastSaved: null,
            });
        } catch (error) {
            console.error('Error loading stats:', error);
            setState(prev => ({ ...prev, isLoading: false }));
        }
    }, []); // Empty dependency array since it doesn't depend on any external values

    // Load stats when setId or matchPlayerId changes
    useEffect(() => {
        if (setId && matchPlayerId) {
            loadStats(setId, matchPlayerId);
        } else {
            // Reset to empty state
            setState({
                quickKPIs: initQuickKPIs(),
                eventCounters: initEventCounters(),
                detailedStats: initDetailedStats(),
                isLoading: false,
                isSaving: false,
                lastSaved: null,
            });
        }
    }, [setId, matchPlayerId, loadStats]);

    // Auto-save when player changes (to preserve data before switching)
    const prevPlayerRef = useRef<{ setId: number | null; matchPlayerId: number | null }>({
        setId: null,
        matchPlayerId: null,
    });

    useEffect(() => {
        const prevSetId = prevPlayerRef.current.setId;
        const prevMatchPlayerId = prevPlayerRef.current.matchPlayerId;

        // If player changed (and we had a previous player), save the old player's data
        if (prevSetId && prevMatchPlayerId && (prevSetId !== setId || prevMatchPlayerId !== matchPlayerId)) {
            // Check if there's any data to save
            const hasEventData =
                state.eventCounters.fhWinners > 0 ||
                state.eventCounters.bhWinners > 0 ||
                state.eventCounters.aces > 0 ||
                state.eventCounters.doubleFaults > 0 ||
                state.eventCounters.fhUnforcedErrors > 0 ||
                state.eventCounters.bhUnforcedErrors > 0 ||
                state.eventCounters.longRalliesWon > 0 ||
                state.eventCounters.longRalliesLost > 0 ||
                state.eventCounters.volleyWinners > 0 ||
                state.eventCounters.volleyErrors > 0;

            const hasDetailedData =
                state.detailedStats.first_serve_total > 0 ||
                state.detailedStats.returns_total > 0;

            const hasData = hasEventData || hasDetailedData;

            if (hasData && !state.isSaving) {
                console.log('Auto-saving before player switch:', {
                    prevSetId,
                    prevMatchPlayerId,
                    eventCounters: state.eventCounters,
                });

                // Merge event counters into stats
                const statsToSave = {
                    ...state.detailedStats,
                    fh_winners: state.eventCounters.fhWinners,
                    bh_winners: state.eventCounters.bhWinners,
                    fh_unforced_errors: state.eventCounters.fhUnforcedErrors,
                    bh_unforced_errors: state.eventCounters.bhUnforcedErrors,
                    aces: state.eventCounters.aces,
                    double_faults: state.eventCounters.doubleFaults,
                    long_rallies_won: state.eventCounters.longRalliesWon,
                    long_rallies_lost: state.eventCounters.longRalliesLost,
                    volley_winners: state.eventCounters.volleyWinners,
                    volley_errors: state.eventCounters.volleyErrors,
                };

                // Prepare data for each table
                const techStatsData = {
                    set_id: prevSetId,
                    match_player_id: prevMatchPlayerId,
                    first_serve_in: statsToSave.first_serve_in,
                    first_serve_total: statsToSave.first_serve_total,
                    first_serve_points_won: statsToSave.first_serve_points_won,
                    second_serve_in: statsToSave.second_serve_in,
                    second_serve_total: statsToSave.second_serve_total,
                    second_serve_points_won: statsToSave.second_serve_points_won,
                    aces: statsToSave.aces,
                    double_faults: statsToSave.double_faults,
                    serve_plus1_points_won: statsToSave.serve_plus1_points_won,
                    returns_in: statsToSave.returns_in,
                    returns_total: statsToSave.returns_total,
                    deep_returns: statsToSave.deep_returns,
                    return_winners: statsToSave.return_winners,
                    return_unforced_errors: statsToSave.return_unforced_errors,
                    breaks_won: statsToSave.breaks_won,
                    break_points_won: statsToSave.break_points_won,
                    break_points_total: statsToSave.break_points_total,
                    avg_rally_length: statsToSave.avg_rally_length,
                    long_rallies_won: statsToSave.long_rallies_won,
                    long_rallies_lost: statsToSave.long_rallies_lost,
                    attacking_points_played: statsToSave.attacking_points_played,
                    attacking_points_won: statsToSave.attacking_points_won,
                    defensive_points_played: statsToSave.defensive_points_played,
                    defensive_points_won: statsToSave.defensive_points_won,
                    fh_winners: statsToSave.fh_winners,
                    fh_unforced_errors: statsToSave.fh_unforced_errors,
                    fh_forced_errors_drawn: statsToSave.fh_forced_errors_drawn,
                    bh_winners: statsToSave.bh_winners,
                    bh_unforced_errors: statsToSave.bh_unforced_errors,
                    bh_forced_errors_drawn: statsToSave.bh_forced_errors_drawn,
                    net_approaches: statsToSave.net_approaches,
                    net_points_won: statsToSave.net_points_won,
                    volley_winners: statsToSave.volley_winners,
                    volley_errors: statsToSave.volley_errors,
                    smash_winners: statsToSave.smash_winners,
                    smash_errors: statsToSave.smash_errors,
                };

                const tacticalStatsData = {
                    set_id: prevSetId,
                    match_player_id: prevMatchPlayerId,
                    game_deuce_played: statsToSave.game_deuce_played,
                    game_deuce_won: statsToSave.game_deuce_won,
                    bp_saved: statsToSave.bp_saved,
                    bp_faced: statsToSave.bp_faced,
                    game_from_40_0_lost: statsToSave.game_from_40_0_lost,
                    deep_shots: statsToSave.deep_shots,
                    mid_court_shots: statsToSave.mid_court_shots,
                    short_balls_given: statsToSave.short_balls_given,
                    shots_to_opponent_bh: statsToSave.shots_to_opponent_bh,
                    shots_to_opponent_fh: statsToSave.shots_to_opponent_fh,
                };

                const pmStatsData = {
                    set_id: prevSetId,
                    match_player_id: prevMatchPlayerId,
                    speed_rating: statsToSave.speed_rating,
                    recovery_rating: statsToSave.recovery_rating,
                    fatigue_errors: statsToSave.fatigue_errors,
                    confidence_rating: statsToSave.confidence_rating,
                    emotion_control: statsToSave.emotion_control,
                    focus_rating: statsToSave.focus_rating,
                    tactical_adjustment: statsToSave.tactical_adjustment,
                    coach_notes: statsToSave.coach_notes,
                };

                // Save silently in the background
                Promise.all([
                    (supabase.from('set_player_tech_stats') as any).upsert(techStatsData, { onConflict: 'set_id,match_player_id' }),
                    (supabase.from('set_player_tactical_stats') as any).upsert(tacticalStatsData, { onConflict: 'set_id,match_player_id' }),
                    (supabase.from('set_player_physical_mental_stats') as any).upsert(pmStatsData, { onConflict: 'set_id,match_player_id' }),
                ])
                    .then(() => {
                        console.log('Auto-save successful');
                    })
                    .catch(error => {
                        console.error('Auto-save error:', error);
                    });
            }
        }

        // Update ref to current player
        prevPlayerRef.current = { setId, matchPlayerId };
    }, [setId, matchPlayerId, state]);


    /**
     * Increment an event counter
     */
    const incrementEvent = useCallback((eventKey: keyof EventCounters) => {
        setState(prev => ({
            ...prev,
            eventCounters: {
                ...prev.eventCounters,
                [eventKey]: prev.eventCounters[eventKey] + 1,
            },
        }));
    }, []);

    /**
     * Decrement an event counter (minimum 0)
     */
    const decrementEvent = useCallback((eventKey: keyof EventCounters) => {
        setState(prev => ({
            ...prev,
            eventCounters: {
                ...prev.eventCounters,
                [eventKey]: Math.max(0, prev.eventCounters[eventKey] - 1),
            },
        }));
    }, []);

    /**
     * Update detailed stats
     */
    const updateDetailedStats = useCallback((stats: Partial<DetailedStats>) => {
        setState(prev => ({
            ...prev,
            detailedStats: { ...prev.detailedStats, ...stats },
        }));
    }, []);

    /**
     * Derive detailed stats from Event Counters
     */
    const deriveDetailedStats = useCallback(() => {
        setState(prev => {
            const mergedWithEvents = mergeEventCounters(prev.eventCounters, prev.detailedStats);

            return {
                ...prev,
                detailedStats: {
                    ...prev.detailedStats,
                    ...mergedWithEvents,
                },
            };
        });
    }, []);


    /**
     * Save detailed stats to database
     */
    const saveDetailedStatsMutation = useMutation({
        mutationFn: async () => {
            if (!setId || !matchPlayerId) throw new Error('Set and player must be selected');

            // Capture current state values at mutation time
            const currentStats = state.detailedStats;
            const currentEventCounters = state.eventCounters;

            // Merge event counters into stats before saving
            const statsToSave: DetailedStats = {
                ...currentStats,
                // Update from event counters
                fh_winners: currentEventCounters.fhWinners,
                bh_winners: currentEventCounters.bhWinners,
                fh_unforced_errors: currentEventCounters.fhUnforcedErrors,
                bh_unforced_errors: currentEventCounters.bhUnforcedErrors,
                aces: currentEventCounters.aces,
                double_faults: currentEventCounters.doubleFaults,
                long_rallies_won: currentEventCounters.longRalliesWon,
                long_rallies_lost: currentEventCounters.longRalliesLost,
                volley_winners: currentEventCounters.volleyWinners,
                volley_errors: currentEventCounters.volleyErrors,
            };

            setState(prev => ({ ...prev, isSaving: true }));

            // Prepare data for each table
            const techStatsData = {
                set_id: setId,
                match_player_id: matchPlayerId,
                first_serve_in: statsToSave.first_serve_in,
                first_serve_total: statsToSave.first_serve_total,
                first_serve_points_won: statsToSave.first_serve_points_won,
                second_serve_in: statsToSave.second_serve_in,
                second_serve_total: statsToSave.second_serve_total,
                second_serve_points_won: statsToSave.second_serve_points_won,
                aces: statsToSave.aces,
                double_faults: statsToSave.double_faults,
                serve_plus1_points_won: statsToSave.serve_plus1_points_won,
                returns_in: statsToSave.returns_in,
                returns_total: statsToSave.returns_total,
                deep_returns: statsToSave.deep_returns,
                return_winners: statsToSave.return_winners,
                return_unforced_errors: statsToSave.return_unforced_errors,
                breaks_won: statsToSave.breaks_won,
                break_points_won: statsToSave.break_points_won,
                break_points_total: statsToSave.break_points_total,
                avg_rally_length: statsToSave.avg_rally_length,
                long_rallies_won: statsToSave.long_rallies_won,
                long_rallies_lost: statsToSave.long_rallies_lost,
                attacking_points_played: statsToSave.attacking_points_played,
                attacking_points_won: statsToSave.attacking_points_won,
                defensive_points_played: statsToSave.defensive_points_played,
                defensive_points_won: statsToSave.defensive_points_won,
                fh_winners: statsToSave.fh_winners,
                fh_unforced_errors: statsToSave.fh_unforced_errors,
                fh_forced_errors_drawn: statsToSave.fh_forced_errors_drawn,
                bh_winners: statsToSave.bh_winners,
                bh_unforced_errors: statsToSave.bh_unforced_errors,
                bh_forced_errors_drawn: statsToSave.bh_forced_errors_drawn,
                net_approaches: statsToSave.net_approaches,
                net_points_won: statsToSave.net_points_won,
                volley_winners: statsToSave.volley_winners,
                volley_errors: statsToSave.volley_errors,
                smash_winners: statsToSave.smash_winners,
                smash_errors: statsToSave.smash_errors,
            };

            const tacticalStatsData = {
                set_id: setId,
                match_player_id: matchPlayerId,
                game_deuce_played: statsToSave.game_deuce_played,
                game_deuce_won: statsToSave.game_deuce_won,
                bp_saved: statsToSave.bp_saved,
                bp_faced: statsToSave.bp_faced,
                game_from_40_0_lost: statsToSave.game_from_40_0_lost,
                deep_shots: statsToSave.deep_shots,
                mid_court_shots: statsToSave.mid_court_shots,
                short_balls_given: statsToSave.short_balls_given,
                shots_to_opponent_bh: statsToSave.shots_to_opponent_bh,
                shots_to_opponent_fh: statsToSave.shots_to_opponent_fh,
            };

            // Prepare coach_notes with Quick KPIs embedded
            const kpiJson = JSON.stringify(state.quickKPIs);
            const existingNotes = statsToSave.coach_notes || '';
            // Remove old KPI line if exists
            const notesWithoutKPIs = existingNotes.split('\n').filter(line => !line.startsWith('QUICK_KPIs:')).join('\n');
            const coachNotesWithKPIs = `QUICK_KPIs:${kpiJson}\n${notesWithoutKPIs}`.trim();

            const pmStatsData = {
                set_id: setId,
                match_player_id: matchPlayerId,
                speed_rating: statsToSave.speed_rating,
                recovery_rating: statsToSave.recovery_rating,
                fatigue_errors: statsToSave.fatigue_errors,
                confidence_rating: statsToSave.confidence_rating,
                emotion_control: statsToSave.emotion_control,
                focus_rating: statsToSave.focus_rating,
                tactical_adjustment: statsToSave.tactical_adjustment,
                coach_notes: coachNotesWithKPIs,
            };

            // Upsert to all three tables
            const [techResult, tacticalResult, pmResult] = await Promise.all([
                (supabase
                    .from('set_player_tech_stats') as any)
                    .upsert(techStatsData, {
                        onConflict: 'set_id,match_player_id',
                    }),
                (supabase
                    .from('set_player_tactical_stats') as any)
                    .upsert(tacticalStatsData, {
                        onConflict: 'set_id,match_player_id',
                    }),
                (supabase
                    .from('set_player_physical_mental_stats') as any)
                    .upsert(pmStatsData, {
                        onConflict: 'set_id,match_player_id',
                    }),
            ]);

            if (techResult.error) throw techResult.error;
            if (tacticalResult.error) throw tacticalResult.error;
            if (pmResult.error) throw pmResult.error;

            return { success: true };
        },
        onSuccess: () => {
            setState(prev => ({ ...prev, isSaving: false, lastSaved: new Date() }));
            queryClient.invalidateQueries({ queryKey: ['matches'] });
            queryClient.invalidateQueries({ queryKey: ['liveMatch'] });
        },
        onError: (error) => {
            console.error('Error saving stats:', error);
            setState(prev => ({ ...prev, isSaving: false }));
        },
    });

    return {
        state,
        incrementEvent,
        decrementEvent,
        updateDetailedStats,
        deriveDetailedStats,
        saveDetailedStats: saveDetailedStatsMutation.mutate,
        isLoadingStats: state.isLoading,
        isSavingStats: state.isSaving || saveDetailedStatsMutation.isPending,
    };
}
