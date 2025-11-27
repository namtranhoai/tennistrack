import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as teamService from '../services/teamService';
import type { TeamMemberWithProfile } from '../services/teamService';

export default function TeamAdminPage() {
    const [pendingRequests, setPendingRequests] = useState<TeamMemberWithProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { teamMembership } = useAuth();

    useEffect(() => {
        loadPendingRequests();
    }, [teamMembership]);

    const loadPendingRequests = async () => {
        if (!teamMembership || teamMembership.role !== 'admin') {
            setLoading(false);
            return;
        }

        try {
            const requests = await teamService.getPendingRequests(teamMembership.team_id);
            setPendingRequests(requests);
        } catch (err) {
            console.error('Error loading pending requests:', err);
            setError('Failed to load pending requests');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (membershipId: string) => {
        try {
            setError(''); // Clear any previous errors
            await teamService.approveMember(membershipId);
            // Reload the list
            await loadPendingRequests();
        } catch (err: any) {
            console.error('Error approving member:', err);
            const errorMessage = err?.message || 'Failed to approve member';
            const errorCode = err?.code ? ` (Code: ${err.code})` : '';
            const errorDetails = err?.details ? `\nDetails: ${err.details}` : '';
            const errorHint = err?.hint ? `\nHint: ${err.hint}` : '';
            setError(`${errorMessage}${errorCode}${errorDetails}${errorHint}`);
        }
    };

    const handleReject = async (membershipId: string) => {
        try {
            await teamService.rejectMember(membershipId);
            // Reload the list
            await loadPendingRequests();
        } catch (err) {
            console.error('Error rejecting member:', err);
            setError('Failed to reject member');
        }
    };

    if (!teamMembership || teamMembership.role !== 'admin') {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
                    You must be a team admin to access this page.
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#a3cf08]"></div>
                    <p className="mt-4 text-gray-600">Loading pending requests...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Management</h1>
                <p className="text-gray-600">Approve or reject membership requests</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 whitespace-pre-wrap">
                    {error}
                </div>
            )}

            {pendingRequests.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No Pending Requests</h3>
                    <p className="text-gray-600">There are no membership requests waiting for approval.</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="divide-y divide-gray-200">
                        {pendingRequests.map((request) => (
                            <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {request.profiles?.full_name || 'Unknown User'}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Requested {new Date(request.created_at).toLocaleDateString()} at{' '}
                                            {new Date(request.created_at).toLocaleTimeString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-3 ml-4">
                                        <button
                                            onClick={() => handleApprove(request.id)}
                                            className="px-4 py-2 bg-[#a3cf08] text-[#132d24] font-semibold rounded-lg hover:bg-[#8fb507] transition-colors"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(request.id)}
                                            className="px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition-colors"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
