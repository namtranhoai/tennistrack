import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { useTeamId } from './useTeamId';

interface PlayerComparisonStats {
    playerName: string;
    totalMatches: number;
    wins: number;
    losses: number;
    winRate: number;
    bySurface: {
        [surface: string]: {
            wins: number;
            losses: number;
            total: number;
            winRate: number;
        };
    };
    byType: {
        singles: { wins: number; losses: number; total: number; winRate: number };
        doubles: { wins: number; losses: number; total: number; winRate: number };
    };
    technicalStats: {
        avgFirstServePercentage: number;
        avgAcesPerMatch: number;
        avgDoubleFaultsPerMatch: number;
        avgWinnersPerMatch: number;
        avgUnforcedErrorsPerMatch: number;
        avgNetSuccessRate: number;
    };
}

interface HeadToHeadRecord {
    totalMatches: number;
    player1Wins: number;
    player2Wins: number;
    matches: {
        matchId: number;
        date: string;
        winner: number;
        score: string | null;
        surface: string;
    }[];
}

interface PlayerComparison {
    player1: PlayerComparisonStats;
    player2: PlayerComparisonStats;
    headToHead: HeadToHeadRecord;
}

export function usePlayerComparison(player1Id?: number, player2Id?: number) {
    const teamId = useTeamId();

    return useQuery<PlayerComparison>({
        queryKey: ['playerComparison', player1Id, player2Id, teamId],
        queryFn: async () => {
            if (!player1Id || !player2Id) {
                throw new Error('Both player IDs are required');
            }
            if (!teamId) {
                throw new Error('No team membership found');
            }

            // Verify both players belong to this team
            const { data: player1Data, error: player1Error } = await supabase
                .from('players')
                .select('team_id')
                .eq('player_id', player1Id)
                .single() as { data: { team_id: string } | null; error: any };

            const { data: player2Data, error: player2Error } = await supabase
                .from('players')
                .select('team_id')
                .eq('player_id', player2Id)
                .single() as { data: { team_id: string } | null; error: any };

            if (player1Error || player2Error || !player1Data || !player2Data) {
                throw new Error('Failed to verify player ownership');
            }

            if (player1Data.team_id !== teamId || player2Data.team_id !== teamId) {
                throw new Error('One or both players do not belong to your team');
            }

            // Fetch player 1 stats
            const player1Stats = await fetchPlayerStats(player1Id, teamId);

            // Fetch player 2 stats
            const player2Stats = await fetchPlayerStats(player2Id, teamId);

            // Fetch head-to-head record
            const headToHead = await fetchHeadToHead(player1Id, player2Id, teamId);

            return {
                player1: player1Stats,
                player2: player2Stats,
                headToHead,
            };
        },
        enabled: !!player1Id && !!player2Id && player1Id !== player2Id && !!teamId,
    });
}

async function fetchPlayerStats(playerId: number, teamId: string): Promise<PlayerComparisonStats> {
    // Get player name
    const { data: playerData } = await supabase
        .from('players')
        .select('full_name')
        .eq('player_id', playerId)
        .eq('team_id', teamId)
        .single();

    const player = playerData as any;

    // Get all matches for this player (filtered by team)
    const { data: matchesData } = await supabase
        .from('matches')
        .select(`
            *,
            match_players!inner(
                player_id,
                side
            )
        `)
        .eq('match_players.player_id', playerId)
        .eq('team_id', teamId);

    const matches = matchesData as any[];

    const totalMatches = matches?.length || 0;
    const wins = matches?.filter(m => m.final_result === 'win').length || 0;
    const losses = matches?.filter(m => m.final_result === 'loss').length || 0;
    const winRate = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;

    // Calculate surface stats
    const bySurface: { [surface: string]: { wins: number; losses: number; total: number; winRate: number } } = {};
    matches?.forEach(match => {
        const surface = match.surface;
        if (!bySurface[surface]) {
            bySurface[surface] = { wins: 0, losses: 0, total: 0, winRate: 0 };
        }
        bySurface[surface].total++;
        if (match.final_result === 'win') {
            bySurface[surface].wins++;
        } else if (match.final_result === 'loss') {
            bySurface[surface].losses++;
        }
    });

    // Calculate win rates for surfaces
    Object.keys(bySurface).forEach(surface => {
        const stats = bySurface[surface];
        stats.winRate = stats.total > 0 ? (stats.wins / stats.total) * 100 : 0;
    });

    // Calculate match type stats
    const singlesMatches = matches?.filter(m => m.format === 'singles') || [];
    const doublesMatches = matches?.filter(m => m.format === 'doubles') || [];

    const singlesWins = singlesMatches.filter(m => m.final_result === 'win').length;
    const doublesWins = doublesMatches.filter(m => m.final_result === 'win').length;

    const byType = {
        singles: {
            wins: singlesWins,
            losses: singlesMatches.length - singlesWins,
            total: singlesMatches.length,
            winRate: singlesMatches.length > 0 ? (singlesWins / singlesMatches.length) * 100 : 0,
        },
        doubles: {
            wins: doublesWins,
            losses: doublesMatches.length - doublesWins,
            total: doublesMatches.length,
            winRate: doublesMatches.length > 0 ? (doublesWins / doublesMatches.length) * 100 : 0,
        },
    };

    // Calculate technical stats (placeholder values - would need actual stats from database)
    const technicalStats = {
        avgFirstServePercentage: 0,
        avgAcesPerMatch: 0,
        avgDoubleFaultsPerMatch: 0,
        avgWinnersPerMatch: 0,
        avgUnforcedErrorsPerMatch: 0,
        avgNetSuccessRate: 0,
    };

    return {
        playerName: player?.full_name || 'Unknown',
        totalMatches,
        wins,
        losses,
        winRate,
        bySurface,
        byType,
        technicalStats,
    };
}

async function fetchHeadToHead(player1Id: number, player2Id: number, teamId: string): Promise<HeadToHeadRecord> {
    // Find matches where both players participated (filtered by team)
    const { data: player1MatchesData } = await supabase
        .from('match_players')
        .select('match_id')
        .eq('player_id', player1Id);

    const { data: player2MatchesData } = await supabase
        .from('match_players')
        .select('match_id')
        .eq('player_id', player2Id);

    const player1Matches = player1MatchesData as any[];
    const player2Matches = player2MatchesData as any[];

    const player1MatchIds = new Set(player1Matches?.map(m => m.match_id) || []);
    const player2MatchIds = new Set(player2Matches?.map(m => m.match_id) || []);

    // Find common matches
    const commonMatchIds = Array.from(player1MatchIds).filter(id => player2MatchIds.has(id));

    if (commonMatchIds.length === 0) {
        return {
            totalMatches: 0,
            player1Wins: 0,
            player2Wins: 0,
            matches: [],
        };
    }

    // Fetch match details (filtered by team)
    const { data: matchesData } = await supabase
        .from('matches')
        .select(`
            match_id,
            match_date,
            surface,
            score_line,
            final_result,
            match_players(player_id, side)
        `)
        .in('match_id', commonMatchIds)
        .eq('team_id', teamId)
        .order('match_date', { ascending: false });

    const matches = matchesData as any[];

    let player1Wins = 0;
    let player2Wins = 0;

    const matchRecords = matches?.map(match => {
        // Determine winner based on match_players data
        const player1Data = (match.match_players as any[])?.find((mp: any) => mp.player_id === player1Id);
        const player2Data = (match.match_players as any[])?.find((mp: any) => mp.player_id === player2Id);

        // Assume the match result corresponds to side A winning if result is 'win'
        // This is a simplification - you may need to adjust based on your data structure
        let winner = player1Id;
        if (match.final_result === 'win' && player1Data?.side === 'A') {
            winner = player1Id;
            player1Wins++;
        } else if (match.final_result === 'win' && player2Data?.side === 'A') {
            winner = player2Id;
            player2Wins++;
        } else if (match.final_result === 'loss' && player1Data?.side === 'A') {
            winner = player2Id;
            player2Wins++;
        } else {
            winner = player1Id;
            player1Wins++;
        }

        return {
            matchId: match.match_id,
            date: match.match_date,
            winner,
            score: match.score_line,
            surface: match.surface,
        };
    }) || [];

    return {
        totalMatches: commonMatchIds.length,
        player1Wins,
        player2Wins,
        matches: matchRecords,
    };
}
