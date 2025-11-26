import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { MatchWithPlayer } from '../types/extended';

interface DashboardStats {
    totalPlayers: number;
    totalMatches: number;
    wins: number;
    losses: number;
    winRate: number;
    matchesByType: {
        singles: number;
        doubles: number;
    };
    matchesBySurface: {
        [surface: string]: {
            total: number;
            wins: number;
            losses: number;
            winRate: number;
        };
    };
    topPlayers: {
        player_id: number;
        full_name: string;
        avatar_url: string | null;
        totalMatches: number;
        wins: number;
        losses: number;
        winRate: number;
    }[];
    recentMatches: MatchWithPlayer[];
    newPlayersThisMonth: number;
}

export function useDashboardStats() {
    return useQuery<DashboardStats>({
        queryKey: ['dashboardStats'],
        queryFn: async () => {
            // Fetch all players (for total count)
            const { data: players, error: playersError } = await supabase
                .from('players')
                .select('player_id, full_name, avatar_url');

            if (playersError) throw playersError;

            // Fetch all matches with player info
            const { data: matches, error: matchesError } = await supabase
                .from('matches')
                .select(`
                    *,
                    match_players (
                        *,
                        players:player_id (
                            full_name,
                            avatar_url
                        )
                    )
                `)
                .order('match_date', { ascending: false });

            if (matchesError) throw matchesError;

            const matchesData = (matches || []) as unknown as MatchWithPlayer[];
            const playersData = players || [];

            // Calculate new players this month
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            const newPlayersThisMonth = playersData.filter(() => {
                // Note: This assumes there's a created_at field, if not available will return 0
                return false; // Placeholder since we don't have created_at in players table
            }).length;

            // Calculate overall stats
            const totalMatches = matchesData.length;
            const wins = matchesData.filter(m => m.final_result === 'win').length;
            const losses = matchesData.filter(m => m.final_result === 'loss').length;
            const winRate = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;

            // Calculate matches by type
            const matchesByType = {
                singles: matchesData.filter(m => m.format === 'singles').length,
                doubles: matchesData.filter(m => m.format === 'doubles').length,
            };

            // Calculate matches by surface
            const matchesBySurface: DashboardStats['matchesBySurface'] = {};
            matchesData.forEach(match => {
                const surface = match.surface || 'Unknown';
                if (!matchesBySurface[surface]) {
                    matchesBySurface[surface] = { total: 0, wins: 0, losses: 0, winRate: 0 };
                }
                matchesBySurface[surface].total++;
                if (match.final_result === 'win') {
                    matchesBySurface[surface].wins++;
                } else if (match.final_result === 'loss') {
                    matchesBySurface[surface].losses++;
                }
            });

            // Calculate win rates for surfaces
            Object.keys(matchesBySurface).forEach(surface => {
                const stats = matchesBySurface[surface];
                stats.winRate = stats.total > 0 ? (stats.wins / stats.total) * 100 : 0;
            });

            // Calculate top players (players with most wins and good win rate, minimum 3 matches)
            const playerStatsMap = new Map<number, {
                player_id: number;
                full_name: string;
                avatar_url: string | null;
                totalMatches: number;
                wins: number;
                losses: number;
            }>();

            matchesData.forEach(match => {
                // Get tracked players from match_players
                const trackedPlayers = match.match_players?.filter((mp: any) => mp.is_tracked && mp.player_id) || [];

                trackedPlayers.forEach((mp: any) => {
                    if (!mp.player_id) return;

                    if (!playerStatsMap.has(mp.player_id)) {
                        playerStatsMap.set(mp.player_id, {
                            player_id: mp.player_id,
                            full_name: mp.players?.full_name || mp.display_name,
                            avatar_url: mp.players?.avatar_url || null,
                            totalMatches: 0,
                            wins: 0,
                            losses: 0,
                        });
                    }

                    const playerStats = playerStatsMap.get(mp.player_id)!;
                    playerStats.totalMatches++;
                    if (match.final_result === 'win') {
                        playerStats.wins++;
                    } else if (match.final_result === 'loss') {
                        playerStats.losses++;
                    }
                });
            });

            // Convert to array and calculate win rates
            const topPlayers = Array.from(playerStatsMap.values())
                .filter(p => p.totalMatches >= 3) // Minimum 3 matches
                .map(p => ({
                    ...p,
                    winRate: p.totalMatches > 0 ? (p.wins / p.totalMatches) * 100 : 0,
                }))
                .sort((a, b) => {
                    // Sort by win rate, then by total matches
                    if (b.winRate !== a.winRate) {
                        return b.winRate - a.winRate;
                    }
                    return b.totalMatches - a.totalMatches;
                })
                .slice(0, 5); // Top 5 players

            const stats: DashboardStats = {
                totalPlayers: playersData.length,
                totalMatches,
                wins,
                losses,
                winRate,
                matchesByType,
                matchesBySurface,
                topPlayers,
                recentMatches: matchesData.slice(0, 10),
                newPlayersThisMonth,
            };

            return stats;
        },
    });
}
