import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { usePlayers } from '@/hooks/usePlayers';
import { useEffect } from 'react';

interface MatchFormProps {
    onSubmit: (data: any) => void;
    isSubmitting: boolean;
    initialData?: any;
}

export function MatchForm({ onSubmit, isSubmitting, initialData }: MatchFormProps) {
    const { data: players } = usePlayers();

    const { register, control, handleSubmit, watch } = useForm({
        defaultValues: initialData || {
            players: [
                { player_id: '', role: 'player' } // Main player
            ],
            match_type: 'singles', // Default to singles
            opponent1_id: '',
            opponent1_name: '',
            opponent2_id: '',
            opponent2_name: '',
            match_date: new Date().toISOString().split('T')[0],
            location: '',
            surface: 'hard',
            final_result: 'win',
            score_line: '',
            status: 'completed', // Default to completed for recording past matches
            started_at: '',
            completed_at: '',
            sets: [
                { set_number: 1, games_won: 6, games_lost: 0, set_result: 'win' }
            ]
        }
    });

    const { fields: setFields, append: appendSet, remove: removeSet } = useFieldArray({
        control,
        name: "sets"
    });

    const { fields: playerFields, append: appendPlayer, remove: removePlayer } = useFieldArray({
        control,
        name: "players"
    });

    const matchType = watch('match_type');
    const matchStatus = watch('status');

    // Manage players based on match type
    useEffect(() => {
        if (matchType === 'doubles' && playerFields.length === 1) {
            appendPlayer({ player_id: '', role: 'partner' });
        } else if (matchType === 'singles' && playerFields.length > 1) {
            removePlayer(1); // Remove partner
        }
    }, [matchType, playerFields.length, appendPlayer, removePlayer]);

    const handleFormSubmit = (data: any) => {
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
            {/* Match Info */}
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-6">
                <h3 className="font-semibold text-lg">Match Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Match Type</label>
                        <select
                            {...register('match_type')}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                            <option value="singles">Singles</option>
                            <option value="doubles">Doubles</option>
                            <option value="practice">Practice</option>
                        </select>
                    </div>

                    {/* Opponents Section */}
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <label className="text-sm font-medium">
                            {matchType === 'doubles' ? 'Opponents (2 Players)' : 'Opponent'}
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Opponent 1 */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">
                                    {matchType === 'doubles' ? 'Opponent 1' : 'Opponent'}
                                </label>
                                <select
                                    {...register('opponent1_id')}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                >
                                    <option value="">Select Player...</option>
                                    {players?.map((p: any) => (
                                        <option key={p.player_id} value={p.player_id}>{p.full_name}</option>
                                    ))}
                                </select>
                                <Input
                                    {...register('opponent1_name')}
                                    placeholder="Or enter name manually"
                                    className="text-sm"
                                />
                            </div>

                            {/* Opponent 2 (for doubles) */}
                            {matchType === 'doubles' && (
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">
                                        Opponent 2
                                    </label>
                                    <select
                                        {...register('opponent2_id')}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    >
                                        <option value="">Select Player...</option>
                                        {players?.map((p: any) => (
                                            <option key={p.player_id} value={p.player_id}>{p.full_name}</option>
                                        ))}
                                    </select>
                                    <Input
                                        {...register('opponent2_name')}
                                        placeholder="Or enter name manually"
                                        className="text-sm"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Players Section */}
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <label className="text-sm font-medium">Your Team</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {playerFields.map((field, index) => (
                                <div key={field.id} className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">
                                        {index === 0 ? 'You (Main Player)' : 'Partner'}
                                    </label>
                                    <select
                                        {...register(`players.${index}.player_id` as const, { required: true })}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    >
                                        <option value="">Select Player...</option>
                                        {players?.map((p: any) => (
                                            <option key={p.player_id} value={p.player_id}>{p.full_name}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Date</label>
                        <Input type="date" {...register('match_date')} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Location</label>
                        <Input {...register('location')} placeholder="e.g. Melbourne Park" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Surface</label>
                        <select {...register('surface')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                            <option value="hard">Hard</option>
                            <option value="clay">Clay</option>
                            <option value="grass">Grass</option>
                            <option value="carpet">Carpet</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Result</label>
                        <select {...register('final_result')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                            <option value="win">Win</option>
                            <option value="loss">Loss</option>
                            <option value="retired">Retired</option>
                        </select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium">Score Line</label>
                        <Input {...register('score_line')} placeholder="e.g. 6-4 3-6 7-5" />
                    </div>
                </div>
            </div>

            {/* Match Status & Timing */}
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-6">
                <h3 className="font-semibold text-lg">Match Status & Timing</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Match Status</label>
                        <select
                            {...register('status')}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                            <option value="scheduled">Scheduled (Not Started)</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        <p className="text-xs text-muted-foreground">
                            Select "Completed" for recording past matches
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Started At (Optional)</label>
                        <Input
                            type="datetime-local"
                            {...register('started_at')}
                            disabled={matchStatus === 'scheduled'}
                        />
                        <p className="text-xs text-muted-foreground">
                            {matchStatus === 'scheduled' ? 'Auto-set when match starts' : 'When the match began'}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Completed At (Optional)</label>
                        <Input
                            type="datetime-local"
                            {...register('completed_at')}
                            disabled={matchStatus !== 'completed'}
                        />
                        <p className="text-xs text-muted-foreground">
                            {matchStatus !== 'completed' ? 'Only for completed matches' : 'When the match ended'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Sets */}
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Sets</h3>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendSet({ set_number: setFields.length + 1, games_won: 0, games_lost: 0, set_result: 'win' })}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add Set
                    </Button>
                </div>

                <div className="space-y-4">
                    {setFields.map((field, index) => (
                        <div key={field.id} className="flex items-end gap-4 p-4 border rounded-md bg-gray-50">
                            <div className="w-16">
                                <label className="text-xs font-medium text-muted-foreground">Set</label>
                                <div className="flex h-10 items-center justify-center font-bold text-lg">
                                    {index + 1}
                                    <input type="hidden" {...register(`sets.${index}.set_number`)} value={index + 1} />
                                </div>
                            </div>

                            <div className="flex-1 space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">Games Won</label>
                                <Input type="number" {...register(`sets.${index}.games_won`)} min="0" />
                            </div>

                            <div className="flex-1 space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">Games Lost</label>
                                <Input type="number" {...register(`sets.${index}.games_lost`)} min="0" />
                            </div>

                            <div className="flex-1 space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">Result</label>
                                <select {...register(`sets.${index}.set_result`)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                    <option value="win">Win</option>
                                    <option value="loss">Loss</option>
                                </select>
                            </div>

                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => removeSet(index)}
                                disabled={setFields.length === 1}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end space-x-4">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Match'}
                </Button>
            </div>
        </form>
    );
}
