import { useQuery } from '@tanstack/react-query';
import { useMatch } from './useMatches';

export interface PlayerStats {
    // Serve stats
    aces: number;
    doubleFaults: number;
    firstServePercentage: number;
    firstServePointsWon: number;
    secondServePointsWon: number;

    // Groundstrokes
    forehandWinners: number;
    forehandErrors: number;
    backhandWinners: number;
    backhandErrors: number;

    // Net play
    netPointsWon: number;
    volleyWinners: number;

    // Return
    returnWinners: number;
    breakPointsWon: number;
    breakPointsTotal: number;

    // Rally
    avgRallyLength: number;
    longRalliesWon: number;
    longRalliesLost: number;

    // Physical/Mental
    speedRating: number;
    recoveryRating: number;
    confidenceRating: number;
    focusRating: number;
}

export interface PlayerInfo {
    name: string;
    role: 'player' | 'partner' | 'opponent_1' | 'opponent_2';
    stats?: PlayerStats;
}

export interface MatchComparisonData {
    matchId: number;
    matchType: 'singles' | 'doubles';
    matchDate: string | null;
    location: string | null;
    surface: string | null;
    finalResult: string | null;
    scoreLine: string | null;

    // Players
    players: PlayerInfo[];
}

export function useMatchComparison(matchId: number) {
    const { data: match, isLoading: matchLoading } = useMatch(matchId);

    return useQuery<MatchComparisonData>({
        queryKey: ['match-comparison', matchId],
        queryFn: async () => {
            if (!match) throw new Error('Match not found');

            const isDoubles = match.format === 'doubles';

            // Aggregate stats for a specific player
            const aggregateStats = (playerId: number | null): PlayerStats | undefined => {
                if (!playerId) return undefined;

                const sets = match.sets || [];
                let hasStats = false;

                let totalAces = 0;
                let totalDoubleFaults = 0;
                let totalFirstServeIn = 0;
                let totalFirstServeTotal = 0;
                let totalFirstServePointsWon = 0;
                let totalSecondServePointsWon = 0;

                let totalFhWinners = 0;
                let totalFhErrors = 0;
                let totalBhWinners = 0;
                let totalBhErrors = 0;

                let totalNetPointsWon = 0;
                let totalVolleyWinners = 0;

                let totalReturnWinners = 0;
                let totalBreakPointsWon = 0;
                let totalBreakPointsTotal = 0;

                let totalRallyLength = 0;
                let rallyCount = 0;
                let totalLongRalliesWon = 0;
                let totalLongRalliesLost = 0;

                let totalSpeedRating = 0;
                let totalRecoveryRating = 0;
                let totalConfidenceRating = 0;
                let totalFocusRating = 0;
                let ratingCount = 0;

                sets.forEach(set => {
                    // Filter stats by match_player_id
                    const techStats = set.set_player_tech_stats?.find(s => s.match_player_id === playerId);
                    const pmStats = set.set_player_physical_mental_stats?.find(s => s.match_player_id === playerId);

                    if (techStats) {
                        hasStats = true;
                        totalAces += techStats.aces || 0;
                        totalDoubleFaults += techStats.double_faults || 0;
                        totalFirstServeIn += techStats.first_serve_in || 0;
                        totalFirstServeTotal += techStats.first_serve_total || 0;
                        totalFirstServePointsWon += techStats.first_serve_points_won || 0;
                        totalSecondServePointsWon += techStats.second_serve_points_won || 0;

                        totalFhWinners += techStats.fh_winners || 0;
                        totalFhErrors += techStats.fh_unforced_errors || 0;
                        totalBhWinners += techStats.bh_winners || 0;
                        totalBhErrors += techStats.bh_unforced_errors || 0;

                        totalNetPointsWon += techStats.net_points_won || 0;
                        totalVolleyWinners += techStats.volley_winners || 0;

                        totalReturnWinners += techStats.return_winners || 0;
                        totalBreakPointsWon += techStats.break_points_won || 0;
                        totalBreakPointsTotal += techStats.break_points_total || 0;

                        if (techStats.avg_rally_length) {
                            totalRallyLength += techStats.avg_rally_length;
                            rallyCount++;
                        }
                        totalLongRalliesWon += techStats.long_rallies_won || 0;
                        totalLongRalliesLost += techStats.long_rallies_lost || 0;
                    }

                    if (pmStats) {
                        hasStats = true;
                        totalSpeedRating += pmStats.speed_rating || 0;
                        totalRecoveryRating += pmStats.recovery_rating || 0;
                        totalConfidenceRating += pmStats.confidence_rating || 0;
                        totalFocusRating += pmStats.focus_rating || 0;
                        ratingCount++;
                    }
                });

                if (!hasStats) return undefined;

                return {
                    aces: totalAces,
                    doubleFaults: totalDoubleFaults,
                    firstServePercentage: totalFirstServeTotal > 0
                        ? Math.round((totalFirstServeIn / totalFirstServeTotal) * 100)
                        : 0,
                    firstServePointsWon: totalFirstServePointsWon,
                    secondServePointsWon: totalSecondServePointsWon,

                    forehandWinners: totalFhWinners,
                    forehandErrors: totalFhErrors,
                    backhandWinners: totalBhWinners,
                    backhandErrors: totalBhErrors,

                    netPointsWon: totalNetPointsWon,
                    volleyWinners: totalVolleyWinners,

                    returnWinners: totalReturnWinners,
                    breakPointsWon: totalBreakPointsWon,
                    breakPointsTotal: totalBreakPointsTotal,

                    avgRallyLength: rallyCount > 0 ? Math.round(totalRallyLength / rallyCount) : 0,
                    longRalliesWon: totalLongRalliesWon,
                    longRalliesLost: totalLongRalliesLost,

                    speedRating: ratingCount > 0 ? Math.round(totalSpeedRating / ratingCount) : 0,
                    recoveryRating: ratingCount > 0 ? Math.round(totalRecoveryRating / ratingCount) : 0,
                    confidenceRating: ratingCount > 0 ? Math.round(totalConfidenceRating / ratingCount) : 0,
                    focusRating: ratingCount > 0 ? Math.round(totalFocusRating / ratingCount) : 0,
                };
            };

            // Build players array from match_players
            const players: PlayerInfo[] = [];

            if (match.match_players && match.match_players.length > 0) {
                // Use new schema
                match.match_players.forEach(mp => {
                    players.push({
                        name: mp.display_name,
                        role: mp.role as any,
                        stats: aggregateStats(mp.match_player_id),
                    });
                });
            }

            return {
                matchId: match.match_id,
                matchType: isDoubles ? 'doubles' : 'singles',
                matchDate: match.match_date,
                location: match.location,
                surface: match.surface,
                finalResult: match.final_result,
                scoreLine: match.score_line,
                players,
            };
        },
        enabled: !!match && !matchLoading,
    });
}
