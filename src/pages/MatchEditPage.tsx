import { useParams, useNavigate } from 'react-router-dom';
import { useMatch, useUpdateMatch } from '@/hooks/useMatches';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';

export default function MatchEditPage() {
    const { id } = useParams<{ id: string }>();
    const matchId = parseInt(id || '0');
    const navigate = useNavigate();
    const { data: match, isLoading } = useMatch(matchId);
    const updateMatch = useUpdateMatch();

    const { register, handleSubmit } = useForm({
        values: match ? {
            match_date: match.match_date,
            location: match.location || '',
            surface: match.surface,
            final_result: match.final_result || 'win',
            score_line: match.score_line || '',
            tournament_name: match.tournament_name || '',
            weather: match.weather || '',
            notes: match.notes || '',
        } : undefined
    });

    const onSubmit = (data: any) => {
        updateMatch.mutate(
            { matchId, updates: data },
            {
                onSuccess: () => {
                    navigate(`/matches/${matchId}`);
                },
                onError: (error) => {
                    console.error('Failed to update match:', error);
                }
            }
        );
    };

    if (isLoading) return <div className="p-8">Loading...</div>;
    if (!match) return <div className="p-8">Match not found</div>;

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-12">
            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(`/matches/${matchId}`)}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-3xl font-bold tracking-tight">Edit Match</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-6">
                    <h3 className="font-semibold text-lg">Match Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tournament</label>
                            <Input {...register('tournament_name')} placeholder="Optional" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Weather</label>
                            <Input {...register('weather')} placeholder="Optional" />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium">Notes</label>
                            <textarea
                                {...register('notes')}
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                placeholder="Optional match notes"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate(`/matches/${matchId}`)}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={updateMatch.isPending}>
                        {updateMatch.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>

                {updateMatch.isError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
                        <p className="font-semibold">Error updating match</p>
                        <p className="text-sm mt-1">Please try again.</p>
                    </div>
                )}
            </form>
        </div>
    );
}
