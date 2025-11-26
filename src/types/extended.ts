import { Database } from './db';

export type MatchRow = Database['public']['Tables']['matches']['Row'];
export type PlayerRow = Database['public']['Tables']['players']['Row'];
export type MatchPlayerRow = Database['public']['Tables']['match_players']['Row'];
export type SetRow = Database['public']['Tables']['sets']['Row'];
export type SetTechStatsRow = Database['public']['Tables']['set_player_tech_stats']['Row'];
export type SetTacticalStatsRow = Database['public']['Tables']['set_player_tactical_stats']['Row'];
export type SetPhysicalMentalStatsRow = Database['public']['Tables']['set_player_physical_mental_stats']['Row'];

export interface MatchWithPlayer extends MatchRow {
    match_players: (MatchPlayerRow & {
        players: {
            full_name: string;
            avatar_url: string | null;
        } | null;
    })[];
}

export interface MatchDetails extends MatchWithPlayer {
    sets: (SetRow & {
        set_player_tech_stats: SetTechStatsRow[];
        set_player_tactical_stats: SetTacticalStatsRow[];
        set_player_physical_mental_stats: SetPhysicalMentalStatsRow[];
    })[];
}
