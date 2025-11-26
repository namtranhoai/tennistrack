import { useState } from 'react';
import { SetRow, SetTechStatsRow, SetTacticalStatsRow, SetPhysicalMentalStatsRow, MatchPlayerRow } from '@/types/extended';
import TechnicalStatsForm from './TechnicalStatsForm';
import TacticalStatsForm from './TacticalStatsForm';
import PhysicalMentalStatsForm from './PhysicalMentalStatsForm';
import SetBasicInfoForm from './SetBasicInfoForm';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SetStatsEditorProps {
    set: SetRow & {
        set_player_tech_stats: SetTechStatsRow[];
        set_player_tactical_stats: SetTacticalStatsRow[];
        set_player_physical_mental_stats: SetPhysicalMentalStatsRow[];
    };
    matchPlayerId: number;
    playerInfo?: MatchPlayerRow & { players: { full_name: string; avatar_url: string | null } | null };
    isOpponent?: boolean;
    onClose: () => void;
}

type TabType = 'basic' | 'technical' | 'tactical' | 'physical';

export default function SetStatsEditor({ set, matchPlayerId, playerInfo, isOpponent = false, onClose }: SetStatsEditorProps) {
    const [expandedSections, setExpandedSections] = useState<Set<TabType>>(new Set(['basic']));

    // Filter stats for the specific match_player
    const techStats = set.set_player_tech_stats?.find(s => s.match_player_id === matchPlayerId);
    const tacticalStats = set.set_player_tactical_stats?.find(s => s.match_player_id === matchPlayerId);
    const pmStats = set.set_player_physical_mental_stats?.find(s => s.match_player_id === matchPlayerId);

    // Color scheme based on player type
    const colorScheme = isOpponent ? {
        primary: 'orange',
        bgGradient: 'from-orange-50 to-white',
        border: 'border-orange-200',
        text: 'text-orange-900',
        textLight: 'text-orange-600',
        buttonHover: 'hover:bg-orange-100 hover:text-orange-600',
        expandedBorder: 'border-orange-400',
        iconColor: 'text-orange-600'
    } : {
        primary: 'indigo',
        bgGradient: 'from-indigo-50 to-white',
        border: 'border-indigo-200',
        text: 'text-indigo-900',
        textLight: 'text-indigo-600',
        buttonHover: 'hover:bg-indigo-100 hover:text-indigo-600',
        expandedBorder: 'border-indigo-400',
        iconColor: 'text-indigo-600'
    };

    const playerName = playerInfo?.players?.full_name || playerInfo?.display_name || 'Player';

    const toggleSection = (section: TabType) => {
        setExpandedSections(prev => {
            const newSet = new Set(prev);
            if (newSet.has(section)) {
                newSet.delete(section);
            } else {
                newSet.add(section);
            }
            return newSet;
        });
    };

    const sections = [
        { id: 'basic' as TabType, label: 'Basic Info', icon: '📊', description: 'Games, tiebreak, and set result' },
        { id: 'technical' as TabType, label: 'Technical Stats', icon: '🎾', description: 'Serve, groundstrokes, net play' },
        { id: 'tactical' as TabType, label: 'Tactical Stats', icon: '🎯', description: 'Deuce games, break points, shot placement' },
        { id: 'physical' as TabType, label: 'Physical/Mental', icon: '💪', description: 'Ratings and coach notes' },
    ];

    return (
        <div className={`bg-gradient-to-br ${colorScheme.bgGradient} rounded-2xl border-2 ${colorScheme.border} shadow-xl p-6 space-y-4`}>
            <div className={`flex items-center justify-between pb-4 border-b-2 ${colorScheme.border}`}>
                <div>
                    <h3 className={`text-2xl font-bold ${colorScheme.text}`}>
                        Edit Set {set.set_number} Statistics
                    </h3>
                    <p className={`text-sm ${colorScheme.textLight} mt-1`}>
                        {playerName} {isOpponent && <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full ml-2">Opponent</span>}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Click on any section below to expand and edit</p>
                </div>
                <button
                    onClick={onClose}
                    className={`text-gray-400 transition-colors p-2 rounded-full ${colorScheme.buttonHover}`}
                    aria-label="Close"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Accordion Sections */}
            <div className="space-y-3">
                {sections.map((section) => {
                    const isExpanded = expandedSections.has(section.id);
                    return (
                        <div
                            key={section.id}
                            className={`border-2 rounded-xl transition-all ${isExpanded
                                ? `${colorScheme.expandedBorder} bg-white shadow-lg`
                                : `border-gray-200 bg-white hover:${colorScheme.border} hover:shadow-md`
                                }`}
                        >
                            <button
                                onClick={() => toggleSection(section.id)}
                                className="w-full px-6 py-4 flex items-center justify-between text-left transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl">{section.icon}</span>
                                    <div>
                                        <h4 className="font-semibold text-lg text-gray-900">{section.label}</h4>
                                        <p className="text-sm text-gray-500">{section.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {isExpanded ? (
                                        <ChevronUp className={`h-5 w-5 ${colorScheme.iconColor}`} />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-gray-400" />
                                    )}
                                </div>
                            </button>

                            {isExpanded && (
                                <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                                    {section.id === 'basic' && (
                                        <SetBasicInfoForm
                                            set={set}
                                            onSuccess={() => { }}
                                            onCancel={onClose}
                                        />
                                    )}
                                    {section.id === 'technical' && (
                                        <TechnicalStatsForm
                                            setId={set.set_id}
                                            matchPlayerId={matchPlayerId}
                                            initialData={techStats}
                                            onSuccess={() => { }}
                                            onCancel={onClose}
                                        />
                                    )}
                                    {section.id === 'tactical' && (
                                        <TacticalStatsForm
                                            setId={set.set_id}
                                            matchPlayerId={matchPlayerId}
                                            initialData={tacticalStats}
                                            onSuccess={() => { }}
                                            onCancel={onClose}
                                        />
                                    )}
                                    {section.id === 'physical' && (
                                        <PhysicalMentalStatsForm
                                            setId={set.set_id}
                                            matchPlayerId={matchPlayerId}
                                            initialData={pmStats}
                                            onSuccess={() => { }}
                                            onCancel={onClose}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className={`pt-4 border-t-2 ${colorScheme.border} text-center`}>
                <p className={`text-sm ${colorScheme.textLight}`}>
                    💡 Tip: You can expand multiple sections at once to edit different stats simultaneously
                </p>
            </div>
        </div>
    );
}
