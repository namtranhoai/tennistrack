import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Hook to get the current user's team ID
 * Returns null if user has no approved team membership
 */
export function useTeamId(): string | null {
    const { teamMembership } = useContext(AuthContext)!;
    return teamMembership?.team_id || null;
}
