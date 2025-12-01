import { QuickKPIs, EventCounters, DetailedStats, SetStatus, MatchPlayer } from '../types/live';
import { Database } from '../types/db';

type SetRow = Database['public']['Tables']['sets']['Row'];

/**
 * Derive initial detailed stats estimates from Quick KPIs
 */
export function deriveStatsFromKPIs(kpis: QuickKPIs): Partial<DetailedStats> {
    const derived: Partial<DetailedStats> = {};

    // Serve quality mapping (rough estimates)
    if (kpis.serveQuality) {
        const serveMap = {
            poor: { firstServePercent: 0.45, aceRate: 0.02 },
            fair: { firstServePercent: 0.55, aceRate: 0.05 },
            good: { firstServePercent: 0.65, aceRate: 0.08 },
            excellent: { firstServePercent: 0.75, aceRate: 0.12 },
        };
        // These are just placeholders - actual values come from events
        derived.first_serve_in = 0;
        derived.first_serve_total = 0;
    }

    // Return quality mapping
    if (kpis.returnQuality) {
        const returnMap = {
            poor: { returnInPercent: 0.50, deepPercent: 0.20 },
            fair: { returnInPercent: 0.65, deepPercent: 0.35 },
            good: { returnInPercent: 0.75, deepPercent: 0.50 },
            excellent: { returnInPercent: 0.85, deepPercent: 0.65 },
        };
        derived.returns_in = 0;
        derived.returns_total = 0;
        derived.deep_returns = 0;
    }

    // Error level mapping
    if (kpis.unforcedErrorsLevel) {
        // Low/Medium/High - will be reflected in event counters
        derived.fh_unforced_errors = 0;
        derived.bh_unforced_errors = 0;
    }

    // Winner level mapping
    if (kpis.winnersLevel) {
        derived.fh_winners = 0;
        derived.bh_winners = 0;
    }

    // Focus level mapping (1-10 scale)
    if (kpis.focusLevel) {
        const focusMap = { low: 4, medium: 7, high: 9 };
        derived.focus_rating = focusMap[kpis.focusLevel];
    }

    // Energy level mapping (1-10 scale)
    if (kpis.energyLevel) {
        const energyMap = { low: 4, medium: 7, high: 9 };
        derived.speed_rating = energyMap[kpis.energyLevel];
        derived.recovery_rating = energyMap[kpis.energyLevel];
    }

    return derived;
}

/**
 * Merge event counters into detailed stats
 */
export function mergeEventCounters(
    events: EventCounters,
    existingStats: Partial<DetailedStats>
): Partial<DetailedStats> {
    return {
        ...existingStats,
        fh_winners: events.fhWinners,
        bh_winners: events.bhWinners,
        fh_unforced_errors: events.fhUnforcedErrors,
        bh_unforced_errors: events.bhUnforcedErrors,
        aces: events.aces,
        double_faults: events.doubleFaults,
        long_rallies_won: events.longRalliesWon,
        long_rallies_lost: events.longRalliesLost,
        volley_winners: events.volleyWinners,
        volley_errors: events.volleyErrors,
    };
}

/**
 * Compute set status from timestamps
 */
export function computeSetStatus(set: SetRow): SetStatus {
    if (set.completed_at) {
        return 'finished';
    }
    if (set.started_at) {
        return 'in_progress';
    }
    return 'planned';
}

/**
 * Format match name from match players
 */
export function formatMatchName(matchPlayers: MatchPlayer[]): string {
    const sideA = matchPlayers.filter(p => p.side === 'A');
    const sideB = matchPlayers.filter(p => p.side === 'B');

    const formatSide = (players: MatchPlayer[]) => {
        return players.map(p => p.display_name).join(' / ');
    };

    const nameA = formatSide(sideA);
    const nameB = formatSide(sideB);

    return `${nameA} vs ${nameB}`;
}

/**
 * Initialize empty Quick KPIs
 */
export function initQuickKPIs(): QuickKPIs {
    return {
        serveQuality: null,
        returnQuality: null,
        unforcedErrorsLevel: null,
        winnersLevel: null,
        focusLevel: null,
        energyLevel: null,
    };
}

/**
 * Initialize empty event counters
 */
export function initEventCounters(): EventCounters {
    return {
        fhWinners: 0,
        bhWinners: 0,
        fhUnforcedErrors: 0,
        bhUnforcedErrors: 0,
        aces: 0,
        doubleFaults: 0,
        netErrors: 0,
        longRalliesWon: 0,
        longRalliesLost: 0,
        volleyWinners: 0,
        volleyErrors: 0,
    };
}

/**
 * Initialize empty detailed stats
 */
export function initDetailedStats(): DetailedStats {
    return {
        // Serve
        first_serve_in: 0,
        first_serve_total: 0,
        first_serve_points_won: 0,
        second_serve_in: 0,
        second_serve_total: 0,
        second_serve_points_won: 0,
        aces: 0,
        double_faults: 0,
        serve_plus1_points_won: 0,

        // Return
        returns_in: 0,
        returns_total: 0,
        deep_returns: 0,
        return_winners: 0,
        return_unforced_errors: 0,
        breaks_won: 0,
        break_points_won: 0,
        break_points_total: 0,

        // Rally
        avg_rally_length: 0,
        long_rallies_won: 0,
        long_rallies_lost: 0,
        attacking_points_played: 0,
        attacking_points_won: 0,
        defensive_points_played: 0,
        defensive_points_won: 0,

        // Groundstrokes
        fh_winners: 0,
        fh_unforced_errors: 0,
        fh_forced_errors_drawn: 0,
        bh_winners: 0,
        bh_unforced_errors: 0,
        bh_forced_errors_drawn: 0,

        // Net
        net_approaches: 0,
        net_points_won: 0,
        volley_winners: 0,
        volley_errors: 0,
        smash_winners: 0,
        smash_errors: 0,

        // Tactical
        game_deuce_played: 0,
        game_deuce_won: 0,
        bp_saved: 0,
        bp_faced: 0,
        game_from_40_0_lost: 0,
        deep_shots: 0,
        mid_court_shots: 0,
        short_balls_given: 0,
        shots_to_opponent_bh: 0,
        shots_to_opponent_fh: 0,

        // Physical/Mental
        speed_rating: 5,
        recovery_rating: 5,
        fatigue_errors: 0,
        confidence_rating: 5,
        emotion_control: 5,
        focus_rating: 5,
        tactical_adjustment: 5,
        coach_notes: '',
    };
}
