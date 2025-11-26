import { useState } from 'react';
import { SetTechStatsRow } from '@/types/extended';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUpdateSetTechStats } from '@/hooks/useSetStats';

interface TechnicalStatsFormProps {
    setId: number;
    matchPlayerId: number;
    initialData?: SetTechStatsRow;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function TechnicalStatsForm({ setId, matchPlayerId, initialData, onSuccess, onCancel }: TechnicalStatsFormProps) {
    const updateMutation = useUpdateSetTechStats();

    const [formData, setFormData] = useState({
        // Serve Stats
        first_serve_in: initialData?.first_serve_in ?? 0,
        first_serve_total: initialData?.first_serve_total ?? 0,
        first_serve_points_won: initialData?.first_serve_points_won ?? 0,
        second_serve_in: initialData?.second_serve_in ?? 0,
        second_serve_total: initialData?.second_serve_total ?? 0,
        second_serve_points_won: initialData?.second_serve_points_won ?? 0,
        aces: initialData?.aces ?? 0,
        double_faults: initialData?.double_faults ?? 0,
        serve_plus1_points_won: initialData?.serve_plus1_points_won ?? 0,
        // Return Stats
        returns_in: initialData?.returns_in ?? 0,
        returns_total: initialData?.returns_total ?? 0,
        deep_returns: initialData?.deep_returns ?? 0,
        return_winners: initialData?.return_winners ?? 0,
        return_unforced_errors: initialData?.return_unforced_errors ?? 0,
        breaks_won: initialData?.breaks_won ?? 0,
        break_points_won: initialData?.break_points_won ?? 0,
        break_points_total: initialData?.break_points_total ?? 0,
        // Rally Stats
        avg_rally_length: initialData?.avg_rally_length ?? 0,
        long_rallies_won: initialData?.long_rallies_won ?? 0,
        long_rallies_lost: initialData?.long_rallies_lost ?? 0,
        attacking_points_played: initialData?.attacking_points_played ?? 0,
        attacking_points_won: initialData?.attacking_points_won ?? 0,
        defensive_points_played: initialData?.defensive_points_played ?? 0,
        defensive_points_won: initialData?.defensive_points_won ?? 0,
        // Groundstrokes
        fh_winners: initialData?.fh_winners ?? 0,
        fh_unforced_errors: initialData?.fh_unforced_errors ?? 0,
        fh_forced_errors_drawn: initialData?.fh_forced_errors_drawn ?? 0,
        bh_winners: initialData?.bh_winners ?? 0,
        bh_unforced_errors: initialData?.bh_unforced_errors ?? 0,
        bh_forced_errors_drawn: initialData?.bh_forced_errors_drawn ?? 0,
        // Net Play
        net_approaches: initialData?.net_approaches ?? 0,
        net_points_won: initialData?.net_points_won ?? 0,
        volley_winners: initialData?.volley_winners ?? 0,
        volley_errors: initialData?.volley_errors ?? 0,
        smash_winners: initialData?.smash_winners ?? 0,
        smash_errors: initialData?.smash_errors ?? 0,
    });

    const handleChange = (field: keyof typeof formData, value: string) => {
        const numValue = value === '' ? 0 : parseFloat(value);
        setFormData(prev => ({ ...prev, [field]: numValue }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!matchPlayerId) {
            console.error('Match Player ID is required');
            return;
        }
        try {
            await updateMutation.mutateAsync({ setId, matchPlayerId, data: formData });
            onSuccess?.();
        } catch (error) {
            console.error('Failed to update technical stats:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Serve Stats */}
            <div className="space-y-4">
                <h4 className="font-semibold text-indigo-600">Serve Performance</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm text-muted-foreground">Aces</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.aces}
                            onChange={(e) => handleChange('aces', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Double Faults</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.double_faults}
                            onChange={(e) => handleChange('double_faults', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">1st Serve In</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.first_serve_in}
                            onChange={(e) => handleChange('first_serve_in', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">1st Serve Total</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.first_serve_total}
                            onChange={(e) => handleChange('first_serve_total', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">1st Serve Points Won</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.first_serve_points_won}
                            onChange={(e) => handleChange('first_serve_points_won', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">2nd Serve In</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.second_serve_in}
                            onChange={(e) => handleChange('second_serve_in', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">2nd Serve Total</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.second_serve_total}
                            onChange={(e) => handleChange('second_serve_total', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">2nd Serve Points Won</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.second_serve_points_won}
                            onChange={(e) => handleChange('second_serve_points_won', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Serve +1 Points Won</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.serve_plus1_points_won}
                            onChange={(e) => handleChange('serve_plus1_points_won', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Return Stats */}
            <div className="space-y-4">
                <h4 className="font-semibold text-indigo-600">Return Performance</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm text-muted-foreground">Returns In</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.returns_in}
                            onChange={(e) => handleChange('returns_in', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Returns Total</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.returns_total}
                            onChange={(e) => handleChange('returns_total', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Deep Returns</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.deep_returns}
                            onChange={(e) => handleChange('deep_returns', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Return Winners</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.return_winners}
                            onChange={(e) => handleChange('return_winners', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Return UE</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.return_unforced_errors}
                            onChange={(e) => handleChange('return_unforced_errors', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Breaks Won</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.breaks_won}
                            onChange={(e) => handleChange('breaks_won', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Break Points Won</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.break_points_won}
                            onChange={(e) => handleChange('break_points_won', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Break Points Total</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.break_points_total}
                            onChange={(e) => handleChange('break_points_total', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Groundstrokes */}
            <div className="space-y-4">
                <h4 className="font-semibold text-indigo-600">Groundstrokes</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm text-muted-foreground">FH Winners</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.fh_winners}
                            onChange={(e) => handleChange('fh_winners', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">FH UE</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.fh_unforced_errors}
                            onChange={(e) => handleChange('fh_unforced_errors', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">FH Forced Errors Drawn</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.fh_forced_errors_drawn}
                            onChange={(e) => handleChange('fh_forced_errors_drawn', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">BH Winners</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.bh_winners}
                            onChange={(e) => handleChange('bh_winners', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">BH UE</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.bh_unforced_errors}
                            onChange={(e) => handleChange('bh_unforced_errors', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">BH Forced Errors Drawn</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.bh_forced_errors_drawn}
                            onChange={(e) => handleChange('bh_forced_errors_drawn', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Rally Stats */}
            <div className="space-y-4">
                <h4 className="font-semibold text-indigo-600">Rally Statistics</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm text-muted-foreground">Avg Rally Length</label>
                        <Input
                            type="number"
                            min="0"
                            step="0.1"
                            value={formData.avg_rally_length}
                            onChange={(e) => handleChange('avg_rally_length', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Long Rallies Won</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.long_rallies_won}
                            onChange={(e) => handleChange('long_rallies_won', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Long Rallies Lost</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.long_rallies_lost}
                            onChange={(e) => handleChange('long_rallies_lost', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Attacking Points Played</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.attacking_points_played}
                            onChange={(e) => handleChange('attacking_points_played', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Attacking Points Won</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.attacking_points_won}
                            onChange={(e) => handleChange('attacking_points_won', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Defensive Points Played</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.defensive_points_played}
                            onChange={(e) => handleChange('defensive_points_played', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Defensive Points Won</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.defensive_points_won}
                            onChange={(e) => handleChange('defensive_points_won', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Net Play */}
            <div className="space-y-4">
                <h4 className="font-semibold text-indigo-600">Net Play</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm text-muted-foreground">Net Approaches</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.net_approaches}
                            onChange={(e) => handleChange('net_approaches', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Net Points Won</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.net_points_won}
                            onChange={(e) => handleChange('net_points_won', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Volley Winners</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.volley_winners}
                            onChange={(e) => handleChange('volley_winners', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Volley Errors</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.volley_errors}
                            onChange={(e) => handleChange('volley_errors', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Smash Winners</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.smash_winners}
                            onChange={(e) => handleChange('smash_winners', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Smash Errors</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.smash_errors}
                            onChange={(e) => handleChange('smash_errors', e.target.value)}
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
                    Failed to update stats. Please try again.
                </div>
            )}
        </form>
    );
}
