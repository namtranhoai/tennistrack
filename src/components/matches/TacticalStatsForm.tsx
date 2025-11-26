import { useState } from 'react';
import { SetTacticalStatsRow } from '@/types/extended';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUpdateSetTacticalStats } from '@/hooks/useSetStats';

interface TacticalStatsFormProps {
    setId: number;
    matchPlayerId: number;
    initialData?: SetTacticalStatsRow;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function TacticalStatsForm({ setId, matchPlayerId, initialData, onSuccess, onCancel }: TacticalStatsFormProps) {
    const updateMutation = useUpdateSetTacticalStats();

    const [formData, setFormData] = useState({
        game_deuce_played: initialData?.game_deuce_played ?? 0,
        game_deuce_won: initialData?.game_deuce_won ?? 0,
        bp_saved: initialData?.bp_saved ?? 0,
        bp_faced: initialData?.bp_faced ?? 0,
        game_from_40_0_lost: initialData?.game_from_40_0_lost ?? 0,
        deep_shots: initialData?.deep_shots ?? 0,
        mid_court_shots: initialData?.mid_court_shots ?? 0,
        short_balls_given: initialData?.short_balls_given ?? 0,
        shots_to_opponent_bh: initialData?.shots_to_opponent_bh ?? 0,
        shots_to_opponent_fh: initialData?.shots_to_opponent_fh ?? 0,
    });

    const handleChange = (field: keyof typeof formData, value: string) => {
        const numValue = value === '' ? 0 : parseInt(value);
        setFormData(prev => ({ ...prev, [field]: numValue }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateMutation.mutateAsync({ setId, matchPlayerId, data: formData });
            onSuccess?.();
        } catch (error) {
            console.error('Failed to update tactical stats:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Deuce Games */}
            <div className="space-y-4">
                <h4 className="font-semibold text-indigo-600">Deuce Games</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-muted-foreground">Deuce Games Played</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.game_deuce_played}
                            onChange={(e) => handleChange('game_deuce_played', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Deuce Games Won</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.game_deuce_won}
                            onChange={(e) => handleChange('game_deuce_won', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Break Points */}
            <div className="space-y-4">
                <h4 className="font-semibold text-indigo-600">Break Points</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm text-muted-foreground">BP Saved</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.bp_saved}
                            onChange={(e) => handleChange('bp_saved', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">BP Faced</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.bp_faced}
                            onChange={(e) => handleChange('bp_faced', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Games from 40-0 Lost</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.game_from_40_0_lost}
                            onChange={(e) => handleChange('game_from_40_0_lost', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Shot Placement */}
            <div className="space-y-4">
                <h4 className="font-semibold text-indigo-600">Shot Placement</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm text-muted-foreground">Deep Shots</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.deep_shots}
                            onChange={(e) => handleChange('deep_shots', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Mid Court Shots</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.mid_court_shots}
                            onChange={(e) => handleChange('mid_court_shots', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Short Balls Given</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.short_balls_given}
                            onChange={(e) => handleChange('short_balls_given', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Target Direction */}
            <div className="space-y-4">
                <h4 className="font-semibold text-indigo-600">Target Direction</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-muted-foreground">Shots to Opponent BH</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.shots_to_opponent_bh}
                            onChange={(e) => handleChange('shots_to_opponent_bh', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Shots to Opponent FH</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.shots_to_opponent_fh}
                            onChange={(e) => handleChange('shots_to_opponent_fh', e.target.value)}
                        />
                    </div>
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
                    Failed to update tactical stats. Please try again.
                </div>
            )}
        </form>
    );
}
