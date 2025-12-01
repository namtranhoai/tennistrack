import { MatchPlayer } from '../../types/live';

interface PlayerSelectorProps {
    players: MatchPlayer[];
    selectedPlayerId: number | null;
    onSelectPlayer: (playerId: number) => void;
}

export default function PlayerSelector({ players, selectedPlayerId, onSelectPlayer }: PlayerSelectorProps) {
    const sideA = players.filter(p => p.side === 'A');
    const sideB = players.filter(p => p.side === 'B');

    const renderPlayer = (player: MatchPlayer) => {
        const isSelected = selectedPlayerId === player.match_player_id;
        const avatarUrl = player.players?.avatar_url;

        return (
            <button
                key={player.match_player_id}
                onClick={() => onSelectPlayer(player.match_player_id)}
                className={`flex items-center gap-3 p-4 sm:p-5 rounded-lg border-2 transition-all touch-manipulation ${isSelected
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white active:bg-gray-50'
                    }`}
            >
                <div className="flex-shrink-0">
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt={player.display_name}
                            className="w-14 h-14 sm:w-12 sm:h-12 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-14 h-14 sm:w-12 sm:h-12 rounded-full bg-green-600 flex items-center justify-center">
                            <span className="text-white font-bold text-xl sm:text-lg">
                                {player.display_name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex-1 text-left">
                    <div className="font-bold text-gray-900 text-base sm:text-sm">{player.display_name}</div>
                    <div className="text-sm text-gray-600 capitalize">{player.role.replace('_', ' ')}</div>
                </div>

                {isSelected && (
                    <div className="flex-shrink-0">
                        <svg className="w-7 h-7 sm:w-6 sm:h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
            </button>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Select Player to Track</h2>

            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                {/* Side A */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Side A</h3>
                    <div className="space-y-3">
                        {sideA.map(renderPlayer)}
                    </div>
                </div>

                {/* Side B */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Side B</h3>
                    <div className="space-y-3">
                        {sideB.map(renderPlayer)}
                    </div>
                </div>
            </div>
        </div>
    );
}
