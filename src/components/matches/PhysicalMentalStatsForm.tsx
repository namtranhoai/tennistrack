import { useState } from 'react';
import { SetPhysicalMentalStatsRow } from '@/types/extended';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUpdateSetPhysicalMentalStats } from '@/hooks/useSetStats';

interface PhysicalMentalStatsFormProps {
    setId: number;
    matchPlayerId: number;
    initialData?: SetPhysicalMentalStatsRow;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function PhysicalMentalStatsForm({ setId, matchPlayerId, initialData, onSuccess, onCancel }: PhysicalMentalStatsFormProps) {
    const updateMutation = useUpdateSetPhysicalMentalStats();

    const [formData, setFormData] = useState({
        speed_rating: initialData?.speed_rating ?? 5,
        recovery_rating: initialData?.recovery_rating ?? 5,
        fatigue_errors: initialData?.fatigue_errors ?? 0,
        confidence_rating: initialData?.confidence_rating ?? 5,
        emotion_control: initialData?.emotion_control ?? 5,
        focus_rating: initialData?.focus_rating ?? 5,
        tactical_adjustment: initialData?.tactical_adjustment ?? 5,
        coach_notes: initialData?.coach_notes ?? '',
    });

    const handleChange = (field: keyof typeof formData, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateMutation.mutateAsync({ setId, matchPlayerId, data: formData });
            onSuccess?.();
        } catch (error) {
            console.error('Failed to update physical/mental stats:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Physical Ratings */}
            <div className="space-y-4">
                <h4 className="font-semibold text-indigo-600">Physical Performance</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-muted-foreground">Speed Rating (1-10)</label>
                        <div className="flex items-center space-x-3">
                            <Input
                                type="range"
                                min="1"
                                max="10"
                                value={formData.speed_rating}
                                onChange={(e) => handleChange('speed_rating', parseInt(e.target.value))}
                                className="flex-1"
                            />
                            <span className="font-semibold text-indigo-600 w-8 text-center">{formData.speed_rating}</span>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Recovery Rating (1-10)</label>
                        <div className="flex items-center space-x-3">
                            <Input
                                type="range"
                                min="1"
                                max="10"
                                value={formData.recovery_rating}
                                onChange={(e) => handleChange('recovery_rating', parseInt(e.target.value))}
                                className="flex-1"
                            />
                            <span className="font-semibold text-indigo-600 w-8 text-center">{formData.recovery_rating}</span>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Fatigue Errors</label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.fatigue_errors}
                            onChange={(e) => handleChange('fatigue_errors', parseInt(e.target.value))}
                        />
                    </div>
                </div>
            </div>

            {/* Mental Ratings */}
            <div className="space-y-4">
                <h4 className="font-semibold text-indigo-600">Mental Performance</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-muted-foreground">Confidence Rating (1-10)</label>
                        <div className="flex items-center space-x-3">
                            <Input
                                type="range"
                                min="1"
                                max="10"
                                value={formData.confidence_rating}
                                onChange={(e) => handleChange('confidence_rating', parseInt(e.target.value))}
                                className="flex-1"
                            />
                            <span className="font-semibold text-indigo-600 w-8 text-center">{formData.confidence_rating}</span>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Emotion Control (1-10)</label>
                        <div className="flex items-center space-x-3">
                            <Input
                                type="range"
                                min="1"
                                max="10"
                                value={formData.emotion_control}
                                onChange={(e) => handleChange('emotion_control', parseInt(e.target.value))}
                                className="flex-1"
                            />
                            <span className="font-semibold text-indigo-600 w-8 text-center">{formData.emotion_control}</span>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Focus Rating (1-10)</label>
                        <div className="flex items-center space-x-3">
                            <Input
                                type="range"
                                min="1"
                                max="10"
                                value={formData.focus_rating}
                                onChange={(e) => handleChange('focus_rating', parseInt(e.target.value))}
                                className="flex-1"
                            />
                            <span className="font-semibold text-indigo-600 w-8 text-center">{formData.focus_rating}</span>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Tactical Adjustment (1-10)</label>
                        <div className="flex items-center space-x-3">
                            <Input
                                type="range"
                                min="1"
                                max="10"
                                value={formData.tactical_adjustment}
                                onChange={(e) => handleChange('tactical_adjustment', parseInt(e.target.value))}
                                className="flex-1"
                            />
                            <span className="font-semibold text-indigo-600 w-8 text-center">{formData.tactical_adjustment}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Coach Notes */}
            <div className="space-y-4">
                <h4 className="font-semibold text-indigo-600">Coach Notes</h4>
                <div>
                    <label className="text-sm text-muted-foreground">Notes</label>
                    <textarea
                        className="w-full min-h-[100px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={formData.coach_notes}
                        onChange={(e) => handleChange('coach_notes', e.target.value)}
                        placeholder="Add coach observations, mental state notes, or physical condition details..."
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
                    Failed to update physical/mental stats. Please try again.
                </div>
            )}
        </form>
    );
}
