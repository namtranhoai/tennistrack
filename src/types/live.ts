import { Database } from './db';

// Quick KPI levels
export type ServeQuality = 'poor' | 'fair' | 'good' | 'excellent';
export type ReturnQuality = 'poor' | 'fair' | 'good' | 'excellent';
export type ErrorLevel = 'low' | 'medium' | 'high';
export type WinnerLevel = 'low' | 'medium' | 'high';
export type FocusLevel = 'low' | 'medium' | 'high';
export type EnergyLevel = 'low' | 'medium' | 'high';

// Quick KPIs structure
export interface QuickKPIs {
    serveQuality: ServeQuality | null;
    returnQuality: ReturnQuality | null;
    unforcedErrorsLevel: ErrorLevel | null;
    winnersLevel: WinnerLevel | null;
    focusLevel: FocusLevel | null;
    energyLevel: EnergyLevel | null;
}

// Event counters for tap bar
export interface EventCounters {
    fhWinners: number;
    bhWinners: number;
    fhUnforcedErrors: number;
    bhUnforcedErrors: number;
    aces: number;
    doubleFaults: number;
    netErrors: number;
    longRalliesWon: number;
    longRalliesLost: number;
    volleyWinners: number;
    volleyErrors: number;
}

// Complete detailed stats (merged from all three stat tables)
export interface DetailedStats {
    // Technical stats - Serve
    first_serve_in: number;
    first_serve_total: number;
    first_serve_points_won: number;
    second_serve_in: number;
    second_serve_total: number;
    second_serve_points_won: number;
    aces: number;
    double_faults: number;
    serve_plus1_points_won: number;

    // Technical stats - Return
    returns_in: number;
    returns_total: number;
    deep_returns: number;
    return_winners: number;
    return_unforced_errors: number;
    breaks_won: number;
    break_points_won: number;
    break_points_total: number;

    // Technical stats - Rally
    avg_rally_length: number;
    long_rallies_won: number;
    long_rallies_lost: number;
    attacking_points_played: number;
    attacking_points_won: number;
    defensive_points_played: number;
    defensive_points_won: number;

    // Technical stats - Groundstrokes
    fh_winners: number;
    fh_unforced_errors: number;
    fh_forced_errors_drawn: number;
    bh_winners: number;
    bh_unforced_errors: number;
    bh_forced_errors_drawn: number;

    // Technical stats - Net
    net_approaches: number;
    net_points_won: number;
    volley_winners: number;
    volley_errors: number;
    smash_winners: number;
    smash_errors: number;

    // Tactical stats
    game_deuce_played: number;
    game_deuce_won: number;
    bp_saved: number;
    bp_faced: number;
    game_from_40_0_lost: number;
    deep_shots: number;
    mid_court_shots: number;
    short_balls_given: number;
    shots_to_opponent_bh: number;
    shots_to_opponent_fh: number;

    // Physical/Mental stats
    speed_rating: number;
    recovery_rating: number;
    fatigue_errors: number;
    confidence_rating: number;
    emotion_control: number;
    focus_rating: number;
    tactical_adjustment: number;
    coach_notes: string;
}

// SP-Input complete state
export interface SPInputState {
    quickKPIs: QuickKPIs;
    eventCounters: EventCounters;
    detailedStats: DetailedStats;
    isLoading: boolean;
    isSaving: boolean;
    lastSaved: Date | null;
}

// Match with players for live tracking
export type MatchPlayer = Database['public']['Tables']['match_players']['Row'] & {
    players: {
        full_name: string;
        avatar_url: string | null;
    } | null;
};

export type LiveMatch = Database['public']['Tables']['matches']['Row'] & {
    match_players: MatchPlayer[];
};

// Set with computed status
export type SetStatus = 'planned' | 'in_progress' | 'finished';

export type SetWithStatus = Database['public']['Tables']['sets']['Row'] & {
    status: SetStatus;
};

// Live match with full details
export type LiveMatchDetails = Database['public']['Tables']['matches']['Row'] & {
    match_players: MatchPlayer[];
    sets: SetWithStatus[];
};
