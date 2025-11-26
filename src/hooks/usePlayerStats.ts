import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { MatchWithPlayer, SetRow, SetTechStatsRow } from '../types/extended';

export type DateRange = '1month' | '3months' | '6months' | '1year' | 'all';

interface PlayerStats {
    totalMatches: number;
    wins: number;
    losses: number;
    winRate: number;
    matchesBySurface: {
        [surface: string]: {
            wins: number;
            losses: number;
            total: number;
            winRate: number;
        };
    };
    matchesByType: {
        singles: { wins: number; losses: number; total: number };
        doubles: { wins: number; losses: number; total: number };
    };
    technicalStats: {
        avgFirstServePercentage: number;
        avgAcesPerMatch: number;
        avgDoubleFaultsPerMatch: number;
        avgWinnersPerMatch: number;
        avgUnforcedErrorsPerMatch: number;
        avgNetSuccessRate: number;
    };
    monthlyTrends: {
        month: string;
        wins: number;
        losses: number;
        winRate: number;
        firstServePercentage: number;
        unforcedErrors: number;
    }[];
    recentMatches: MatchWithPlayer[];
}

function getDateRangeFilter(dateRange: DateRange): string | null {
    const now = new Date();
    let startDate: Date;

    switch (dateRange) {
        case '1month':
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
        case '3months':
            startDate = new Date(now.setMonth(now.getMonth() - 3));
            break;
        case '6months':
            startDate = new Date(now.setMonth(now.getMonth() - 6));
            break;
        case '1year':
            startDate = new Date(now.setFullYear(now.getFullYear() - 1));
            break;
        case 'all':
            return null;
    }

    return startDate.toISOString().split('T')[0];
}

export function usePlayerStats(playerId: number, dateRange: DateRange = '6months') {
    return useQuery<PlayerStats>({
        queryKey: ['playerStats', playerId, dateRange],
        queryFn: async () => {
            const startDate = getDateRangeFilter(dateRange);

            // Fetch matches with sets and tech stats
            let query = supabase
                .from('matches')
                .select(`
                    *,
                    match_players!inner(
                        *,
                        players(
                            full_name,
                            avatar_url
                        )
                    ),
                    sets (
                        *,
                        set_player_tech_stats (*)
                    )
                `)
                .eq('match_players.player_id', playerId)
                .order('match_date', { ascending: false });

            if (startDate) {
                query = query.gte('match_date', startDate);
            }

            const { data: matches, error } = await query;

            if (error) throw error;

            const matchesData = (matches || []) as unknown as (MatchWithPlayer & {
                sets: (SetRow & { set_player_tech_stats: SetTechStatsRow[] })[];
            })[];

            // Calculate statistics
            const stats: PlayerStats = {
                totalMatches: matchesData.length,
                wins: 0,
                losses: 0,
                winRate: 0,
                matchesBySurface: {},
                matchesByType: {
                    singles: { wins: 0, losses: 0, total: 0 },
                    doubles: { wins: 0, losses: 0, total: 0 },
                },
                technicalStats: {
                    avgFirstServePercentage: 0,
                    avgAcesPerMatch: 0,
                    avgDoubleFaultsPerMatch: 0,
                    avgWinnersPerMatch: 0,
                    avgUnforcedErrorsPerMatch: 0,
                    avgNetSuccessRate: 0,
                },
                monthlyTrends: [],
                recentMatches: matchesData.slice(0, 10) as MatchWithPlayer[],
            };

            if (matchesData.length === 0) {
                return stats;
            }

            // Aggregate by month for trends
            const monthlyData: {
                [key: string]: {
                    wins: number;
                    losses: number;
                    firstServeIn: number;
                    firstServeTotal: number;
                    unforcedErrors: number;
                    matchCount: number;
                };
            } = {};

            let totalFirstServeIn = 0;
            let totalFirstServeAttempts = 0;
            let totalAces = 0;
            let totalDoubleFaults = 0;
            let totalWinners = 0;
            let totalUnforcedErrors = 0;
            let totalNetPointsWon = 0;
            let totalNetApproaches = 0;

            matchesData.forEach((match) => {
                const isWin = match.final_result === 'win';

                // Win/Loss
                if (isWin) {
                    stats.wins++;
                } else {
                    stats.losses++;
                }

                // By Surface
                const surface = match.surface || 'Unknown';
                if (!stats.matchesBySurface[surface]) {
                    stats.matchesBySurface[surface] = { wins: 0, losses: 0, total: 0, winRate: 0 };
                }
                stats.matchesBySurface[surface].total++;
                if (isWin) {
                    stats.matchesBySurface[surface].wins++;
                } else {
                    stats.matchesBySurface[surface].losses++;
                }

                // By Type
                const matchType = match.format === 'doubles' ? 'doubles' : 'singles';
                stats.matchesByType[matchType].total++;
                if (isWin) {
                    stats.matchesByType[matchType].wins++;
                } else {
                    stats.matchesByType[matchType].losses++;
                }

                // Monthly trends
                if (match.match_date) {
                    const monthKey = match.match_date.substring(0, 7); // YYYY-MM
                    if (!monthlyData[monthKey]) {
                        monthlyData[monthKey] = {
                            wins: 0,
                            losses: 0,
                            firstServeIn: 0,
                            firstServeTotal: 0,
                            unforcedErrors: 0,
                            matchCount: 0,
                        };
                    }
                    monthlyData[monthKey].matchCount++;
                    if (isWin) {
                        monthlyData[monthKey].wins++;
                    } else {
                        monthlyData[monthKey].losses++;
                    }
                }

                // Technical stats from sets
                match.sets?.forEach((set) => {
                    set.set_player_tech_stats?.forEach((techStats) => {
                        if (techStats.first_serve_in !== null && techStats.first_serve_total !== null) {
                            totalFirstServeIn += techStats.first_serve_in;
                            totalFirstServeAttempts += techStats.first_serve_total;

                            if (match.match_date) {
                                const monthKey = match.match_date.substring(0, 7);
                                if (monthlyData[monthKey]) {
                                    monthlyData[monthKey].firstServeIn += techStats.first_serve_in;
                                    monthlyData[monthKey].firstServeTotal += techStats.first_serve_total;
                                }
                            }
                        }
                        if (techStats.aces !== null) totalAces += techStats.aces;
                        if (techStats.double_faults !== null) totalDoubleFaults += techStats.double_faults;

                        const winners = (techStats.fh_winners || 0) + (techStats.bh_winners || 0) +
                            (techStats.volley_winners || 0) + (techStats.smash_winners || 0);
                        totalWinners += winners;

                        const unforcedErrors = (techStats.fh_unforced_errors || 0) +
                            (techStats.bh_unforced_errors || 0) +
                            (techStats.volley_errors || 0) +
                            (techStats.smash_errors || 0);
                        totalUnforcedErrors += unforcedErrors;

                        if (match.match_date) {
                            const monthKey = match.match_date.substring(0, 7);
                            if (monthlyData[monthKey]) {
                                monthlyData[monthKey].unforcedErrors += unforcedErrors;
                            }
                        }

                        if (techStats.net_points_won !== null) totalNetPointsWon += techStats.net_points_won;
                        if (techStats.net_approaches !== null) totalNetApproaches += techStats.net_approaches;
                    });
                });
            });

            // Calculate win rate
            stats.winRate = stats.totalMatches > 0 ? (stats.wins / stats.totalMatches) * 100 : 0;

            // Calculate surface win rates
            Object.keys(stats.matchesBySurface).forEach((surface) => {
                const surfaceStats = stats.matchesBySurface[surface];
                surfaceStats.winRate = surfaceStats.total > 0
                    ? (surfaceStats.wins / surfaceStats.total) * 100
                    : 0;
            });

            // Calculate technical averages
            stats.technicalStats.avgFirstServePercentage =
                totalFirstServeAttempts > 0 ? (totalFirstServeIn / totalFirstServeAttempts) * 100 : 0;
            stats.technicalStats.avgAcesPerMatch =
                stats.totalMatches > 0 ? totalAces / stats.totalMatches : 0;
            stats.technicalStats.avgDoubleFaultsPerMatch =
                stats.totalMatches > 0 ? totalDoubleFaults / stats.totalMatches : 0;
            stats.technicalStats.avgWinnersPerMatch =
                stats.totalMatches > 0 ? totalWinners / stats.totalMatches : 0;
            stats.technicalStats.avgUnforcedErrorsPerMatch =
                stats.totalMatches > 0 ? totalUnforcedErrors / stats.totalMatches : 0;
            stats.technicalStats.avgNetSuccessRate =
                totalNetApproaches > 0 ? (totalNetPointsWon / totalNetApproaches) * 100 : 0;

            // Build monthly trends
            stats.monthlyTrends = Object.entries(monthlyData)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([month, data]) => ({
                    month,
                    wins: data.wins,
                    losses: data.losses,
                    winRate: data.matchCount > 0 ? (data.wins / data.matchCount) * 100 : 0,
                    firstServePercentage: data.firstServeTotal > 0
                        ? (data.firstServeIn / data.firstServeTotal) * 100
                        : 0,
                    unforcedErrors: data.matchCount > 0 ? data.unforcedErrors / data.matchCount : 0,
                }));

            return stats;
        },
        enabled: !!playerId,
    });
}
