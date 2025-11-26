import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, teamMembership, loading } = useAuth();

    // Show loading state while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#132d24] to-[#1a3d32]">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
        );
    }

    // Not authenticated - redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Authenticated but no team membership - redirect to choose team
    if (!teamMembership || teamMembership.status !== 'approved') {
        return <Navigate to="/choose-team" replace />;
    }

    // Authenticated and has approved team membership - render children
    return <>{children}</>;
}
