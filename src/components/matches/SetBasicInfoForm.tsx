import { useState } from 'react';
import { SetRow } from '@/types/extended';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUpdateSetBasicInfo } from '@/hooks/useSetStats';

interface SetBasicInfoFormProps {
    set: SetRow;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function SetBasicInfoForm({ set, onSuccess, onCancel }: SetBasicInfoFormProps) {
    const updateMutation = useUpdateSetBasicInfo();

    const [formData, setFormData] = useState({
        games_side_a: set.games_side_a ?? 0,
        games_side_b: set.games_side_b ?? 0,
        tiebreak_played: set.tiebreak_played ?? false,
        tiebreak_score: set.tiebreak_score ?? '',
        notes: set.notes ?? '',
    });

    const handleChange = (field: keyof typeof formData, value: string | number | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateMutation.mutateAsync({
                setId: set.set_id,
                data: formData
            });
            onSuccess?.();
        } catch (error) {
            console.error('Failed to update set info:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <h4 className="font-semibold text-indigo-600">Set {set.set_number} - Basic Information</h4>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-muted-foreground">Side A Games</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.games_side_a}
                            onChange={(e) => handleChange('games_side_a', parseInt(e.target.value))}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Side B Games</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.games_side_b}
                            onChange={(e) => handleChange('games_side_b', parseInt(e.target.value))}
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="tiebreak"
                        checked={formData.tiebreak_played}
                        onChange={(e) => handleChange('tiebreak_played', e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="tiebreak" className="text-sm text-muted-foreground">
                        Tiebreak Played
                    </label>
                </div>

                {formData.tiebreak_played && (
                    <div>
                        <label className="text-sm text-muted-foreground">Tiebreak Score</label>
                        <Input
                            type="text"
                            placeholder="e.g., 7-5"
                            value={formData.tiebreak_score}
                            onChange={(e) => handleChange('tiebreak_score', e.target.value)}
                        />
                    </div>
                )}

                <div>
                    <label className="text-sm text-muted-foreground">Notes</label>
                    <textarea
                        className="w-full min-h-[80px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={formData.notes}
                        onChange={(e) => handleChange('notes', e.target.value)}
                        placeholder="Add any notes about this set..."
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>

            {updateMutation.isError && (
                <div className="text-sm text-red-600">
                    Failed to update set information. Please try again.
                </div>
            )}
        </form>
    );
}
