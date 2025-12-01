import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { LiveMatch } from '../types/live';
import { useTeamId } from './useTeamId';

/**
 * Hook to fetch matches that are currently live or scheduled
 * (status = 'in_progress' or 'scheduled')
 */
export function useLiveMatches() {
    const teamId = useTeamId();

    return useQuery<LiveMatch[]>({
        queryKey: ['liveMatches', teamId],
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
          )
        `)
                .eq('team_id', teamId)
                .in('status', ['in_progress', 'scheduled'])
                .order('match_date', { ascending: false });

            if (error) throw error;
            return data as unknown as LiveMatch[];
        },
        enabled: !!teamId,
    });
}
