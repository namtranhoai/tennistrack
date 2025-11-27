import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as teamService from '../services/teamService';
import type { Database } from '../types/db';

type Team = Database['public']['Tables']['teams']['Row'];

export default function ChooseTeamPage() {
    const [mode, setMode] = useState<'select' | 'create' | 'join'>('select');
    const [teams, setTeams] = useState<Team[]>([]);
    const [newTeamName, setNewTeamName] = useState('');
    const [selectedTeamId, setSelectedTeamId] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingTeams, setLoadingTeams] = useState(false);
    const { user, teamMembership, refreshMembership, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    // Redirect logic based on membership status
    useEffect(() => {
        if (!authLoading && teamMembership) {
            if (teamMembership.status === 'approved') {
                navigate('/dashboard', { replace: true });
            } else if (teamMembership.status === 'pending') {
                navigate('/waiting-for-approval', { replace: true });
            }
        }
    }, [teamMembership, authLoading, navigate]);

    // Load teams when switching to join mode
    useEffect(() => {
        if (mode === 'join') {
            loadTeams();
        }
    }, [mode]);

    const loadTeams = async () => {
        setLoadingTeams(true);
        try {
            const allTeams = await teamService.getTeams();
            setTeams(allTeams);
        } catch (err) {
            console.error('Error loading teams:', err);
            setError('Failed to load teams');
        } finally {
            setLoadingTeams(false);
        }
    };

    const handleCreateTeam = async (e: FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setError('');
        setLoading(true);

        try {
            await teamService.createTeamAndSetAdmin(newTeamName, user.id);
            await refreshMembership();
            navigate('/dashboard');
        } catch (err: unknown) {
            if (err instanceof Error) {
                if (err.message.includes('already have')) {
                    setError('You already have a team membership. Each user can only belong to one team.');
                } else {
                    setError(err.message);
                }
            } else {
                setError('Failed to create team');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleJoinTeam = async (e: FormEvent) => {
        e.preventDefault();
        if (!user || !selectedTeamId) return;

        setError('');
        setLoading(true);

        try {
            await teamService.requestJoinTeam(selectedTeamId, user.id);
            navigate('/waiting-for-approval');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to join team');
            }
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#132d24] to-[#1a3d32]">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
                    <p className="text-white text-sm">Loading...</p>
                </div>
            </div>
        );
    }

    if (mode === 'select') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#132d24] to-[#1a3d32] px-4">
                <div className="max-w-2xl w-full">
                    <div className="text-center mb-6">
                        <img src="/logo.png" alt="TenniTrack" className="h-24 mx-auto" />
                    </div>
                    <div className="bg-white rounded-lg shadow-xl p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Team</h1>
                            <p className="text-gray-600">Create a new team or join an existing one</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <button
                                onClick={() => setMode('create')}
                                className="p-6 border-2 border-gray-200 rounded-lg hover:border-[#a3cf08] hover:bg-gray-50 transition-all group"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-[#a3cf08] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <svg className="w-8 h-8 text-[#132d24]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-2">Create New Team</h2>
                                    <p className="text-gray-600">Start your own team and invite others</p>
                                </div>
                            </button>

                            <button
                                onClick={() => setMode('join')}
                                className="p-6 border-2 border-gray-200 rounded-lg hover:border-[#a3cf08] hover:bg-gray-50 transition-all group"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-[#a3cf08] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <svg className="w-8 h-8 text-[#132d24]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-2">Join Existing Team</h2>
                                    <p className="text-gray-600">Request to join a team</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (mode === 'create') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#132d24] to-[#1a3d32] px-4">
                <div className="max-w-md w-full">
                    <div className="text-center mb-6">
                        <img src="/logo.png" alt="TenniTrack" className="h-24 mx-auto" />
                    </div>
                    <div className="bg-white rounded-lg shadow-xl p-8">
                        <button
                            onClick={() => setMode('select')}
                            className="mb-6 text-gray-600 hover:text-gray-900 flex items-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            Back
                        </button>

                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Team</h1>
                            <p className="text-gray-600">You'll be the team admin</p>
                        </div>

                        <form onSubmit={handleCreateTeam} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-2">
                                    Team Name
                                </label>
                                <input
                                    id="teamName"
                                    type="text"
                                    required
                                    value={newTeamName}
                                    onChange={(e) => setNewTeamName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a3cf08] focus:border-transparent"
                                    placeholder="Tennis Academy"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-4 bg-[#a3cf08] text-[#132d24] font-semibold rounded-lg hover:bg-[#8fb507] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Creating Team...' : 'Create Team'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    // Join mode
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#132d24] to-[#1a3d32] px-4">
            <div className="max-w-2xl w-full">
                <div className="text-center mb-6">
                    <img src="/logo.png" alt="TenniTrack" className="h-24 mx-auto" />
                </div>
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <button
                        onClick={() => setMode('select')}
                        className="mb-6 text-gray-600 hover:text-gray-900 flex items-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </button>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Join a Team</h1>
                        <p className="text-gray-600">Select a team to request membership</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    {loadingTeams ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#a3cf08]"></div>
                            <p className="mt-4 text-gray-600">Loading teams...</p>
                        </div>
                    ) : teams.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600">No teams available. Create your own team instead!</p>
                        </div>
                    ) : (
                        <form onSubmit={handleJoinTeam} className="space-y-6">
                            <div className="space-y-3">
                                {teams.map((team) => (
                                    <label
                                        key={team.id}
                                        className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedTeamId === team.id
                                            ? 'border-[#a3cf08] bg-green-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="team"
                                            value={team.id}
                                            checked={selectedTeamId === team.id}
                                            onChange={(e) => setSelectedTeamId(e.target.value)}
                                            className="sr-only"
                                        />
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{team.name}</h3>
                                                <p className="text-sm text-gray-500">
                                                    Created {new Date(team.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            {selectedTeamId === team.id && (
                                                <svg className="w-6 h-6 text-[#a3cf08]" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                    </label>
                                ))}
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !selectedTeamId}
                                className="w-full py-3 px-4 bg-[#a3cf08] text-[#132d24] font-semibold rounded-lg hover:bg-[#8fb507] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending Request...' : 'Request to Join'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
