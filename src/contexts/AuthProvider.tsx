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

    // Helper to timeout a promise
    const withTimeout = <T,>(promise: Promise<T>, ms: number, label: string): Promise<T> => {
        return Promise.race([
            promise,
            new Promise<T>((_, reject) =>
                setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
            )
        ]);
    };

    // Load user profile and team membership
    const loadUserData = async (currentUser: User) => {
        console.log('[AuthProvider] Loading user data for:', currentUser.id);
        try {
            // Load profile with timeout
            console.log('[AuthProvider] Fetching profile...');
            const userProfile = await withTimeout(
                authService.getProfile(currentUser.id),
                5000,
                'Profile fetch'
            );

            // If no profile exists, create one from auth metadata
            if (!userProfile) {
                console.log('[AuthProvider] No profile found, creating new profile...');
                const fullName = currentUser.user_metadata?.full_name || currentUser.email || 'User';
                const newProfile = await withTimeout(
                    authService.createProfile(currentUser.id, fullName),
                    5000,
                    'Profile creation'
                );
                setProfile(newProfile);
                console.log('[AuthProvider] Profile created successfully');
            } else {
                setProfile(userProfile);
                console.log('[AuthProvider] Profile loaded successfully');
            }

            // Load team membership
            console.log('[AuthProvider] Fetching team membership...');
            const membership = await withTimeout(
                teamService.getUserTeamMembership(currentUser.id),
                5000,
                'Team membership fetch'
            );
            setTeamMembership(membership);
            console.log('[AuthProvider] Team membership loaded:', membership?.status || 'none');
        } catch (error) {
            console.error('[AuthProvider] Error loading user data:', error);
            // Set profile and membership to null on error to allow app to continue
            // We don't reset user here, as they are still authenticated
        }
    };

    // Initialize auth state
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        console.log('[AuthProvider] Initializing auth state...');

        // Set a timeout to ensure loading state doesn't hang forever
        timeoutId = setTimeout(() => {
            console.warn('[AuthProvider] Auth initialization timeout - forcing loading to false');
            setLoading(false);
        }, 10000); // 10 second timeout

        // Get initial session
        supabase.auth.getSession()
            .then(({ data: { session } }) => {
                console.log('[AuthProvider] Initial session check:', session ? 'logged in' : 'not logged in');
                if (session?.user) {
                    setUser(session.user);
                    return loadUserData(session.user);
                }
            })
            .catch((error) => {
                console.error('[AuthProvider] Error getting initial session:', error);
            })
            .finally(() => {
                clearTimeout(timeoutId);
                setLoading(false);
                console.log('[AuthProvider] Initial auth check complete');
            });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            console.log('[AuthProvider] Auth state changed:', _event, session ? 'logged in' : 'logged out');
            setUser(session?.user ?? null);

            if (session?.user) {
                try {
                    await loadUserData(session.user);
                } catch (error) {
                    console.error('[AuthProvider] Error in auth state change handler:', error);
                }
            } else {
                setProfile(null);
                setTeamMembership(null);
            }
        });

        return () => {
            clearTimeout(timeoutId);
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
