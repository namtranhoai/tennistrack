import { useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { AuthContext, AuthContextType } from './AuthContext';
import type { Database } from '../types/db';
import * as authService from '../services/authService';
import * as teamService from '../services/teamService';

type Profile = Database['public']['Tables']['profiles']['Row'];
type TeamMember = Database['public']['Tables']['team_members']['Row'];

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [teamMembership, setTeamMembership] = useState<TeamMember | null>(null);
    const [loading, setLoading] = useState(true);

    // Load user profile and team membership
    const loadUserData = async (currentUser: User) => {
        try {
            // Load profile
            const userProfile = await authService.getProfile(currentUser.id);

            // If no profile exists, create one from auth metadata
            if (!userProfile) {
                const fullName = currentUser.user_metadata?.full_name || currentUser.email || 'User';
                const newProfile = await authService.createProfile(currentUser.id, fullName);
                setProfile(newProfile);
            } else {
                setProfile(userProfile);
            }

            // Load team membership
            const membership = await teamService.getUserTeamMembership(currentUser.id);
            setTeamMembership(membership);
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    // Initialize auth state
    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser(session.user);
                loadUserData(session.user).finally(() => setLoading(false));
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setUser(session?.user ?? null);

            if (session?.user) {
                await loadUserData(session.user);
            } else {
                setProfile(null);
                setTeamMembership(null);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // Auth methods
    const signUp = async (email: string, password: string, fullName: string) => {
        await authService.signUp(email, password, fullName);
        // Note: User will need to confirm email before they can sign in
    };

    const signIn = async (email: string, password: string) => {
        const { user: signedInUser } = await authService.signIn(email, password);
        if (signedInUser) {
            setUser(signedInUser);
            await loadUserData(signedInUser);
        }
    };

    const signOut = async () => {
        await authService.signOut();
        setUser(null);
        setProfile(null);
        setTeamMembership(null);
    };

    const refreshMembership = async () => {
        if (user) {
            const membership = await teamService.getUserTeamMembership(user.id);
            setTeamMembership(membership);
        }
    };

    const value: AuthContextType = {
        user,
        profile,
        teamMembership,
        loading,
        signUp,
        signIn,
        signOut,
        refreshMembership,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
