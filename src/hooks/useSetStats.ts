import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { Database } from '../types/db';

type SetUpdate = Database['public']['Tables']['sets']['Update'];
type SetTechStatsUpdate = Database['public']['Tables']['set_player_tech_stats']['Update'];
type SetTacticalStatsUpdate = Database['public']['Tables']['set_player_tactical_stats']['Update'];
type SetPhysicalMentalStatsUpdate = Database['public']['Tables']['set_player_physical_mental_stats']['Update'];

// Update Set Basic Info (games won/lost, tiebreak, etc.)
export function useUpdateSetBasicInfo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ setId, data }: { setId: number; data: SetUpdate }) => {
            const { error } = await supabase
                .from('sets')
                // @ts-expect-error - Supabase generated types may have Update as never
                .update(data)
                .eq('set_id', setId);

            if (error) throw error;
        },
        onSuccess: () => {
            // Invalidate the match query to refetch all data
            queryClient.invalidateQueries({ queryKey: ['matches'] });
        },
    });
}

// Update Set Technical Stats
export function useUpdateSetTechStats() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ setId, matchPlayerId, data }: { setId: number; matchPlayerId: number; data: SetTechStatsUpdate }) => {
            if (!matchPlayerId) throw new Error('Match Player ID is required');

            // First, check if tech stats exist for this set and match_player
            const { data: existing } = await supabase
                .from('set_player_tech_stats')
                .select('set_player_tech_id')
                .eq('set_id', setId)
                .eq('match_player_id', matchPlayerId)
                .maybeSingle();

            if (existing) {
                // Update existing record
                const { error } = await supabase
                    .from('set_player_tech_stats')
                    // @ts-expect-error - Supabase generated types may have Update as never
                    .update(data)
                    .eq('set_id', setId)
                    .eq('match_player_id', matchPlayerId);

                if (error) throw error;
            } else {
                // Create new record
                const { error } = await supabase
                    .from('set_player_tech_stats')
                    .insert({ ...data, set_id: setId, match_player_id: matchPlayerId } as any);

                if (error) throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['matches'] });
        },
    });
}

// Update Set Tactical Stats
export function useUpdateSetTacticalStats() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ setId, matchPlayerId, data }: { setId: number; matchPlayerId: number; data: SetTacticalStatsUpdate }) => {
            if (!matchPlayerId) throw new Error('Match Player ID is required');

            // First, check if tactical stats exist for this set and match_player
            const { data: existing } = await supabase
                .from('set_player_tactical_stats')
                .select('set_player_tactical_id')
                .eq('set_id', setId)
                .eq('match_player_id', matchPlayerId)
                .maybeSingle();

            if (existing) {
                // Update existing record
                const { error } = await supabase
                    .from('set_player_tactical_stats')
                    // @ts-expect-error - Supabase generated types may have Update as never
                    .update(data)
                    .eq('set_id', setId)
                    .eq('match_player_id', matchPlayerId);

                if (error) throw error;
            } else {
                // Create new record
                const { error } = await supabase
                    .from('set_player_tactical_stats')
                    .insert({ ...data, set_id: setId, match_player_id: matchPlayerId } as any);

                if (error) throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['matches'] });
        },
    });
}

// Update Set Physical/Mental Stats
export function useUpdateSetPhysicalMentalStats() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ setId, matchPlayerId, data }: { setId: number; matchPlayerId: number; data: SetPhysicalMentalStatsUpdate }) => {
            if (!matchPlayerId) throw new Error('Match Player ID is required');

            // First, check if PM stats exist for this set and match_player
            const { data: existing } = await supabase
                .from('set_player_physical_mental_stats')
                .select('set_player_pm_id')
                .eq('set_id', setId)
                .eq('match_player_id', matchPlayerId)
                .maybeSingle();

            if (existing) {
                // Update existing record
                const { error } = await supabase
                    .from('set_player_physical_mental_stats')
                    // @ts-expect-error - Supabase generated types may have Update as never
                    .update(data)
                    .eq('set_id', setId)
                    .eq('match_player_id', matchPlayerId);

                if (error) throw error;
            } else {
                // Create new record
                const { error } = await supabase
                    .from('set_player_physical_mental_stats')
                    .insert({ ...data, set_id: setId, match_player_id: matchPlayerId } as any);

                if (error) throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['matches'] });
        },
    });
}

// Create a new set for a match
export function useCreateSet() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ matchId, setNumber }: { matchId: number; setNumber: number }) => {
            const { data, error } = await supabase
                .from('sets')
                .insert({
                    match_id: matchId,
                    set_number: setNumber,
                    games_side_a: 0,
                    games_side_b: 0,
                    tiebreak_played: false,
                } as any)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['matches'] });
        },
    });
}

// Delete a set
export function useDeleteSet() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (setId: number) => {
            // Delete set (cascade will handle related stats)
            const { error } = await supabase
                .from('sets')
                .delete()
                .eq('set_id', setId);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['matches'] });
        },
    });
}
