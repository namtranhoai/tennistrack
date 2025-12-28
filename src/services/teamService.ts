import { supabase } from '../lib/supabaseClient';
import type { Database } from '../types/db';

type Team = Database['public']['Tables']['teams']['Row'];
type TeamInsert = Database['public']['Tables']['teams']['Insert'];
type TeamMember = Database['public']['Tables']['team_members']['Row'];
type TeamMemberInsert = Database['public']['Tables']['team_members']['Insert'];

export interface TeamMemberWithProfile extends TeamMember {
    profiles: {
        full_name: string | null;
    } | null;
}

/**
 * Create a new team and set the creator as admin
 */
export async function createTeamAndSetAdmin(teamName: string, userId: string): Promise<{ team: Team; membership: TeamMember }> {
    // Check if user already has a team membership
    const existingMembership = await getUserTeamMembership(userId);
    if (existingMembership) {
        throw new Error('You already have a team membership. Each user can only belong to one team.');
    }

    // Also check for pending memberships
    const pendingMembership = await getUserPendingMembership(userId);
    if (pendingMembership) {
        throw new Error('You already have a pending team membership request. Please wait for approval or cancel it first.');
    }

    // Start a transaction by creating the team first
    const teamData: TeamInsert = {
        name: teamName,
        created_by: userId,
    };

    const { data: team, error: teamError } = await ((supabase as any)
        .from('teams')
        .insert(teamData)
        .select()
        .single());

    if (teamError) {
        throw teamError;
    }

    // Then create the membership
    const membershipData: TeamMemberInsert = {
        team_id: team.id,
        user_id: userId,
        role: 'admin',
        status: 'approved',
    };

    const { data: membership, error: membershipError } = await ((supabase as any)
        .from('team_members')
        .insert(membershipData)
        .select()
        .single());

    if (membershipError) {
        // If membership creation fails, we should ideally rollback the team creation
        // For now, throw the error
        throw membershipError;
    }

    return { team, membership };
}

/**
 * Request to join an existing team
 */
export async function requestJoinTeam(teamId: string, userId: string): Promise<TeamMember> {
    // Check if user already has an approved team membership
    const existingMembership = await getUserTeamMembership(userId);
    if (existingMembership) {
        throw new Error('You already have a team membership. Each user can only belong to one team.');
    }

    // Check if user already has a pending request
    const pendingMembership = await getUserPendingMembership(userId);
    if (pendingMembership) {
        throw new Error('You already have a pending team membership request. Please wait for approval or cancel it first.');
    }

    const membershipData: TeamMemberInsert = {
        team_id: teamId,
        user_id: userId,
        role: 'member',
        status: 'pending',
    };

    const { data, error } = await supabase
        .from('team_members')
        .insert(membershipData as any)
        .select()
        .single();

    if (error) {
        // Check if it's a unique constraint violation
        if (error.code === '23505') {
            throw new Error('You already have a pending or approved membership request.');
        }
        throw error;
    }

    return data;
}

/**
 * Get all teams (for the join team list)
 */
export async function getTeams(): Promise<Team[]> {
    const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        throw error;
    }

    return data || [];
}

export interface TeamMemberWithTeam extends TeamMember {
    teams: {
        name: string;
    } | null;
}

/**
 * Get a user's approved team membership
 */
export async function getUserTeamMembership(userId: string): Promise<TeamMemberWithTeam | null> {
    console.log('[teamService] Getting team membership for user:', userId);
    const { data, error } = await ((supabase as any)
        .from('team_members')
        .select(`
            *,
            teams (
                name
            )
        `)
        .eq('user_id', userId)
        .eq('status', 'approved')
        .single());

    if (error) {
        if (error.code === 'PGRST116') {
            // No membership found
            console.log('[teamService] No approved membership found');
            return null;
        }
        console.error('[teamService] Error getting team membership:', error);
        throw error;
    }

    if (data) {
        console.log('[teamService] Team membership found:', data.status, 'Team:', data.teams?.name);
    }
    return data;
}

/**
 * Get a user's pending team membership
 */
export async function getUserPendingMembership(userId: string): Promise<TeamMember | null> {
    console.log('[teamService] Getting pending membership for user:', userId);
    const { data, error } = await ((supabase as any)
        .from('team_members')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .single());

    if (error) {
        if (error.code === 'PGRST116') {
            // No pending membership found
            console.log('[teamService] No pending membership found');
            return null;
        }
        console.error('[teamService] Error getting pending membership:', error);
        throw error;
    }

    console.log('[teamService] Pending membership found');
    return data;
}

/**
 * Get pending join requests for a team (admin only)
 */
export async function getPendingRequests(teamId: string): Promise<TeamMemberWithProfile[]> {
    const { data, error } = await supabase
        .from('team_members')
        .select(`
            *,
            profiles (
                full_name
            )
        `)
        .eq('team_id', teamId)
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

    if (error) {
        throw error;
    }

    return data as TeamMemberWithProfile[] || [];
}

/**
 * Approve a pending membership request
 */
export async function approveMember(membershipId: string): Promise<TeamMember> {
    console.log('[teamService] Approving member with ID:', membershipId);

    // First, verify the membership exists and is pending
    const { data: existingMembership, error: fetchError } = await ((supabase as any)
        .from('team_members')
        .select('*')
        .eq('id', membershipId)
        .single());

    if (fetchError) {
        console.error('[teamService] Error fetching membership:', fetchError);
        throw new Error(`Failed to fetch membership: ${fetchError.message}`);
    }

    if (!existingMembership) {
        throw new Error('Membership not found');
    }

    if (existingMembership.status !== 'pending') {
        throw new Error(`Membership is not pending (current status: ${existingMembership.status})`);
    }

    console.log('[teamService] Existing membership:', existingMembership);

    // Check if user already has an approved membership for a different team
    const { data: otherMemberships, error: checkError } = await supabase
        .from('team_members')
        .select('*')
        .eq('user_id', existingMembership.user_id)
        .eq('status', 'approved')
        .neq('id', membershipId);

    if (checkError) {
        console.error('[teamService] Error checking other memberships:', checkError);
    }

    if (otherMemberships && otherMemberships.length > 0) {
        console.warn('[teamService] User already has approved membership(s):', otherMemberships);
        throw new Error('User already has an approved team membership. Each user can only belong to one team.');
    }

    // Now attempt to approve
    const { data, error } = await ((supabase as any)
        .from('team_members')
        .update({ status: 'approved' })
        .eq('id', membershipId)
        .eq('status', 'pending') // Only approve if currently pending
        .select()
        .single());

    if (error) {
        console.error('[teamService] Error approving member:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
            fullError: error
        });
        throw error;
    }

    console.log('[teamService] Member approved successfully:', data);
    return data;
}


/**
 * Reject a pending membership request
 */
export async function rejectMember(membershipId: string): Promise<TeamMember> {
    const { data, error } = await ((supabase as any)
        .from('team_members')
        .update({ status: 'rejected' })
        .eq('id', membershipId)
        .eq('status', 'pending') // Only reject if currently pending
        .select()
        .single());

    if (error) {
        throw error;
    }

    return data;
}

/**
 * Get team details by ID
 */
export async function getTeamById(teamId: string): Promise<Team | null> {
    const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            return null;
        }
        throw error;
    }

    return data;
}

/**
 * Cancel a pending membership request
 */
export async function cancelMembershipRequest(membershipId: string): Promise<void> {
    const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', membershipId)
        .eq('status', 'pending'); // Only delete if pending

    if (error) {
        throw error;
    }
}

/**
 * Get all team members (approved only)
 */
export async function getTeamMembers(teamId: string): Promise<TeamMemberWithProfile[]> {
    const { data, error } = await supabase
        .from('team_members')
        .select(`
            *,
            profiles (
                full_name
            )
        `)
        .eq('team_id', teamId)
        .eq('status', 'approved')
        .order('created_at', { ascending: true });

    if (error) {
        throw error;
    }

    return data as TeamMemberWithProfile[] || [];
}

/**
 * Deactivate a team member
 */
export async function deactivateMember(membershipId: string): Promise<TeamMember> {
    console.log('[teamService] Deactivating member with ID:', membershipId);

    const { data, error } = await ((supabase as any)
        .from('team_members')
        .update({ is_active: false })
        .eq('id', membershipId)
        .eq('status', 'approved') // Only deactivate approved members
        .select()
        .single());

    if (error) {
        console.error('[teamService] Error deactivating member:', error);
        throw error;
    }

    console.log('[teamService] Member deactivated successfully:', data);
    return data;
}

/**
 * Activate a team member
 */
export async function activateMember(membershipId: string): Promise<TeamMember> {
    console.log('[teamService] Activating member with ID:', membershipId);

    const { data, error } = await ((supabase as any)
        .from('team_members')
        .update({ is_active: true })
        .eq('id', membershipId)
        .eq('status', 'approved') // Only activate approved members
        .select()
        .single());

    if (error) {
        console.error('[teamService] Error activating member:', error);
        throw error;
    }

    console.log('[teamService] Member activated successfully:', data);
    return data;
}
