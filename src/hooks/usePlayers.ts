import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { Database } from '../types/db';
import { useTeamId } from './useTeamId';

type Player = Database['public']['Tables']['players']['Row'];
type PlayerInsert = Database['public']['Tables']['players']['Insert'];
type PlayerUpdate = Database['public']['Tables']['players']['Update'];

export function usePlayers() {
    const teamId = useTeamId();

    return useQuery<Player[]>({
        queryKey: ['players', teamId],
        queryFn: async () => {
            if (!teamId) throw new Error('No team membership found');

            const { data, error } = await supabase
                .from('players')
                .select('*')
                .eq('team_id', teamId)
                .order('full_name');

            if (error) throw error;
            return data as Player[];
        },
        enabled: !!teamId,
    });
}

export function usePlayer(id: number) {
    const teamId = useTeamId();

    return useQuery<Player>({
        queryKey: ['players', id, teamId],
        queryFn: async () => {
            if (!teamId) throw new Error('No team membership found');

            const { data, error } = await supabase
                .from('players')
                .select('*')
                .eq('player_id', id)
                .eq('team_id', teamId)
                .single();

            if (error) throw error;
            return data as Player;
        },
        enabled: !!id && !!teamId,
    });
}

export function useCreatePlayer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newPlayer: PlayerInsert) => {
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

            // Include team_id in the player data
            const playerWithTeam: PlayerInsert = {
                ...newPlayer,
                team_id: membership.team_id,
            };

            const { data, error } = await ((supabase as any)
                .from('players')
                .insert(playerWithTeam) as any)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['players'] });
        },
    });
}

export function useUpdatePlayer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, updates }: { id: number; updates: PlayerUpdate }) => {
            // Verify player belongs to user's team
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data: membership } = await supabase
                .from('team_members')
                .select('team_id')
                .eq('user_id', user.id)
                .eq('status', 'approved')
                .single() as { data: { team_id: string } | null };

            if (!membership) throw new Error('No approved team membership found');

            const { data, error } = await ((supabase as any)
                .from('players')
                .update(updates) as any)
                .eq('player_id', id)
                .eq('team_id', membership.team_id)
                .select()
                .single();

            if (error) throw error;
            return data as any;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['players'] });
            queryClient.invalidateQueries({ queryKey: ['players', data.player_id] });
        },
    });
}

export function useDeletePlayer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            // Verify player belongs to user's team
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
                .from('players')
                .delete()
                .eq('player_id', id)
                .eq('team_id', membership.team_id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['players'] });
        },
    });
}
