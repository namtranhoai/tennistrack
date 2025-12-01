import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { Database } from '../types/db';

type SetInsert = Database['public']['Tables']['sets']['Insert'];

interface CreateSetParams {
    matchId: number;
    gamesA?: number;
    gamesB?: number;
}

/**
 * Hook to create a new set for a match
 * Auto-increments set_number and sets started_at
 */
export function useCreateSet() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ matchId, gamesA = 0, gamesB = 0 }: CreateSetParams) => {
            // Get the highest set_number for this match
            const { data: existingSets, error: fetchError } = await supabase
                .from('sets')
                .select('set_number')
                .eq('match_id', matchId)
                .order('set_number', { ascending: false })
                .limit(1);

            if (fetchError) throw fetchError;

            const nextSetNumber = existingSets && existingSets.length > 0
                ? existingSets[0].set_number + 1
                : 1;

            // Create the new set
            const newSet: SetInsert = {
                match_id: matchId,
                set_number: nextSetNumber,
                games_side_a: gamesA,
                games_side_b: gamesB,
                started_at: new Date().toISOString(),
                tiebreak_played: false,
            };

            const { data, error } = await ((supabase as any)
                .from('sets')
                .insert(newSet) as any)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data, variables) => {
            // Invalidate live match query to refresh sets list
            queryClient.invalidateQueries({ queryKey: ['liveMatch', variables.matchId] });
            queryClient.invalidateQueries({ queryKey: ['matches'] });
        },
    });
}
