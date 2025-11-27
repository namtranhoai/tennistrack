import { useNavigate } from 'react-router-dom';
import { useCreateMatch } from '@/hooks/useMatches';
import { usePlayers } from '@/hooks/usePlayers';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { MatchForm } from '@/components/matches/MatchForm';

export default function MatchNewPage() {
    const navigate = useNavigate();
    const createMatch = useCreateMatch();
    const { data: playersList } = usePlayers();

    const onSubmit = (data: any) => {
        // Transform form data to API structure

        // 1. Prepare Match Data
        const matchData = {
            match_date: data.match_date,
            location: data.location,
            surface: data.surface,
            format: data.match_type === 'practice' ? 'singles' : data.match_type, // Map to 'singles' or 'doubles'
            final_result: data.final_result,
            score_line: data.score_line,
            notes: data.notes ? data.notes.trim() : null,
        };

        // 2. Prepare Match Players Data
        // Validate that at least one player is selected
        if (!data.players || data.players.length === 0 || !data.players[0]?.player_id) {
            console.error("No player selected");
            return;
        }

        const matchPlayersData = data.players.map((p: any) => {
            const playerDetails = playersList?.find((pl: any) => pl.player_id === parseInt(p.player_id));
            return {
                player_id: parseInt(p.player_id),
                display_name: playerDetails?.full_name || 'Unknown Player',
                side: 'A', // User's side
                role: p.role,
                is_tracked: true,
            };
        });

        // Add Opponent(s) to match_players on Side B
        // Handle Opponent 1
        if (data.opponent1_id || data.opponent1_name) {
            const opponent1Details = data.opponent1_id
                ? playersList?.find((pl: any) => pl.player_id === parseInt(data.opponent1_id))
                : null;

            matchPlayersData.push({
                player_id: data.opponent1_id ? parseInt(data.opponent1_id) : null,
                display_name: opponent1Details?.full_name || (data.opponent1_name?.trim() || 'Opponent 1'),
                side: 'B',
                role: 'opponent_1',
                is_tracked: false,
            });
        }

        // Handle Opponent 2 (for doubles)
        if (data.match_type === 'doubles' && (data.opponent2_id || data.opponent2_name)) {
            const opponent2Details = data.opponent2_id
                ? playersList?.find((pl: any) => pl.player_id === parseInt(data.opponent2_id))
                : null;

            matchPlayersData.push({
                player_id: data.opponent2_id ? parseInt(data.opponent2_id) : null,
                display_name: opponent2Details?.full_name || (data.opponent2_name?.trim() || 'Opponent 2'),
                side: 'B',
                role: 'opponent_2',
                is_tracked: false,
            });
        }

        // 3. Prepare Sets Data
        const setsData = data.sets.map((set: any) => ({
            set: {
                set_number: set.set_number,
                games_side_a: parseInt(set.games_won) || 0,
                games_side_b: parseInt(set.games_lost) || 0,
                tiebreak_played: false,
                tiebreak_score: null,
                notes: null,
            },
            // Initialize empty stats for now
            techStats: [],
            tacticalStats: [],
            pmStats: []
        }));

        console.log('Submitting match data:', { match: matchData, players: matchPlayersData, sets: setsData });

        createMatch.mutate({ match: matchData, players: matchPlayersData, sets: setsData }, {
            onSuccess: () => {
                console.log('Match created successfully');
                navigate('/dashboard/matches');
            },
            onError: (error: any) => {
                console.error('Failed to create match:', error);
                console.error('Error details:', error.message, error.details);
            }
        });
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-12">
            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-3xl font-bold tracking-tight">New Match</h2>
            </div>

            <MatchForm onSubmit={onSubmit} isSubmitting={createMatch.isPending} />

            {createMatch.isError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
                    <p className="font-semibold">Error saving match</p>
                    <p className="text-sm mt-1">Please check the console for details.</p>
                </div>
            )}
        </div>
    );
}
