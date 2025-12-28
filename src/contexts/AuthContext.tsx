import { createContext, useContext } from 'react';
import type { User } from '@supabase/supabase-js';
import type { Database } from '../types/db';
import type { TeamMemberWithTeam } from '../services/teamService';

type Profile = Database['public']['Tables']['profiles']['Row'];

export interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    teamMembership: TeamMemberWithTeam | null;
    loading: boolean;
    signUp: (email: string, password: string, fullName: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    refreshMembership: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
