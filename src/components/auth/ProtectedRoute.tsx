import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, teamMembership, loading } = useAuth();
    const [showTimeout, setShowTimeout] = useState(false);

    // Set timeout for loading state
    useEffect(() => {
        if (loading) {
            console.log('[ProtectedRoute] Loading started');
            const timeoutId = setTimeout(() => {
                console.warn('[ProtectedRoute] Loading timeout reached');
                setShowTimeout(true);
            }, 15000); // 15 second timeout

            return () => {
                clearTimeout(timeoutId);
                setShowTimeout(false);
            };
        }
    }, [loading]);

    // Show loading state while checking auth
    if (loading) {
        if (showTimeout) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#132d24] to-[#1a3d32] px-4">
                    <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
                            <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Taking Too Long</h2>
                        <p className="text-gray-600 mb-6">
                            The app is taking longer than expected to load. This might be due to a slow connection or server issue.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full py-3 px-4 bg-[#a3cf08] text-[#132d24] font-semibold rounded-lg hover:bg-[#8fb507] transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#132d24] to-[#1a3d32]">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
                    <p className="text-white text-sm">Loading...</p>
                </div>
            </div>
        );
    }

    // Not authenticated - redirect to login
    if (!user) {
        console.log('[ProtectedRoute] No user, redirecting to login');
        return <Navigate to="/login" replace />;
    }

    // Authenticated but no team membership - redirect to choose team
    if (!teamMembership || teamMembership.status !== 'approved') {
        console.log('[ProtectedRoute] No approved team membership, redirecting to choose team');
        return <Navigate to="/choose-team" replace />;
    }

    // Authenticated and has approved team membership - render children
    console.log('[ProtectedRoute] User authenticated with approved team membership');
    return <>{children}</>;
}
