import { useNavigate } from 'react-router-dom';
import { useLiveMatches } from '../hooks/useLiveMatches';
import { useStartMatch } from '../hooks/useMatches';
import { formatMatchName } from '../lib/spInputHelpers';
import { LiveMatch } from '../types/live';

export default function LiveMatchesPage() {
    const navigate = useNavigate();
    const { data: matches, isLoading, error } = useLiveMatches();
    const startMatch = useStartMatch();

    const handleStartMatch = async (matchId: number) => {
        try {
            await startMatch.mutateAsync(matchId);
            navigate(`/dashboard/live/${matchId}`);
        } catch (err) {
            console.error('Error starting match:', err);
            alert('Failed to start match');
        }
    };

    const handleContinueLive = (matchId: number) => {
        navigate(`/dashboard/live/${matchId}`);
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            scheduled: 'bg-blue-100 text-blue-800',
            in_progress: 'bg-green-100 text-green-800',
            completed: 'bg-gray-100 text-gray-800',
        };

        const labels = {
            scheduled: 'Scheduled',
            in_progress: 'Live',
            completed: 'Completed',
        };

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status as keyof typeof styles] || styles.scheduled}`}>
                {labels[status as keyof typeof labels] || status}
            </span>
        );
    };

    const renderMatchCard = (match: LiveMatch) => {
        const matchName = formatMatchName(match.match_players);
        const isScheduled = match.status === 'scheduled';
        const isInProgress = match.status === 'in_progress';

        return (
            <div key={match.match_id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{matchName}</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                            <p><span className="font-medium">Format:</span> {match.format === 'singles' ? 'Singles' : 'Doubles'}</p>
                            <p><span className="font-medium">Surface:</span> {match.surface}</p>
                            <p><span className="font-medium">Date:</span> {new Date(match.match_date).toLocaleDateString()}</p>
                            {match.location && <p><span className="font-medium">Location:</span> {match.location}</p>}
                        </div>
                    </div>
                    <div>
                        {getStatusBadge(match.status)}
                    </div>
                </div>

                <div className="flex gap-3">
                    {isScheduled && (
                        <button
                            onClick={() => handleStartMatch(match.match_id)}
                            disabled={startMatch.isPending}
                            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                        >
                            {startMatch.isPending ? 'Starting...' : 'Start Live Tracking'}
                        </button>
                    )}
                    {isInProgress && (
                        <button
                            onClick={() => handleContinueLive(match.match_id)}
                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                        >
                            Continue Live Tracking
                        </button>
                    )}
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading live matches...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">Error loading matches: {error.message}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Match Tracking</h1>
                <p className="text-gray-600">Select a match to start or continue live tracking</p>
            </div>

            {matches && matches.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                    {matches.map(renderMatchCard)}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <div className="max-w-md mx-auto">
                        <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Live Matches</h3>
                        <p className="text-gray-600 mb-6">
                            There are no scheduled or in-progress matches. Create a new match to get started.
                        </p>
                        <button
                            onClick={() => navigate('/dashboard/matches/new')}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium transition-colors"
                        >
                            Create New Match
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
