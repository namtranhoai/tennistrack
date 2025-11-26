import { usePlayers } from '@/hooks/usePlayers';
import { PlayerAvatar } from '@/components/players/PlayerAvatar';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

interface PlayerSelectorProps {
    selectedPlayerId?: number;
    onSelect: (playerId: number | undefined) => void;
    label: string;
    excludePlayerId?: number; // Exclude this player from the list
}

export function PlayerSelector({
    selectedPlayerId,
    onSelect,
    label,
    excludePlayerId,
}: PlayerSelectorProps) {
    const { data: players, isLoading } = usePlayers();
    const [isOpen, setIsOpen] = useState(false);

    const selectedPlayer = players?.find((p) => p.player_id === selectedPlayerId);
    const availablePlayers =
        players?.filter((p) => p.player_id !== excludePlayerId) || [];

    if (isLoading) {
        return (
            <div className="w-full">
                <label className="block text-sm font-medium mb-2">{label}</label>
                <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
            </div>
        );
    }

    return (
        <div className="w-full">
            <label className="block text-sm font-medium mb-2">{label}</label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between gap-2 rounded-lg border bg-white px-4 py-3 text-left text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    {selectedPlayer ? (
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <PlayerAvatar
                                url={selectedPlayer.avatar_url}
                                alt={selectedPlayer.full_name}
                                size="sm"
                            />
                            <span className="font-medium truncate">
                                {selectedPlayer.full_name}
                            </span>
                        </div>
                    ) : (
                        <span className="text-muted-foreground">Select a player...</span>
                    )}
                    <ChevronsUpDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </button>

                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown */}
                        <div className="absolute z-20 mt-2 w-full max-h-80 overflow-auto rounded-lg border bg-white shadow-lg">
                            {availablePlayers.length === 0 ? (
                                <div className="px-4 py-3 text-sm text-muted-foreground">
                                    No players available
                                </div>
                            ) : (
                                <>
                                    {selectedPlayerId && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onSelect(undefined);
                                                setIsOpen(false);
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-muted-foreground border-b"
                                        >
                                            Clear selection
                                        </button>
                                    )}
                                    {availablePlayers.map((player) => (
                                        <button
                                            key={player.player_id}
                                            type="button"
                                            onClick={() => {
                                                onSelect(player.player_id);
                                                setIsOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 transition-colors"
                                        >
                                            <PlayerAvatar
                                                url={player.avatar_url}
                                                alt={player.full_name}
                                                size="sm"
                                            />
                                            <span className="flex-1 font-medium truncate">
                                                {player.full_name}
                                            </span>
                                            {selectedPlayerId === player.player_id && (
                                                <Check className="h-4 w-4 text-primary flex-shrink-0" />
                                            )}
                                        </button>
                                    ))}
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
