import { supabase } from '../lib/supabaseClient';
import type { Database } from '../types/db';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];

/**
 * Sign up a new user with email and password
 * Sends email confirmation
 */
export async function signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
        },
    });

    if (error) {
        throw error;
    }

    return data;
}

/**
 * Sign in an existing user
 */
export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error('Supabase signIn error:', error);
        throw error;
    }

    return data;
}

/**
 * Sign out the current user
 */
export async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        throw error;
    }
}

/**
 * Get the current user session
 */
export async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
        throw error;
    }

    return user;
}

/**
 * Create a profile for a user
 */
export async function createProfile(userId: string, fullName: string, role?: string): Promise<Profile> {
    const profileData: ProfileInsert = {
        id: userId,
        full_name: fullName,
        role: role || null,
    };

    const { data, error } = await ((supabase as any)
        .from('profiles')
        .insert(profileData)
        .select()
        .single());

    if (error) {
        throw error;
    }

    return data;
}

/**
 * Get a user's profile
 */
export async function getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            // No profile found
            return null;
        }
        throw error;
    }

    return data;
}

/**
 * Update a user's profile
 */
export async function updateProfile(userId: string, updates: { full_name?: string; role?: string }): Promise<Profile> {
    const { data, error } = await ((supabase as any)
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single());

    if (error) {
        throw error;
    }

    return data;
}
