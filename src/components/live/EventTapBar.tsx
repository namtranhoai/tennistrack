import { EventCounters } from '../../types/live';

interface EventTapBarProps {
    counters: EventCounters;
    onIncrement: (eventKey: keyof EventCounters) => void;
    onDecrement: (eventKey: keyof EventCounters) => void;
    playerName?: string;
    playerAvatar?: string;
    setNumber?: number;
}

export default function EventTapBar({
    counters,
    onIncrement,
    onDecrement,
    playerName,
    playerAvatar,
    setNumber
}: EventTapBarProps) {
    const events = [
        { key: 'fhWinners' as keyof EventCounters, label: 'FH Winner', color: 'green' },
        { key: 'bhWinners' as keyof EventCounters, label: 'BH Winner', color: 'green' },
        { key: 'fhUnforcedErrors' as keyof EventCounters, label: 'FH Unforced Error', color: 'red' },
        { key: 'bhUnforcedErrors' as keyof EventCounters, label: 'BH Unforced Error', color: 'red' },
        { key: 'aces' as keyof EventCounters, label: 'Ace', color: 'green' },
        { key: 'doubleFaults' as keyof EventCounters, label: 'Double Fault', color: 'red' },
        { key: 'netErrors' as keyof EventCounters, label: 'Net Error', color: 'red' },
        { key: 'longRalliesWon' as keyof EventCounters, label: 'Long Rally Won', color: 'blue' },
        { key: 'longRalliesLost' as keyof EventCounters, label: 'Long Rally Lost', color: 'orange' },
        { key: 'volleyWinners' as keyof EventCounters, label: 'Volley Winner', color: 'green' },
        { key: 'volleyErrors' as keyof EventCounters, label: 'Volley Error', color: 'red' },
    ];

    const getColorClasses = (color: string) => {
        const colors = {
            green: 'text-green-700',
            red: 'text-red-700',
            blue: 'text-blue-700',
            orange: 'text-orange-700',
        };
        return colors[color as keyof typeof colors] || colors.blue;
    };

    const totalWinners = counters.fhWinners + counters.bhWinners + counters.aces + counters.volleyWinners;
    const totalErrors = counters.fhUnforcedErrors + counters.bhUnforcedErrors + counters.doubleFaults + counters.netErrors + counters.volleyErrors;

    return (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            {/* Player & Set Info Header */}
            <div className="mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3 sm:gap-4">
                    {/* Player Avatar */}
                    <div className="flex-shrink-0">
                        {playerAvatar ? (
                            <img
                                src={playerAvatar}
                                alt={playerName || 'Player'}
                                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-green-500"
                            />
                        ) : (
                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-green-500 flex items-center justify-center border-2 border-green-600">
                                <span className="text-white font-bold text-lg sm:text-2xl">
                                    {playerName ? playerName.charAt(0).toUpperCase() : '?'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Player Name & Set Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                            {playerName || 'Unknown Player'}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            {setNumber && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                    Set {setNumber}
                                </span>
                            )}
                            <span className="text-xs sm:text-sm text-gray-600">
                                Live Tracking
                            </span>
                        </div>
                    </div>

                    {/* Live Indicator */}
                    <div className="flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs sm:text-sm font-medium text-green-600">LIVE</span>
                        </div>
                    </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mt-3">
                    Tap +/− to record events (auto-saves when switching players)
                </p>
            </div>

            {/* Event List */}
            <div className="space-y-2 mb-4 max-h-[60vh] overflow-y-auto">
                {events.map((event) => {
                    const count = counters[event.key];
                    const canDecrement = count > 0;

                    return (
                        <div
                            key={event.key}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                            {/* Event Label */}
                            <div className={`flex-1 font-medium ${getColorClasses(event.color)}`}>
                                {event.label}
                            </div>

                            {/* Counter Controls */}
                            <div className="flex items-center gap-2">
                                {/* Decrement Button */}
                                <button
                                    onClick={() => onDecrement(event.key)}
                                    disabled={!canDecrement}
                                    className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-200 text-gray-700 font-bold text-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-300 active:bg-gray-400 transition-colors touch-manipulation"
                                    aria-label={`Decrease ${event.label}`}
                                >
                                    −
                                </button>

                                {/* Counter Display */}
                                <div className="w-16 text-center">
                                    <span className="text-2xl font-bold text-gray-900">{count}</span>
                                </div>

                                {/* Increment Button */}
                                <button
                                    onClick={() => onIncrement(event.key)}
                                    className="w-12 h-12 flex items-center justify-center rounded-lg bg-green-600 text-white font-bold text-xl hover:bg-green-700 active:bg-green-800 transition-colors touch-manipulation"
                                    aria-label={`Increase ${event.label}`}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Summary Bar */}
            <div className="sticky bottom-0 bg-white border-t-2 border-gray-200 pt-4 -mx-4 -mb-4 px-4 pb-4 sm:-mx-6 sm:-mb-6 sm:px-6 sm:pb-6">
                <div className="grid grid-cols-2 gap-4 text-sm sm:text-base">
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <div className="text-green-600 text-xs font-medium mb-1">Total Winners</div>
                        <div className="text-2xl font-bold text-green-700">{totalWinners}</div>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                        <div className="text-red-600 text-xs font-medium mb-1">Total Errors</div>
                        <div className="text-2xl font-bold text-red-700">{totalErrors}</div>
                    </div>
                </div>
                <div className="mt-3 text-xs text-gray-500 text-center">
                    Auto-saves when switching players
                </div>
            </div>
        </div>
    );
}
