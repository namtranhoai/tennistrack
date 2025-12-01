import { useSPInput } from '../../hooks/useSPInput';
import EventTapBar from './EventTapBar';
import DetailedStatsAccordion from './DetailedStatsAccordion';

interface SPInputPanelProps {
    matchId: number;
    setId: number;
    matchPlayerId: number;
    playerName?: string;
    playerAvatar?: string;
    setNumber?: number;
}

export default function SPInputPanel({ setId, matchPlayerId, playerName, playerAvatar, setNumber }: SPInputPanelProps) {
    const {
        state,
        incrementEvent,
        decrementEvent,
        updateDetailedStats,
        deriveDetailedStats,
        saveDetailedStats,
        isLoadingStats,
        isSavingStats,
    } = useSPInput(setId, matchPlayerId);

    if (isLoadingStats) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-center h-32">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                        <p className="text-gray-600">Loading stats...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Event Tap Bar */}
            <EventTapBar
                counters={state.eventCounters}
                onIncrement={incrementEvent}
                onDecrement={decrementEvent}
                playerName={playerName}
                playerAvatar={playerAvatar}
                setNumber={setNumber}
            />

            {/* Detailed Stats */}
            <DetailedStatsAccordion
                stats={state.detailedStats}
                onUpdate={updateDetailedStats}
                onSave={saveDetailedStats}
                onDerive={deriveDetailedStats}
                isSaving={isSavingStats}
            />
        </div>
    );
}
