import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLiveMatch } from '../hooks/useLiveMatch';
import { formatMatchName } from '../lib/spInputHelpers';
import TabNavigation, { Tab } from '../components/live/TabNavigation';
import MatchInfoTab from '../components/live/MatchInfoTab';
import SetManagementTab from '../components/live/SetManagementTab';
import PlayerTrackingTab from '../components/live/PlayerTrackingTab';

type TabId = 'match' | 'sets' | 'stats';

export default function LiveMatchControlPage() {
    const { matchId } = useParams<{ matchId: string }>();
    const navigate = useNavigate();
    const numericMatchId = matchId ? parseInt(matchId, 10) : 0;

    const { data: match, isLoading, error } = useLiveMatch(numericMatchId);

    const [activeTab, setActiveTab] = useState<TabId>('match');
    const [selectedSetId, setSelectedSetId] = useState<number | null>(null);
    const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);

    // Define tabs
    const tabs: Tab[] = [
        {
            id: 'match',
            label: 'Match',
            icon: '📋',
        },
        {
            id: 'sets',
            label: 'Sets',
            icon: '🎾',
        },
        {
            id: 'stats',
            label: 'Stats',
            icon: '📊',
        },
    ];

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading match...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !match) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">Error loading match: {error?.message || 'Match not found'}</p>
                    <button
                        onClick={() => navigate('/dashboard/live')}
                        className="mt-4 text-red-600 hover:text-red-800 font-medium"
                    >
                        ← Back to Live Matches
                    </button>
                </div>
            </div>
        );
    }

    const matchName = formatMatchName(match.match_players);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4">
                <div className="max-w-7xl mx-auto">
                    <button
                        onClick={() => navigate('/dashboard/live')}
                        className="text-gray-600 hover:text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 touch-manipulation py-1"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm sm:text-base">Back</span>
                    </button>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                        <div>
                            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">{matchName}</h1>
                            <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                                <span className="font-medium">{match.format === 'singles' ? 'Singles' : 'Doubles'}</span>
                                <span className="hidden sm:inline">•</span>
                                <span>{match.surface}</span>
                                <span className="hidden sm:inline">•</span>
                                <span>{new Date(match.match_date).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div>
                            <span className="inline-block px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-800">
                                Live
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <TabNavigation
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={(tabId) => setActiveTab(tabId as TabId)}
            />

            {/* Tab Content */}
            <div className="max-w-7xl mx-auto">
                {activeTab === 'match' && <MatchInfoTab match={match} />}

                {activeTab === 'sets' && (
                    <SetManagementTab
                        match={match}
                        selectedSetId={selectedSetId}
                        onSelectSet={setSelectedSetId}
                    />
                )}

                {activeTab === 'stats' && (
                    <PlayerTrackingTab
                        match={match}
                        selectedSetId={selectedSetId}
                        selectedPlayerId={selectedPlayerId}
                        onSelectPlayer={setSelectedPlayerId}
                    />
                )}
            </div>
        </div>
    );
}
