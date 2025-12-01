export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            teams: {
                Row: {
                    id: string
                    name: string
                    created_by: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    created_by?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    created_by?: string | null
                    created_at?: string
                }
            }
            profiles: {
                Row: {
                    id: string
                    full_name: string | null
                    role: string | null
                    created_at: string
                }
                Insert: {
                    id: string
                    full_name?: string | null
                    role?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    full_name?: string | null
                    role?: string | null
                    created_at?: string
                }
            }
            team_members: {
                Row: {
                    id: string
                    team_id: string
                    user_id: string
                    role: 'admin' | 'member'
                    status: 'pending' | 'approved' | 'rejected'
                    created_at: string
                }
                Insert: {
                    id?: string
                    team_id: string
                    user_id: string
                    role: 'admin' | 'member'
                    status: 'pending' | 'approved' | 'rejected'
                    created_at?: string
                }
                Update: {
                    id?: string
                    team_id?: string
                    user_id?: string
                    role?: 'admin' | 'member'
                    status?: 'pending' | 'approved' | 'rejected'
                    created_at?: string
                }
            }
            players: {
                Row: {
                    player_id: number
                    full_name: string
                    gender: string | null
                    birth_date: string | null
                    dominant_hand: 'right' | 'left' | null
                    backhand_type: 'one-hand' | 'two-hand' | null
                    level: string | null
                    notes: string | null
                    avatar_url: string | null
                    team_id: string | null
                }
                Insert: {
                    player_id?: number
                    full_name: string
                    gender?: string | null
                    birth_date?: string | null
                    dominant_hand?: 'right' | 'left' | null
                    backhand_type?: 'one-hand' | 'two-hand' | null
                    level?: string | null
                    notes?: string | null
                    avatar_url?: string | null
                    team_id?: string | null
                }
                Update: {
                    player_id?: number
                    full_name?: string
                    gender?: string | null
                    birth_date?: string | null
                    dominant_hand?: 'right' | 'left' | null
                    backhand_type?: 'one-hand' | 'two-hand' | null
                    level?: string | null
                    notes?: string | null
                    avatar_url?: string | null
                    team_id?: string | null
                }
            }
            matches: {
                Row: {
                    match_id: number
                    match_date: string
                    location: string | null
                    surface: string
                    weather: string | null
                    tournament_name: string | null
                    match_type: string | null
                    pre_match_strategy: string | null
                    final_result: string | null
                    score_line: string | null
                    notes: string | null
                    format: 'singles' | 'doubles'
                    team_id: string | null
                    status: 'scheduled' | 'in_progress' | 'completed'
                    started_at: string | null
                    completed_at: string | null
                }
                Insert: {
                    match_id?: number
                    match_date: string
                    location?: string | null
                    surface: string
                    weather?: string | null
                    tournament_name?: string | null
                    match_type?: string | null
                    pre_match_strategy?: string | null
                    final_result?: string | null
                    score_line?: string | null
                    notes?: string | null
                    format?: 'singles' | 'doubles'
                    team_id?: string | null
                    status?: 'scheduled' | 'in_progress' | 'completed'
                    started_at?: string | null
                    completed_at?: string | null
                }
                Update: {
                    match_id?: number
                    match_date?: string
                    location?: string | null
                    surface?: string
                    weather?: string | null
                    tournament_name?: string | null
                    match_type?: string | null
                    pre_match_strategy?: string | null
                    final_result?: string | null
                    score_line?: string | null
                    notes?: string | null
                    format?: 'singles' | 'doubles'
                    team_id?: string | null
                    status?: 'scheduled' | 'in_progress' | 'completed'
                    started_at?: string | null
                    completed_at?: string | null
                }
            }
            sets: {
                Row: {
                    set_id: number
                    match_id: number
                    set_number: number
                    tiebreak_played: boolean | null
                    tiebreak_score: string | null
                    notes: string | null
                    games_side_a: number | null
                    games_side_b: number | null
                    started_at: string | null
                    completed_at: string | null
                }
                Insert: {
                    set_id?: number
                    match_id: number
                    set_number: number
                    tiebreak_played?: boolean | null
                    tiebreak_score?: string | null
                    notes?: string | null
                    games_side_a?: number | null
                    games_side_b?: number | null
                    started_at?: string | null
                    completed_at?: string | null
                }
                Update: {
                    set_id?: number
                    match_id?: number
                    set_number?: number
                    tiebreak_played?: boolean | null
                    tiebreak_score?: string | null
                    notes?: string | null
                    games_side_a?: number | null
                    games_side_b?: number | null
                    started_at?: string | null
                    completed_at?: string | null
                }
            }
            match_players: {
                Row: {
                    match_player_id: number
                    match_id: number
                    player_id: number | null
                    display_name: string
                    side: 'A' | 'B'
                    role: string
                    is_tracked: boolean
                }
                Insert: {
                    match_player_id?: number
                    match_id: number
                    player_id?: number | null
                    display_name: string
                    side: 'A' | 'B'
                    role: string
                    is_tracked?: boolean
                }
                Update: {
                    match_player_id?: number
                    match_id?: number
                    player_id?: number | null
                    display_name?: string
                    side?: 'A' | 'B'
                    role?: string
                    is_tracked?: boolean
                }
            }
            set_player_tech_stats: {
                Row: {
                    set_player_tech_id: number
                    set_id: number
                    match_player_id: number
                    first_serve_in: number | null
                    first_serve_total: number | null
                    first_serve_points_won: number | null
                    second_serve_in: number | null
                    second_serve_total: number | null
                    second_serve_points_won: number | null
                    aces: number | null
                    double_faults: number | null
                    serve_plus1_points_won: number | null
                    returns_in: number | null
                    returns_total: number | null
                    deep_returns: number | null
                    return_winners: number | null
                    return_unforced_errors: number | null
                    breaks_won: number | null
                    break_points_won: number | null
                    break_points_total: number | null
                    avg_rally_length: number | null
                    long_rallies_won: number | null
                    long_rallies_lost: number | null
                    attacking_points_played: number | null
                    attacking_points_won: number | null
                    defensive_points_played: number | null
                    defensive_points_won: number | null
                    fh_winners: number | null
                    fh_unforced_errors: number | null
                    fh_forced_errors_drawn: number | null
                    bh_winners: number | null
                    bh_unforced_errors: number | null
                    bh_forced_errors_drawn: number | null
                    net_approaches: number | null
                    net_points_won: number | null
                    volley_winners: number | null
                    volley_errors: number | null
                    smash_winners: number | null
                    smash_errors: number | null
                }
                Insert: {
                    set_player_tech_id?: number
                    set_id: number
                    match_player_id: number
                    first_serve_in?: number | null
                    first_serve_total?: number | null
                    first_serve_points_won?: number | null
                    second_serve_in?: number | null
                    second_serve_total?: number | null
                    second_serve_points_won?: number | null
                    aces?: number | null
                    double_faults?: number | null
                    serve_plus1_points_won?: number | null
                    returns_in?: number | null
                    returns_total?: number | null
                    deep_returns?: number | null
                    return_winners?: number | null
                    return_unforced_errors?: number | null
                    breaks_won?: number | null
                    break_points_won?: number | null
                    break_points_total?: number | null
                    avg_rally_length?: number | null
                    long_rallies_won?: number | null
                    long_rallies_lost?: number | null
                    attacking_points_played?: number | null
                    attacking_points_won?: number | null
                    defensive_points_played?: number | null
                    defensive_points_won?: number | null
                    fh_winners?: number | null
                    fh_unforced_errors?: number | null
                    fh_forced_errors_drawn?: number | null
                    bh_winners?: number | null
                    bh_unforced_errors?: number | null
                    bh_forced_errors_drawn?: number | null
                    net_approaches?: number | null
                    net_points_won?: number | null
                    volley_winners?: number | null
                    volley_errors?: number | null
                    smash_winners?: number | null
                    smash_errors?: number | null
                }
                Update: {
                    set_player_tech_id?: number
                    set_id?: number
                    match_player_id?: number
                    first_serve_in?: number | null
                    first_serve_total?: number | null
                    first_serve_points_won?: number | null
                    second_serve_in?: number | null
                    second_serve_total?: number | null
                    second_serve_points_won?: number | null
                    aces?: number | null
                    double_faults?: number | null
                    serve_plus1_points_won?: number | null
                    returns_in?: number | null
                    returns_total?: number | null
                    deep_returns?: number | null
                    return_winners?: number | null
                    return_unforced_errors?: number | null
                    breaks_won?: number | null
                    break_points_won?: number | null
                    break_points_total?: number | null
                    avg_rally_length?: number | null
                    long_rallies_won?: number | null
                    long_rallies_lost?: number | null
                    attacking_points_played?: number | null
                    attacking_points_won?: number | null
                    defensive_points_played?: number | null
                    defensive_points_won?: number | null
                    fh_winners?: number | null
                    fh_unforced_errors?: number | null
                    fh_forced_errors_drawn?: number | null
                    bh_winners?: number | null
                    bh_unforced_errors?: number | null
                    bh_forced_errors_drawn?: number | null
                    net_approaches?: number | null
                    net_points_won?: number | null
                    volley_winners?: number | null
                    volley_errors?: number | null
                    smash_winners?: number | null
                    smash_errors?: number | null
                }
            }
            set_player_tactical_stats: {
                Row: {
                    set_player_tactical_id: number
                    set_id: number
                    match_player_id: number
                    game_deuce_played: number | null
                    game_deuce_won: number | null
                    bp_saved: number | null
                    bp_faced: number | null
                    game_from_40_0_lost: number | null
                    deep_shots: number | null
                    mid_court_shots: number | null
                    short_balls_given: number | null
                    shots_to_opponent_bh: number | null
                    shots_to_opponent_fh: number | null
                }
                Insert: {
                    set_player_tactical_id?: number
                    set_id: number
                    match_player_id: number
                    game_deuce_played?: number | null
                    game_deuce_won?: number | null
                    bp_saved?: number | null
                    bp_faced?: number | null
                    game_from_40_0_lost?: number | null
                    deep_shots?: number | null
                    mid_court_shots?: number | null
                    short_balls_given?: number | null
                    shots_to_opponent_bh?: number | null
                    shots_to_opponent_fh?: number | null
                }
                Update: {
                    set_player_tactical_id?: number
                    set_id?: number
                    match_player_id?: number
                    game_deuce_played?: number | null
                    game_deuce_won?: number | null
                    bp_saved?: number | null
                    bp_faced?: number | null
                    game_from_40_0_lost?: number | null
                    deep_shots?: number | null
                    mid_court_shots?: number | null
                    short_balls_given?: number | null
                    shots_to_opponent_bh?: number | null
                    shots_to_opponent_fh?: number | null
                }
            }
            set_player_physical_mental_stats: {
                Row: {
                    set_player_pm_id: number
                    set_id: number
                    match_player_id: number
                    speed_rating: number | null
                    recovery_rating: number | null
                    fatigue_errors: number | null
                    confidence_rating: number | null
                    emotion_control: number | null
                    focus_rating: number | null
                    tactical_adjustment: number | null
                    coach_notes: string | null
                }
                Insert: {
                    set_player_pm_id?: number
                    set_id: number
                    match_player_id: number
                    speed_rating?: number | null
                    recovery_rating?: number | null
                    fatigue_errors?: number | null
                    confidence_rating?: number | null
                    emotion_control?: number | null
                    focus_rating?: number | null
                    tactical_adjustment?: number | null
                    coach_notes?: string | null
                }
                Update: {
                    set_player_pm_id?: number
                    set_id?: number
                    match_player_id?: number
                    speed_rating?: number | null
                    recovery_rating?: number | null
                    fatigue_errors?: number | null
                    confidence_rating?: number | null
                    emotion_control?: number | null
                    focus_rating?: number | null
                    tactical_adjustment?: number | null
                    coach_notes?: string | null
                }
            }
        }
    }
}
