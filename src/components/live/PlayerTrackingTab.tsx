import { MatchWithDetails } from '../../types/live';
import PlayerSelector from './PlayerSelector';
import SPInputPanel from './SPInputPanel';

interface PlayerTrackingTabProps {
    match: MatchWithDetails;
    selectedSetId: number | null;
    selectedPlayerId: number | null;
    onSelectPlayer: (playerId: number) => void;
}

export default function PlayerTrackingTab({
    match,
    selectedSetId,
    selectedPlayerId,
    onSelectPlayer
}: PlayerTrackingTabProps) {
    // Find selected player info
    const selectedPlayer = match.match_players.find(p => p.match_player_id === selectedPlayerId);

    // Find selected set info
    const selectedSet = match.sets?.find(s => s.set_id === selectedSetId);
    const setNumber = selectedSet ? match.sets?.indexOf(selectedSet)! + 1 : undefined;

    return (
        <div className="p-4 sm:p-6 space-y-6">
            {/* Instructions when no set selected */}
            {!selectedSetId && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 text-center">
                    <p className="text-blue-800 font-medium text-sm sm:text-base">
                        Please select or create a set in the "Sets" tab first
                    </p>
                </div>
            )}

            {/* Player Selector */}
            {selectedSetId && (
                <>
                    <PlayerSelector
                        players={match.match_players}
                        selectedPlayerId={selectedPlayerId}
                        onSelectPlayer={onSelectPlayer}
                    />

                    {/* Instructions when no player selected */}
                    {!selectedPlayerId && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 text-center">
                            <p className="text-blue-800 font-medium text-sm sm:text-base">
                                Select a player above to track their stats
                            </p>
                        </div>
                    )}

                    {/* SP-Input Panel */}
                    {selectedPlayerId && (
                        <SPInputPanel
                            matchId={match.match_id}
                            setId={selectedSetId}
                            matchPlayerId={selectedPlayerId}
                            playerName={selectedPlayer?.display_name}
                            playerAvatar={selectedPlayer?.avatar_url}
                            setNumber={setNumber}
                        />
                    )}
                </>
            )}
        </div>
    );
}
