import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as teamService from '../services/teamService';
import type { TeamMemberWithProfile } from '../services/teamService';

export default function TeamAdminPage() {
    const [pendingRequests, setPendingRequests] = useState<TeamMemberWithProfile[]>([]);
    const [teamMembers, setTeamMembers] = useState<TeamMemberWithProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [confirmDialog, setConfirmDialog] = useState<{
        show: boolean;
        action: 'activate' | 'deactivate' | null;
        membershipId: string | null;
        memberName: string | null;
    }>({ show: false, action: null, membershipId: null, memberName: null });
    const { teamMembership } = useAuth();

    useEffect(() => {
        loadData();
    }, [teamMembership]);

    const loadData = async () => {
        if (!teamMembership || teamMembership.role !== 'admin') {
            setLoading(false);
            return;
        }

        try {
            const [requests, members] = await Promise.all([
                teamService.getPendingRequests(teamMembership.team_id),
                teamService.getTeamMembers(teamMembership.team_id)
            ]);
            setPendingRequests(requests);
            setTeamMembers(members);
        } catch (err) {
            console.error('Error loading data:', err);
            setError('Failed to load team data');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (membershipId: string) => {
        try {
            setError('');
            await teamService.approveMember(membershipId);
            await loadData();
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
            await loadData();
        } catch (err) {
            console.error('Error rejecting member:', err);
            setError('Failed to reject member');
        }
    };

    const showConfirmDialog = (action: 'activate' | 'deactivate', membershipId: string, memberName: string) => {
        setConfirmDialog({ show: true, action, membershipId, memberName });
    };

    const handleConfirmAction = async () => {
        if (!confirmDialog.membershipId || !confirmDialog.action) return;

        try {
            setError('');
            if (confirmDialog.action === 'deactivate') {
                await teamService.deactivateMember(confirmDialog.membershipId);
            } else {
                await teamService.activateMember(confirmDialog.membershipId);
            }
            await loadData();
            setConfirmDialog({ show: false, action: null, membershipId: null, memberName: null });
        } catch (err) {
            console.error(`Error ${confirmDialog.action}ing member:`, err);
            setError(`Failed to ${confirmDialog.action} member`);
            setConfirmDialog({ show: false, action: null, membershipId: null, memberName: null });
        }
    };

    const cancelConfirmDialog = () => {
        setConfirmDialog({ show: false, action: null, membershipId: null, memberName: null });
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
                    <p className="mt-4 text-gray-600">Loading team data...</p>
                </div>
            </div>
        );
    }

    const activeMembers = teamMembers.filter(m => m.is_active !== false);
    const inactiveMembers = teamMembers.filter(m => m.is_active === false);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Management</h1>
                <p className="text-gray-600">Manage team members and membership requests</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 whitespace-pre-wrap">
                    {error}
                </div>
            )}

            {/* Confirmation Dialog */}
            {confirmDialog.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Confirm {confirmDialog.action === 'deactivate' ? 'Deactivation' : 'Activation'}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to {confirmDialog.action} <strong>{confirmDialog.memberName}</strong>?
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={cancelConfirmDialog}
                                className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmAction}
                                className={`px-4 py-2 font-semibold rounded-lg transition-colors ${confirmDialog.action === 'deactivate'
                                        ? 'bg-red-600 text-white hover:bg-red-700'
                                        : 'bg-[#a3cf08] text-[#132d24] hover:bg-[#8fb507]'
                                    }`}
                            >
                                {confirmDialog.action === 'deactivate' ? 'Deactivate' : 'Activate'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-8">
                {/* Pending Requests Section */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Requests</h2>
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

                {/* Active Team Members Section */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Active Members ({activeMembers.length})
                    </h2>
                    {activeMembers.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-8 text-center">
                            <p className="text-gray-600">No active team members.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Member
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Joined
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {activeMembers.map((member) => (
                                        <tr key={member.id} data-testid="team-member" className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-[#a3cf08] rounded-full flex items-center justify-center">
                                                        <span className="text-[#132d24] font-semibold">
                                                            {(member.profiles?.full_name || 'U')[0].toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {member.profiles?.full_name || 'Unknown User'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${member.role === 'admin'
                                                        ? 'bg-purple-100 text-purple-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {member.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(member.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {member.role !== 'admin' && (
                                                    <button
                                                        onClick={() => showConfirmDialog('deactivate', member.id, member.profiles?.full_name || 'Unknown User')}
                                                        className="text-red-600 hover:text-red-900 font-semibold"
                                                    >
                                                        Deactivate
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Inactive Team Members Section */}
                {inactiveMembers.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Inactive Members ({inactiveMembers.length})
                        </h2>
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Member
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Joined
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {inactiveMembers.map((member) => (
                                        <tr key={member.id} data-testid="team-member" className="hover:bg-gray-50 opacity-60">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                                                        <span className="text-gray-600 font-semibold">
                                                            {(member.profiles?.full_name || 'U')[0].toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                                            {member.profiles?.full_name || 'Unknown User'}
                                                            <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded">
                                                                Inactive
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-600">
                                                    {member.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(member.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => showConfirmDialog('activate', member.id, member.profiles?.full_name || 'Unknown User')}
                                                    className="text-[#a3cf08] hover:text-[#8fb507] font-semibold"
                                                >
                                                    Activate
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
