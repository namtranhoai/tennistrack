import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { LiveMatchDetails, SetWithStatus } from '../types/live';
import { useTeamId } from './useTeamId';
import { computeSetStatus } from '../lib/spInputHelpers';

/**
 * Hook to fetch a single match with all details for live tracking
 */
export function useLiveMatch(matchId: number) {
    const teamId = useTeamId();

    return useQuery<LiveMatchDetails>({
        queryKey: ['liveMatch', matchId, teamId],
        queryFn: async () => {
            if (!teamId) throw new Error('No team membership found');

            const { data, error } = await supabase
                .from('matches')
                .select(`
          *,
          match_players (
            *,
            players:player_id (
              full_name,
              avatar_url
            )
          ),
          sets (*)
        `)
                .eq('match_id', matchId)
                .eq('team_id', teamId)
                .single();

            if (error) throw error;

            // Compute status for each set
            const matchData = data as any;
            const setsWithStatus: SetWithStatus[] = (matchData.sets || []).map((set: any) => ({
                ...set,
                status: computeSetStatus(set),
            }));

            return {
                ...matchData,
                sets: setsWithStatus,
            } as LiveMatchDetails;
        },
        enabled: !!matchId && !!teamId,
    });
}
