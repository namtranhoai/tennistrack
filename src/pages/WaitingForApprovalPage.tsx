import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as teamService from '../services/teamService';
import type { Database } from '../types/db';

type Team = Database['public']['Tables']['teams']['Row'];
type TeamMember = Database['public']['Tables']['team_members']['Row'];

export default function WaitingForApprovalPage() {
    const [team, setTeam] = useState<Team | null>(null);
    const [membership, setMembership] = useState<TeamMember | null>(null);
    const [loading, setLoading] = useState(true);
    const { user, refreshMembership, teamMembership } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        loadPendingMembership();

        // Poll for approval every 5 seconds
        const interval = setInterval(async () => {
            await refreshMembership();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Redirect if approved
    useEffect(() => {
        if (teamMembership?.status === 'approved') {
            navigate('/');
        }
    }, [teamMembership, navigate]);

    const loadPendingMembership = async () => {
        if (!user) return;

        try {
            const pendingMembership = await teamService.getUserPendingMembership(user.id);
            if (pendingMembership) {
                setMembership(pendingMembership);
                const teamData = await teamService.getTeamById(pendingMembership.team_id);
                setTeam(teamData);
            } else {
                // No pending membership, redirect to choose team
                navigate('/choose-team');
            }
        } catch (error) {
            console.error('Error loading pending membership:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelRequest = async () => {
        if (!membership) return;

        try {
            await teamService.cancelMembershipRequest(membership.id);
            navigate('/choose-team');
        } catch (error) {
            console.error('Error canceling request:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#132d24] to-[#1a3d32]">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#132d24] to-[#1a3d32] px-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-6">
                    <img src="/logo.png" alt="TenniTrack" className="h-24 mx-auto" />
                </div>
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
                            <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Waiting for Approval</h2>

                        {team && (
                            <p className="text-gray-600 mb-6">
                                Your request to join <strong>{team.name}</strong> is pending approval from the team admin.
                            </p>
                        )}

                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <p className="text-sm text-gray-600">
                                You'll be automatically redirected once your request is approved.
                                You can also refresh this page to check the status.
                            </p>
                        </div>

                        <button
                            onClick={handleCancelRequest}
                            className="w-full py-2 px-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel Request
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
