import { useCreateSet } from '../../hooks/useCreateSet';
import { SetWithStatus } from '../../types/live';

interface SetSelectorProps {
    matchId: number;
    sets: SetWithStatus[];
    selectedSetId: number | null;
    onSelectSet: (setId: number) => void;
}

export default function SetSelector({ matchId, sets, selectedSetId, onSelectSet }: SetSelectorProps) {
    const createSet = useCreateSet();

    const handleCreateSet = async () => {
        try {
            const newSet = await createSet.mutateAsync({ matchId });
            onSelectSet((newSet as any).set_id);
        } catch (err) {
            console.error('Error creating set:', err);
            alert('Failed to create set');
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            planned: 'bg-gray-100 text-gray-700',
            in_progress: 'bg-blue-100 text-blue-800',
            finished: 'bg-green-100 text-green-800',
        };

        return (
            <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status as keyof typeof styles] || styles.planned}`}>
                {status.replace('_', ' ')}
            </span>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Sets</h2>
                <button
                    onClick={handleCreateSet}
                    disabled={createSet.isPending}
                    className="w-full sm:w-auto bg-green-600 text-white px-4 py-3 sm:py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center justify-center gap-2 touch-manipulation"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {createSet.isPending ? 'Creating...' : 'Create New Set'}
                </button>
            </div>

            {sets.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p className="text-sm sm:text-base">No sets yet. Create the first set to begin tracking.</p>
                </div>
            ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {sets.map((set) => (
                        <div
                            key={set.set_id}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all touch-manipulation ${selectedSetId === set.set_id
                                    ? 'border-green-600 bg-green-50'
                                    : 'border-gray-200 hover:border-gray-300 bg-white active:bg-gray-50'
                                }`}
                            onClick={() => onSelectSet(set.set_id)}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-bold text-lg">Set {set.set_number}</h3>
                                {getStatusBadge(set.status)}
                            </div>

                            <div className="text-3xl font-bold text-gray-900 mb-2">
                                {set.games_side_a ?? 0} - {set.games_side_b ?? 0}
                            </div>

                            {set.tiebreak_played && set.tiebreak_score && (
                                <div className="text-sm text-gray-600">
                                    Tiebreak: {set.tiebreak_score}
                                </div>
                            )}

                            {selectedSetId === set.set_id && (
                                <div className="mt-3 pt-3 border-t border-green-200">
                                    <span className="text-sm font-medium text-green-700">✓ Selected</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
