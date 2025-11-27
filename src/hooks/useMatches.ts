import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { Database } from '../types/db';
import { MatchWithPlayer, MatchDetails } from '../types/extended';
import { useTeamId } from './useTeamId';

type MatchInsert = Database['public']['Tables']['matches']['Insert'];
type SetInsert = Database['public']['Tables']['sets']['Insert'];
type SetTechStatsInsert = Database['public']['Tables']['set_player_tech_stats']['Insert'];
type SetTacticalStatsInsert = Database['public']['Tables']['set_player_tactical_stats']['Insert'];
type SetPhysicalMentalStatsInsert = Database['public']['Tables']['set_player_physical_mental_stats']['Insert'];

export function useMatches() {
    const teamId = useTeamId();

    return useQuery<MatchWithPlayer[]>({
        queryKey: ['matches', teamId],
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
                .order('match_date', { ascending: false });

            if (error) throw error;
            return data as unknown as MatchWithPlayer[];
        },
        enabled: !!teamId,
    });
}

export function useMatch(id: number) {
    const teamId = useTeamId();

    return useQuery<MatchDetails>({
        queryKey: ['matches', id, teamId],
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
          sets (
            *,
            set_player_tech_stats (*),
            set_player_tactical_stats (*),
            set_player_physical_mental_stats (*)
          )
        `)
                .eq('match_id', id)
                .eq('team_id', teamId)
                .single();

            if (error) throw error;
            return data as unknown as MatchDetails;
        },
        enabled: !!id && !!teamId,
    });
}

export function usePlayerMatches(playerId: number) {
    const teamId = useTeamId();

    return useQuery<any[]>({
        queryKey: ['matches', 'player', playerId, teamId],
        queryFn: async () => {
            if (!teamId) throw new Error('No team membership found');

            const { data, error } = await supabase
                .from('matches')
                .select(`
                    *,
                    match_players!inner(
                        *,
                        players:player_id (
                            full_name,
                            avatar_url
                        )
                    )
                `)
                .eq('match_players.player_id', playerId)
                .eq('team_id', teamId)
                .order('match_date', { ascending: false });

            if (error) throw error;
            return data;
        },
        enabled: !!playerId && !!teamId,
    });
}

interface CreateMatchParams {
    match: MatchInsert;
    players: Database['public']['Tables']['match_players']['Insert'][];
    sets: {
        set: Omit<SetInsert, 'match_id'>;
        techStats?: Omit<SetTechStatsInsert, 'set_id'>[];
        tacticalStats?: Omit<SetTacticalStatsInsert, 'set_id'>[];
        pmStats?: Omit<SetPhysicalMentalStatsInsert, 'set_id'>[];
    }[];
}

export function useCreateMatch() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ match, players, sets }: CreateMatchParams) => {
            // Get current user's team_id
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data: membership, error: membershipError } = await supabase
                .from('team_members')
                .select('team_id')
                .eq('user_id', user.id)
                .eq('status', 'approved')
                .single() as { data: { team_id: string } | null; error: any };

            if (membershipError || !membership) throw new Error('No approved team membership found');

            // 1. Create Match with team_id
            // Ensure match_id is not included in the insert (it should be auto-generated)
            console.log('Original match object:', match);
            const { match_id, ...matchWithoutId } = match as any;
            console.log('Match object after removing match_id:', matchWithoutId);
            console.log('Removed match_id:', match_id);

            // Include team_id in the match data
            const matchWithTeam: MatchInsert = {
                ...matchWithoutId,
                team_id: membership.team_id,
            };

            const { data, error: matchError } = await ((supabase as any)
                .from('matches')
                .insert(matchWithTeam) as any)
                .select()
                .single();

            if (matchError) {
                console.error('Match insert error:', matchError);
                throw matchError;
            }
            const matchData = data as any;

            // 2. Create Match Players
            if (players && players.length > 0) {
                const playersToInsert = players.map(p => ({ ...p, match_id: matchData.match_id }));
                const { error: playersError } = await (supabase
                    .from('match_players')
                    .insert(playersToInsert as any) as any);

                if (playersError) throw playersError;
            }

            // 3. Create Sets and Stats
            for (const setItem of sets) {
                const { data: setDataRaw, error: setError } = await ((supabase as any)
                    .from('sets')
                    .insert({ ...setItem.set, match_id: matchData.match_id }) as any)
                    .select()
                    .single();

                if (setError) throw setError;
                const setData = setDataRaw as any;

                if (setItem.techStats && setItem.techStats.length > 0) {
                    const techStatsToInsert = setItem.techStats.map(s => ({ ...s, set_id: setData.set_id }));
                    await ((supabase as any).from('set_player_tech_stats').insert(techStatsToInsert) as any);
                }
                if (setItem.tacticalStats && setItem.tacticalStats.length > 0) {
                    const tacticalStatsToInsert = setItem.tacticalStats.map(s => ({ ...s, set_id: setData.set_id }));
                    await ((supabase as any).from('set_player_tactical_stats').insert(tacticalStatsToInsert) as any);
                }
                if (setItem.pmStats && setItem.pmStats.length > 0) {
                    const pmStatsToInsert = setItem.pmStats.map(s => ({ ...s, set_id: setData.set_id }));
                    await ((supabase as any).from('set_player_physical_mental_stats').insert(pmStatsToInsert) as any);
                }
            }

            return matchData;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['matches'] });
        },
    });
}

export function useUpdateMatch() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ matchId, updates }: { matchId: number; updates: Database['public']['Tables']['matches']['Update'] }) => {
            // Verify match belongs to user's team
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data: membership } = await supabase
                .from('team_members')
                .select('team_id')
                .eq('user_id', user.id)
                .eq('status', 'approved')
                .single() as { data: { team_id: string } | null };

            if (!membership) throw new Error('No approved team membership found');

            const { error } = await ((supabase
                .from('matches') as any)
                .update(updates)
                .eq('match_id', matchId)
                .eq('team_id', membership.team_id));

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['matches'] });
        },
    });
}

export function useDeleteMatch() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            // Verify match belongs to user's team
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data: membership } = await supabase
                .from('team_members')
                .select('team_id')
                .eq('user_id', user.id)
                .eq('status', 'approved')
                .single() as { data: { team_id: string } | null };

            if (!membership) throw new Error('No approved team membership found');

            const { error } = await supabase
                .from('matches')
                .delete()
                .eq('match_id', id)
                .eq('team_id', membership.team_id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['matches'] });
        },
    });
}
