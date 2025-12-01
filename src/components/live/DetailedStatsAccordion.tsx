import { useState } from 'react';
import { DetailedStats } from '../../types/live';

interface DetailedStatsAccordionProps {
    stats: DetailedStats;
    onUpdate: (stats: Partial<DetailedStats>) => void;
    onSave: () => void;
    onDerive: () => void;
    isSaving: boolean;
}

export default function DetailedStatsAccordion({ stats, onUpdate, onSave, onDerive, isSaving }: DetailedStatsAccordionProps) {
    const [openSections, setOpenSections] = useState<string[]>([]);
    const [isCollapsed, setIsCollapsed] = useState(true); // Collapsed by default

    const toggleSection = (section: string) => {
        setOpenSections(prev =>
            prev.includes(section)
                ? prev.filter(s => s !== section)
                : [...prev, section]
        );
    };

    const renderNumberInput = (label: string, field: keyof DetailedStats) => {
        return (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
                <input
                    type="number"
                    min="0"
                    value={stats[field] as number || 0}
                    onChange={(e) => onUpdate({ [field]: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
            </div>
        );
    };

    const renderFractionInput = (label: string, numeratorField: keyof DetailedStats, denominatorField: keyof DetailedStats) => {
        const numerator = stats[numeratorField] as number || 0;
        const denominator = stats[denominatorField] as number || 0;
        const percentage = denominator > 0 ? Math.round((numerator / denominator) * 100) : 0;

        return (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
                <div className="flex gap-2 items-center">
                    <input
                        type="number"
                        min="0"
                        value={numerator}
                        onChange={(e) => onUpdate({ [numeratorField]: parseInt(e.target.value) || 0 })}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Made"
                    />
                    <span className="text-gray-500">/</span>
                    <input
                        type="number"
                        min="0"
                        value={denominator}
                        onChange={(e) => onUpdate({ [denominatorField]: parseInt(e.target.value) || 0 })}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Total"
                    />
                    <span className="text-sm font-medium text-green-600 ml-2">
                        {percentage}%
                    </span>
                </div>
            </div>
        );
    };

    const renderSection = (title: string, sectionKey: string, content: React.ReactNode) => {
        const isOpen = openSections.includes(sectionKey);

        return (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                    onClick={() => toggleSection(sectionKey)}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                    <h4 className="font-semibold text-gray-900">{title}</h4>
                    <svg
                        className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                {isOpen && (
                    <div className="p-4 bg-white">
                        {content}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            {/* Collapsible Header */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="w-full flex items-center justify-between mb-4 hover:bg-gray-50 p-3 rounded-lg transition-colors touch-manipulation"
            >
                <div className="text-left">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">Detailed Stats (Optional)</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        {isCollapsed ? 'Click to expand for detailed statistics' : 'Complete statistical breakdown'}
                    </p>
                </div>
                <svg
                    className={`w-6 h-6 text-gray-500 transition-transform ${isCollapsed ? '' : 'rotate-180'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Collapsible Content */}
            {!isCollapsed && (
                <div className="space-y-4">
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-gray-200">
                        <div className="flex gap-3">
                            <button
                                onClick={onDerive}
                                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-medium transition-colors text-sm sm:text-base touch-manipulation"
                            >
                                Auto-Fill from Events
                            </button>
                            <button
                                onClick={onSave}
                                disabled={isSaving}
                                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors text-sm sm:text-base touch-manipulation"
                            >
                                {isSaving ? 'Saving...' : 'Save All Stats'}
                            </button>
                        </div>
                    </div>

                    {/* Serve Stats */}
                    {renderSection('Serve Stats', 'serve', (
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                {renderFractionInput('1st Serve %', 'first_serve_in', 'first_serve_total')}
                                {renderFractionInput('1st Serve Points Won', 'first_serve_points_won', 'first_serve_in')}
                                {renderFractionInput('2nd Serve %', 'second_serve_in', 'second_serve_total')}
                                {renderFractionInput('2nd Serve Points Won', 'second_serve_points_won', 'second_serve_in')}
                            </div>
                            <div className="space-y-4">
                                {renderNumberInput('Aces', 'aces')}
                                {renderNumberInput('Double Faults', 'double_faults')}
                                {renderNumberInput('Serve +1 Points Won', 'serve_plus1_points_won')}
                            </div>
                        </div>
                    ))}

                    {/* Return Stats */}
                    {renderSection('Return Stats', 'return', (
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                {renderFractionInput('Returns In', 'returns_in', 'returns_total')}
                                {renderNumberInput('Deep Returns', 'deep_returns')}
                                {renderNumberInput('Return Winners', 'return_winners')}
                            </div>
                            <div className="space-y-4">
                                {renderNumberInput('Return Unforced Errors', 'return_unforced_errors')}
                                {renderFractionInput('Break Points Won', 'break_points_won', 'break_points_total')}
                                {renderNumberInput('Breaks Won', 'breaks_won')}
                            </div>
                        </div>
                    ))}

                    {/* Rally Stats */}
                    {renderSection('Rally Stats', 'rally', (
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                {renderNumberInput('Average Rally Length', 'avg_rally_length')}
                                {renderNumberInput('Long Rallies Won', 'long_rallies_won')}
                                {renderNumberInput('Long Rallies Lost', 'long_rallies_lost')}
                            </div>
                            <div className="space-y-4">
                                {renderFractionInput('Attacking Points Won', 'attacking_points_won', 'attacking_points_played')}
                                {renderFractionInput('Defensive Points Won', 'defensive_points_won', 'defensive_points_played')}
                            </div>
                        </div>
                    ))}

                    {/* Groundstroke Stats */}
                    {renderSection('Groundstroke Stats', 'groundstrokes', (
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <h5 className="font-medium text-gray-700">Forehand</h5>
                                {renderNumberInput('FH Winners', 'fh_winners')}
                                {renderNumberInput('FH Unforced Errors', 'fh_unforced_errors')}
                                {renderNumberInput('FH Forced Errors Drawn', 'fh_forced_errors_drawn')}
                            </div>
                            <div className="space-y-4">
                                <h5 className="font-medium text-gray-700">Backhand</h5>
                                {renderNumberInput('BH Winners', 'bh_winners')}
                                {renderNumberInput('BH Unforced Errors', 'bh_unforced_errors')}
                                {renderNumberInput('BH Forced Errors Drawn', 'bh_forced_errors_drawn')}
                            </div>
                        </div>
                    ))}

                    {/* Net Play Stats */}
                    {renderSection('Net Play Stats', 'net', (
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                {renderFractionInput('Net Points Won', 'net_points_won', 'net_approaches')}
                                {renderNumberInput('Volley Winners', 'volley_winners')}
                            </div>
                            <div className="space-y-4">
                                {renderNumberInput('Volley Errors', 'volley_errors')}
                                {renderNumberInput('Smash Winners', 'smash_winners')}
                                {renderNumberInput('Smash Errors', 'smash_errors')}
                            </div>
                        </div>
                    ))}

                    {/* Tactical Stats */}
                    {renderSection('Tactical Stats', 'tactical', (
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                {renderNumberInput('Deuce Games Played', 'game_deuce_played')}
                                {renderNumberInput('Deuce Games Won', 'game_deuce_won')}
                                {renderNumberInput('Break Points Saved', 'bp_saved')}
                                {renderNumberInput('Break Points Faced', 'bp_faced')}
                                {renderNumberInput('Games from 40-0 Lost', 'game_from_40_0_lost')}
                            </div>
                            <div className="space-y-4">
                                {renderNumberInput('Deep Shots', 'deep_shots')}
                                {renderNumberInput('Mid Court Shots', 'mid_court_shots')}
                                {renderNumberInput('Short Balls Given', 'short_balls_given')}
                                {renderNumberInput('Shots to Opponent BH', 'shots_to_opponent_bh')}
                                {renderNumberInput('Shots to Opponent FH', 'shots_to_opponent_fh')}
                            </div>
                        </div>
                    ))}

                    {/* Physical & Mental Stats */}
                    {renderSection('Physical & Mental Stats', 'physical', (
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Speed Rating (1-10)
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={stats.speed_rating}
                                        onChange={(e) => onUpdate({ speed_rating: parseInt(e.target.value) })}
                                        className="w-full"
                                    />
                                    <div className="text-center font-bold text-lg text-green-600">{stats.speed_rating}</div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Recovery Rating (1-10)
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={stats.recovery_rating}
                                        onChange={(e) => onUpdate({ recovery_rating: parseInt(e.target.value) })}
                                        className="w-full"
                                    />
                                    <div className="text-center font-bold text-lg text-green-600">{stats.recovery_rating}</div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Confidence Rating (1-10)
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={stats.confidence_rating}
                                        onChange={(e) => onUpdate({ confidence_rating: parseInt(e.target.value) })}
                                        className="w-full"
                                    />
                                    <div className="text-center font-bold text-lg text-green-600">{stats.confidence_rating}</div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Emotion Control (1-10)
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={stats.emotion_control}
                                        onChange={(e) => onUpdate({ emotion_control: parseInt(e.target.value) })}
                                        className="w-full"
                                    />
                                    <div className="text-center font-bold text-lg text-green-600">{stats.emotion_control}</div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Focus Rating (1-10)
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={stats.focus_rating}
                                        onChange={(e) => onUpdate({ focus_rating: parseInt(e.target.value) })}
                                        className="w-full"
                                    />
                                    <div className="text-center font-bold text-lg text-green-600">{stats.focus_rating}</div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tactical Adjustment (1-10)
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={stats.tactical_adjustment}
                                        onChange={(e) => onUpdate({ tactical_adjustment: parseInt(e.target.value) })}
                                        className="w-full"
                                    />
                                    <div className="text-center font-bold text-lg text-green-600">{stats.tactical_adjustment}</div>
                                </div>

                                {renderNumberInput('Fatigue Errors', 'fatigue_errors')}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Coach Notes
                                    </label>
                                    <textarea
                                        value={stats.coach_notes}
                                        onChange={(e) => onUpdate({ coach_notes: e.target.value })}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Add observations, tactical notes, or other comments..."
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
